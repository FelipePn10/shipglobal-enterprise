"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, History, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BalanceSummaryProps {
  totalBalanceUSD: number
  currencies: number
  transactions: number
}

export function BalanceSummary({ totalBalanceUSD, currencies, transactions }: BalanceSummaryProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const summaryCards = [
    {
      title: "Total Balance (USD)",
      value: `$${totalBalanceUSD.toFixed(2)}`,
      trend: 8.5,
      trendLabel: "vs last month",
      icon: <Wallet className="h-6 w-6 text-white/80" />,
      color: "from-indigo-500/20 to-rose-500/20",
      details: "Your total balance across all currencies, converted to USD at current exchange rates.",
    },
    {
      title: "Active Currencies",
      value: currencies.toString(),
      trend: 0,
      trendLabel: "unchanged",
      icon: <CreditCard className="h-6 w-6 text-white/80" />,
      color: "from-violet-500/20 to-indigo-500/20",
      details:
        "The number of different currencies in your portfolio. Diversification helps protect against currency fluctuations.",
    },
    {
      title: "Total Transactions",
      value: transactions.toString(),
      trend: 12.3,
      trendLabel: "vs last month",
      icon: <History className="h-6 w-6 text-white/80" />,
      color: "from-blue-500/20 to-indigo-500/20",
      details: "The total number of deposits, withdrawals, and transfers in your account history.",
    },
    {
      title: "Monthly Growth",
      value: "+15.7%",
      trend: 3.2,
      trendLabel: "vs last month",
      icon: <ArrowUpRight className="h-6 w-6 text-white/80" />,
      color: "from-emerald-500/20 to-teal-500/20",
      details: "Your portfolio's growth rate over the past month, calculated across all currencies.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden relative"
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br opacity-30"
            animate={{
              background: [
                `linear-gradient(to bottom right, ${item.color.split(" ")[0]}, ${item.color.split(" ")[1]})`,
                `linear-gradient(to bottom left, ${item.color.split(" ")[0]}, ${item.color.split(" ")[1]})`,
                `linear-gradient(to top right, ${item.color.split(" ")[0]}, ${item.color.split(" ")[1]})`,
                `linear-gradient(to bottom right, ${item.color.split(" ")[0]}, ${item.color.split(" ")[1]})`,
              ],
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          <div className="p-4 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/60">{item.title}</p>
                <h3 className="text-2xl font-semibold mt-1 text-white">{item.value}</h3>
              </div>
              <div className={`p-2 bg-gradient-to-r ${item.color} rounded-md`}>{item.icon}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`flex items-center text-xs font-medium ${
                  item.trend > 0 ? "text-green-400" : item.trend < 0 ? "text-red-400" : "text-white/60"
                }`}
              >
                {item.trend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {item.trend > 0 ? "+" : ""}
                {item.trend}% <span className="text-white/60 ml-1">{item.trendLabel}</span>
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
              >
                <Info className="h-3 w-3" />
                <span className="sr-only">More info</span>
              </Button>
            </div>

            <AnimatePresence>
              {expandedCard === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 pt-3 border-t border-white/10 text-xs text-white/70"
                >
                  {item.details}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

