"use client"

import { useState } from "react"
import MinimalNavbar from "@/components/navigation/minimal-navbar"
import { Button } from "@/components/ui/button"

export default function MinimalNavbarDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <MinimalNavbar
        logoText="Redirex"
        isLoggedIn={isLoggedIn}
        userName={isLoggedIn ? "John Doe" : undefined}
       // onLogin={handleLogin}
        //onLogout={handleLogout}
       // onSignup={handleSignup}
      />

      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-white">Minimalist Navbar Demo</h1>
          <p className="text-white/70 mb-8">
            This page demonstrates the minimalist, nearly invisible navbar component. Try scrolling down to see how it
            adapts, or resize your browser to see the responsive behavior.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <Button onClick={() => setIsLoggedIn(!isLoggedIn)}>
              {isLoggedIn ? "Switch to Logged Out State" : "Switch to Logged In State"}
            </Button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg shadow-md text-left">
            <h2 className="text-xl font-semibold mb-4 text-white">Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-white/80">
              <li>Minimalist, nearly invisible design</li>
              <li>Subtle backdrop blur effect</li>
              <li>Responsive with mobile hamburger menu</li>
              <li>Authentication controls that adapt to logged-in state</li>
              <li>Scroll effect with subtle background change</li>
              <li>Accessible with proper ARIA attributes</li>
              <li>Customizable via props</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

