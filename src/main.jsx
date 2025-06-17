import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from "./pages/AuthPage.jsx";
import Outlet from "./Outlet.jsx";
import HomePage from "./pages/HomePage.jsx";
import SettingPage from "./pages/Setting.jsx";
import { ResetPasswordForm } from "./pages/ResetPassword.jsx";

// import HomePage from "./pages/HomePage";
// import Home from "./components/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route path="/login" index element={<AuthPage />} />
      {/* Uncomment and fix when Home and HomePage are ready */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/setting" element={<SettingPage />} />
      <Route path="/reset-password/:token" element={< ResetPasswordForm />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
      {/* <App /> */}
    </AuthProvider>

  </StrictMode>
);

