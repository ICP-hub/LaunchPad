import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
import { Actor, HttpAgent } from "@dfinity/agent";
import { useDispatch } from "react-redux";
import { setActor } from "../Redux/Reducers/actorBindReducer";
import {
  loginSuccess,
  logoutSuccess,
  logoutFailure,
} from "../Redux/Reducers/InternetIdentityReducer";
import { NFID } from "@nfid/embed"; // Import NFID
import { PlugMobileProvider } from "@funded-labs/plug-mobile-sdk"; 

const AuthContext = createContext();

const defaultOptions = {
  createOptions: {
    idleOptions: {
      idleTimeout: 1000 * 60 * 30,
      disableDefaultIdleCallback: true,
    },
  },
  loginOptionsii: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
  },
  loginOptionsnfid: {
    identityProvider: `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [nfid, setNfid] = useState(null); // NFID state
  const dispatch = useDispatch();

  useEffect(() => {
    AuthClient.create(options.createOptions).then((client) => {
      setAuthClient(client);
    });

    // Initialize NFID
    const initNFID = async () => {
      const nfIDInstance = await NFID.init({
        application: "test",
        logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg",
      });
      setNfid(nfIDInstance);
    };

    initNFID();
  }, []);

  const login = (provider) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient.isAuthenticated() &&
          !(await authClient.getIdentity().getPrincipal().isAnonymous())
        ) {
          updateClient(authClient);
          resolve(authClient);
        } else {
          let opt = provider === "ii" ? "loginOptionsii" : "loginOptionsnfid";
          authClient.login({
            ...options[opt],
            onError: (error) => reject(error),
            onSuccess: () => {
              updateClient(authClient);
              resolve(authClient);
            },
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  // Plug Desktop Connect
 const loginWithPlug = async () => {
   return new Promise(async (resolve, reject) => {
     if (!window.ic?.plug) {
       reject(
         new Error(
           "Plug wallet not detected. Please install or enable the Plug extension."
         )
       );
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
         setPrincipal(principal.toString());

         const backendActor = await window.ic.plug.createActor({
           canisterId: process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND,
           interfaceFactory: DaoFactory,
         });

         setBackendActor(backendActor);
         setIsAuthenticated(true);

         // Dispatch success actions
         dispatch(loginSuccess({ isAuthenticated: true, identity, principal }));
         dispatch(setActor(backendActor));

         updateClient(authClient); 
         resolve(authClient);
       } else {
         reject(new Error("Plug connection failed."));
       }
     } catch (error) {
       reject(error);
     }
   });
 };


  // NFID Connect
const nfidConnect = async () => {
  try {
    const delegationIdentity = await nfid.getDelegation({
      targets: [process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND],
      maxTimeToLive: BigInt(8) * BigInt(3_600_000_000_000),
    });
    const identity = await nfid.getIdentity();
    const agent = new HttpAgent({ identity: delegationIdentity });
    const actor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, {
      agent,
    });

    setBackendActor(actor);
    setIsAuthenticated(true);

    // Dispatch success actions
    dispatch(
      loginSuccess({
        isAuthenticated: true,
        identity,
        principal: identity.getPrincipal().toText(),
      })
    );
    dispatch(setActor(actor));

    updateClient(authClient); // Ensures the authClient is updated after login
  } catch (err) {
    console.error("NFID Connect failed:", err);
  }
};


  // Plug Mobile Connect
  const plugConnectMobile = async () => {
    try {
      const isMobile = PlugMobileProvider.isMobileBrowser();
      if (isMobile) {
        const provider = new PlugMobileProvider({
          debug: true,
          walletConnectProjectId: "your-walletconnect-project-id",
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
        setBackendActor(actor);
        setIsAuthenticated(true);

        // Dispatch success actions
        dispatch(
          loginSuccess({
            isAuthenticated: true,
            identity,
            principal: identity.getPrincipal().toText(),
          })
        );
        dispatch(setActor(actor));
      } else {
        // Plug Desktop logic
       await loginWithPlug().catch((err) => {
         console.error("Error during Plug login:", err);
       });
      }
    } catch (err) {
      console.error("Plug Mobile Connect failed:", err);
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
    setIdentity(identity);

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

  async function logout() {
    try {
      await authClient?.logout();
      await updateClient(authClient);
      setIsAuthenticated(false);
      dispatch(logoutSuccess());
    } catch (error) {
      dispatch(logoutFailure(error.toString()));
    }
  }

  return {
    isAuthenticated,
    login,
    loginWithPlug, 
    nfidConnect, 
    plugConnectMobile, 
    logout,
    updateClient,
    authClient,
    identity,
    principal,
    backendActor,
    reloadLogin,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  if (auth.authClient && auth.backendActor) {
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
  } else {
    return null;
  }
};

export const useAuth = () => useContext(AuthContext);
