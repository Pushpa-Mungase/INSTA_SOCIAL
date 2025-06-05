import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../Layout/Home"; // Your layout wrapper
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
//import EditPostPage from "../pages/EditPostPage";

export default function AppRouting() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPage/>} />
        {/* Private Routes inside Home layout */}
        <Route
          path="/home"
          element={
            <Home>
              <HomePage />
            </Home>
          }
        />
      
      </Routes>
    </>
  );
}
