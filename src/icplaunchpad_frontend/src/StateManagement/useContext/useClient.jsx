import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
import { useBalance, useIdentity, useAccounts, useDelegationType, useIsInitializing, useAuth ,useAgent} from '@nfid/identitykit/react';
import {
    loginSuccess,
    logoutSuccess,
    logoutFailure,
} from '../Redux/Reducers/InternetIdentityReducer';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as ledgerIDL } from "./ledger.did.js";

const AuthContext = createContext();
const canisterID = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;

export const useAuthClient = () => {
  const dispatch = useDispatch();
  const { connect, disconnect, isConnecting, user } = useAuth();
  const { balance, fetchBalance } = useBalance();
  const identity = useIdentity();
  const accounts = useAccounts();
  const delegationType = useDelegationType();
  const isInitializing = useIsInitializing();
  const agent = useAgent();

  const [backendActor, setBackendActor] = useState(null);

  const LOCAL_HOST = "http://127.0.0.1:4943";
  const MAINNET_HOST = "https://ic0.app";
  const HOST = process.env.DFX_NETWORK === "ic" ? MAINNET_HOST : LOCAL_HOST;

  useEffect(() => {
    const initActor = async () => {
      try {
        if (user && identity && agent) {
          // Fetch root key for local development
          if (process.env.DFX_NETWORK !== "ic") {
            await agent.fetchRootKey();
          }

          // Create actor
          const actor = createActor(canisterID, { agent });
          setBackendActor(actor);

          // Dispatch login success
          dispatch(
            loginSuccess({
              isAuthenticated: true,
              identity,
              principal: user?.principal.toText(),
            })
          );
        }
      } catch (error) {
        console.error("Error initializing actor:", error.message);
      }
    };
    debugReadState(agent, canisterID);
    testSigning();
    initActor();
  }, [user, identity, agent, dispatch]);

  const handleLogin = async () => {
    try {
      await connect();
      const principal = identity.getPrincipal().toText();
      dispatch(
        loginSuccess({
          isAuthenticated: true,
          identity,
          principal,
        })
      );
    } catch (error) {
      console.error("Login Error:", error);
      dispatch(loginFailure(error.toString()));
    }
  };

  const handleLogout = async () => {
    try {
      await disconnect();
      setBackendActor(null);
      dispatch(logoutSuccess());
    } catch (error) {
      console.error("Logout Error:", error);
      dispatch(logoutFailure(error.toString()));
    }
  };

  const createCustomActor = async (canisterId) => {
    try {
      if (!canisterId) {
        throw new Error("Canister ID is required.");
      }
  
      if (!identity || !agent) {
        throw new Error("Agent or Identity is not initialized.");
      }
  
      console.log("Creating actor for canister:", canisterId);
      console.log("Identity Principal:", identity.getPrincipal().toText());
  
      // Fetch root key for local environment
      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey();
      }
  
      const actor = Actor.createActor(ledgerIDL, {
        agent,
        canisterId,
      });
  
      if (!actor) {
        throw new Error("Actor creation failed. Check the IDL and canister ID.");
      }
  
      return actor;
    } catch (err) {
      console.error("Error creating custom actor:", err.message);
      throw err;
    }
  };
  
  // Test the signing process
  const testSigning = async () => {
    try {
      const encoder = new TextEncoder();
      const payload = encoder.encode("Test payload");
      const signature = await identity.sign(payload);
      console.log("Test Signature:", signature);
    } catch (error) {
      console.error("Error in signing:", error.message);
    }
  };
  
  // Debug readState
  const debugReadState = async (agent, canisterId) => {
    try {
      const paths = [[new TextEncoder().encode("time")]];
      const state = await agent.readState(canisterId, { paths });
      console.log("Read State Response:", state);
    } catch (error) {
      console.error("Error in readState:", error.message);
    }
  };
  
  // Usage
 
  

  const signerId = localStorage.getItem("signerId");

  return {
    isInitializing,
    isAuthenticated: !!user,
    isConnecting,
    accounts,
    identity,
    backendActor,
    createCustomActor,
    delegationType,
    handleLogin,
    principal: user?.principal?.toText() || null,
    logout: handleLogout,
    fetchBalance,
    signerId,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuths = () => useContext(AuthContext);
