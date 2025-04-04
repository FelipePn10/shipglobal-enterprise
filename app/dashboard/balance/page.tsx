"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  EuroIcon,
  JapaneseYenIcon as Yen,
  ArrowRightLeft,
  Plus,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"


// Add these imports at the top of the file
import { useTheme } from "next-themes"
import { SunMoon } from "lucide-react"
import { BalanceChart } from "@/components/balance/balance-chart"
import { BalanceSummary } from "@/components/balance/balance-summary"
import { CurrencyCard } from "@/components/balance/currency-card"
import { CurrencyConverter } from "@/components/balance/currency-converter"
import { DepositModal } from "@/components/balance/deposit-modal"
import { ExchangeRateTable } from "@/components/balance/exchange-rate-table"
import { QuickActions } from "@/components/balance/quick-actions"
import { TransactionHistory } from "@/components/balance/transaction-history"

// Currency types
type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY"

// Currency data with symbols and names
const currencies = {
  USD: { symbol: "$", name: "US Dollar", icon: DollarSign, color: "from-blue-500 to-indigo-500" },
  EUR: { symbol: "€", name: "Euro", icon: EuroIcon, color: "from-indigo-500 to-violet-500" },
  CNY: { symbol: "¥", name: "Chinese Yuan", icon: Yen, color: "from-red-500 to-orange-500" },
  JPY: { symbol: "¥", name: "Japanese Yen", icon: Yen, color: "from-emerald-500 to-teal-500" },
}

// Interface for balance data
interface BalanceData {
  [key: string]: {
    amount: number
    lastUpdated: string
  }
}

// Interface for transaction data
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

// // Interactive Mouse Follower Element
// const MouseFollower = () => {
//   const mouseX = useMotionValue(0)
//   const mouseY = useMotionValue(0)

//   const followerX = useSpring(mouseX, { stiffness: 1000, damping: 100 })
//   const followerY = useSpring(mouseY, { stiffness: 1000, damping: 100 })

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       mouseX.set(e.clientX)
//       mouseY.set(e.clientY)
//     }

//     window.addEventListener("mousemove", handleMouseMove)
//     return () => window.removeEventListener("mousemove", handleMouseMove)
//   }, [mouseX, mouseY])

//   return (
//     <motion.div
//       className="fixed w-4 h-4 rounded-full pointer-events-none z-50 mix-blend-screen opacity-50 bg-gradient-to-r from-violet-500 to-indigo-500"
//       style={{
//         x: followerX,
//         y: followerY,
//         translateX: "-50%",
//         translateY: "-50%",
//       }}
//       transition={{
//         type: "spring",
//         damping: 25,
//         stiffness: 250,
//       }}
//     />
//   )
// }

