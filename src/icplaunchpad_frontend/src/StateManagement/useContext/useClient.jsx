import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
import {  useBalance, useIdentity, useAccounts, useDelegationType, useIsInitializing, useAuth, useAgent } from '@nfid/identitykit/react';
import {
    loginStart,
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
    const { connect, disconnect, isConnecting, user } = useAuth()
         const { balance, fetchBalance } = useBalance()
         const identity = useIdentity()
         const accounts = useAccounts()
         const agent = useAgent()
         const delegationType = useDelegationType()
         const isInitializing = useIsInitializing()
    const [backendActor, setBackendActor] = useState(null);

    // console.log('user',user?.principal.toText())
    // console.log('icpBalance',balance)
    useEffect(() => {
        if (user) {
            const backendCanisterId = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;
    
            if (!backendCanisterId) {
                console.error("CANISTER_ID_ICPLAUNCHPAD_BACKEND is undefined");
                return;
            }
    
            const actor = createActor(backendCanisterId, { agent });
    console.log('actor',actor)
            setBackendActor(actor);
    
            dispatch(
                loginSuccess({
                    isAuthenticated: true,
                    identity,
                    principal: user?.principal.toText(),
                })
            );
        }
    }, [user, dispatch]);
    

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
            console.error('Login Error:', error);
            dispatch(loginFailure(error.toString()));
        }
    };

    const handleLogout = async () => {
        try {
            await disconnect();
            setBackendActor(null);
            dispatch(logoutSuccess());
        } catch (error) {
            console.error('Logout Error:', error);
            dispatch(logoutFailure(error.toString()));
        }
    };



    const createCustomActor = async (canisterId) => {
        try {
          if (!canisterId) {
            throw new Error("Canister ID is required.");
          }
          const agent = new HttpAgent({ identity });
          console.log("Creating actor for canister ID:", canisterId);
          const actor = Actor.createActor(ledgerIDL, { agent, canisterId });
          if (!actor) {
            throw new Error("Actor creation failed. Check the IDL and canister ID.");
          }
          console.log("Actor created successfully:", actor);
          return actor;
        } catch (err) {
          console.error("Error creating custom actor:", err.message, err.stack);
          throw err;
        }
      };
    
    
    const principal = user && user.principal ? user.principal.toText() : null;


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
        principal: principal,
        logout: handleLogout,
        fetchBalance,
        actor: createActor(canisterID, {
            agentOptions: { identity, verifyQuerySignatures: false },
        }),
    };
};

export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();


    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuths = () => useContext(AuthContext);

