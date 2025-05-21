"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      if (user) {
        redirect("/dashboard");
      } else {
        redirect("/auth/login");
      }
    }
  }, [user, router]);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={40} color="#2563EB" />
      </div>
    );
  }

  // Optional: return null while routing (can also show loader here)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ClipLoader size={40} color="#2563EB" />
    </div>
  );
}
