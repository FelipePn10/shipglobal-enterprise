"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

export function SuccessAnimation() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          >
            <Check className="h-8 w-8 text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1.5 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500"
        />
      </motion.div>
    </div>
  )
}

