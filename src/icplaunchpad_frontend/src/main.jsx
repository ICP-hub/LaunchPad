
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./StateManagement/useContext/useAuth";
import { Provider } from "react-redux";
import store, { persistor } from "./StateManagement/Redux/Store";
import { PersistGate } from "redux-persist/integration/react";
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </AuthProvider>
 </Provider>
);
