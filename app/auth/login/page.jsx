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
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setloading] = useState(false);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [checkingUser, setCheckingUser] = useState(true);
  const [showPassword, setShowPassword] = useState(false);  

  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user !== undefined) {
      if (user) {
        router.replace("/dashboard");
      } else {
        setCheckingUser(false);  
      }
    }
  }, [user, router]);

  const handleLogin = async () => {
    if (email != "" && password != "") {
      try {
        setloading(true);
        const payload = {
          email: email,
          password: password,
          fcm_token: "",
          type: "id__pwd",
          device_type: "webapp",
        };
        console.log("🚀 ~ handleLogin ~ payload:", payload);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-user-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const result = await response.json();
        console.log("🚀 ~ handleLogin ~ result:", result);

        if (result.status === 0) {
          toast.error(result.message);
          setloading(false);
          setEmail("");
          setPassword("");
        } else {
          dispatch(login(result.user_data));
          toast.success(result.message);
          setEmail("");
          setPassword("");
          router.push("/dashboard");
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        toast.error(error.message);
      }
    } else {
      toast.error("Please enter fields !");
    }
  };

  if (checkingUser) {
     return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#2563EB" size={40} />
      </div>
    );
  }
  return (
    <>
      <title>Concise-5 | Login</title>
      <meta name="description" content="Here is the concise-5 description." />

      <section className="flex flex-col md:flex-row min-h-screen">
        
        <div className="w-full hidden md:w-1/2 bg-gray-100 md:flex items-center justify-center p-8">
          <Logo />
        </div>

        
        <div className="w-full md:w-1/2 flex flex-col items-center min-h-screen  justify-center p-6">
          <div className="md:hidden ">
            <Logo className={"w-56 h-full"} />
          </div>
          <div className="w-full max-w-md p-6 md:p-8 space-y-8 bg-white rounded-2xl border shadow-lg">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  // className={' focus-visible:ring-blue-500 focus-visible:ring-2'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}  
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="pr-10" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute cursor-pointer inset-y-0 right-0 flex items-center px-3 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye size={18} /> :<EyeOff size={18} /> }
                  </button>
                </div>
                <Link
                  className="flex items-end justify-end font-semibold capitalize text-blue-600"
                  href={"/auth/forgot-password"}
                >
                  forgot password?
                </Link>
              </div>

              <Button
                disabled={loading}
                className="w-full  bg-blue-600 hover:bg-blue-700 cursor-pointer"
                onClick={handleLogin}
              >
                {loading && <ClipLoader color="white" size={20} />}
                {!loading && <span>Login</span>}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
