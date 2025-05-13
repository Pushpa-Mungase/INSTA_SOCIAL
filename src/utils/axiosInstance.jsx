import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    "Authorization":localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ""
  },
});

// Optional: Attach auth token if using auth
// axiosInstance.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default axiosInstance;
