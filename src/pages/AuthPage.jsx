import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiUrls from "../utils/apiUrls";
import Lottie from "lottie-react";
import socialMediaAnimationData from "@/assets/socialmedia.json";
import ResetPasswordDialog from "../components/ui/customComponents/passwordresetEmail";

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get("view");
  const [authView, setAuthView] = useState(initialView || "login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

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
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center max-w-md w-full">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome Back!</h2>
          <p className="text-gray-600 mb-4 text-sm">You are successfully logged in.</p>
          <button
            onClick={logout}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-background flex items-center justify-center px-4 pt-0 pb-2">
      <ResetPasswordDialog isOpen={showResetModal} onClose={() => setShowResetModal(false)} />
      <Card className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl shadow-xl rounded-2xl overflow-hidden">
        {/* Left - Form */}
        <CardContent className="p-6 md:p-8 space-y-5">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {authView === "signup" ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-600 text-sm">
              {authView === "signup"
                ? "Sign up to get started"
                : "Sign in to your account"}
            </p>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50 text-sm">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authView === "signup" && (
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={authData.name}
                    onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm "
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  className="w-full pl-9 pr-10 py-2 rounded-lg border border-gray-200 text-sm "
                />
                <d
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 "
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </d>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                {/* <input
                  type="checkbox"
                  checked={authData.remember}
                  onChange={(e) => setAuthData({ ...authData, remember: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                /> */}
                {/* <span className="text-gray-600">Remember me</span> */}
              </label>
              {authView === "login" && (
                <button type="button" className="text-indigo-600 hover:underline" onClick={() => setShowResetModal(true)}>Forgot password?</button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 !bg-[#8e51ff] hover:!bg-[#8e51ff] text-white text-sm rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {authView === "signup" ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              {authView === "signup" ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setAuthView(authView === "signup" ? "login" : "signup")}
                className="ml-1 text-indigo-600 hover:underline"
              >
                {authView === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
          </form>
        </CardContent>

        {/* Right - Animation */}
        <div className="hidden md:flex items-center justify-center bg-white/50 p-4">
          <Lottie animationData={socialMediaAnimationData} className="max-w-[300px] w-full" loop autoplay />
        </div>
      </Card>
    </div>
  );
}
