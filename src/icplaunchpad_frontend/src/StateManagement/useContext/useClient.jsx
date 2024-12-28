// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
// import { useBalance, useIdentity, useAccounts, useDelegationType, useIsInitializing, useAuth } from '@nfid/identitykit/react';
// import {
//     loginSuccess,
//     logoutSuccess,
//     logoutFailure,
// } from '../Redux/Reducers/InternetIdentityReducer';
// import { Actor, HttpAgent } from "@dfinity/agent";
// import { idlFactory as ledgerIDL } from "./ledger.did.js";

// const AuthContext = createContext();
// const canisterID = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;

// export const useAuthClient = () => {
//     const dispatch = useDispatch();
//     const { connect, disconnect, isConnecting, user } = useAuth();
//     const { balance, fetchBalance } = useBalance();
//     const identity = useIdentity();
//     const accounts = useAccounts();
//     const delegationType = useDelegationType();
//     const isInitializing = useIsInitializing();
    
//     const [backendActor, setBackendActor] = useState(null);

//     const LOCAL_HOST = "http://127.0.0.1:4943";
//     const MAINNET_HOST = "https://icp0.io";
//     const HOST = process.env.DFX_NETWORK === "ic" ? MAINNET_HOST : LOCAL_HOST;

//     useEffect(() => {
//         const initActor = async () => {
//             if (user && identity && HOST) { // Ensure user and identity are ready
//                 const agent = new HttpAgent({
//                     identity,
//                     host: HOST
//                 });

//                 // Fetch root key for local development
//                 if (process.env.DFX_NETWORK !== "ic") {
//                     await agent.fetchRootKey();
//                 }

//                 const actor = createActor(canisterID, { agent });
//                 setBackendActor(actor);

//                 dispatch(
//                     loginSuccess({
//                         isAuthenticated: true,
//                         identity,
//                         principal: user?.principal.toText(),
//                     })
//                 );
//             }
//         };

//         initActor();
//     }, [user, identity, dispatch]);

//     const handleLogin = async () => {
//         try {
//             await connect();
//             const principal = identity.getPrincipal().toText();
//             dispatch(
//                 loginSuccess({
//                     isAuthenticated: true,
//                     identity,
//                     principal,
//                 })
//             );
//         } catch (error) {
//             console.error('Login Error:', error);
//             dispatch(loginFailure(error.toString()));
//         }
//     };

//     const handleLogout = async () => {
//         try {
//             await disconnect();
//             setBackendActor(null);
//             dispatch(logoutSuccess());
//         } catch (error) {
//             console.error('Logout Error:', error);
//             dispatch(logoutFailure(error.toString()));
//         }
//     };

//     const createCustomActor = async (canisterId) => {
//         try {
//             if (!canisterId) {
//                 throw new Error("Canister ID is required.");
//             }
//             const agent = new HttpAgent({ identity, host: HOST });

//             // Only fetch root key in local development
//             if (process.env.DFX_NETWORK !== "ic") {
//                 await agent.fetchRootKey();
//             }

//             const actor = Actor.createActor(ledgerIDL, { agent, canisterId });
//             if (!actor) {
//                 throw new Error("Actor creation failed. Check the IDL and canister ID.");
//               }
//             return actor;
//         } catch (err) {
//             console.error("Error creating custom actor:", err.message);
//             throw err;
//         }
//     };
    
//     const signerId = localStorage.getItem("signerId");
    


//     return {
//         isInitializing,
//         isAuthenticated: !!user,
//         isConnecting,
//         accounts,
//         identity,
//         backendActor,
//         createCustomActor,
//         delegationType,
//         handleLogin,
//         principal: user?.principal?.toText() || null,
//         logout: handleLogout,
//         fetchBalance,
//         signerId
//     };
// };

// export const AuthProvider = ({ children }) => {
//     const auth = useAuthClient();
//     return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// };

// export const useAuths = () => useContext(AuthContext);





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

const host = process.env.DFX_NETWORK === "ic" ? "https://icp0.io" : "http://127.0.0.1:4943";

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
      // Ensure the Plug extension is installed
      if (!window.ic?.plug) {
        throw new Error("Plug extension is not installed or unavailable.");
      }
  
      const canisterId = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;
      if (!canisterId) {
        throw new Error("Backend canister ID is not set in the environment variables.");
      }
  
      // Define the whitelist for canisters the app can interact with
      const whitelist = [canisterId];
  
      // Specify the host based on the network environment
    
  
      // Request connection to Plug wallet
      const isConnected = await window.ic.plug.requestConnect({ whitelist, host });
      if (!isConnected) {
        throw new Error("Connection to Plug was refused by the user.");
      }
  
      // Create an actor for interacting with the backend canister
      const userActor = await window.ic.plug.createActor({
        canisterId,
        interfaceFactory: DaoFactory,
      });
  
      // Retrieve the principal associated with the Plug wallet
      const principal = await window.ic.plug.agent.getPrincipal();
  
      // Update local state with authentication details
      setUserPrincipal(principal.toString());
      setIdentity(window.ic.plug.agent);
      setBackendActor(userActor);
      setIsAuthenticated(true);
  
      // Dispatch Redux action for login success
      dispatch(
        loginSuccess({
          isAuthenticated: true,
          identity: window.ic.plug.agent,
          principal: principal.toString(),
        })
      );
    } catch (err) {
      // Handle errors and display messages for better user experience
      console.error("Error during Plug login:", err.message || err);
      setError(err.message || "An unexpected error occurred during Plug login.");
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

    const agent = new HttpAgent({ identity,host });
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
