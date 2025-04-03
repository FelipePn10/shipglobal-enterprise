"use client"

import { useState, type ReactNode, useEffect } from "react"
import MinimalNavbar from "@/components/navigation/minimal-navbar"
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
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "next-themes" 

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export default function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const pathname = usePathname()
  const { setTheme } = useTheme()
  
  // Forçar o tema dark quando o componente montar
  useEffect(() => {
    setTheme("dark")
  }, [setTheme])

  const navigation = [
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
        },
      ],
    },
  ]

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <div className="flex min-h-screen flex-col bg-gray-950 text-gray-200">
        <MinimalNavbar logoText="Ship Global" isLoggedIn={true} userName="John Smith" notifications={notifications} />
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Sidebar */}
          <div
            className={cn(
              "flex h-full flex-col border-r border-gray-800 bg-gray-900 transition-all",
              sidebarCollapsed ? "w-16" : "w-64",
            )}
          >
            <div className="flex-1 overflow-auto py-2">
              {navigation.map((group) => (
                <div key={group.title} className="px-2 py-2">
                  <div className="px-2 py-1 text-xs font-medium text-gray-500">
                    {!sidebarCollapsed && group.title}
                  </div>
                  <div className="space-y-1">
                    <div>
                      {group.items.map((item) => (
                        <div key={item.title}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                              pathname === item.href
                                ? "bg-blue-900/50 text-blue-400 font-medium"
                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            {!sidebarCollapsed && <span>{item.title}</span>}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800">
              <div className="px-2 py-2">
                <div className="space-y-1">
                  <div>
                    <Link
                      href="/dashboard/settings"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                        pathname === "/dashboard/settings"
                          ? "bg-blue-900/50 text-blue-400 font-medium"
                          : "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
                      )}
                    >
                      <Settings className="h-5 w-5" />
                      {!sidebarCollapsed && <span>Settings</span>}
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/dashboard/help"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                        pathname === "/dashboard/help"
                          ? "bg-blue-900/50 text-blue-400 font-medium"
                          : "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
                      )}
                    >
                      <HelpCircle className="h-5 w-5" />
                      {!sidebarCollapsed && <span>Help & Support</span>}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-gray-300 hover:bg-gray-800 hover:text-gray-100">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback className="bg-gray-800 text-gray-200">JD</AvatarFallback>
                      </Avatar>
                      {!sidebarCollapsed && (
                        <div className="flex flex-col items-start text-sm">
                          <span className="font-medium">John Doe</span>
                          <span className="text-xs text-gray-500">Admin</span>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-gray-900 text-gray-200 border-gray-800">
                    <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-950">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}