export default function BalancePage() {
  // State for balances in different currencies
  const [balances, setBalances] = useState<BalanceData>({
    USD: { amount: 5000, lastUpdated: new Date().toISOString() },
    EUR: { amount: 2500, lastUpdated: new Date().toISOString() },
    CNY: { amount: 10000, lastUpdated: new Date().toISOString() },
    JPY: { amount: 200000, lastUpdated: new Date().toISOString() },
  })

  // State for exchange rates
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    USD: 1,
    EUR: 0.92,
    CNY: 7.25, // Fixed rate for CNY is 1.30 for 100 units, which is 7.25 for 1:1
    JPY: 150.45,
  })

  // State for loading exchange rates
  const [loadingRates, setLoadingRates] = useState(false)

  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-001",
      type: "deposit",
      amount: 1000,
      currency: "USD",
      date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      status: "completed",
      description: "Initial deposit",
    },
    {
      id: "tx-002",
      type: "transfer",
      amount: 500,
      currency: "USD",
      targetCurrency: "EUR",
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: "completed",
      description: "Currency exchange",
    },
    {
      id: "tx-003",
      type: "deposit",
      amount: 5000,
      currency: "CNY",
      date: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 12 hours ago
      status: "completed",
      description: "Business funding",
    },
  ])

  // State for active tab
  const [activeTab, setActiveTab] = useState("dashboard")

  // State for deposit modal
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [depositCurrency, setDepositCurrency] = useState<CurrencyCode>("USD")

  // State for expanded currency cards
  const [expandedCard, setExpandedCard] = useState<CurrencyCode | null>(null)

  // Function to fetch exchange rates
  const fetchExchangeRates = async () => {
    setLoadingRates(true)
    try {
      // In a real app, you would fetch from an API like:
      // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      // const data = await response.json()
      // setExchangeRates(data.rates)

      // For demo purposes, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update with slightly different rates to simulate real-time changes
      // Note: CNY rate is fixed at 7.25 (equivalent to 1.30 for 100 units)
      setExchangeRates({
        USD: 1,
        EUR: 0.92 + (Math.random() * 0.02 - 0.01), // Small random fluctuation
        CNY: 7.25, // Fixed rate
        JPY: 150.45 + (Math.random() * 2 - 1), // Small random fluctuation
      })

      toast({
        title: "Exchange rates updated",
        description: "Latest rates have been fetched successfully",
      })
    } catch (error) {
      toast({
        title: "Failed to update exchange rates",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoadingRates(false)
    }
  }

  // Function to handle deposit
  const handleDeposit = (currency: CurrencyCode, amount: number) => {
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "deposit",
      amount,
      currency,
      date: new Date().toISOString(),
      status: "completed",
      description: `Deposit to ${currency} account`,
    }

    // Update balances
    setBalances((prev) => ({
      ...prev,
      [currency]: {
        amount: prev[currency].amount + amount,
        lastUpdated: new Date().toISOString(),
      },
    }))

    // Add transaction to history
    setTransactions((prev) => [newTransaction, ...prev])

    toast({
      title: "Deposit successful",
      description: `${currencies[currency].symbol}${amount.toFixed(2)} has been added to your ${currency} balance`,
    })

    setDepositModalOpen(false)
  }

  // Function to handle transfer
  const handleTransfer = (fromCurrency: CurrencyCode, toCurrency: CurrencyCode, amount: number) => {
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    if (amount > balances[fromCurrency].amount) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${fromCurrency} to complete this transfer`,
        variant: "destructive",
      })
      return
    }

    // Calculate converted amount
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency]
    const convertedAmt = amount * rate

    // Create new transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "transfer",
      amount,
      currency: fromCurrency,
      targetCurrency: toCurrency,
      date: new Date().toISOString(),
      status: "completed",
      description: `Converted from ${fromCurrency} to ${toCurrency}`,
    }

    // Update balances
    setBalances((prev) => ({
      ...prev,
      [fromCurrency]: {
        amount: prev[fromCurrency].amount - amount,
        lastUpdated: new Date().toISOString(),
      },
      [toCurrency]: {
        amount: prev[toCurrency].amount + convertedAmt,
        lastUpdated: new Date().toISOString(),
      },
    }))

    // Add transaction to history
    setTransactions((prev) => [newTransaction, ...prev])

    toast({
      title: "Transfer successful",
      description: `${currencies[fromCurrency].symbol}${amount.toFixed(2)} has been converted to ${currencies[toCurrency].symbol}${convertedAmt.toFixed(2)}`,
    })
  }

  // Calculate total balance in USD
  const totalBalanceUSD = Object.entries(balances).reduce((total, [currency, data]) => {
    return total + data.amount / exchangeRates[currency]
  }, 0)

  // Add a theme toggle function
  const ThemeToggle = () => {
    const { theme, setTheme } = useTheme()

    return (
      <Button
        variant="outline"
        size="icon"
        className="border-white/10 text-white/80 hover:bg-white/5 h-9 w-9"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <SunMoon className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // Generate historical balance data for charts
  const generateHistoricalData = () => {
    const data = []
    const now = new Date()

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Generate a somewhat realistic growth pattern
      const dayFactor = 1 + (Math.sin(i / 5) * 0.03 + Math.random() * 0.01)

      data.push({
        date: date.toISOString().split("T")[0],
        USD: Math.round(5000 * dayFactor * (1 + (30 - i) * 0.01)),
        EUR: Math.round(2500 * dayFactor * (1 + (30 - i) * 0.008)),
        CNY: Math.round(10000 * dayFactor * (1 + (30 - i) * 0.012)),
        JPY: Math.round(200000 * dayFactor * (1 + (30 - i) * 0.007)),
      })
    }

    return data
  }

  const historicalBalanceData = generateHistoricalData()

  // Open deposit modal with specific currency
  const openDepositModal = (currency: CurrencyCode) => {
    setDepositCurrency(currency)
    setDepositModalOpen(true)
  }

  return (
    <DashboardLayout>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Balance</h1>
            <p className="text-white/60">Manage your multi-currency balances and transactions</p>
          </div>
          <div className="flex items-center gap-3">
            {/* <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white/80 hover:bg-white/5"
              onClick={fetchExchangeRates}
              disabled={loadingRates}
            >
              {loadingRates ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Rates
                </>
              )}
            </Button> */}
            <Button
              className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white"
              onClick={() => setDepositModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Deposit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="balances"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Balances
          </TabsTrigger>
          <TabsTrigger
            value="convert"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Convert
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            History
          </TabsTrigger>
          <TabsTrigger
            value="rates"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Exchange Rates
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <BalanceSummary
            totalBalanceUSD={totalBalanceUSD}
            currencies={Object.keys(balances).length}
            transactions={transactions.length}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BalanceChart data={historicalBalanceData} currencies={currencies} />
            </div>
            <div>
              <QuickActions
                onDeposit={() => setDepositModalOpen(true)}
                onConvert={() => setActiveTab("convert")}
                onViewHistory={() => setActiveTab("history")}
                onViewRates={() => setActiveTab("rates")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Recent Transactions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                  onClick={() => setActiveTab("history")}
                >
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-3">
                {transactions.slice(0, 3).map((transaction) => {
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
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-full bg-${iconColorClass.replace("text-", "")}/10 flex items-center justify-center mr-3`}
                      >
                        <Icon className={`h-4 w-4 ${iconColorClass}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="text-white font-medium capitalize">{transaction.type}</div>
                          <div className="text-white font-medium">
                            {transaction.type === "deposit" ? "+" : transaction.type === "withdrawal" ? "-" : ""}
                            {currencies[transaction.currency].symbol}
                            {transaction.amount.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <div className="text-xs text-white/60">{new Date(transaction.date).toLocaleDateString()}</div>
                          {transaction.type === "transfer" && transaction.targetCurrency && (
                            <div className="text-xs text-white/60">
                              {transaction.currency} → {transaction.targetCurrency}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Currency Distribution</h3>
                <div className="text-white/60 text-sm">{Object.keys(balances).length} Currencies</div>
              </div>

              <div className="space-y-4">
                {Object.entries(balances).map(([currency, data]) => {
                  const currencyCode = currency as CurrencyCode
                  const percentage = (data.amount / exchangeRates[currency] / totalBalanceUSD) * 100

                  return (
                    <div key={currency} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center text-white">
                          {React.createElement(currencies[currencyCode].icon, { className: "h-3 w-3 mr-1" })}
                          {currencyCode}
                        </div>
                        <div className="text-white">
                          {currencies[currencyCode].symbol}
                          {data.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${currencies[currencyCode].color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-white/60">
                        <div>≈ ${(data.amount / exchangeRates[currency]).toFixed(2)} USD</div>
                        <div>{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Balances Tab */}
        <TabsContent value="balances" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(balances).map(([currency, data]) => {
              const currencyCode = currency as CurrencyCode
              const isExpanded = expandedCard === currencyCode

              return (
                <CurrencyCard
                  key={currency}
                  currency={currencyCode}
                  amount={data.amount}
                  symbol={currencies[currencyCode].symbol}
                  name={currencies[currencyCode].name}
                  icon={currencies[currencyCode].icon}
                  lastUpdated={new Date(data.lastUpdated).toLocaleString()}
                  usdEquivalent={(data.amount / exchangeRates[currency]).toFixed(2)}
                  isExpanded={isExpanded}
                  onToggleExpand={() => setExpandedCard(isExpanded ? null : currencyCode)}
                  onDeposit={() => openDepositModal(currencyCode)}
                  onTransfer={() => {
                    setActiveTab("convert")
                  }}
                  exchangeRate={exchangeRates[currency]}
                  color={currencies[currencyCode].color}
                  recentTransactions={transactions
                    .filter((t) => t.currency === currencyCode || t.targetCurrency === currencyCode)
                    .slice(0, 3)}
                />
              )
            })}
          </div>
        </TabsContent>

        {/* Convert Tab */}
        <TabsContent value="convert" className="mt-6">
          <CurrencyConverter
            balances={balances}
            exchangeRates={exchangeRates}
            currencies={currencies}
            onTransfer={handleTransfer}
          />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <TransactionHistory transactions={transactions} currencies={currencies} />
        </TabsContent>

        {/* Exchange Rates Tab */}
        <TabsContent value="rates" className="mt-6">
          <ExchangeRateTable
            exchangeRates={exchangeRates}
            currencies={currencies}
            onRefresh={fetchExchangeRates}
            isLoading={loadingRates}
          />
        </TabsContent>
      </Tabs>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onDeposit={handleDeposit}
        currencies={currencies}
        initialCurrency={depositCurrency}
        balances={balances}
      />
    </DashboardLayout>
  )
}

