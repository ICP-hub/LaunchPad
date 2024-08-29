import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import LaunchCoin from "./Pages/LaunchCoin"
import PrivateLayout from './Layout/PrivateLayout';
import Projects from './Pages/Projects/Projects';

function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrivateLayout>  <Home /></PrivateLayout>} />
      <Route path="/projects" element={<PrivateLayout> <Projects /> </PrivateLayout>} />
      <Route path="/launchCoin" element={<PrivateLayout> <LaunchCoin /> </PrivateLayout>} />
    </Routes>
  )
}

export default AllRoutes;