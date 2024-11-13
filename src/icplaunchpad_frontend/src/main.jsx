import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import Modal from 'react-modal';
import { Provider } from "react-redux";
import store, { persistor } from "./StateManagement/Redux/Store";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "./StateManagement/useContext/useClient";
import {
  IdentityKitProvider,
  IdentityKitTheme,
} from "@nfid/identitykit/react";
import { BrowserRouter } from 'react-router-dom';
import {
  IdentityKitAuthType,
  NFIDW,
  Plug,
  InternetIdentity,
} from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";

Modal.setAppElement('#root');

// Define signers and canister ID
const signers = [NFIDW, Plug, InternetIdentity];
const canisterID = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;

ReactDOM.createRoot(document.getElementById("root")).render(
  <IdentityKitProvider
    onConnectSuccess={(res) => {
      console.log("logged in successfully", res);
    }}
    onDisconnect={(res) => {
      console.log("logged out successfully", res);
    }}
    signers={signers}
    theme={IdentityKitTheme.SYSTEM}
    authType={IdentityKitAuthType.DELEGATION}
    // authType={IdentityKitAuthType.ACCOUNTS}
    signerClientOptions={{
      targets: [canisterID],
                              
    }}
  >
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  </IdentityKitProvider>
);
