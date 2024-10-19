import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { NFID } from "@nfid/embed";
import { PlugMobileProvider } from "@funded-labs/plug-mobile-sdk";
import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
import { HttpAgent, Actor } from "@dfinity/agent";
import { useDispatch } from "react-redux";
import { setActor } from "../Redux/Reducers/actorBindReducer";
import { idlFactory as ledgerIDL } from "./ledger.did.js";
import {
  loginSuccess,
  logoutSuccess,
  logoutFailure,
} from "../Redux/Reducers/InternetIdentityReducer";
import { idlFactory } from "../../../../declarations/icplaunchpad_backend/icplaunchpad_backend.did.js";
// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your app and provide authentication functionality
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActorState] = useState(null);
  const [defaultidentity, setDefaultIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [nfid, setNfid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize AuthClient and NFID on mount
    const initializeAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);

        const nfidInstance = await NFID.init({
          application: "test",
          logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg",
        });
        setNfid(nfidInstance);
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      }
    };
    initializeAuth();
  }, []);

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
          console.log("first identity", identity);
          setDefaultIdentity(identity);
          setPrincipal(principal);
          dispatch(
            loginSuccess({ isAuthenticated: true, principal, defaultidentity })
          );
          dispatch(setActor(actor));
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
      // Fetch the delegation identity from NFID
      const delegationIdentity = await nfid.getDelegation({
        targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
        maxTimeToLive: BigInt(8) * BigInt(3_600_000_000_000),
      });

      // Create an agent with the delegation identity
      const agent = new HttpAgent({ identity: delegationIdentity });

      // For development only, fetch the root key (remove in production)
      if (process.env.NODE_ENV !== "production") {
        await agent.fetchRootKey();
      }

      // Create an actor for interacting with the backend canister
      const actor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, {
        agent,
      });

      // Save the actor in state
      setActorState(actor);
      setIsAuthenticated(true);

      // Fetch the user's identity and principal
      const identity = await nfid.getIdentity();
      const principalText = identity.getPrincipal().toText();

      // Update Redux state or other state management with login details
      dispatch(
        loginSuccess({ isAuthenticated: true, principal: principalText })
      );
      dispatch(setActor(actor));
      setPrincipal(principalText);
      setDefaultIdentity(identity);
      console.log("Authenticated with principal:", principalText);
    } catch (error) {
      // Enhanced error handling for debugging
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
      if (isMobile) {
        console.log("Detected mobile browser, using PlugMobileProvider.");

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

        const actor = createActor(
          process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
          { agent }
        );
        setActorState(actor);
        setIsAuthenticated(true);

        const principalText = agent.getPrincipal().toText();
        const identity = agent.getIdentity();
        console.log(
          "Authenticated with PlugMobileProvider, principal:",
          principalText
        );

        setPrincipal(principalText);
        setDefaultIdentity(identity);
        dispatch(
          loginSuccess({ isAuthenticated: true, principal: principalText })
        );
        dispatch(setActor(actor));
      } else {
        console.log("Detected desktop browser, using window.ic.plug.");

        // Check if Plug Wallet is available
        if (!window.ic || !window.ic.plug) {
          console.error("Plug Wallet is not available on window.ic.");
          return;
        }

        const connected = await window.ic.plug.requestConnect({
          whitelist: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
          timeout: 5000,
        });

        if (connected) {
          await window.ic.plug.createAgent();
          const principal = await window.ic.plug.agent.getPrincipal();
          const identity = await window.ic.plug.agent.getIdentity();

          const backendActor = await window.ic.plug.createActor({
            canisterId: process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
            interfaceFactory: idlFactory,
          });

          console.log(
            "Authenticated with window.ic.plug, principal:",
            principal.toText()
          );

          setActorState(backendActor);
          setPrincipal(principal.toText());
          setDefaultIdentity(identity);
          setIsAuthenticated(true);
          dispatch(
            loginSuccess({
              isAuthenticated: true,
              principal: principal.toText(),
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

  const reloadLogin = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient.isAuthenticated() &&
          !(await authClient.getIdentity().getPrincipal().isAnonymous())
        ) {
          updateClient(authClient);
          resolve(authClient);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  async function updateClient(client) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setDefaultIdentity(identity);

    const principal = identity.getPrincipal().toText();
    setPrincipal(principal);

    setAuthClient(client);
    const agent = new HttpAgent({
      identity,
      verifyQuerySignatures: process.env.DFX_NETWORK === "ic",
    });

    if (process.env.DFX_NETWORK !== "ic") {
      await agent.fetchRootKey().catch((err) => {
        console.warn("Unable to fetch root key:", err);
      });
    }

    const actor = createActor(process.env.CANISTER_ID_ICPACCELERATOR_BACKEND, {
      agent,
    });

    if (isAuthenticated) {
      dispatch(loginSuccess({ isAuthenticated, identity, principal }));
      dispatch(setActor(actor));
    }
    setBackendActor(actor);
  }

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

  // A function to handle updating the greeting state
  const updateGreeting = async () => {
    try {
      const res = await actor.whami();
      setGreeting(res);
    } catch (error) {
      console.error("Failed to fetch greeting:", error);
    }
  };

  // Function to dynamically create an actor for any canister
  // const createCustomActor = async (canisterId) => {
  //   try {
  //     const agent = new HttpAgent({ identity });

  //     // Fetch the root key for local development (but not on IC mainnet)
  //     if (process.env.DFX_NETWORK !== "ic") {
  //       await agent.fetchRootKey().catch((err) => {
  //         console.warn("Unable to fetch root key. Check your local replica.", err);
  //       });
  //     }

  //     // Dynamically create the actor using the canisterId
  //     const actor = createActor({
  //       canisterId,
  //       agent,
  //     });
  //     // const actor = createActor(canisterId, { agent });

  //     return actor;
  //   } catch (err) {
  //     console.error("Error creating actor:", err);
  //   }
  // };

  const host = "http://127.0.0.1:4943/";
  const createCustomActor = async (canisterId) => {
    try {
      console.log("Identity value before agent creation:", defaultidentity);
      console.log("Creating actor for canister ID:", canisterId);

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
      console.log("Created ledger actor:", ledgerActor);
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
        greeting,
        createCustomActor,
        authenticateWithII,
        authenticateWithNFID,
        authenticateWithPlug,
        logout,
        updateGreeting,
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