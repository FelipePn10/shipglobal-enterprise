"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ServiceFeatureProps {
  title: string
  description: string
  icon: ReactNode
}

export default function ServiceFeature({ title, description, icon }: ServiceFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.05] transition-colors duration-300"
    >
      <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-lg inline-flex mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-white/90">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  )
}

