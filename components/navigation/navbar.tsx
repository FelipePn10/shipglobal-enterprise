"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type NavItem = {
  title: string
  href: string
  description?: string
  disabled?: boolean
  external?: boolean
  children?: NavItem[]
  badge?: string
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
  variant?: 'default' | 'floating' | 'minimal'
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
  variant = 'default',
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  // Funções para event listeners
  const handleScroll = () => {
    const scrollY = window.scrollY
    setScrolled(scrollY > 20)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (nav) {
      nav.addEventListener("mousemove", handleMouseMove)
      nav.addEventListener("mouseenter", handleMouseEnter)
      nav.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        nav.removeEventListener("mousemove", handleMouseMove)
        nav.removeEventListener("mouseenter", handleMouseEnter)
        nav.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const getNavbarStyles = () => {
    const baseStyles = "fixed top-0 w-full z-50 transition-all duration-500 ease-out"
    
    if (variant === 'floating') {
      return cn(
        baseStyles,
        "px-4 pt-4",
        className,
      )
    }
    
    if (variant === 'minimal') {
      return cn(
        baseStyles,
        scrolled ? "bg-black/50 backdrop-blur-md border-b border-gray-800" : "bg-transparent",
        className,
      )
    }

    return cn(
      baseStyles,
      scrolled
        ? "bg-black/70 backdrop-blur-lg border-b border-gray-800 shadow-xl shadow-black/20"
        : "bg-transparent",
      className,
    )
  }

  const getContainerStyles = () => {
    if (variant === 'floating') {
      return cn(
        "relative rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-xl shadow-2xl shadow-black/30",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-gray-700/10 before:via-transparent before:to-gray-700/10 before:opacity-0 before:transition-opacity before:duration-500",
        isHovered && "before:opacity-100",
        "overflow-hidden"
      )
    }
    
    return "relative"
  }

  const LogoComponent = () => (
    <Link 
      href={logoHref} 
      className="group flex items-center gap-3 text-white transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative">
        {logo || (
          <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center shadow-md shadow-black/20">
            <div className="h-4 w-4 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 rounded-lg bg-gray-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>
      {logoText && (
        <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight">
          {logoText}
        </span>
      )}
    </Link>
  )

  const NavItemComponent = ({ item, index }: { item: NavItem; index: number }) => {
    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0

    if (hasChildren) {
      return (
        <DropdownMenu key={index}>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => {
                if (item.href === "#") {
                  e.preventDefault()
                }
              }}
              className={cn(
                "group flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                "hover:bg-gray-800 hover:text-white",
                isActive ? "text-white bg-gray-800" : "text-gray-300",
                "relative overflow-hidden"
              )}
            >
              <span className="relative z-10">
                {item.title}
              </span>
              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-sky-400 text-white rounded-full">
                  {item.badge}
                </span>
              )}
              <div className="absolute inset-0 bg-gray-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="center" 
            className="w-64 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl shadow-black/30 overflow-hidden"
          >
            <div className="p-2">
              {item.children?.map((child, childIndex) => (
                <DropdownMenuItem key={childIndex} asChild className="focus:bg-gray-800 rounded-lg">
                  <Link
                    href={child.href}
                    className={cn(
                      "w-full px-3 py-2.5 text-sm transition-all duration-300",
                      "hover:bg-gray-800",
                      pathname === child.href ? "text-white" : "text-gray-300 hover:text-white"
                    )}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{child.title}</div>
                      {child.description && (
                        <div className="text-xs text-gray-500 mt-0.5">{child.description}</div>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Link
        key={index}
        href={item.href}
        className={cn(
          "group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
          "hover:bg-gray-800 hover:text-white",
          isActive ? "text-white bg-gray-800" : "text-gray-300",
          "overflow-hidden"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="relative z-10">
          {item.title}
          {item.badge && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-sky-400 text-white rounded-full">
              {item.badge}
            </span>
          )}
        </span>
        <div className="absolute inset-0 bg-gray-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isActive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-sky-400 rounded-full" />
        )}
      </Link>
    )
  }

  const AuthSection = () => {
    if (!showAuth) return null

    return (
      <div className="hidden md:flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
              <div className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800 relative">
              <div className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-800">
                  <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
                    <div className="h-4 w-4 text-gray-300" />
                  </div>
                  <span className="font-medium">{userName || "Account"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl shadow-black/30"
              >
                <div className="p-2 space-y-1">
                  <DropdownMenuItem asChild className="focus:bg-gray-800 rounded-lg">
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-gray-800 rounded-lg">
                    <Link href="/profile" className="px-3 py-2 text-sm text-gray-300 hover:text-white">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-gray-800 rounded-lg">
                    <Link href="/settings" className="px-3 py-2 text-sm text-gray-300 hover:text-white">Settings</Link>
                  </DropdownMenuItem>
                  <div className="h-px bg-gray-700 my-2"></div>
                  <DropdownMenuItem 
                    onClick={onLogout} 
                    className="px-3 py-2 text-sm text-red-500 hover:text-red-400 focus:bg-red-900/30 rounded-lg"
                  >
                    Logout
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogin}
              className="text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-300"
            >
              Login
            </Button>
            <Button
              onClick={onSignup}
              className="text-sm bg-sky-500 hover:bg-sky-600 text-white border-0 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg shadow-sky-500/20"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <header ref={navRef} className={getNavbarStyles()}>
      <div 
        className="absolute inset-0 opacity-20 transition-opacity duration-1000"
        style={{
          background: isHovered 
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)`
            : 'transparent'
        }}
      />
      
      <div className={cn(
        variant === 'floating' ? "max-w-6xl mx-auto" : "container mx-auto px-4"
      )}>
        <div className={getContainerStyles()}>
          <div className="flex h-16 items-center justify-between px-4">
            <LogoComponent />

            <nav className="hidden md:flex items-center gap-1">
              {items.map((item, index) => (
                <NavItemComponent key={index} item={item} index={index} />
              ))}
            </nav>

            <AuthSection />

            <button
              type="button"
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              <div className="relative w-5 h-5">
                {isOpen ? (
                  <X className="absolute inset-0 transition-all duration-300 rotate-0 opacity-100" />
                ) : (
                  <Menu className="absolute inset-0 transition-all duration-300 rotate-0 opacity-100" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className={cn(
        "md:hidden absolute top-full left-0 right-0 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <div className="mx-4 mt-2 bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800 shadow-2xl shadow-black/30 overflow-hidden">
          <div className="p-4 space-y-2">
            {items.map((item, index) => {
              if (item.children) {
                return (
                  <div key={index} className="space-y-1">
                    <div className="px-3 py-2 text-sm font-medium text-gray-200 border-b border-gray-700/50">
                      {item.title}
                    </div>
                    <div className="pl-4 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-lg transition-all duration-300",
                            "hover:bg-gray-800",
                            pathname === child.href ? "text-white bg-gray-800" : "text-gray-400 hover:text-white"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm rounded-lg transition-all duration-300",
                    "hover:bg-gray-800",
                    pathname === item.href ? "text-white bg-gray-800" : "text-gray-400 hover:text-white"
                  )}
                >
                  {item.title}
                </Link>
              )
            })}

            {showAuth && (
              <div className="pt-4 mt-4 border-t border-gray-700/50 space-y-2">
                {isLoggedIn ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm font-medium text-gray-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                        <div className="h-3 w-3 text-gray-300" />
                      </div>
                      {userName || "Account"}
                    </div>
                    <Link href="/dashboard" className="block px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
                      Profile
                    </Link>
                    <Link href="/settings" className="block px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
                      Settings
                    </Link>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:text-red-400 rounded-lg hover:bg-red-900/30 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={onLogin}
                      className="w-full justify-start px-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={onSignup}
                      className="w-full text-sm bg-sky-500 hover:bg-sky-600 text-white border-0 rounded-lg transition-all duration-300"
                    >
                      Sign up
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

const defaultNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Services",
    href: "#",
    badge: "New",
    children: [
      {
        title: "Personal Shopping",
        href: "/services/personal-shopping",
        description: "Curated shopping experiences",
      },
      {
        title: "Business Importing",
        href: "/services/business-importing",
        description: "B2B import solutions",
      },
      {
        title: "Specialty Items",
        href: "/services/specialty-items",
        description: "Hard-to-find products",
      },
      {
        title: "Concierge Service",
        href: "/services/concierge-service",
        description: "Premium assistance for your needs",
      },
      {
        title: "Customs Clearance",
        href: "/services/customs-clearance",
        description: "Seamless processing for imports",
      },
    ],
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "How It Works",
    href: "/how-it-works",
  },
  {
    title: "Pricing",
    href: "/pricing",
    badge: "Hot",
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