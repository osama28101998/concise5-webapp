"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "../lib/redux/slices/authSlice";
import Link from "next/link";
import {
  Home,
  Shield,
  Users,
  BarChart,
  Settings,
  LogOut,
  List,
  UsersRound,
  FileCheck2,
  InfoIcon,
  MessageCircleQuestion,
  Library,
  ListMusicIcon,
} from "lucide-react";
import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function AppSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  const handleNavigation = (path) => {
    if (isMobile) {
      setOpenMobile(false);
    }
    router.push(path);
  };

  const sharedNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    {
      name: "Personal Library",
      path: "/personal-library",
      icon: Library,
    },
    { name: "Socreboard", path: "/scoreboard", icon: FileCheck2 },
    { name: "Playlist", path: "/playlist", icon: ListMusicIcon },
    {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
    { name: "About Us", path: "/about", icon: InfoIcon },
    { name: "Privacy Policy", path: "/privacy-policy", icon: Shield },
    {
      name: "Introduction Video",
      path: "/intro-video",
      icon: MessageCircleQuestion,
    },
  ];

  const roleNavItems =
    user?.user_type === "manager"
      ? [
          {
            name: "Your Team Activity",
            path: "/team-activity",
            icon: UsersRound,
          },
        ]
      : [];

  const navItems = [...sharedNavItems, ...roleNavItems];
//   const navItems = [...sharedNavItems, ...roleNavItems].sort((a, b) =>
//   a.name.localeCompare(b.name)
// );


  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => {
                if (isMobile) setOpenMobile(false);
                router.push("/dashboard");
              }}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <Image
                  className="border rounded-full"
                  src={"/assets/images/concise5logo.webp"}
                  width={400}
                  height={400}
                  alt="logo"
                />
              </div>
              <div className="flex flex-col gap-1 leading-none">
                <span className="font-semibold">App</span>
                <span className="capitalize">{user?.user_type || "User"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className={"space-y-3 mt-10 px-2"}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
            <SidebarMenuItem >
              <SidebarMenuButton
                className={"rounded-md hover:bg-gray-200 cursor-pointer"}
                isActive={pathname === item.path}
                tooltip={item.name}
                // onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                if (isMobile) setOpenMobile(false);
                handleLogout();
              }}
              tooltip="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
