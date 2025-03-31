"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

interface SpecialtyItemCardProps {
  title: string
  description: string
  image: string
  items: string[]
}

export default function SpecialtyItemCard({ title, description, image, items }: SpecialtyItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden"
    >
      <div className="relative h-48">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] to-transparent"></div>
        <h3 className="absolute bottom-4 left-6 text-xl font-semibold text-white">{title}</h3>
      </div>

      <div className="p-6">
        <p className="text-white/70 mb-6">{description}</p>

        <h4 className="text-sm uppercase tracking-wider text-white/40 mb-3">Examples</h4>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-400" />
              <span className="text-white/70 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

