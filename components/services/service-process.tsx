"use client"

import { motion } from "framer-motion"

interface ServiceProcessProps {
  step: number
  title: string
  description: string
  isLast?: boolean
}

export default function ServiceProcess({ step, title, description, isLast = false }: ServiceProcessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex mb-8 last:mb-0"
    >
      <div className="mr-6 text-center">
        <div className="bg-gradient-to-br from-indigo-500 to-rose-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
          {step}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gradient-to-b from-indigo-500/50 to-rose-500/50 mx-auto mt-2"></div>
        )}
      </div>
      <div className="flex-1 pt-2">
        <h3 className="text-xl font-semibold mb-2 text-white/90">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </motion.div>
  )
}

