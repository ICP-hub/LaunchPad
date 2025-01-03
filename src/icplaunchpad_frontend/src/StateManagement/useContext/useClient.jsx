import React, { createContext, useContext, useState ,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess, logoutFailure } from '../Redux/Reducers/InternetIdentityReducer';
import { setActor } from '../Redux/Reducers/actorBindReducer';
import { idlFactory as ledgerIDL } from "./ledger.did.js";
import { idlFactory } from "../../../../declarations/icplaunchpad_backend/index";

const AuthContext = createContext();
const canisterID = process?.env?.CANISTER_ID_ICPLAUNCHPAD_BACKEND ?? 'bw4dl-smaaa-aaaaa-qaacq-cai'
console.log('canisterID',canisterID)

export const useAuthClient = () => {
    const dispatch = useDispatch();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [backendActor, setBackendActor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const LOCAL_HOST = "http://127.0.0.1:4943" || "http://localhost:3000";
    const MAINNET_HOST = "https://icp0.io";

    const HOST = process?.env?.DFX_NETWORK === "ic" ? MAINNET_HOST : LOCAL_HOST;
    console.log('Host being used:', HOST);

    const validateEnvVariables = () => {
        if (!canisterID) {
            throw new Error("Backend Canister ID is not properly configured in environment variables.");
        }
    };

    const handleLogin = async () => {
        try {
            validateEnvVariables();
    
            if (!window?.ic?.plug) {
                alert("Plug Wallet extension not detected. Please install.");
                return {
                    isAuthenticated: false,
                    identity: null,
                    principal: null,
                };
            }
    
            setIsLoading(true);
    
            const whitelist = [canisterID];
            console.log("Connecting with whitelist:", whitelist);
            const isConnected = await window?.ic?.plug?.requestConnect({
                whitelist,
                host: HOST,
                timeout: 50000
            });
    
            if (!isConnected) {
                throw new Error("User denied Plug connection.");
            }
    
            const plugPrincipal = await window?.ic?.plug?.agent.getPrincipal();
            const plugAgent = window?.ic?.plug?.agent;
    
            console.log("Plug Principal:", plugPrincipal.toText());
            console.log("Plug Agent:", plugAgent);
    
            const backendActor = await window?.ic?.plug.createActor({
                canisterId: canisterID,
                interfaceFactory: idlFactory,
            });
    
            // Update React states
            setPrincipal(plugPrincipal.toText());
            setIsAuthenticated(true);
            setIdentity(plugAgent);
            setBackendActor(backendActor);
    
            // Dispatch actor for the app
            dispatch(setActor(backendActor));
    
            return {
                isAuthenticated: true,
                identity: plugAgent,
                principal: plugPrincipal.toText(),
            };
        } catch (error) {
            console.error("Login Error:", error.message || error);
            alert(`Login failed: ${error.message || "Unknown error occurred."}`);
            dispatch(logoutFailure(error.message || "Unknown error occurred during login."));
            return {
                isAuthenticated: false,
                identity: null,
                principal: null,
            };
        } finally {
            setIsLoading(false);
        }
    };
    
    const verifyConnection = async () => {
        const whitelist = [canisterID];
        const connected = await window.ic.plug.isConnected();
        if (!connected) await window.ic.plug.requestConnect({ whitelist, HOST });
      };
      
      
useEffect(() => {
    const checkConnection = async () => {
      await verifyConnection();
    };
  
    checkConnection();
  }, []);
    
    const handleLogout = async () => {
        try {
            setIdentity(null);
            setPrincipal(null);
            setBackendActor(null);
            setIsAuthenticated(false);

            dispatch(setActor(null));
            dispatch(logoutSuccess());
        } catch (error) {
            console.error("Logout Error:", error.message || error);
            alert(`Logout failed: ${error.message || "Unknown error occurred."}`);
            dispatch(logoutFailure(error.message || "Unknown error occurred during logout."));
        }
    };

    const createCustomActor = async (canisterId) => {
        try {
            if (!canisterId) {
                throw new Error("Canister ID is required.");
            }

            const actor = await window?.ic?.plug.createActor({
                canisterId,
                interfaceFactory: ledgerIDL,
            });
            return actor;
        } catch (error) {
            console.error("Error creating custom actor:", error.message || error);
            alert(`Failed to create actor: ${error.message || "Unknown error."}`);
            throw error;
        }
    };

    return {
        isAuthenticated,
        identity,
        principal,
        backendActor,
        isLoading,
        handleLogin,
        logout: handleLogout,
        createCustomActor,
    };
};

export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();

    if (auth.isLoading) {
        return <div>Connecting to Plug Wallet...</div>;
    }

    // Expose auth functions for non-React usage (like Redux Saga)
    window.authFunctions = {
        handleLogin: auth.handleLogin,
        handleLogout: auth.logout,
    };

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
export const useAuths = () => useContext(AuthContext);