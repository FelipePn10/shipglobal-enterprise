"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceTestimonialProps {
  quote: string
  author: string
  location: string
  rating: number
}

export default function ServiceTestimonial({ quote, author, location, rating }: ServiceTestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6"
    >
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn("w-4 h-4 mr-1", i < rating ? "text-amber-400 fill-amber-400" : "text-white/20")}
          />
        ))}
      </div>

      <p className="text-white/70 mb-6 italic">&ldquo;{quote}&rdquo;</p>

      <div>
        <p className="text-white/90 font-medium">{author}</p>
        <p className="text-white/60 text-sm">{location}</p>
      </div>
    </motion.div>
  )
}