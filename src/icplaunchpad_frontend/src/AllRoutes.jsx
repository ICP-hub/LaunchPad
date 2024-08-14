import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";

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

      </Routes>
   
  )
}

export default AllRoutes;