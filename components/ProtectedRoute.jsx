// 'use client';

// import { useSelector } from 'react-redux';
// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function ProtectedRoute({ children }) {
//   const user = useSelector((state) => state.auth.user);
//   const pathname = usePathname();
//   const router = useRouter();

//   useEffect(() => {
//     // Protect routes: redirect to /auth/login if no user and trying to access protected route
//     const protectedRoutes = ['/dashboard'];
//     if (!user && protectedRoutes.includes(pathname)) {
//       router.push('/auth/login');
//     }
//   }, [user, pathname, router]);

//   return children;
// }

"use client";

import { useSelector } from "react-redux";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const protectedRoutes = [
      "/dashboard",
      "/profile",
      "/tasks",
      "/users",
      "/reports",
      "/settings",
      "/personal-library",
      "/team-activity",
      "/settings"
    ];
    const enterpriseOnlyRoutes = ["/tasks"];
    const managerOnlyRoutes = ["/users", "/reports",];

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isEnterpriseOnly = enterpriseOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isManagerOnly = managerOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

     if (!user && isProtected) {
      console.log('object')
      redirect("/auth/login"); 
    } else if (user && isEnterpriseOnly && user.role !== "enterprise") {
      redirect("/dashboard");
    } else if (user && isManagerOnly && user.role !== "manager") {
      redirect("/dashboard");
    } else {
      setIsLoading(false);  
    }
  }, [user, pathname, router]);

  return children;
}
