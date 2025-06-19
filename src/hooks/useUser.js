import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import apiUrls from "../utils/apiUrls";
import { getToken } from "../utils/tokenUtils";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setTokenState] = useState(getToken());

  // Listen for token changes in localStorage
  useEffect(() => {
    const handleStorage = () => {
      setTokenState(getToken());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(apiUrls.getUserById());
        setUser(res.data.user || res.data.data || res.data);
      } catch (err) {
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  return { user, loading, error };
}