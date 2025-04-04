"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Search, X, Filter, Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

// Types
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

interface TransactionHistoryProps {
  transactions: Transaction[]
  currencies: Record<CurrencyCode, { symbol: string; name: string; icon: LucideIcon; color: string }>
}

export function TransactionHistory({ transactions, currencies }: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currencyFilter, setCurrencyFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.targetCurrency && transaction.targetCurrency.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchQuery.toLowerCase()))

    // Type filter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    // Currency filter
    const matchesCurrency =
      currencyFilter === "all" ||
      transaction.currency === currencyFilter ||
      transaction.targetCurrency === currencyFilter

    return matchesSearch && matchesType && matchesCurrency
  })

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setTypeFilter("all")
    setCurrencyFilter("all")
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery || typeFilter !== "all" || currencyFilter !== "all"

  // Get transaction icon based on type
  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="h-4 w-4 text-green-400" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />
      case "transfer":
        return <ArrowRightLeft className="h-4 w-4 text-blue-400" />
    }
  }

  // Get transaction status badge
  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">Failed</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white/80 hover:bg-white/5"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge className="ml-2 bg-white/10 text-white hover:bg-white/20">
                {(typeFilter !== "all" ? 1 : 0) + (currencyFilter !== "all" ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-4 mt-4 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/60 text-sm block mb-2">Transaction Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white/80">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="all" className="text-white/80 hover:text-white focus:text-white">
                        All Types
                      </SelectItem>
                      <SelectItem value="deposit" className="text-white/80 hover:text-white focus:text-white">
                        Deposits
                      </SelectItem>
                      <SelectItem value="withdrawal" className="text-white/80 hover:text-white focus:text-white">
                        Withdrawals
                      </SelectItem>
                      <SelectItem value="transfer" className="text-white/80 hover:text-white focus:text-white">
                        Transfers
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-white/60 text-sm block mb-2">Currency</label>
                  <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white/80">
                      <SelectValue placeholder="Filter by currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="all" className="text-white/80 hover:text-white focus:text-white">
                        All Currencies
                      </SelectItem>
                      {Object.entries(currencies).map(([code, { name }]) => (
                        <SelectItem key={code} value={code} className="text-white/80 hover:text-white focus:text-white">
                          {code} - {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="border-white/10 text-white/80 hover:bg-white/5 w-full"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            const isExpanded = expandedTransaction === transaction.id

            return (
              <motion.div
                key={transaction.id}
                layout
                transition={{ duration: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 flex items-center cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedTransaction(isExpanded ? null : transaction.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    {getTransactionIcon(transaction.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-white font-medium capitalize flex items-center">
                          {transaction.type}
                          <span className="text-white/60 text-sm ml-2">{transaction.id}</span>
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                          {transaction.description || `${transaction.type} transaction`}
                        </div>
                      </div>

                      <div className="mt-2 md:mt-0 flex flex-col md:items-end">
                        <div className="text-white font-medium">
                          {transaction.type === "deposit" ? "+" : transaction.type === "withdrawal" ? "-" : ""}
                          {currencies[transaction.currency].symbol}
                          {transaction.amount.toFixed(2)} {transaction.currency}
                        </div>
                        {transaction.type === "transfer" && transaction.targetCurrency && (
                          <div className="text-sm text-white/60">
                            → {currencies[transaction.targetCurrency].symbol}
                            {(
                              transaction.amount *
                              (transaction.targetCurrency === "CNY" && transaction.currency === "USD"
                                ? 7.25
                                : transaction.targetCurrency === "USD" && transaction.currency === "CNY"
                                  ? 1 / 7.25
                                  : 1)
                            ).toFixed(2)}{" "}
                            {transaction.targetCurrency}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
                      <div className="flex items-center text-sm text-white/60">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(transaction.date).toLocaleString()}
                      </div>
                      <div className="mt-2 md:mt-0">{getStatusBadge(transaction.status)}</div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="ml-2 text-white/60 hover:text-white">
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
                      className="border-t border-white/10 p-4 bg-white/[0.03]"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-white/60 text-sm mb-1">Transaction Details</h4>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              <div className="text-white/60">Transaction ID:</div>
                              <div className="text-white">{transaction.id}</div>

                              <div className="text-white/60">Type:</div>
                              <div className="text-white capitalize">{transaction.type}</div>

                              <div className="text-white/60">Status:</div>
                              <div>{getStatusBadge(transaction.status)}</div>

                              <div className="text-white/60">Date:</div>
                              <div className="text-white">{new Date(transaction.date).toLocaleString()}</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white/60 text-sm mb-1">Amount Details</h4>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              <div className="text-white/60">Currency:</div>
                              <div className="text-white">{transaction.currency}</div>

                              <div className="text-white/60">Amount:</div>
                              <div className="text-white">
                                {currencies[transaction.currency].symbol}
                                {transaction.amount.toFixed(2)}
                              </div>

                              {transaction.type === "transfer" && transaction.targetCurrency && (
                                <>
                                  <div className="text-white/60">Target Currency:</div>
                                  <div className="text-white">{transaction.targetCurrency}</div>

                                  <div className="text-white/60">Converted Amount:</div>
                                  <div className="text-white">
                                    {currencies[transaction.targetCurrency].symbol}
                                    {(
                                      transaction.amount *
                                      (transaction.targetCurrency === "CNY" && transaction.currency === "USD"
                                        ? 7.25
                                        : transaction.targetCurrency === "USD" && transaction.currency === "CNY"
                                          ? 1 / 7.25
                                          : 1)
                                    ).toFixed(2)}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white/60 text-sm mb-1">Additional Information</h4>
                          <div className="bg-white/5 rounded-lg p-3 h-full">
                            <div className="text-sm text-white">
                              {transaction.description || "No additional information available."}
                            </div>

                            {transaction.type === "transfer" && transaction.currency === "CNY" && (
                              <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 p-2 rounded">
                                Note: CNY has a fixed exchange rate of 1.30 for every 100 units.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-6 w-6 text-white/40" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No transactions found</h3>
          <p className="text-white/60 max-w-md mx-auto">
            {hasActiveFilters
              ? "Try adjusting your filters to see more transactions."
              : "You don't have any transactions yet. Make a deposit or transfer to get started."}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              className="mt-4 border-white/10 text-white/80 hover:bg-white/5"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

