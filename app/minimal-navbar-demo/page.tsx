"use client";

import { useState, useCallback } from "react";
import MinimalNavbar from "@/components/navigation/minimal-navbar";
import { Button } from "@/components/ui/button";

// Types
interface User {
  name: string;
}

export default function MinimalNavbarDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Auth functions
  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    setUser({ name: "John Doe" });
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const handleSignup = useCallback(() => {
    setIsLoggedIn(true);
    setUser({ name: "John Doe" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <MinimalNavbar
        logoText="Redirex"
        isLoggedIn={isLoggedIn}
        userName={user?.name}
        //onLogin={handleLogin}
        //onLogout={handleLogout}
        //onSignup={handleSignup}
      />

      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-white">
            Minimalist Navbar Demo
          </h1>
          <p className="mb-8 text-white/70">
            This page demonstrates the minimalist, nearly invisible navbar
            component. Try scrolling down to see how it adapts, or resize your
            browser to see the responsive behavior.
          </p>

          <div className="mb-12 flex justify-center gap-4">
            <Button
              onClick={isLoggedIn ? handleLogout : handleLogin}
              aria-label={isLoggedIn ? "Log out" : "Log in"}
            >
              {isLoggedIn ? "Log Out" : "Log In"}
            </Button>
            {!isLoggedIn && (
              <Button
                onClick={handleSignup}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                aria-label="Sign up"
              >
                Sign Up
              </Button>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-left shadow-md backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold text-white">Features</h2>
            <ul className="list-disc space-y-2 pl-6 text-white/80">
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
  );
}