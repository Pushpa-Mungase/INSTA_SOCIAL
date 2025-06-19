import { createContext, useContext, useEffect, useState } from "react";
import { getToken, clearToken, setToken } from "../utils/tokenUtils";
import useUser from "../hooks/useUser";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const { user, loading: userLoading, error: userError } = useUser();

  const login = (token) => {
  setToken(token);
  setIsAuthenticated(true);
  window.dispatchEvent(new Event("storage")); 
};

const logout = () => {
  clearToken();
  setIsAuthenticated(false);
  window.dispatchEvent(new Event("storage")); 
};

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, userLoading, userError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
