import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Chrome } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import axiosInstance from "../utils/axiosInstance"; // your configured axios
import { useAuth } from "../context/AuthContext"; // your auth context
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiUrls from "../utils/apiUrls";

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get("view");
  const [authView, setAuthView] = useState(initialView || "login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    remember: false,
  });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = authView === "signup" ? apiUrls.signUpUser : apiUrls.loginUser;
      const payload = authView === "signup"
        ? { name: authData.name, email: authData.email, password: authData.password }
        : { email: authData.email, password: authData.password };

      const res = await axiosInstance.post(url, payload);

      if (res.data.status || res.data.success) {
        if (authView === "signup") {
          toast.success("Account created successfully! Please login now.");
          setAuthView("login");
          setAuthData({ name: "", email: "", password: "", remember: false });
        } else {
          const token = res.data.token;
          login(token, authData.remember);         
          toast.success("Welcome back!");
          navigate("/home");
        }
      } else {
        setError(res.data.message || "Authentication failed");
        toast.error(res.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">You are successfully logged in.</p>
          <button 
            onClick={logout}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {authView === "signup" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {authView === "signup" 
              ? "Sign up to get started with our platform" 
              : "Sign in to your account to continue"
            }
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Social Login Buttons */}
          {/* <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors group">
              <Chrome className="w-5 h-5 text-gray-600  group-hover:text-gray-900" />
              <span className="font-medium text-gray-700">Continue with Google</span>
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white rounded-lg py-3 px-4 hover:bg-gray-800 transition-colors">
              <Github className="w-5 h-5" />
              <span className="font-medium">Continue with GitHub</span>
            </button>
          </div> */}

          {/* Divider */}
          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or continue with email</span>
            </div>
          </div> */}

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <div className="space-y-5">
            {authView === "signup" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={authData.name}
                    onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={authData.remember}
                  onChange={(e) => setAuthData({ ...authData, remember: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              {authView === "login" && (
                <button type="button" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                  Forgot password?
                </button>
              )}
            </div>

            <button
              onClick={handleAuthSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{authView === "signup" ? "Create Account" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Switch Auth View */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {authView === "signup"
                ? "Already have an account? "
                : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setAuthView(authView === "signup" ? "login" : "signup")}
                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
              >
                {authView === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <button className="text-indigo-600 hover:text-indigo-500">Terms of Service</button>
            {" "}and{" "}
            <button className="text-indigo-600 hover:text-indigo-500">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}