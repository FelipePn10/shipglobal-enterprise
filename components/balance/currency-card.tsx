"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronDown,
  Plus,
  ArrowRightLeft,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY"

interface Transaction {
  id: string
  type: "deposit" | "transfer" | "withdrawal"
  amount: number
  currency: CurrencyCode
  targetCurrency?: CurrencyCode
  date: string
  status: "completed" | "pending" | "failed"
  description?: string
}

interface CurrencyCardProps {
  currency: CurrencyCode
  amount: number
  symbol: string
  name: string
  icon: LucideIcon
  lastUpdated: string
  usdEquivalent: string
  isExpanded: boolean
  onToggleExpand: () => void
  onDeposit: () => void
  onTransfer: () => void
  exchangeRate: number
  color: string
  recentTransactions: Transaction[]
}

export function CurrencyCard({
  currency,
  amount,
  symbol,
  name,
  icon: Icon,
  lastUpdated,
  usdEquivalent,
  isExpanded,
  onToggleExpand,
  onDeposit,
  onTransfer,
  exchangeRate,
  color,
  recentTransactions,
}: CurrencyCardProps) {
  // Generate random trend percentage between -5 and +15
  const trend = Math.random() * 20 - 5
  const isPositive = trend > 0

  return (
    <motion.div
      layout
      transition={{
        layout: { duration: 0.3 },
        height: { duration: 0.3 },
      }}
      className={`${isExpanded ? "md:col-span-2" : ""}`}
    >
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden relative h-full">
        <div className={`absolute inset-0 bg-gradient-to-br ${color}/20 opacity-50`} />

        {/* Animated holographic pattern */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)] opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-white/60 text-sm">{name}</div>
              <motion.div
                className="text-3xl font-bold text-white mt-1"
                key={amount}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {symbol}
                {amount.toFixed(2)}
              </motion.div>
              <div className="text-sm text-white/60 mt-1">≈ ${usdEquivalent} USD</div>
            </div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm flex items-center justify-center"
            >
              <Icon className="h-6 w-6 text-white" />
            </motion.div>
          </div>

          <div className="flex justify-between items-center mt-4">
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
              <span className="text-xs text-white/60 ml-1">vs last week</span>
            </div>

            <div className="flex items-center text-xs text-white/60">
              <Clock className="h-3 w-3 mr-1" />
              <span>Updated {lastUpdated}</span>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
              onClick={onDeposit}
            >
              <Plus className="h-3 w-3 mr-1" />
              Deposit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-white/80 hover:bg-white/5"
              onClick={onTransfer}
            >
              <ArrowRightLeft className="h-3 w-3 mr-1" />
              Transfer
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/5"
              onClick={onToggleExpand}
            >
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-white/60" />
                      Exchange Rate
                    </h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <div className="text-white/60 text-sm">Current Rate</div>
                        <div className="text-white font-medium">
                          1 {currency === "USD" ? currency : "USD"} ={" "}
                          {currency === "USD" ? "1.0000" : exchangeRate.toFixed(4)}{" "}
                          {currency === "USD" ? "USD" : currency}
                        </div>
                      </div>

                      {currency === "CNY" && (
                        <div className="text-amber-400 text-xs mt-2 bg-amber-500/10 p-2 rounded">
                          Note: CNY has a fixed exchange rate of 1.30 for every 100 units.
                        </div>
                      )}
                    </div>

                    <h3 className="text-white font-medium mt-4 mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-white/60" />
                      Quick Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 text-xs mb-1">Total Deposits</div>
                        <div className="text-white font-medium">
                          {symbol}
                          {recentTransactions
                            .filter((t) => t.type === "deposit" && t.currency === currency)
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 text-xs mb-1">Total Transfers</div>
                        <div className="text-white font-medium">
                          {symbol}
                          {recentTransactions
                            .filter(
                              (t) =>
                                t.type === "transfer" && (t.currency === currency || t.targetCurrency === currency),
                            )
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Recent Transactions</h3>
                    {recentTransactions.length > 0 ? (
                      <div className="space-y-2">
                        {recentTransactions.map((transaction) => {
                          const Icon =
                            transaction.type === "deposit"
                              ? ArrowDownRight
                              : transaction.type === "withdrawal"
                                ? ArrowUpRight
                                : ArrowRightLeft

                          const iconColorClass =
                            transaction.type === "deposit"
                              ? "text-green-400"
                              : transaction.type === "withdrawal"
                                ? "text-red-400"
                                : "text-blue-400"

                          return (
                            <div key={transaction.id} className="flex items-center p-3 rounded-lg bg-white/5">
                              <div
                                className={`w-6 h-6 rounded-full bg-${iconColorClass.replace("text-", "")}/10 flex items-center justify-center mr-2`}
                              >
                                <Icon className={`h-3 w-3 ${iconColorClass}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div className="text-white text-sm capitalize">{transaction.type}</div>
                                  <div className="text-white text-sm">
                                    {transaction.type === "deposit"
                                      ? "+"
                                      : transaction.type === "withdrawal"
                                        ? "-"
                                        : ""}
                                    {symbol}
                                    {transaction.amount.toFixed(2)}
                                  </div>
                                </div>
                                <div className="text-xs text-white/60">
                                  {new Date(transaction.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-white/60 text-sm bg-white/5 p-4 rounded-lg text-center">
                        No recent transactions for this currency
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

