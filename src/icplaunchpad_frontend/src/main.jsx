
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./auth/useAuthClient";
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
