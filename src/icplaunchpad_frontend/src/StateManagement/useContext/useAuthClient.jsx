import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
import { idlFactory as DaoFactory } from "./ledger.did.js";
import { NFID } from "@nfid/embed";
import { loginSuccess } from "../Redux/Reducers/InternetIdentityReducer";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

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
    identityProvider: "https://nfid.one/authenticate/?applicationName=my-ic-app#authorize",
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [userPrincipal, setUserPrincipal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nfid, setNfid] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const initializeClientInfo = async (client, identity) => {
    try {
      if (!process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND) {
        throw new Error("Backend canister ID is not set in the environment variables.");
      }

      const isAuthenticated = await client.isAuthenticated();
      const principal = identity?.getPrincipal();

      if (isAuthenticated && identity && !principal?.isAnonymous()) {
        const backendActor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, {
          agentOptions: { identity, verifyQuerySignatures: false },
        });
        setBackendActor(backendActor);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setAuthClient(client);
      setIdentity(identity);
      setUserPrincipal(principal?.toString() || null);
    } catch (err) {
      console.error("Error initializing client info:", err);
      setError("Failed to initialize client information.");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const client = await AuthClient.create(options.createOptions);
        await initializeClientInfo(client, client.getIdentity());
      } catch (err) {
        console.error("Error initializing AuthClient:", err);
        setError("Failed to initialize authentication client.");
      }
    };

    const initializeNFID = async () => {
      try {
        const nfidInstance = await NFID.init({
          application: {
            name: "NFID Login",
            logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg",
          },
          idleOptions: {
            idleTimeout: 600000, // 10 minutes
          },
        });
        setNfid(nfidInstance);
      } catch (err) {
        console.error("Error initializing NFID:", err);
        setError("Failed to initialize NFID.");
      }
    };

    initializeAuth();
    initializeNFID();

    return () => {
      setAuthClient(null);
      setNfid(null);
    };
  }, []);

  const login = async (provider = "Icp") => {
    try {
      if (!authClient) throw new Error("AuthClient is not initialized yet.");

      switch (provider) {
        case "Plug":
          await loginWithPlug();
          break;
        case "Nfid":
          await loginWithNFID();
          break;
        case "Icp":
          await authClient.login({
            ...options.loginOptionsIcp,
            onSuccess: async () => {
              await initializeClientInfo(authClient, authClient.getIdentity());
            },
          });
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  const loginWithPlug = async () => {
    try {
      if (!window.ic?.plug) throw new Error("Plug extension not installed");

      const whitelist = [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND];
      const host = process.env.DFX_NETWORK === "ic" ? "https://icp0.io" : "http://127.0.0.1:4943";

      const isConnected = await window.ic.plug.requestConnect({ whitelist, host });

      if (isConnected) {
        const userActor = await window.ic.plug.createActor({
          canisterId: process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
          interfaceFactory: DaoFactory,
        });

        const principal = await window.ic.plug.agent.getPrincipal();
        setUserPrincipal(principal.toString());
        setIdentity(window.ic.plug.agent);
        setBackendActor(userActor);
        setIsAuthenticated(true);

        dispatch(
          loginSuccess({
            isAuthenticated: true,
            identity: window.ic.plug.agent,
            principal: principal.toString(),
          })
        );
      } else {
        throw new Error("Plug connection refused");
      }
    } catch (err) {
      console.error("Error during Plug login:", err);
      setError(err.message);
    }
  };

  const loginWithNFID = async () => {
    try {
      if (!nfid) throw new Error("NFID is not initialized.");

      const identity = await nfid.getIdentity();
      if (!identity) throw new Error("Identity is not available.");

      const principal = identity.getPrincipal();
      setUserPrincipal(principal.toString());
      setIsAuthenticated(true);

      const backendActor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, {
        agentOptions: { identity, verifyQuerySignatures: false },
      });
      setBackendActor(backendActor);
    } catch (err) {
      console.error("Error during NFID login:", err);
      setError("Failed to log in with NFID. Please try again.");
    }
  };

  const createCustomActor = (canisterId) => {
    if (!identity || identity.getPrincipal().isAnonymous()) {
      console.error("User must be authenticated to create an actor.");
      return null;
    }

    const agent = new HttpAgent({ identity });
    if (process.env.DFX_NETWORK !== "ic") {
      agent.fetchRootKey().catch((err) => {
        console.warn("Unable to fetch root key. Check your local replica.");
      });
    }

    return Actor.createActor(DaoFactory, { agent, canisterId });
  };

  const logout = async () => {
    try {
      if (authClient) {
        await authClient.logout();
      }
      setAuthClient(null);
      setIdentity(null);
      setBackendActor(null);
      setUserPrincipal(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Failed to log out. Please try again.");
    }
  };

  return {
    login,
    logout,
    actor: backendActor,
    isAuthenticated,
    identity,
    principal: userPrincipal,
    createCustomActor,
    error,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuths = () => useContext(AuthContext);
