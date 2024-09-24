import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { createActor, idlFactory as DaoFactory } from "../../../declarations/icplaunchpad_backend/index";

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
  const [userPrincipal, setUserPrincipal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clientInfo = async (client, identity) => {
    const isAuthenticated = await client.isAuthenticated();
    const principal = identity.getPrincipal();
    setAuthClient(client);
    setIdentity(identity);
    setUserPrincipal(principal.toString());

    if (isAuthenticated && identity && principal && !principal.isAnonymous()) {
      const backendActor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, {
        agentOptions: { identity, verifyQuerySignatures: false },
      });
      setBackendActor(backendActor);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
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


  // Add Plug login logic
  const loginWithPlug = async () => {
    return new Promise(async (resolve, reject) => {
      if (!window.ic?.plug) {
        reject(new Error("Plug wallet not detected. Please install or enable the Plug extension."));
        return;
      }
  
      try {
        // Request Plug wallet connection
        const connected = await window.ic.plug.requestConnect({
          whitelist: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND], // Ensure necessary canister IDs
          timeout: 5000, // Optional timeout to avoid indefinite wait
        });
  
        if (connected) {
          // Ensure the agent is created, as some versions of Plug may need this explicitly set up
          if (!window.ic.plug.agent) {
            await window.ic.plug.createAgent();
          }
  
          const principal = await window.ic.plug.agent.getPrincipal();
          setUserPrincipal(principal.toString());
  
          // Set up the HttpAgent and create the backend actor using Plug's identity
          const backendActor = await window.ic.plug.createActor({
            canisterId: process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
            interfaceFactory: DaoFactory,
          });
  
          setBackendActor(backendActor);
          setIsAuthenticated(true);
          resolve(true);
        } else {
          reject(new Error("Plug connection failed. Please check your wallet settings."));
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  

  const login = async (provider = "Icp") => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!authClient) {
          reject(new Error("AuthClient is not initialized yet."));
          return;
        }

        if (provider === "Plug") {
          // Plug login
          loginWithPlug()
            .then(resolve)
            .catch(reject);
        } 
        else {
          // Standard login (ICP or NFID)
          if (
            await authClient.isAuthenticated() &&
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
    if (!authClient) return;

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
    isAuthenticated,
    identity,
    createCustomActor,
    clientInfo,
    loginWithPlug, // Expose Plug login
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
