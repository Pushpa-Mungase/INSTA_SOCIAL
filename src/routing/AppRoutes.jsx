import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../Layout/Home"; // Your layout wrapper
import HomePage from "../MyComponent/HomePage";
import EditPostPage from "../MyComponent/EditPostPage";

export default function AppRouting() {
  return (
    <>
      <Routes>
        {/* Private Routes inside Home layout */}
        <Route
          path="/"
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
