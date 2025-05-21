"use client";
import { Bell, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { logout } from "@/lib/redux/slices/authSlice";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import useSWR from "swr";
import postFetcher from "@/lib/postfetcher";
import { formatDate } from "@/lib/utils";

export function AppHeader() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const payload = {
    user_type: user?.user_type,
    notification_for: user?.user_id,
    pageSize: 15,
  };

  const { data, error, isLoading, mutate } = useSWR(
    user
      ? [
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/get-notifications`,
        payload,
          user.Token
          
        ]
      : null,
    postFetcher
  );

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/update-notifications`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_type: user?.user_type,
            notification_for: user?.user_id,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "All notifications marked as read");

        // Update the cache
        if (data && data.data) {
          mutate(
            {
              ...data,
              data: data.data.map((notification) => ({
                ...notification,
                seen: 1,
              })),
              unseen: 0,
            },
            false
          );
        }
      } else {
        toast.error("Failed to mark notifications as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Error marking notifications as read");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully logged out");
    setTimeout(() => {
      router.replace("/auth/login");
    }, 2000);
  };

  const handleNotificationRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/update-single-notifications`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notification_id: notificationId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);

        // Update the notification in the cache
        mutate(
          {
            ...data,
            data: data.data.map((notification) =>
              notification.id === notificationId
                ? { ...notification, seen: 1 }
                : notification
            ),
            unseen: data.unseen > 0 ? data.unseen - 1 : 0,
          },
          false
        );
      } else {
        toast.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error marking notification as read");
    }
  };

  return (
    <header className="flex sticky z-10 top-0 bg-white shadow-md h-16 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        {/* <h1 className="text-lg font-semibold">Dashboard</h1> */}
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {data?.unseen > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {data.unseen}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>

              {data?.unseen > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {data?.data?.length > 0 ? (
              data.data.map((notification) => (
                <DropdownMenuItem
                  title={notification.description}
                  onClick={() => handleNotificationRead(notification.id)}
                  key={notification.id}
                  className="cursor-default p-0"
                >
                  <div className="flex w-full gap-2 p-3">
                    {notification.seen === 0 && (
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                    <div
                      className={`flex flex-col ${
                        notification.seen === 0 ? "" : "pl-4"
                      }`}
                    >
                      <div className="flex w-full justify-between">
                        <span className="font-medium">
                          {notification.title}
                        </span>
                        <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border-[3px]">
              {/* <AvatarImage
                src={
                  user?.profile_image != ""
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}/${user.profile_image}`
                    : "/assets/images/concise5logo.webp"
                }
                alt="User"
              /> */}
              <AvatarImage
                src={
                  user && user.profile_image && user.profile_image !== ""
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}/${user.profile_image}`
                    : "/assets/images/concise5logo.webp"
                }
                alt="User"
              />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={"/profile"}>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
