"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ModalLayoutProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  icon?: ReactNode
  iconBackground?: string
  children: ReactNode
  size?: "sm" | "md" | "lg"
  accentColor?: "indigo" | "rose" | "green" | "amber"
}

export function ModalLayout({
  open,
  onOpenChange,
  title,
  description,
  icon,
  iconBackground,
  children,
  size = "md",
  accentColor = "indigo",
}: ModalLayoutProps) {
  // Define accent color gradients
  const accentGradients = {
    indigo: {
      gradient: "from-indigo-500 to-rose-500",
      blur: "bg-indigo-500/10",
      hover: "hover:from-indigo-600 hover:to-rose-600",
    },
    rose: {
      gradient: "from-rose-500 to-pink-500",
      blur: "bg-rose-500/10",
      hover: "hover:from-rose-600 hover:to-pink-600",
    },
    green: {
      gradient: "from-emerald-500 to-teal-500",
      blur: "bg-emerald-500/10",
      hover: "hover:from-emerald-600 hover:to-teal-600",
    },
    amber: {
      gradient: "from-amber-500 to-orange-500",
      blur: "bg-amber-500/10",
      hover: "hover:from-amber-600 hover:to-orange-600",
    },
  }

  // Define modal sizes
  const modalSizes = {
    sm: "sm:max-w-[500px]",
    md: "sm:max-w-[600px]",
    lg: "sm:max-w-[700px]",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent
        className={`${modalSizes[size]} p-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black border-white/10 text-white shadow-xl`}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Decorative elements */}
          <div
            className={`absolute top-0 right-0 w-32 h-32 ${accentGradients[accentColor].blur} rounded-full blur-3xl -z-10`}
          />
          <div
            className={`absolute bottom-0 left-0 w-32 h-32 ${accentGradients[accentColor].blur} rounded-full blur-3xl -z-10`}
          />

          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center gap-3 mb-2">
              {icon && (
                <div
                  className={`${iconBackground || `bg-gradient-to-br ${accentGradients[accentColor].gradient}`} p-2 rounded-lg`}
                >
                  {icon}
                </div>
              )}
              <DialogTitle className="text-xl font-semibold text-white">{title}</DialogTitle>
            </div>
            {description && <DialogDescription className="text-white/60">{description}</DialogDescription>}
          </DialogHeader>

          {children}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

