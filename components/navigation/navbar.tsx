"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type NavItem = {
  title: string
  href: string
  description?: string
  disabled?: boolean
  external?: boolean
  icon?: React.ReactNode
  children?: NavItem[]
}

interface NavbarProps {
  logo?: React.ReactNode
  logoText?: string
  logoHref?: string
  items?: NavItem[]
  showAuth?: boolean
  isLoggedIn?: boolean
  userName?: string
  onLogin?: () => void
  onLogout?: () => void
  onSignup?: () => void
  className?: string
}

export default function Navbar({
  logo,
  logoText = "Redirex",
  logoHref = "/",
  items = defaultNavItems,
  showAuth = true,
  isLoggedIn = false,
  userName,
  onLogin,
  onLogout,
  onSignup,
  className,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-black/30 backdrop-blur-md border-b border-white/10"
          : "bg-transparent",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={logoHref} className="flex items-center gap-2 text-white opacity-90 hover:opacity-100 transition-opacity">
            {logo}
            {logoText && <span className="text-lg font-light tracking-wide">{logoText}</span>}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {items.map((item, index) => {
              // Handle items with children (dropdowns)
              if (item.children) {
                return (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center text-sm font-light transition-colors",
                          pathname === item.href
                            ? "text-white"
                            : "text-gray-300 hover:text-white",
                        )}
                      >
                        {item.title}
                        <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-md min-w-[140px]">
                      {item.children.map((child, childIndex) => (
                        <DropdownMenuItem key={childIndex} asChild className="focus:bg-white/10">
                          <Link
                            href={child.href}
                            className={cn(
                              "w-full text-sm py-1.5",
                              pathname === child.href ? "text-white" : "text-gray-300"
                            )}
                          >
                            {child.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              // Regular nav items
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "text-sm font-light transition-colors",
                    pathname === item.href
                      ? "text-white"
                      : "text-gray-300 hover:text-white",
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* Auth Section */}
          {showAuth && (
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-sm text-white/90 hover:text-white transition-colors">
                      <User className="h-4 w-4 mr-1.5 opacity-70" />
                      {userName || "Account"}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-md min-w-[140px]">
                    <DropdownMenuItem asChild className="focus:bg-white/10">
                      <Link href="/dashboard" className="text-sm py-1.5 text-gray-300 hover:text-white">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-white/10">
                      <Link href="/profile" className="text-sm py-1.5 text-gray-300 hover:text-white">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-white/10">
                      <Link href="/settings" className="text-sm py-1.5 text-gray-300 hover:text-white">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout} className="text-sm py-1.5 text-gray-300 hover:text-white focus:bg-white/10">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onLogin}
                    className="text-sm text-gray-300 hover:text-white hover:bg-transparent"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onSignup}
                    className="text-sm text-white border-white/20 hover:bg-white/10 hover:border-white/30"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="p-1 text-white/80 hover:text-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {items.map((item, index) => {
              // Handle items with children
              if (item.children) {
                return (
                  <div key={index} className="py-1">
                    <div className="px-2 py-1.5 text-sm font-medium text-white/80">{item.title}</div>
                    <div className="pl-3 space-y-0.5">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href}
                          className={cn(
                            "block px-2 py-1.5 text-sm transition-colors",
                            pathname === child.href
                              ? "text-white"
                              : "text-gray-400 hover:text-white",
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }

              // Regular nav items
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "block px-2 py-1.5 text-sm transition-colors",
                    pathname === item.href
                      ? "text-white"
                      : "text-gray-400 hover:text-white",
                  )}
                >
                  {item.title}
                </Link>
              )
            })}

            {/* Mobile Auth Section */}
            {showAuth && (
              <div className="pt-2 mt-2 border-t border-white/10">
                {isLoggedIn ? (
                  <div className="space-y-0.5">
                    <div className="px-2 py-1.5 text-sm font-medium text-white/80">
                      {userName || "Account"}
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-2 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-2 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-2 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-2 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 px-2 py-2">
                    <Button 
                      variant="ghost" 
                      onClick={onLogin} 
                      className="justify-start px-0 text-sm text-gray-300 hover:text-white hover:bg-transparent"
                    >
                      Login
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={onSignup} 
                      className="text-sm text-white bg-black border-white/20 transition-colors duration-300 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-pink-700"
                    >
                      Sign up
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

// Default navigation items
const defaultNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Services",
    href: "#",
    children: [
      {
        title: "Personal Shopping",
        href: "/services/personal-shopping",
      },
      {
        title: "Business Importing",
        href: "/services/business-importing",
      },
      {
        title: "Specialty Items",
        href: "/services/specialty-items",
      },
      {
        title: "Concierge Service",
        href: "/services/concierge-service",
      },
      {
        title: "Customs Clearance",
        href: "/services/customs-clearance",
      },
    ],
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "How It Works",
    href: "/how-it-works",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "FAQ",
    href: "/faq",
  },
  {
    title: "Contact",
    href: "/contact",
  },
]