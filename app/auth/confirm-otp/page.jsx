"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Logo from "../../../components/Logo";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
export default function ConfirmOTP() {
  const [otp, setotp] = useState("");
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const [checkingUser, setCheckingUser] = useState(true);

  const router = useRouter();
  const { userId, userType } = useSelector((state) => state.resetPassword);
  console.log("🚀 ~ ConfirmOTP ~ userId:", userId);
  console.log("🚀 ~ ConfirmOTP ~ userType:", userType);

  // useEffect(() => {
  //   // Wait for Redux to hydrate
  //   if (user !== undefined) {
  //     if (user) {
  //       router.replace("/dashboard");
  //     } else {
  //       setCheckingUser(false); // Only show login if no user
  //     }
  //   }
  // }, [user, router]);

  const handleOTPCONFIRM = async () => {
    if (otp != "") {
      console.log("🚀 ~ handleOTPCONFIRM ~ otp:", otp);
      try {
        setloading(true);
        const payload = {
          email: userId,
          otp: otp,
        };
        console.log("🚀 ~ handleOTPCONFIRM ~ payload:", payload);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-verifyOtp-by-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const result = await response.json();
        if (result?.data?.user_id === "") {
          toast.error("Please enter valid otp.");
          setloading(false);
          setotp("");
        } else {
          toast.success(result.message);

          router.push("/auth/reset-password");
          setloading(false);
          setotp("");
        }
      } catch (error) {
        setloading(false);
        toast.error(error.message);
      }
    } else {
      toast.error("Please enter your otp!");
    }
  };

  // if (checkingUser) {
  //   // Show loader while checking user
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <ClipLoader color="#2563EB" size={40} />
  //     </div>
  //   );
  // }
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
            <Logo className={"w-56 h-full"} />
          </div>
          <div className="w-full max-w-md p-6 md:p-8 space-y-4 bg-white rounded-2xl border shadow-lg">
            <h2 className="sm:text-2xl font-bold text-center">Verification</h2>
            <p className="text-center">you will get an OTP via mail</p>
            <div className="flex   flex-col items-center justify-center space-y-4">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={(value) => setotp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className=" w-14 h-10  md:w-24 md:h-14 text-xl"
                  />
                  <InputOTPSlot
                    index={1}
                    className=" w-14 h-10  md:w-24 md:h-14 text-xl"
                  />
                  <InputOTPSlot
                    index={2}
                    className=" w-14 h-10  md:w-24 md:h-14 text-xl"
                  />
                  <InputOTPSlot
                    index={3}
                    className=" w-14 h-10  md:w-24 md:h-14 text-xl"
                  />
                </InputOTPGroup>
              </InputOTP>

              <Button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-800 cursor-pointer"
                onClick={handleOTPCONFIRM}
              >
                {loading && <ClipLoader color="white" size={20} />}
                {!loading && <span className="uppercase">confirmation</span>}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
