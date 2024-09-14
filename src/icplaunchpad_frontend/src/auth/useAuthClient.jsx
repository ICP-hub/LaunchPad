import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { createActor, idlFactory as DaoFactory, } from "../../../declarations/icplaunchpad_backend/index";

const AuthContext = createContext();

const defaultOptions = {
  createOptions: {
    idleOptions: {
      idleTimeout: 1000 * 60 * 30, // 30 minutes idle timeout
      disableDefaultIdleCallback: true,
    },
  },
  loginOptionsIcp: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
  },
  loginOptionsNfid: {
    identityProvider: `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [userPrincipal, setuserPrincipal] = useState(null);
  const clientInfo = async (client, identity) => {
    const isAuthenticated = await client.isAuthenticated();
    const principal = identity.getPrincipal();
    setAuthClient(client);
    setIdentity(identity);
    setuserPrincipal(principal.toString());

    if (isAuthenticated && identity && principal && !principal.isAnonymous()) {
      const backendActor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, {
        agentOptions: { identity, verifyQuerySignatures: false },
      });
      setBackendActor(backendActor);
    }

    return true;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const client = await AuthClient.create(options.createOptions);
      await clientInfo(client, client.getIdentity());
    };
    initializeAuth();
  }, []);

  const login = async (provider = "Icp") => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient.isAuthenticated() &&
          !(await authClient.getIdentity().getPrincipal().isAnonymous())
        ) {
          resolve(clientInfo(authClient, authClient.getIdentity()));
        } else {
          const loginOption =
            provider === "Icp" ? "loginOptionsIcp" : "loginOptionsNfid";
          await authClient.login({
            ...options[loginOption],
            onError: (error) => reject(error),
            onSuccess: () =>
              resolve(clientInfo(authClient, authClient.getIdentity())),
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const createCustomActor = (canisterId) => {
    try {
      const agent = new HttpAgent({ identity });
      if (process.env.DFX_NETWORK !== "ic") {
        agent.fetchRootKey().catch((err) => {
          console.warn("Unable to fetch root key. Check your local replica.");
          console.error(err);
        });
      }

      return Actor.createActor(DaoFactory, { agent, canisterId });
    } catch (err) {
      console.error("Error creating DAO actor:", err);
    }
  };

  const logout = async () => {
    await authClient?.logout();
    setAuthClient(null);
    setIdentity(null);
    setBackendActor(null);
  };

  return {
    login,
    logout,
    backendActor,
    userPrincipal,
    identity,
    createCustomActor,
    clientInfo,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);