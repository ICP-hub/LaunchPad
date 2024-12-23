import React, { useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import LaunchCoin from "./Pages/LaunchCoin"

import CreatePreLaunch from './Pages/CreatePreLaunch';
// import { AuthProvider } from "./utils/useAuthClient"
import Profile from "./Pages/Profile/Profile"
import PrivateLayout from './Layout/PrivateLayout';
import VerifyToken from './Pages/VerifyToken/VerifyToken';
import ProjectList from './Pages/Projects/Projects';
import TokenPage from './Pages/OwnerSection/TokenPage';
import Project from './Pages/Project/project'
import { useDispatch, useSelector } from 'react-redux';
import { upcomingSalesHandlerRequest } from './StateManagement/Redux/Reducers/UpcomingSales';
import { SuccessfulSalesHandlerRequest } from './StateManagement/Redux/Reducers/SuccessfulSales';

function AllRoutes() {

const dispatch=useDispatch();
const actor = useSelector((currState) => currState.actors.actor);

  useEffect(() => {
    if(actor){
    dispatch(upcomingSalesHandlerRequest()) 
    dispatch(SuccessfulSalesHandlerRequest())
    }
  }, [dispatch,actor]);

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
         
         <Route 
        path="/project" 
        element={
          <PrivateLayout>
            <Project />
          </PrivateLayout>
        } 
        />
      </Routes>
   

  )
}

export default AllRoutes;