// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization":localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ""
//   },
// });


// export default axiosInstance;



import axios from "axios";

// Create an Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Add an interceptor to dynamically set the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the latest token from localStorage (or any other place you store it)
    const token = localStorage.getItem("token");
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Optionally, you can delete the header if no token is found
      delete config.headers["Authorization"];
    }
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

