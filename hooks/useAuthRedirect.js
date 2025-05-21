// hooks/useAuthRedirect.ts
"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function useAuthRedirect() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [isChecking, setIsChecking] = useState(true);

  useLayoutEffect(() => {
    if (user === null) {
      router.replace("/auth/login");
      return;
    }

    if (user) {
      router.replace("/dashboard");
      return;
    }

    // If user is undefined (Redux not initialized), wait briefly
    const timer = setTimeout(() => {
      setIsChecking(false);
      router.replace("/auth/login");
    }, 50);

    return () => clearTimeout(timer);
  }, [user, router]);

  return isChecking;
}
