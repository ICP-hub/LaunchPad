import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { NFID } from "@nfid/embed";
import { PlugMobileProvider } from "@funded-labs/plug-mobile-sdk";
import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
import { HttpAgent, Actor } from "@dfinity/agent";
import { useDispatch } from "react-redux";
import { setActor } from "../Redux/Reducers/actorBindReducer";
import {
  loginSuccess,
  logoutSuccess,
  logoutFailure,
} from "../Redux/Reducers/InternetIdentityReducer";
import { idlFactory as ledgerIDL } from "./ledger.did.js";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your app and provide authentication functionality
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActorState] = useState(null);
  const [defaultIdentity, setDefaultIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [nfid, setNfid] = useState(null);
  const dispatch = useDispatch();

  // Initialize the authentication system
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const client = await AuthClient.create();
        const nfidInstance = await NFID.init({
          application: "test",
          logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg",
        });
        setNfid(nfidInstance);
        setAuthClient(client);
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      }
    };
    initializeAuth();
  }, []);

  // Safari check for potential issues
  const isSafariBrowser = () => {
    return (
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      navigator.userAgent.indexOf("Chrome") === -1
    );
  };

  // Function to authenticate with different wallets
  const authenticateWithWallet = async (walletType) => {
    try {
      let agent, identity, principal;

      switch (walletType) {
        case "II": // Internet Identity Login
          await authClient.login({
            identityProvider:
              process.env.DFX_NETWORK === "ic"
                ? "https://identity.ic0.app"
                : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943",
            onSuccess: async () => {
              agent = new HttpAgent({ identity: authClient.getIdentity() });
              identity = authClient.getIdentity();
              principal = identity.getPrincipal().toText();

              if (!identity || !principal) {
                console.error("Failed to retrieve identity or principal from II");
                return;
              }

              // Update client after successful login
              await updateClient({ agent, identity, principal }, "authClient");
              localStorage.setItem("walletType", "authClient");
            },
            onError: (error) => {
              console.error("Internet Identity login failed:", error);
            },
          });
          break;

        case "NFID": // NFID Login
          const delegationIdentity = await nfid.getDelegation({
            targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
            maxTimeToLive: BigInt(8) * BigInt(3_600_000_000_000),
          });
          agent = new HttpAgent({ identity: delegationIdentity });
          identity = await nfid.getIdentity();
          principal = identity.getPrincipal().toText();

          if (!identity || !principal) {
            console.error("Failed to retrieve identity or principal from NFID");
            return;
          }

          await updateClient({ agent, identity, principal }, "NFID");
          localStorage.setItem("walletType", "NFID");
          break;

        case "Plug": // Plug Wallet Login
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
            if (!provider.isPaired()) await provider.pair();

            agent = await provider.createAgent({
              host: "https://icp0.io",
              targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
            });
            principal = agent.getPrincipal().toText();
            identity = provider.accountId;
          } else if (window.ic && window.ic.plug) {
            const connected = await window.ic.plug.requestConnect({
              whitelist: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
              timeout: 5000,
            });

            if (connected) {
              agent = await window.ic.plug.createAgent();
              principal = await window.ic.plug.agent.getPrincipal();
              identity = await window.ic.plug.accountId;
            } else {
              console.error("Plug Wallet connection failed.");
              return;
            }
          } else {
            console.error("Plug Wallet is not available on window.ic.");
            return;
          }

          if (!identity || !principal) {
            console.error("Failed to retrieve identity or principal from Plug Wallet");
            return;
          }

          await updateClient({ agent, identity, principal }, "Plug");
          localStorage.setItem("walletType", "Plug");
          break;

        default:
          console.error("Unknown wallet type.");
          return;
      }
    } catch (error) {
      console.error(`${walletType} login failed:`, error);
    }
  };

  async function updateClient({ agent, identity, principal }, walletType) {
    if (!agent || !identity || !principal) {
      console.error("Invalid authentication details. Aborting updateClient.");
      return;
    }
  
    let isAuthenticated = false;
  
    // Handle authentication checks for different wallet types
    switch (walletType) {
      case "authClient":
        isAuthenticated = await authClient.isAuthenticated();
        
        // Fetch root key only in non-production environments for authClient
        if (isAuthenticated && process.env.DFX_NETWORK !== "ic") {
          try {
            await agent.fetchRootKey();
          } catch (err) {
            console.warn("Unable to fetch root key:", err);
          }
        }
        break;
        
      case "NFID":
        isAuthenticated = !!identity;
        break;
        
      case "Plug":
        isAuthenticated = await window.ic.plug.isConnected();
        break;
        
      default:
        console.error("Unknown wallet type.");
        return;
    }
  
    if (!isAuthenticated) {
      console.error("User is not authenticated. Aborting updateClient.");
      return;
    }
  
    // Create the actor with the authenticated agent
    const actor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, { agent });
  
    // Dispatch login success and actor state updates
    dispatch(loginSuccess({ isAuthenticated: true, principal, defaultIdentity: identity }));
    dispatch(setActor(actor));
  
    // Update local state
    setActorState(actor);
    setIsAuthenticated(true);
    setPrincipal(principal);
  }
  
  
  
  
  
  // Reload login session after page reload
  const reloadLogin = async () => {
   
    const previousWalletType = localStorage.getItem("walletType");
    let isAuthenticated = false;
    let agent, identity, principal;

    switch (previousWalletType) {
      case "authClient":
        if (await authClient.isAuthenticated()) {
          agent = new HttpAgent({ identity: authClient.getIdentity() });
          identity = authClient.getIdentity();
          principal = identity.getPrincipal().toText();
          await updateClient({ agent, identity, principal }, "authClient");
          isAuthenticated = true;
        }
        break;

      case "NFID":
        const nfidInstance = await NFID.init({
          application: "test",
          logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg",
        });
        if (nfidInstance && nfidInstance.initialized) {
          identity = await nfidInstance.getIdentity();
          const delegationIdentity = await nfidInstance.getDelegation({
            targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
            maxTimeToLive: BigInt(8) * BigInt(3_600_000_000_000),
          });
          agent = new HttpAgent({ identity: delegationIdentity });
          principal = identity.getPrincipal().toText();
          await updateClient({ agent, identity, principal }, "NFID");
          isAuthenticated = true;
        }
        break;

      case "Plug":
        if (window.ic && window.ic.plug && await window.ic.plug.isConnected()) {
          agent = await window.ic.plug.createAgent();
          principal = await window.ic.plug.agent.getPrincipal();
          identity = await window.ic.plug.accountId;
          await updateClient({ agent, identity, principal }, "Plug");
          isAuthenticated = true;
        }
        break;

      default:
        console.log("No previous wallet type found.");
        break;
    }

    return isAuthenticated;
  
  };

  // Automatically reload login session on page reload
  useEffect(() => {
    const reload = async () => {
      if (authClient) {
        await reloadLogin();
      }
    };
  
    reload();
  }, [authClient]);
  

  // Logout function
  const logout = async () => {
    try {
      if (authClient) {
        await authClient.logout();
      }
      setIsAuthenticated(false);
      setPrincipal(null);
      setActorState(null);
      localStorage.removeItem("walletType");
      dispatch(logoutSuccess());
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logoutFailure(error.toString()));
    }
  };


  const host = "http://127.0.0.1:4943/";
  const createCustomActor = async (canisterId) => {
    try {
      console.log("Identity value before agent creation:", defaultIdentity);
      console.log("Creating actor for canister ID:", canisterId);
  
      const agent = new HttpAgent({ defaultIdentity, host });
  
      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey().catch((err) => {
          console.warn(
            "Unable to fetch root key. Check your local replica.",
            err
          );
        });
      }
  
      const ledgerActor = Actor.createActor(ledgerIDL, { agent, canisterId });
      console.log("Created ledger actor:", ledgerActor);
      return ledgerActor;
    } catch (err) {
      console.error("Error creating ledger actor:", err);
    }
  };
  
//   console.log("isAuthenticated:", isAuthenticated);
// console.log("principal:", principal);
// console.log("actor:", actor);
// console.log("authClient:", authClient);
// console.log("createCustomActor:", createCustomActor);
// console.log("authenticateWithII:", authenticateWithII);
// console.log("authenticateWithNFID:", authenticateWithNFID);
// console.log("authenticateWithPlug:", authenticateWithPlug);
// console.log("logout:", logout);
// console.log("reloadLogin:", reloadLogin);
// console.log("updateClient:", updateClient);


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        principal,
        actor,
        authClient,
        authenticateWithWallet,
        createCustomActor,
        logout,
        reloadLogin,
        updateClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
