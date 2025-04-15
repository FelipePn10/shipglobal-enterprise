"use client";

import { useState, type ReactNode, useEffect, useMemo } from "react";
import MinimalNavbar from "@/components/navigation/minimal-navbar";
import {
  BarChart3,
  Calendar,
  FileText,
  HelpCircle,
  Home,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";

// Define the mock session type for development
interface MockSession {
  user: {
    id: string;
    name: string;
    email: string;
    type: "user" | "company";
    companyId?: string;
  };
}

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  badge?: number;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const notifications = 3; // Static since setNotifications is unused
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Memoize navigation at the top to ensure consistent hook calls
  const navigation = useMemo<NavigationGroup[]>(
    () => [
      {
        title: "Main",
        items: [
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: Home,
            isActive: pathname === "/dashboard",
          },
          {
            title: "Imports",
            href: "/dashboard/imports",
            icon: Package,
            isActive: pathname.startsWith("/dashboard/imports"),
          },
          {
            title: "Documents",
            href: "/dashboard/documents",
            icon: FileText,
            isActive: pathname === "/dashboard/documents",
          },
          {
            title: "Messages",
            href: "/dashboard/messages",
            icon: MessageSquare,
            isActive: pathname === "/dashboard/messages",
          },
        ],
      },
      {
        title: "Management",
        items: [
          {
            title: "Finances",
            href: "/dashboard/finances",
            icon: Wallet,
            isActive: pathname === "/dashboard/finances",
          },
          {
            title: "Compliance",
            href: "/dashboard/compliance",
            icon: ShieldCheck,
            isActive: pathname === "/dashboard/compliance",
          },
          {
            title: "Analytics",
            href: "/dashboard/analytics",
            icon: BarChart3,
            isActive: pathname === "/dashboard/analytics",
          },
          {
            title: "Calendar",
            href: "/dashboard/calendar",
            icon: Calendar,
            isActive: pathname === "/dashboard/calendar",
          },
        ],
      },
      {
        title: "Team",
        items: [
          {
            title: "Team Members",
            href: "/dashboard/team",
            icon: Users,
            isActive: pathname === "/dashboard/team",
          },
          {
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
            isActive: pathname === "/dashboard/notifications",
            badge: notifications > 0 ? notifications : undefined,
          },
        ],
      },
    ],
    [pathname, notifications],
  );

  // Force dark theme on mount
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  // Mock session for development
  const mockSession: MockSession = {
    user: {
      id: "1",
      name: "Dev User",
      email: "dev@example.com",
      type: "user",
    },
  };

  // Use mock session in development, real session in production
  const effectiveSession = process.env.NODE_ENV === "development" ? mockSession : session;
  const effectiveStatus = process.env.NODE_ENV === "development" ? "authenticated" : status;

  // Redirect to login in production if unauthenticated
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return; // Skip auth in dev
    if (effectiveStatus === "loading") return;
    if (effectiveStatus === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [effectiveStatus, router]);

  // Show loading state during session check
  if (effectiveStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  // Don’t render if unauthenticated in production
  if (effectiveStatus === "unauthenticated") {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <div className="flex min-h-screen flex-col bg-black text-gray-300">
        <MinimalNavbar
          logoText="Redirex"
          isLoggedIn={true}
          userName={effectiveSession?.user?.name || "John Smith"}
          notifications={notifications}
          className="pl-4"
        />
        <div className="flex flex-1 flex-col md:flex-row">
          <aside
            className={cn(
              "flex h-full flex-col border-r border-zinc-800/50 bg-gradient-to-b from-zinc-950 to-black transition-all duration-300 relative",
              sidebarCollapsed ? "w-16" : "w-64",
            )}
            aria-label="Dashboard sidebar"
          >
            <Button
              onClick={toggleSidebar}
              className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 z-10"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>

            <div className="flex-1 overflow-auto py-4 px-2">
              {navigation.map((group, groupIndex) => (
                <div
                  key={group.title}
                  className={cn("mb-6", groupIndex === 0 ? "mt-2" : "")}
                >
                  <div className="mb-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {!sidebarCollapsed && group.title}
                  </div>
                  <nav className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                          item.isActive
                            ? "bg-zinc-800/80 text-white"
                            : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200",
                        )}
                        aria-current={item.isActive ? "page" : undefined}
                      >
                        <div className="relative flex-shrink-0">
                          <item.icon
                            className={cn(
                              "h-5 w-5",
                              item.isActive
                                ? "text-white"
                                : "text-zinc-500 group-hover:text-zinc-300",
                            )}
                            aria-hidden="true"
                          />
                          {item.badge && (
                            <span
                              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                              aria-label={`${item.badge} notifications`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {!sidebarCollapsed && (
                          <span
                            className={cn(
                              item.isActive ? "font-medium" : "font-normal",
                            )}
                          >
                            {item.title}
                          </span>
                        )}
                        {item.isActive && !sidebarCollapsed && (
                          <div
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                            aria-hidden="true"
                          ></div>
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800/50 pt-3">
              <div className="px-2 py-2">
                <nav className="space-y-1">
                  <Link
                    href="/dashboard/settings"
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      pathname === "/dashboard/settings"
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200",
                    )}
                    aria-current={
                      pathname === "/dashboard/settings" ? "page" : undefined
                    }
                  >
                    <Settings
                      className={cn(
                        "h-5 w-5",
                        pathname === "/dashboard/settings"
                          ? "text-white"
                          : "text-zinc-500 group-hover:text-zinc-300",
                      )}
                      aria-hidden="true"
                    />
                    {!sidebarCollapsed && <span>Settings</span>}
                    {pathname === "/dashboard/settings" && !sidebarCollapsed && (
                      <div
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                        aria-hidden="true"
                      ></div>
                    )}
                  </Link>
                  <Link
                    href="/dashboard/help"
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      pathname === "/dashboard/help"
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200",
                    )}
                    aria-current={
                      pathname === "/dashboard/help" ? "page" : undefined
                    }
                  >
                    <HelpCircle
                      className={cn(
                        "h-5 w-5",
                        pathname === "/dashboard/help"
                          ? "text-white"
                          : "text-zinc-500 group-hover:text-zinc-300",
                      )}
                      aria-hidden="true"
                    />
                    {!sidebarCollapsed && <span>Help & Support</span>}
                    {pathname === "/dashboard/help" && !sidebarCollapsed && (
                      <div
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                        aria-hidden="true"
                      ></div>
                    )}
                  </Link>
                </nav>
              </div>

              <div className="p-4 mt-auto">
                {effectiveSession?.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full gap-2 px-3 text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-100 rounded-lg",
                          sidebarCollapsed
                            ? "justify-center"
                            : "justify-start",
                        )}
                        aria-label="User menu"
                      >
                        <Avatar className="h-8 w-8 border border-zinc-700/50 bg-gradient-to-br from-zinc-900 to-zinc-800">
                          <AvatarImage src="/placeholder.svg" alt="User" />
                          <AvatarFallback className="text-zinc-200 font-medium">
                            {effectiveSession.user.name ?? "Unknown User"
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {!sidebarCollapsed && (
                          <div className="flex flex-col items-start text-sm">
                            <span className="font-medium text-white">
                              {effectiveSession.user.name}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {effectiveSession.user.type}
                            </span>
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-zinc-900 text-zinc-200 border-zinc-800"
                    >
                      <DropdownMenuLabel className="text-zinc-300">
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <Link href="/dashboard/settings">
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard/help">
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          <span>Help & Support</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem
                        className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                        onClick={() => router.push("/auth/logout")}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <p className="text-center text-zinc-500 text-sm">
                    User data unavailable
                  </p>
                )}
              </div>
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-black">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}