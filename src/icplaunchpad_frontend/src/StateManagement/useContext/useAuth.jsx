import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { NFID } from "@nfid/embed";
import { PlugMobileProvider } from "@funded-labs/plug-mobile-sdk";
import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
import { HttpAgent,Actor } from "@dfinity/agent";
import { useDispatch } from "react-redux";
import { setActor } from "../Redux/Reducers/actorBindReducer";
import { idlFactory as ledgerIDL } from "./ledger.did.js";
import {
  loginSuccess,
  logoutSuccess,
  logoutFailure,
} from "../Redux/Reducers/InternetIdentityReducer";
import toast from 'react-hot-toast';
import { idlFactory } from "../../../../declarations/icplaunchpad_backend/icplaunchpad_backend.did.js";
// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your app and provide authentication functionality
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActorState] = useState(null);
  const [defaultidentity,setDefaultIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [nfid, setNfid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize AuthClient and NFID on mount
    const initializeAuth = async () => {
      try {
        const client = await AuthClient.create();
        console.log('initialize client',client)
        const nfidInstance = await NFID.init({
          application: "test",
          logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg",
        });
        setNfid(nfidInstance);
        setAuthClient(client);
        // if (await client.isAuthenticated()) {
        //   reloadLogin(client);
        // }
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      }
    };
    initializeAuth();
  }, []);
  useEffect(()=>{
    reloadLogin()
  },[authClient])

  const isSafariBrowser = () => {
    return (
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      navigator.userAgent.indexOf("Chrome") === -1
    );
  };


 
  const authenticateWithII = async () => {
    try {
      await authClient.login({
        identityProvider:
          process.env.DFX_NETWORK === "ic"
            ? "https://identity.ic0.app"
            : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943",
        onSuccess: async () => {
          const agent = new HttpAgent({ identity: authClient.getIdentity() });
          const actor = createActor(
            process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
            { agent }
          );
          setActorState(actor);
          setIsAuthenticated(true);
  
          const principal = authClient.getIdentity().getPrincipal().toText();
          const identity = authClient.getIdentity();
          const isAuthenticated = authClient.isAuthenticated();
  
          setDefaultIdentity(identity);
          setPrincipal(principal);
          setIsAuthenticated(isAuthenticated);
          dispatch(
            loginSuccess({
              isAuthenticated: isAuthenticated,
              principal: principal,
              defaultidentity: identity,
            })
          );
          dispatch(setActor(actor));
          updateClient(authClient, "authClient");
          localStorage.setItem("walletType", "authClient");
        },
        onError: (error) => {
          console.error("Internet Identity login failed:", error);
        },
      });
    } catch (error) {
      console.error("Internet Identity login failed:", error);
    }
  };

  const authenticateWithNFID = async () => {
    try {
      const delegationIdentity = await nfid.getDelegation({
        targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
        maxTimeToLive: BigInt(8) * BigInt(3_600_000_000_000),
      });
      const agent = new HttpAgent({ identity: delegationIdentity });
  
      if (process.env.NODE_ENV !== "production") {
        await agent.fetchRootKey();
      }
      const actor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, {
        agent,
      });
      setActorState(actor);
      setIsAuthenticated(true);
  
      const identity = await nfid.getIdentity();
      const principalText = identity.getPrincipal().toText();
      dispatch(
        loginSuccess({ isAuthenticated: true, principal: principalText })
      );
      dispatch(setActor(actor));
      setPrincipal(principalText);
      setDefaultIdentity(identity);
  
      // Call updateClient for NFID
      updateClient(delegationIdentity, "NFID");
      localStorage.setItem("walletType", "NFID");
    } catch (error) {
      console.error("NFID login failed:", error);
      if (error.message.includes("subnet")) {
        console.error(
          "Subnet not found - double-check the canister ID or subnet configuration."
        );
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };
  

 
  
  const authenticateWithPlug = async () => {
    try {
      const isMobile = PlugMobileProvider.isMobileBrowser();
      if (isSafariBrowser()) {
        alert("Safari browser detected. Some features might not work as expected.");
      }
      if (isMobile) {
        const provider = new PlugMobileProvider({
          debug: true,
          walletConnectProjectId: "77116a21991734ff2e6e715967655746",
          window: window,
        });
        await provider.initialize();
  
        if (!provider.isPaired()) {
          await provider.pair();
        }
        const agent = await provider.createAgent({
          host: "https://icp0.io",
          targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
        });
  
        if (agent) {
          // Call updateClient for Plug Wallet Mobile
          updateClient(agent, "Plug");
          localStorage.setItem("walletType", "Plug");
        }
  
        const actor = createActor(
          process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
          { agent }
        );
        setActorState(actor);
        setIsAuthenticated(true);
  
        const principalText = agent.getPrincipal().toText();
        const isAuthenticated = await window.ic.plug.isConnected();
        const accountId = await window.ic.plug.accountId;
  
        setPrincipal(principalText);
        setDefaultIdentity(accountId);
        dispatch(
          loginSuccess({
            isAuthenticated: isAuthenticated,
            principal: principalText,
            defaultidentity: accountId,
          })
        );
        dispatch(setActor(actor));
      } else {
        // Desktop Plug Wallet login logic
        if (!window.ic || !window.ic.plug) {
          console.error("Plug Wallet is not available on window.ic.");
          return;
        }
  
        const connected = await window.ic.plug.requestConnect({
          whitelist: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
          timeout: 5000,
        });
  
        if (connected) {
          const agent = await window.ic.plug.createAgent();
          const principal = await window.ic.plug.agent.getPrincipal();
          const backendActor = await window.ic.plug.createActor({
            canisterId: process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
            interfaceFactory: idlFactory,
          });
  
          const isAuthenticated = await window.ic.plug.isConnected();
          const accountId = await window.ic.plug.accountId;
  
          if (agent) {
            // Call updateClient for Plug Wallet Desktop
            updateClient(agent, "Plug");
            localStorage.setItem("walletType", "Plug");
          }
  
          setActorState(backendActor);
          setPrincipal(principal.toText());
          setDefaultIdentity(accountId);
          setIsAuthenticated(isAuthenticated);
          dispatch(
            loginSuccess({
              isAuthenticated: isAuthenticated,
              principal: principal.toText(),
              defaultidentity: accountId,
            })
          );
          dispatch(setActor(backendActor));
        } else {
          console.error("Failed to connect with Plug Wallet.");
        }
      }
    } catch (error) {
      console.error("Plug Wallet login failed:", error);
    }
  };
  

  async function updateClient(clientOrAgent, walletType = "authClient") {
    console.log('update client', clientOrAgent);
  
    let isAuthenticated = false;
    let identity = null;
    let principal = null;
    let agent = null;
  
    // Handle different wallet types and retrieve their specific data
    switch (walletType) {
      case "authClient":
        isAuthenticated = await clientOrAgent.isAuthenticated();
        identity = clientOrAgent.getIdentity();
         principal = clientOrAgent.getIdentity().getPrincipal().toText();
        agent = new HttpAgent({ identity, verifyQuerySignatures: process.env.DFX_NETWORK === "ic" });
        break;
  
      case "NFID":
        identity = await clientOrAgent;
        principal = identity.getPrincipal().toText();
        agent = new HttpAgent({ identity });
        isAuthenticated = !!identity; // Check if identity exists
        break;
  
      case "Plug":
        isAuthenticated = await window.ic.plug.isConnected();
        principal = await window.ic.plug.agent.getPrincipal();
        identity = await window.ic.plug.accountId;
        agent = window.ic.plug.agent; // Use Plug agent directly
        break;
  
      default:
        console.error("Unknown wallet type.");
        return;
    }
  
    // If not authenticated, abort further actions
    if (!isAuthenticated) {
      console.error("User is not authenticated. Aborting updateClient.");
      return;
    }
  
    // Fetch root key only in non-production environments for `authClient` and agents that implement `fetchRootKey`
    if (process.env.DFX_NETWORK !== "ic" && walletType === "authClient" && agent.fetchRootKey) {
      try {
        await agent.fetchRootKey();
      } catch (err) {
        console.warn("Unable to fetch root key:", err);
      }
    }
  
    // Create the actor
    const actor = createActor(process.env.CANISTER_ID_ICPACCELERATOR_BACKEND, { agent });
  
    // Dispatch login success and set the actor
    dispatch(loginSuccess({
      isAuthenticated: isAuthenticated,
      principal: principal,
      defaultidentity: identity,
    }));
    dispatch(setActor(actor));
  
    // Update the component state
    setActorState(actor);
    setIsAuthenticated(isAuthenticated);
    setPrincipal(principal);
    setAuthClient(clientOrAgent); // Only relevant for authClient
  }
  
  
  const reloadLogin = async () => {
    try {
      const previousWalletType = localStorage.getItem("walletType");
      let isAuthenticated = false;
  
      // Check if the previous wallet was authClient
      if (previousWalletType === "authClient" && authClient && await authClient.isAuthenticated()) {
        await updateClient(authClient, "authClient");
        isAuthenticated = true;
      }
  
      // Check if the previous wallet was NFID
      if (previousWalletType === "NFID" && nfid) {
        const identity = await nfid.getIdentity();
        if (identity && identity.getPrincipal()) {
          await updateClient(nfid, "NFID");
          isAuthenticated = true;
        }
      }
  
      // Check if the previous wallet was Plug
      if (previousWalletType === "Plug" && window.ic && window.ic.plug) {
        const connected = await window.ic.plug.isConnected();
        if (connected) {
          await updateClient(window.ic.plug.agent, "Plug");
          isAuthenticated = true;
        }
      }
  
      // If none of the wallets are authenticated
      if (!isAuthenticated) {
        console.log("No wallet is authenticated.");
      }
  
      return isAuthenticated;
    } catch (error) {
      console.error("Error in reloadLogin for all wallets:", error);
      return false;
    }
  };
  
  
  

  const logout = async () => {
    try {
      if (authClient) {
        await authClient.logout();
        
      }
      setIsAuthenticated(false);
      setPrincipal(null);
      setActorState(null);
      dispatch(logoutSuccess());
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logoutFailure(error.toString()));
    }
  };

  
  const host = "http://127.0.0.1:4943/";
  const createCustomActor = async (canisterId) => {
    try {
  
      const agent = new HttpAgent({ defaultidentity, host });
  
      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey().catch((err) => {
          console.warn(
            "Unable to fetch root key. Check your local replica.",
            err
          );
        });
      }
  
      const ledgerActor = Actor.createActor(ledgerIDL, { agent, canisterId });
      return ledgerActor;
    } catch (err) {
      console.error("Error creating ledger actor:", err);
    }
  };
  
  

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        principal,
        actor,
        authClient,
        createCustomActor,
        authenticateWithII,
        authenticateWithNFID,
        authenticateWithPlug,
        logout,
        reloadLogin,
        updateClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easier access to the AuthContext
export const useAuth = () => useContext(AuthContext);

