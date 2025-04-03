"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"

interface SubscriptionCardProps {
  title: string
  price: number
  features: string[]
  selected: boolean
  onSelect: () => void
  popularFlag: boolean
}

export function SubscriptionCard({ title, price, features, selected, onSelect, popularFlag }: SubscriptionCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
      <Card
        className={`h-full relative ${selected ? "border-primary shadow-lg" : ""} ${popularFlag ? "border-2 border-primary" : ""}`}
      >
        {popularFlag && (
          <div className="absolute -top-3 left-0 right-0 flex justify-center">
            <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              Most Popular
            </div>
          </div>
        )}

        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <span className="text-2xl font-bold">${price.toFixed(2)}</span> / month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant={selected ? "default" : "outline"} className="w-full" onClick={onSelect}>
            {selected ? "Selected" : "Select Plan"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

