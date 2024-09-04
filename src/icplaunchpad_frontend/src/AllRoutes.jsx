import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import LaunchCoin from "./Pages/LaunchCoin"
import CreatePreLaunch from './Pages/CreatePreLaunch';
// import { AuthProvider } from "./utils/useAuthClient"

import PrivateLayout from './Layout/PrivateLayout';
import VerifyToken from './Pages/VerifyToken/VerifyToken';

function AllRoutes() {
  return (
    
      <Routes>
        <Route
          path="/"
          element={
            <PrivateLayout>
              <Home />
            </PrivateLayout>
          }
        />
        <Route
        path="/launchCoin"
        element={
          <PrivateLayout>
            <LaunchCoin />
          </PrivateLayout>
        }
      />
        <Route 
        path="/create-prelaunch" 
        element={
          <PrivateLayout>
            <CreatePreLaunch />
          </PrivateLayout>
        } 
        />

        <Route 
        path="/verify-token" 
        element={
          <PrivateLayout>
            <VerifyToken />
          </PrivateLayout>
        } 
        />

      </Routes>
   
  )
}

export default AllRoutes;