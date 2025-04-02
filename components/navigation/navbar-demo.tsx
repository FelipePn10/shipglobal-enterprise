"use client"

import { useState } from "react"
import Navbar, { type NavItem } from "@/components/navigation/navbar"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, Briefcase, Users, FileCheck, Info, HelpCircle, Mail } from "lucide-react"

export default function NavbarDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Custom navigation items with icons
  const navItems: NavItem[] = [
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
          icon: <ShoppingBag className="h-4 w-4" />,
        },
        {
          title: "Business Importing",
          href: "/services/business-importing",
          icon: <Briefcase className="h-4 w-4" />,
        },
        {
          title: "Specialty Items",
          href: "/services/specialty-items",
          icon: <Package className="h-4 w-4" />,
        },
        {
          title: "Concierge Service",
          href: "/services/concierge-service",
          icon: <Users className="h-4 w-4" />,
        },
        {
          title: "Customs Clearance",
          href: "/services/customs-clearance",
          icon: <FileCheck className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "About",
      href: "/about",
      icon: <Info className="h-4 w-4" />,
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
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      title: "Contact",
      href: "/contact",
      icon: <Mail className="h-4 w-4" />,
    },
  ]

  // Mock auth functions
  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleSignup = () => {
    setIsLoggedIn(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar
        items={navItems}
        isLoggedIn={isLoggedIn}
        userName={isLoggedIn ? "John Doe" : undefined}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onSignup={handleSignup}
      />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Navbar Component Demo</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            This page demonstrates the responsive navbar component with various features. Try resizing your browser
            window to see how it adapts to different screen sizes.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <Button onClick={() => setIsLoggedIn(!isLoggedIn)}>
              {isLoggedIn ? "Switch to Logged Out State" : "Switch to Logged In State"}
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-left">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Responsive design with mobile hamburger menu</li>
              <li>Dropdown menus for nested navigation</li>
              <li>Active state highlighting for current page</li>
              <li>Authentication controls (login/logout)</li>
              <li>Scroll effect with background change</li>
              <li>Accessible with keyboard navigation and ARIA attributes</li>
              <li>Customizable via props</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

