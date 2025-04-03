"use client"

import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Check, Shield } from "lucide-react"

interface InsuranceOptionProps {
  title: string
  description: string
  price: number
  features: string[]
  selected: boolean
  onSelect: () => void
}

export function InsuranceOption({ title, description, price, features, selected, onSelect }: InsuranceOptionProps) {
  return (
    <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
      <div
        className={`flex items-start space-x-4 p-4 rounded-lg border cursor-pointer ${selected ? "border-primary bg-primary/5" : "border-border"}`}
        onClick={onSelect}
      >
        <div className="mt-1">
          <div
            className={`h-4 w-4 rounded-full border ${selected ? "bg-primary border-primary" : "border-primary"} flex items-center justify-center`}
          >
            {selected && <div className="h-2 w-2 rounded-full bg-white" />}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium cursor-pointer">{title} Protection</Label>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="text-right">
              {price === 0 ? (
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Free</span>
              ) : (
                <span className="text-sm font-medium">${price.toFixed(2)}/month</span>
              )}
            </div>
          </div>

          <div className="pl-6 space-y-1">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start text-sm">
                <Check className="h-4 w-4 text-primary mr-2 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`p-2 rounded-full ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          <Shield className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  )
}

