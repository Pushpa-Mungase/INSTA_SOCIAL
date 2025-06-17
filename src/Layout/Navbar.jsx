import { useState } from "react";
import {
  X,
  User,
  LogIn,
  UserPlus,
  Sparkles,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// shadcn components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../components/ui/button";

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isAuthenticated } = useAuth();

  // const openModal = (type) => {
  //   setAuthType(type);
  //   setIsAuthModalOpen(true);
  // };

  const closeModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
     {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-[#8e51ff] group-hover:text-purple-900 transition-colors duration-300" />
                <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full group-hover:bg-purple-300/30 transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold text-[#8e51ff]">
                INSTA-SOCIAL
              </span>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Settings Button */}
                  <Settings
                    className="w-5 h-5 text-gray-600 hover:text-indigo-600 cursor-pointer transition"
                    onClick={() => navigate("/setting")}
                  />

                  {/* Avatar Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="!focus:outline-none !focus:ring-0 !p-0">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => {
                          logout();
                          navigate("/login", { state: { view: "login" } });
                        }}
                        className="text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="!bg-[#8e51ff] hover:!bg-[#8e51ff]/90 !text-background"
                    onClick={() => navigate("/login", { state: { view: "login" } })}
                  >
                    Login
                  </Button>
                  {/* <Button onClick={() => navigate("/register")}>Register</Button> */}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10"></div>

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                    <User className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {authType === "login" ? "Welcome Back" : "Join Us"}
                  </h2>
                </div>
                <p className="text-gray-300">
                  {authType === "login"
                    ? "Sign in to your account to continue"
                    : "Create an account to get started"}
                </p>
              </div>

              {/* Form */}
              <div className="relative z-10 space-y-4">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                />
                {authType === "signup" && (
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                  />
                )}

                <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 transform">
                  {authType === "login" ? "Sign In" : "Create Account"}
                </button>

                <div className="text-center">
                  <button
                    onClick={() =>
                      setAuthType(authType === "login" ? "signup" : "login")
                    }
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {authType === "login"
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
