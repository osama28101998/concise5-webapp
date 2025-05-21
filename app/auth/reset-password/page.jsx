"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Logo from "../../../components/Logo";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";
import { clearResetPasswordData } from "@/lib/redux/slices/resetPasswordSlice";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [checkingUser, setCheckingUser] = useState(true);

  const router = useRouter();
  const { userId, userType } = useSelector((state) => state.resetPassword);
  console.log("🚀 ~ ResetPassword ~ userId:", userId);
  console.log("🚀 ~ ResetPassword ~ userType:", userType);

  const handlePasswordReset = async () => {
    if (newPassword === "" || confirmationPassword === "") {
      toast.error("Please fill in both password fields!");
      return;
    }
    if (newPassword !== confirmationPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        id: userId,
        password: newPassword,
        user_type: userType,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (result?.status === 0) {
        toast.error("Password reset failed. Please try again.");
        setLoading(false);
      } else {
        toast.success(result.message);
        setLoading(false);
        setNewPassword("");
        setConfirmPassword("");
        dispatch(clearResetPasswordData());
        router.replace("/auth/login");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <title>Concise-5 | Forgot Password</title>
      <meta name="description" content="Here is the concise-5 description." />

      <section className="flex flex-col md:flex-row min-h-screen">
        {/* Logo Section */}
   <div className="w-full hidden md:w-1/2 bg-gray-100 md:flex items-center justify-center p-8">
               <Logo />
             </div>
        {/* Login Section */}
         <div className="w-full md:w-1/2 flex flex-col items-center min-h-screen  justify-center p-6">
               <div className="md:hidden ">
              <Logo className={'w-56 h-full'} />
            </div>
          <div className="w-full max-w-md p-6 md:p-8 space-y-4 bg-white rounded-2xl border shadow-lg">
            <h2 className="sm:text-2xl font-bold text-center">
              Reset Password
            </h2>
            <p className="text-center">Enter your new password</p>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>

              <div className="w-full relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmationPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                  <Eye className="h-5 w-5 text-gray-500 " />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500 " />
                  )}
                </button>
              </div>

              <Button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-800 cursor-pointer"
                onClick={handlePasswordReset}
              >
                {loading && <ClipLoader color="white" size={20} />}
                {!loading && <span className="uppercase">Reset Password</span>}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
