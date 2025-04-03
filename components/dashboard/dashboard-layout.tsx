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
  ChevronLeft,
  ChevronRight,
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
          badge: notifications > 0 ? notifications : undefined,
        },
      ],
    },
  ]

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <div className="flex min-h-screen flex-col bg-black text-gray-300">
        <MinimalNavbar logoText="Ship Global" isLoggedIn={true} userName="John Smith" notifications={notifications} className="pl-4" />
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Sidebar */}
          <div
            className={cn(
              "flex h-full flex-col border-r border-zinc-800/50 bg-gradient-to-b from-zinc-950 to-black transition-all duration-300 relative",
              sidebarCollapsed ? "w-16" : "w-64",
            )}
          >
            {/* Toggle button */}
            <button 
              onClick={toggleSidebar}
              className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white focus:outline-none z-10"
            >
              {sidebarCollapsed ? 
                <ChevronRight className="h-4 w-4" /> : 
                <ChevronLeft className="h-4 w-4" />
              }
            </button>

            <div className="flex-1 overflow-auto py-4 px-2">
              {navigation.map((group, groupIndex) => (
                <div key={group.title} className={cn("mb-6", groupIndex === 0 ? "mt-2" : "")}>
                  <div className="mb-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {!sidebarCollapsed && group.title}
                  </div>
                  <div className="space-y-1">
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
                      >
                        <div className="relative flex-shrink-0">
                          <item.icon className={cn(
                            "h-5 w-5",
                            item.isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                          )} />
                          
                          {/* Notification badge */}
                          {item.badge && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        
                        {!sidebarCollapsed && (
                          <span className={cn(
                            item.isActive ? "font-medium" : "font-normal"
                          )}>
                            {item.title}
                          </span>
                        )}
                        
                        {/* Active indicator */}
                        {item.isActive && !sidebarCollapsed && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-zinc-800/50 pt-3">
              <div className="px-2 py-2">
                <div className="space-y-1">
                  <Link
                    href="/dashboard/settings"
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      pathname === "/dashboard/settings"
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200",
                    )}
                  >
                    <Settings className={cn(
                      "h-5 w-5",
                      pathname === "/dashboard/settings" ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    )} />
                    {!sidebarCollapsed && <span>Settings</span>}
                    
                    {/* Active indicator */}
                    {pathname === "/dashboard/settings" && !sidebarCollapsed && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white"></div>
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
                  >
                    <HelpCircle className={cn(
                      "h-5 w-5",
                      pathname === "/dashboard/help" ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    )} />
                    {!sidebarCollapsed && <span>Help & Support</span>}
                    
                    {/* Active indicator */}
                    {pathname === "/dashboard/help" && !sidebarCollapsed && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white"></div>
                    )}
                  </Link>
                </div>
              </div>
              
              <div className="p-4 mt-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full gap-2 px-3 text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-100 rounded-lg",
                        sidebarCollapsed ? "justify-center" : "justify-start"
                      )}
                    >
                      <Avatar className="h-8 w-8 border border-zinc-700/50 bg-gradient-to-br from-zinc-900 to-zinc-800">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback className="text-zinc-200 font-medium">JD</AvatarFallback>
                      </Avatar>
                      {!sidebarCollapsed && (
                        <div className="flex flex-col items-start text-sm">
                          <span className="font-medium text-white">John Doe</span>
                          <span className="text-xs text-zinc-500">Admin</span>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-zinc-900 text-zinc-200 border-zinc-800">
                    <DropdownMenuLabel className="text-zinc-300">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-black">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}