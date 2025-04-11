"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import ElegantShape from "@/components/kokonutui/elegant-shape"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const validateEmail = () => {
    if (!email) {
      setError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) return

    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitted(true)
    } catch (error) {
      setError("Failed to send reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3 + i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 shadow-xl">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Image src="https://kokonutui.com/logo.svg" alt="Redirex Solutions" width={30} height={30} />
              <span className="text-xl font-bold text-white">Redirex</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-white/60">Enter your email to receive a password reset link</p>
          </motion.div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <motion.div
                custom={1}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 mb-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/70">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError("")
                      }}
                      className={cn(
                        "pl-10 bg-white/[0.03] border-white/10 text-white",
                        error && "border-rose-500/50 focus-visible:ring-rose-500/20",
                      )}
                    />
                  </div>
                  {error && <p className="text-rose-400 text-xs mt-1">{error}</p>}
                </div>
              </motion.div>

              <motion.div custom={2} variants={fadeInVariants} initial="hidden" animate="visible">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-medium"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <p className="mt-6 text-center text-white/60 text-sm">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                    Back to login
                  </Link>
                </p>
              </motion.div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 mb-6">
                <div className="text-indigo-300 mb-2 text-lg">Check Your Email</div>
                <p className="text-white/70">
                  We've sent a password reset link to <span className="text-white font-medium">{email}</span>. Please
                  check your inbox and follow the instructions.
                </p>
              </div>

              <Button
                onClick={() => {
                  setEmail("")
                  setSubmitted(false)
                }}
                variant="outline"
                className="border-white/10 hover:bg-white/[0.03] text-white/80 mr-2"
              >
                Try Another Email
              </Button>

              <Link href="/auth/login">
                <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-medium">
                  Back to Login
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}

