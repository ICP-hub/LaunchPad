import React, { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  logoutSuccess,
  logoutFailure,
} from "../Redux/Reducers/InternetIdentityReducer";
import { setActor } from "../Redux/Reducers/actorBindReducer";
import { idlFactory as ledgerIDL } from "./ledger.did.js";
import { idlFactory as backendIDL } from "../../../../declarations/icplaunchpad_backend/index";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Context initialization
const AuthContext = createContext();

const defaultOptions = {
  createOptions: {
    idleOptions: {
      idleTimeout: 1000 * 60 * 30, // 30-minute idle timeout
      disableDefaultIdleCallback: true,
    },
  },
};

// Environment variables for Canister IDs and Host
const CANISTER_ID_BACKEND =
  process?.env?.CANISTER_ID_ICPLAUNCHPAD_BACKEND || "bw4dl-smaaa-aaaaa-qaacq-cai";
const CANISTER_ID_LEDGER = process?.env?.CANISTER_ID_LEDGER;
const LOCAL_HOST = "http://127.0.0.1:4943";
const MAINNET_HOST = "https://icp0.io";
const HOST = process?.env?.DFX_NETWORK === "ic" ? MAINNET_HOST : LOCAL_HOST;

console.log("Using backend Canister ID:", CANISTER_ID_BACKEND);
console.log("Host being used:", HOST);

export const useAuthClient = (options = defaultOptions) => {
  const dispatch = useDispatch();
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [ledgerActor, setLedgerActor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create(options.createOptions);
        setAuthClient(client);
        if (await client.isAuthenticated()) {
          await updateClient(client);
        }
      } catch (error) {
        console.error("AuthClient initialization error:", error.message || error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const validateEnvVariables = () => {
    if (!CANISTER_ID_BACKEND) {
      throw new Error("Backend Canister ID is not properly configured in environment variables.");
    }
  };

  const createActor = async (canisterId, idlFactory, agent) => {
    try {
      if (!canisterId || !idlFactory || !agent) {
        throw new Error(
          `Invalid parameters for actor creation. Canister ID: ${canisterId}, IDL: ${idlFactory}, Agent: ${agent}`
        );
      }
      return Actor.createActor(idlFactory, { agent, canisterId });
    } catch (error) {
      console.error(`Failed to create actor for canister ${canisterId}:`, error.message || error);
      return null;
    }
  };

  const updateClient = async (client) => {
    try {
      if (!client) return;

      const identity = client.getIdentity();
      const principal = await identity.getPrincipal();

      console.log("Principal:", principal.toText());

      if (principal.toText() === Principal.anonymous().toText()) {
        throw new Error("Identity is anonymous. Please log in again.");
      }

      const agent = new HttpAgent({ identity, host: HOST });

      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey();
      }

      const backendActor = await createActor(CANISTER_ID_BACKEND, backendIDL, agent);
      if (!backendActor) {
        throw new Error("Failed to create backend actor");
      }

      try {
        const stats = await backendActor?.is_account_created();
        console.log("Backend Actor stats:", stats);
      } catch (error) {
        console.error("Error in is_account_created:", error.message || error);
        throw error;
      }

      const ledgerActor = CANISTER_ID_LEDGER
        ? await createActor(CANISTER_ID_LEDGER, ledgerIDL, agent)
        : null;

      setPrincipal(principal.toText());
      setIsAuthenticated(true);
      setIdentity(identity);
      setBackendActor(backendActor);
      setLedgerActor(ledgerActor);

      dispatch(setActor(backendActor));
      dispatch(loginSuccess(principal.toText()));
    } catch (error) {
      console.error("Authentication update error:", error.message || error);
      throw error;
    }
  };

  const handleLogin = async (provider = "plug") => {
    try {
      validateEnvVariables();
      setIsLoading(true);

      if (provider === "plug") {
        if (!window.ic || !window.ic.plug) {
          alert("Plug Wallet extension not detected. Please install.");
          return;
        }

        const whitelist = [CANISTER_ID_BACKEND, CANISTER_ID_LEDGER].filter(Boolean);

        const isConnected = await window.ic.plug.requestConnect({
          whitelist,
          host: HOST,
          timeout: 50000,
        });

        if (!isConnected) {
          throw new Error("User denied Plug connection.");
        }

        if (!window.ic.plug.agent) {
          await window.ic.plug.createAgent({ whitelist, host: HOST });
        }

        const principal = await window.ic.plug.agent.getPrincipal();
        await updateClient({
          getIdentity: () => window.ic.plug.agent,
        });
      } else if (provider === "ii") {
        if (!authClient) {
          throw new Error("AuthClient not initialized.");
        }

        authClient.login({
          identityProvider:
            process.env.DFX_NETWORK === "ic"
              ? "https://identity.ic0.app/#authorize"
              : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943",
          onSuccess: async () => {
            await updateClient(authClient);
          },
          onError: (error) => console.error("Internet Identity login error:", error),
        });
      }
    } catch (error) {
      console.error("Login Error:", error.message || error);
      alert(`Login failed: ${error.message || "Unknown error occurred."}`);
      dispatch(logoutFailure(error.message || "Unknown error occurred during login."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (!authClient) {
        throw new Error("AuthClient not initialized.");
      }

      await authClient.logout();
      setIdentity(null);
      setPrincipal(null);
      setBackendActor(null);
      setLedgerActor(null);
      setIsAuthenticated(false);

      dispatch(setActor(null));
      dispatch(logoutSuccess());

      window.location.reload();
    } catch (error) {
      console.error("Logout Error:", error.message || error);
      alert(`Logout failed: ${error.message || "Unknown error occurred."}`);
      dispatch(logoutFailure(error.message || "Unknown error occurred during logout."));
    }
  };

  return {
    isAuthenticated,
    identity,
    principal,
    backendActor,
    ledgerActor,
    isLoading,
    handleLogin,
    logout: handleLogout,
  };
};

// Auth Provider for wrapping the application
export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();

  if (auth.isLoading) {
    return <div>Connecting to Plug Wallet...</div>;
  }

  window.authFunctions = {
    handleLogin: auth.handleLogin,
    handleLogout: auth.logout,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook for consuming Auth Context
export const useAuths = () => useContext(AuthContext);
