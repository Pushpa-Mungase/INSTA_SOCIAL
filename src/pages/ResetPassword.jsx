import {  useState } from "react";
import {  useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import apiUrls from "@/utils/apiUrls";
import { toast } from "react-toastify";


export function ResetPasswordForm() {
  const { token: tokenFromUrl } = useParams();
   const navigate = useNavigate();
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!tokenFromUrl || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    try {
      await axiosInstance.post(apiUrls.resetPassword, {
        token: tokenFromUrl,
        password,
      });
      toast.success("Password updated successfully!");
      setpassword("");
      setConfirmPassword("");
       // Redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to reset password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex  justify-center p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl overflow-hidden border-0 p-0">
        <div className="bg-[#8e51ff] px-6 py-2 text-white">
          <CardHeader className="space-y-1 p-0">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          </CardHeader>
        </div>
        <form onSubmit={handleResetPassword}>
          <CardContent className="px-4 pb-4 space-y-2">
            <div className="space-y-3 py-0">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  name="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="focus-visible:ring-2 focus-visible:ring-blue-500 pr-10"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 !bg-white !focus:outline-none !focus:ring-0 !p-0"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Must be at least 8 characters with a number and special character
              </p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="focus-visible:ring-2 focus-visible:ring-blue-500 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 !bg-white !focus:outline-none !focus:ring-0 !p-0 "
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {/* Token input removed */}
          </CardContent>
          <CardFooter className="flex flex-col p-6 pt-2 space-y-3 m-0">
            <Button
              className="w-full !bg-[#8e51ff] hover:bg-indigo-700 transition-colors"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}