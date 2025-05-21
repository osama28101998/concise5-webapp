"use client";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { AppHeader } from "@/components/app-header";
import { useSelector } from "react-redux";

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/auth/login";
  const isForgotPassword = pathname === "/auth/forgot-password";
  const isOTPCONFIRM = pathname === "/auth/confirm-otp";
  const isRESETPASSWORD = pathname === "/auth/reset-password";
  const user = useSelector((state) => state.auth.user);

  const hideLayout = pathname === "/" && (user === undefined || user === null);

  if (hideLayout) {
    return children;
  }

  if (
    isLoginPage ||
    isForgotPassword ||
    isOTPCONFIRM ||
    isRESETPASSWORD
  ) {
    return children;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
