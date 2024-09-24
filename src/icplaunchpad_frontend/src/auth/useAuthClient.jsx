import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { createActor, idlFactory as DaoFactory } from "../../../declarations/icplaunchpad_backend/index";
import { NFID } from "@nfid/embed";

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
  const [nfid, setNfid] = useState(null);
  const [error, setError] = useState(null); // Track errors

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
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const client = await AuthClient.create(options.createOptions);
      await clientInfo(client, client.getIdentity());
    };
    
  const initNFID = async () => {
    if (!nfid) {
      try {
        const nfIDInstance = await NFID.init({
          application: {
            name: "NFID Login",
            logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg",
          },
          idleOptions: {
            idleTimeout: 600000, // 10 minutes
            captureScroll: true,
            scrollDebounce: 100,
          },
        });
        setNfid(nfIDInstance);
      } catch (error) {
        console.error("Error initializing NFID:", error);
        setError("Failed to initialize NFID.");
      }
    }
  };

    initializeAuth();
     initNFID(); 
  }, []);


  const loginWithNFID = async () => {
    try {
        if (!nfid) {
        throw new Error("NFID is not initialized.");
      }
  
      // Obtain identity from NFID
      const identity = await nfid.getIdentity();
      if (!identity) {
        throw new Error("Identity is not available.");
      }
  
      // Request delegation for the backend canister (add your canister here)
      const canisterArray = [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND];
      const delegationResult = await nfid.getDelegation({ targets: canisterArray });
      if (!delegationResult) {
        throw new Error("Failed to get delegation result.");
      }
  
      // Fetch principal and delegation type
      const principal = identity.getPrincipal();
      const delegationType = await nfid.getDelegationType();
  
      // Log these values for debugging
      console.log("NFID Principal:", principal.toText());
      console.log("Delegation Type:", delegationType);
  
      // Set the principal and update authentication state
      setUserPrincipal(principal.toString());
      setIsAuthenticated(true);
  
      // You can also initialize backendActor here if needed
      const backendActor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, {
        agentOptions: { identity, verifyQuerySignatures: false },
      });
      setBackendActor(backendActor);
    } catch (error) {
      console.error("Error during NFID login:", error);
      setError("Failed to log in with NFID. Please try again.");
    }
  };
  


  const loginWithPlug = async () => {
    return new Promise(async (resolve, reject) => {
      if (!window.ic?.plug) {
        reject(new Error("Plug wallet not detected. Please install or enable the Plug extension."));
        return;
      }

      try {
        const connected = await window.ic.plug.requestConnect({
          whitelist: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
          timeout: 5000,
        });

        if (connected) {
          if (!window.ic.plug.agent) await window.ic.plug.createAgent();

          const principal = await window.ic.plug.agent.getPrincipal();
          setUserPrincipal(principal.toString());

          const backendActor = await window.ic.plug.createActor({
            canisterId: process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
            interfaceFactory: DaoFactory,
          });

          setBackendActor(backendActor);
          setIsAuthenticated(true);
          resolve(true);
        } else {
          reject(new Error("Plug connection failed."));
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  

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
          if (
            await authClient.isAuthenticated() &&
            !(await authClient.getIdentity().getPrincipal().isAnonymous())
          ) {
            await clientInfo(authClient, authClient.getIdentity());
          } else {
            await authClient.login({
              ...options.loginOptionsIcp,
              onError: (error) => {
                throw error;
              },
              onSuccess: async () => {
                await clientInfo(authClient, authClient.getIdentity());
              },
            });
          }
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  const createCustomActor = (canisterId) => {
    try {
      const agent = new HttpAgent({ identity });
      if (process.env.DFX_NETWORK !== "ic") {
        agent.fetchRootKey().catch((err) => {
          console.warn("Unable to fetch root key. Check your local replica.");
        });
      }
      return Actor.createActor(DaoFactory, { agent, canisterId });
    } catch (err) {
      console.error("Error creating DAO actor:", err);
    }
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
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
    loginWithPlug,
    error, // Expose error state
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
