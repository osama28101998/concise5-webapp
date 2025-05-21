// components/AuthGuard.tsx
"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Use layout effect to run before first paint
  useLayoutEffect(() => {
    // If user state is already populated (from Redux persist or similar)
    if (user !== undefined) {
      setInitialCheckDone(true);
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login");
      }
    } else {
      // If using Redux persist, you might need to wait for rehydration
      const timer = setTimeout(() => {
        setInitialCheckDone(true);
        router.replace("/auth/login");
      }, 100); // Small delay to allow for Redux rehydration

      return () => clearTimeout(timer);
    }
  }, [user, router]);

  if (!initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={40} color="#2563EB" />
      </div>
    );
  }

  return <>{children}</>;
}