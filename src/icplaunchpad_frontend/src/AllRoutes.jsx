import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import LaunchCoin from "./Pages/LaunchCoin"
import CreatePreLaunch from './Pages/CreatePreLaunch';
// import { AuthProvider } from "./utils/useAuthClient"
import Profile from "./Pages/Profile/Profile"
import PrivateLayout from './Layout/PrivateLayout';
import VerifyToken from './Pages/VerifyToken/VerifyToken';
import ProjectList from './Pages/Projects/Projects';
import TokenPage from './Pages/TokenPage/TokenPage';

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
        
        <Route 
        path="/profile" 
        element={
          <PrivateLayout>
            <Profile />
          </PrivateLayout>
        } 
        />
         
         <Route 
        path="/projects" 
        element={
          <PrivateLayout>
            <ProjectList />
          </PrivateLayout>
        } 
        />

        <Route 
        path="/token-page" 
        element={
          <PrivateLayout>
            <TokenPage />
          </PrivateLayout>
        } 
        />

      </Routes>
   
  )
}

export default AllRoutes;