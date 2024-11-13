// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAgent, useIdentityKit } from "@nfid/identitykit/react";
// import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
// import { Navigate, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { DelegationIdentity } from "@dfinity/identity";

// const AuthContext = createContext();

// const canisterID = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;
// export const useAuthClient = () => {
//     const [isConnected, setIsConnected] = useState(false);
//     const signerId = localStorage.getItem("signerId");
//     const [wallet, setWallet] = useState("");
//     // const [delegationExpiry, setDelegationExpiry] = useState(null)
//     const delegationExpiry =
//         Number(localStorage.getItem("delegationExpiry")) || 0;
//     const {
//         user,
//         connect,
//         disconnect: identityKitDisconnect,
//         identity,
//         icpBalance,
//     } = useIdentityKit();
//     const authenticatedAgent = useAgent();
//     console.log('user', user)
//     const disconnect = () => {
//         identityKitDisconnect();
//         setIsConnected(false);
//         localStorage.removeItem("delegationExpiry");
//     };
//     console.log("deligation", delegationExpiry);

//     const checkDelegationExpiry = () => {
//         if (delegationExpiry) {
//             const currentTime = Date.now();
//             console.log(
//                 "Delegation Expiry Time:",
//                 new Date(delegationExpiry).toLocaleString()
//             );

//             if (currentTime >= delegationExpiry) {
//                 toast.success("Delegation expired, logging out...");
//                 disconnect();
//                 //window.location.href = "/login";
//                 setTimeout(() => {
//                     window.location.reload(true); // Force page reload
//                 }, 2000); // Optional delay to allow toast to show fully
//             }
//         }
//     };

//     useEffect(() => {
//         if (user && identity !== "AnonymousIdentity") {
//             setIsConnected(true);

//             const expiryTime = Number(
//                 identity?._delegation?.delegations?.[0]?.delegation?.expiration
//             );
//             if (expiryTime) {
//                 localStorage.setItem("delegationExpiry", expiryTime / 1e6);
//             }

//             if (signerId === "Plug") {
//                 setWallet("plug");
//             } else if (signerId === "NFIDW") {
//                 setWallet("nfidw");
//             } else {
//                 setWallet("sometingwrong");
//             }

//             const interval = setInterval(checkDelegationExpiry, 1000);

//             return () => clearInterval(interval);
//         } else {
//             setIsConnected(false);
//         }
//     }, [user, delegationExpiry, connect]);


//     async function updateClient({ agent, identity, principal }, walletType) {
//         if (!agent || !identity || !principal) {
//             console.error("Invalid authentication details. Aborting updateClient.");
//             return;
//         }

//         let isAuthenticated = false;

//         // Handle authentication checks for different wallet types
//         switch (walletType) {
//             case "authClient":
//                 isAuthenticated = await authClient.isAuthenticated();

//                 // Fetch root key only in non-production environments for authClient
//                 if (isAuthenticated && process.env.DFX_NETWORK !== "ic") {
//                     try {
//                         await agent.fetchRootKey();
//                     } catch (err) {
//                         console.warn("Unable to fetch root key:", err);
//                     }
//                 }
//                 break;

//             case "NFID":
//                 isAuthenticated = !!identity;
//                 break;

//             case "Plug":
//                 isAuthenticated = await window.ic.plug.isConnected();
//                 break;

//             default:
//                 console.error("Unknown wallet type.");
//                 return;
//         }

//         if (!isAuthenticated) {
//             console.error("User is not authenticated. Aborting updateClient.");
//             return;
//         }

//         // Create the actor with the authenticated agent
//         const actor = createActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, { agent });

//         // Dispatch login success and actor state updates
//         dispatch(loginSuccess({ isAuthenticated: true, principal, defaultIdentity: identity }));
//         dispatch(setActor(actor));

//         // Update local state
//         setActorState(actor);
//         setIsAuthenticated(true);
//         setPrincipal(principal);
//     }



//     const host = "http://127.0.0.1:4943/";
//     const createCustomActor = async (canisterId) => {
//         try {
//             console.log("Identity value before agent creation:", defaultIdentity);
//             console.log("Creating actor for canister ID:", canisterId);

//             const agent = new HttpAgent({ defaultIdentity, host });

//             if (process.env.DFX_NETWORK !== "ic") {
//                 await agent.fetchRootKey().catch((err) => {
//                     console.warn(
//                         "Unable to fetch root key. Check your local replica.",
//                         err
//                     );
//                 });
//             }

