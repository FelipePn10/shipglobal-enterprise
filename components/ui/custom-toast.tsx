"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, AlertCircle } from "lucide-react"
import { SuccessAnimation } from "@/components/team/success-animation"

interface CustomToastProps {
  title: string
  description: string
  variant?: "default" | "destructive" | "success"
  onClose: () => void
}

export function CustomToast({ title, description, variant = "default", onClose }: CustomToastProps) {
  const [progress, setProgress] = useState(100)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 4000)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 2.5
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <SuccessAnimation />
      case "destructive":
        return (
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-rose-500" />
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-indigo-500" />
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden w-full max-w-md bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl"
        >
          <div className="p-4 flex gap-4">
            {getIcon()}

            <div className="flex-1">
              <h3 className="font-medium text-white">{title}</h3>
              <p className="text-white/70 text-sm mt-1">{description}</p>
            </div>

            <button onClick={handleClose} className="text-white/60 hover:text-white">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            className="h-1 bg-gradient-to-r from-indigo-500 to-rose-500"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

