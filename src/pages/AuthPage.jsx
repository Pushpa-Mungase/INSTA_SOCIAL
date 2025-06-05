import { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // your configured axios
import { useAuth } from "../context/AuthContext"; // your auth context
import { toast } from "react-toastify";
import { useNavigate,useSearchParams } from "react-router-dom";
import apiUrls from "../utils/apiUrls";
export default function AuthPage() {
      const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuth();
  const [searchParams] = useSearchParams();
const initialView = searchParams.get("view");
const [authView, setAuthView] = useState(initialView);
  //const [authView, setAuthView] = useState("signup"); // toggle between "signup" and "login"
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    remember: false,
  });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        authView === "signup"
          ? await apiUrls.signUpUser
          : await apiUrls.loginUser;

      const payload =
        authView === "signup"
          ? {
              name: authData.name,
              email: authData.email,
              password: authData.password,
            }
          : {
              email: authData.email,
              password: authData.password,
            };

      const res = await axiosInstance.post(url, payload);

      if (res.data.status || res.data.success) {
        if (authView === "signup") {

          toast.success("Signup successful! Please login now.");
          setAuthView("login");
          setAuthData({ name: "", email: "", password: "", remember: false });
        } else {
          const token = res.data.token;
          login(token, authData.remember);
          toast.success("Login successful!");
            navigate("/home");
          // Optionally redirect or fetch user data here
        }
      } else {
        toast.error(res.data.message || "Authentication failed");
      }
    } catch (error) {
      // console.error("Auth error:", error);

  // backend error message usually in error.response.data.error
  const message =
    error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(message);
    
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <h2>You are logged in!</h2>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="auth-container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{authView === "signup" ? "Sign Up" : "Login"}</h1>
      <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
        {authView === "signup" && (
          <input
            type="text"
            required
            placeholder="Name"
            value={authData.name}
            onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
            className="border p-2 rounded"
          />
        )}
        <input
          type="email"
          required
          placeholder="Email"
          value={authData.email}
          onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={authData.password}
          onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={authData.remember}
            onChange={(e) => setAuthData({ ...authData, remember: e.target.checked })}
          />
          Remember Me
        </label>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          {authView === "signup" ? "Sign Up" : "Login"}
        </button>
      </form>
      <p
        className="mt-4 text-center text-blue-500 cursor-pointer"
        onClick={() => setAuthView(authView === "signup" ? "login" : "signup")}
      >
        {authView === "signup"
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
}
