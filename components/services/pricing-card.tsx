"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

interface PricingCardProps {
  title: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
}

export default function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  popular = false,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={cn(
        "bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 relative",
        popular && "border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]",
      )}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
          Most Popular
        </div>
      )}

      <h3 className={cn("text-2xl font-semibold mb-2 text-white/90", popular && "text-indigo-400")}>{title}</h3>

      <div className="flex items-baseline mb-4">
        <span className="text-3xl font-bold text-white">{price}</span>
        <span className="text-white/60 ml-2">{period}</span>
      </div>

      <p className="text-white/70 mb-6">{description}</p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className={cn("h-5 w-5 mt-0.5 flex-shrink-0", popular ? "text-indigo-400" : "text-white/60")} />
            <span className="text-white/70">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href="/auth/register" className="block">
        <Button
          className={cn(
            "w-full",
            popular
              ? "bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white"
              : "bg-white/[0.05] hover:bg-white/[0.08] text-white",
          )}
        >
          {buttonText}
        </Button>
      </Link>
    </motion.div>
  )
}