//             const ledgerActor = Actor.createActor(ledgerIDL, { agent, canisterId });
//             console.log("Created ledger actor:", ledgerActor);
//             return ledgerActor;
//         } catch (err) {
//             console.error("Error creating ledger actor:", err);
//         }
//     };


//     // const createCustomActor = async (canisterId) => {
//     //     const agent = new HttpAgent({ identity, host: process.env.HOST || "https://ic0.app" });
//     //     if (process.env.DFX_NETWORK !== "ic") {
//     //         await agent.fetchRootKey().catch((err) => console.warn("Unable to fetch root key:", err));
//     //     }
//     //     return Actor.createActor(ledgerIDL, { agent, canisterId });
//     // };
//     return {
//         isConnected,
//         delegationExpiry,
//         wallet,
//         login: connect,
//         logout: disconnect,
//         createCustomActor,
//         balance: icpBalance,
//         principal: user?.principal,
//         actor: createActor(canisterID, {
//             agentOptions: { identity, verifyQuerySignatures: false },
//         }),
//     };
// };

// export const AuthProvider = ({ children }) => {
//     const auth = useAuthClient();
//     return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);








import React, { createContext, useContext, useEffect, useState } from "react";
import { useAgent, useIdentityKit } from "@nfid/identitykit/react";
import { createActor } from "../../../../declarations/icplaunchpad_backend/index";
import toast from "react-hot-toast";
import { Actor, HttpAgent } from "@dfinity/agent";
import { useDispatch } from "react-redux";
import { loginSuccess, logoutSuccess, logoutFailure, loginStart } from "../Redux/Reducers/InternetIdentityReducer";
import { setActor } from "../Redux/Reducers/actorBindReducer";

const AuthContext = createContext();

export const useAuthClient = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [wallet, setWallet] = useState("");
    const [actor, setActorState] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const dispatch = useDispatch();

    const signerId = localStorage.getItem("signerId");
    const delegationExpiry = Number(localStorage.getItem("delegationExpiry")) || 0;

    const {
        user,
        connect,
        disconnect: identityKitDisconnect,
        identity,
        icpBalance,
    } = useIdentityKit();
    const authenticatedAgent = useAgent();
    const canisterID = import.meta.env.VITE_CANISTER_ID_ICPLAUNCHPAD_BACKEND;

    // Disconnect function
    const disconnect = () => {
        identityKitDisconnect();
        setIsConnected(false);
        localStorage.removeItem("delegationExpiry");
    };

    // Check delegation expiration and log out if expired
    useEffect(() => {
        const checkDelegationExpiry = () => {
            const currentTime = Date.now();
            if (delegationExpiry && currentTime >= delegationExpiry) {
                toast.success("Delegation expired, logging out...");
                disconnect();
            }
        };

        const interval = setInterval(checkDelegationExpiry, 5 * 60 * 1000); // Check every 5 minutes
        return () => clearInterval(interval);
    }, [delegationExpiry]);

    useEffect(() => {
        if (user && identity !== "AnonymousIdentity") {
            setIsConnected(true);
            setPrincipal(user?.principal?.toText());

            const expiryTime = Number(identity?._delegation?.delegations?.[0]?.delegation?.expiration);
            if (expiryTime) {
                localStorage.setItem("delegationExpiry", expiryTime / 1e6);
            }

            setWallet(signerId === "Plug" ? "plug" : signerId === "NFIDW" ? "nfidw" : "unknown");

            const newActor = createActor(canisterID, { agent: authenticatedAgent });
            setActorState(newActor); 

            // Dispatch login success
            dispatch(loginSuccess({ isConnected: true, principal: principal, defaultIdentity: identity }));
            dispatch(setActor(newActor));
      
        } else {
            setIsConnected(false);
        }
    }, [user, identity, signerId, authenticatedAgent, dispatch]);

   
    const login = async () => {
        try {
            dispatch(loginStart({ wallet }));
            await connect(); 
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };
    // Create custom actor with local agent for local canisters
    const createCustomActor = async (canisterId) => {
        try {
            const agent = new HttpAgent({ identity, host: "http://127.0.0.1:4943/" });

            if (process.env.DFX_NETWORK !== "ic") {
                await agent.fetchRootKey();
            }

            return Actor.createActor(ledgerIDL, { agent, canisterId });
        } catch (err) {
            console.error("Error creating custom actor:", err);
        }
    };

    return {
        isAuthenticated: isConnected,
        delegationExpiry,
        wallet,
        // login: connect,
        login,
        logout: disconnect,
        createCustomActor,
        balance: icpBalance,
        principal,
        // updateClient,
        actor,
    };
};

export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
