// src/services/authService.js
import axiosInstance from "../utils/axiosInstance"; // Adjust path as needed

export const signup = async (formData) => {
  return axiosInstance.post("/signup", formData);
};

export const login = async (formData) => {
  return axiosInstance.post("/login", formData);
};
