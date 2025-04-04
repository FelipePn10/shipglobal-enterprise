"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import type { ReactNode } from "react"

type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY"

interface BalanceCardProps {
  currency: CurrencyCode
  amount: number
  symbol: string
  name: string
  icon: ReactNode
  lastUpdated: string
  usdEquivalent: string
}

export function BalanceCard({ currency, amount, symbol, name, icon, lastUpdated, usdEquivalent }: BalanceCardProps) {
  // Generate random trend percentage between -5 and +15
  const trend = Math.random() * 20 - 5
  const isPositive = trend > 0

  // Get gradient colors based on currency
  const getGradient = () => {
    switch (currency) {
      case "USD":
        return "from-blue-500/20 to-indigo-500/20"
      case "EUR":
        return "from-indigo-500/20 to-purple-500/20"
      case "CNY":
        return "from-red-500/20 to-orange-500/20"
      case "JPY":
        return "from-emerald-500/20 to-teal-500/20"
      default:
        return "from-indigo-500/20 to-rose-500/20"
    }
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden relative h-full">
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50`} />
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-white/60 text-sm">{name}</div>
              <div className="text-2xl font-bold text-white mt-1">
                {symbol}
                {amount.toFixed(2)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">{icon}</div>
          </div>

          <div className="text-sm text-white/60 mb-4">≈ ${usdEquivalent} USD</div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
              )}
              <span className={`text-xs font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
                {isPositive ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center text-xs text-white/60">
              <Clock className="h-3 w-3 mr-1" />
              <span>Updated {lastUpdated}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

