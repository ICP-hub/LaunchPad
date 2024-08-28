import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import LaunchCoin from "./Pages/LaunchCoin"

// import { AuthProvider } from "./utils/useAuthClient"

import PrivateLayout from './Layout/PrivateLayout';

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

      </Routes>
   
  )
}

export default AllRoutes;