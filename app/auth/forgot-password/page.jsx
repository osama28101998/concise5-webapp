"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "../../../lib/redux/slices/authSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import Logo from "../../../components/Logo";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { setResetPasswordData } from "@/lib/redux/slices/resetPasswordSlice";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const [checkingUser, setCheckingUser] = useState(true);

  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Wait for Redux to hydrate
    if (user !== undefined) {
      if (user) {
        router.replace("/dashboard");
      } else {
        setCheckingUser(false); // Only show login if no user
      }
    }
  }, [user, router]);

  const handleForgotPassword = async () => {
    if (email != "") {
      try {
        setloading(true);
        const payload = {
          usermail: email,
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-forget-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const result = await response.json();
        console.log("🚀 ~ handleForgotPassword ~ result:", result);
        if (result.status === 0) {
          toast.error(result.message);
          setloading(false);
          setEmail("");
        } else {
          toast.success(result.message);
          dispatch(
            setResetPasswordData({
              userId: result?.data?.user_id,
              userType: result?.user_type,
            })
          );
          router.push("/auth/confirm-otp");
          setloading(false);
          setEmail("");
        }
      } catch (error) {
        setloading(false);
        toast.error(error.message);
      }
    } else {
      toast.error("Please enter your email!");
    }
  };

  if (checkingUser) {
    // Show loader while checking user
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#2563EB" size={40} />
      </div>
    );
  }
  return (
    <>
      <title>Concise-5 | Forgot Password</title>
      <meta name="description" content="Here is the concise-5 description." />

      <section className="flex flex-col md:flex-row min-h-screen">
        
        <div className="w-full hidden md:w-1/2 bg-gray-100 md:flex items-center justify-center p-8">
                 <Logo />
               </div>

        
   <div className="w-full md:w-1/2 flex flex-col items-center min-h-screen  justify-center p-6">
           <div className="md:hidden ">
          <Logo className={'w-56 h-full'} />
        </div>
          <div className="w-full max-w-md p-6 md:p-8 space-y-4 bg-white rounded-2xl border shadow-lg">
            <h2 className="sm:text-2xl font-bold text-center">
              Enter your registered email to reset your password
            </h2>
            <p className="text-center">
              {
                "(We will send one time password on your registered email to confirm)"
              }
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Please Enter Your Email"
                />
              </div>

              <Button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-800 cursor-pointer"
                onClick={handleForgotPassword}
              >
                {loading && <ClipLoader color="white" size={20} />}
                {!loading && <span className="uppercase">send email</span>}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
