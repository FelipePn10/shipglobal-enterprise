"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, RefreshCw } from "lucide-react"
import { TrendingUp, Repeat, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Types
type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY"

interface CurrencyConverterProps {
  balances: Record<string, { amount: number; lastUpdated: string }>
  exchangeRates: Record<string, number>
  currencies: Record<CurrencyCode, { symbol: string; name: string; icon: LucideIcon; color: string }>
  onTransfer: (fromCurrency: CurrencyCode, toCurrency: CurrencyCode, amount: number) => void
}

export function CurrencyConverter({ balances, exchangeRates, currencies, onTransfer }: CurrencyConverterProps) {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD")
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("EUR")
  const [convertedAmount, setConvertedAmount] = useState("0")
  const [isConverting, setIsConverting] = useState(false)

  // Effect to calculate converted amount when transfer details change
  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const numAmount = Number(amount)
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency]
      setConvertedAmount((numAmount * rate).toFixed(2))
    } else {
      setConvertedAmount("0")
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates])

  // Handle currency swap
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Handle transfer
  const handleTransfer = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return
    }

    setIsConverting(true)

    // Simulate processing delay
    setTimeout(() => {
      onTransfer(fromCurrency, toCurrency, Number(amount))
      setAmount("")
      setIsConverting(false)
    }, 1500)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <ArrowRightLeft className="h-5 w-5 mr-2 text-indigo-400" />
            Currency Converter
          </CardTitle>
          <CardDescription className="text-white/60">Convert your funds from one currency to another</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from-amount" className="text-white/80">
              Amount to Convert
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                {currencies[fromCurrency].symbol}
              </div>
              <Input
                id="from-amount"
                type="number"
                placeholder="0.00"
                className="pl-8 bg-white/5 border-white/10 text-white"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="text-sm text-white/60">
              Available: {currencies[fromCurrency].symbol}
              {balances[fromCurrency].amount.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="from-currency" className="text-white/80">
              From Currency
            </Label>
            <Select value={fromCurrency} onValueChange={(value) => setFromCurrency(value as CurrencyCode)}>
              <SelectTrigger id="from-currency" className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                {Object.entries(currencies).map(([code, { name, symbol, icon: Icon }]) => (
                  <SelectItem key={code} value={code} className="text-white/80 hover:text-white focus:text-white">
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {symbol} {code} - {name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center my-4">
            <motion.div
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/10 p-2 rounded-full cursor-pointer"
              onClick={handleSwapCurrencies}
            >
              <Repeat className="h-5 w-5 text-white/60" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-currency" className="text-white/80">
              To Currency
            </Label>
            <Select value={toCurrency} onValueChange={(value) => setToCurrency(value as CurrencyCode)}>
              <SelectTrigger id="to-currency" className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                {Object.entries(currencies).map(([code, { name, symbol, icon: Icon }]) => (
                  <SelectItem key={code} value={code} className="text-white/80 hover:text-white focus:text-white">
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {symbol} {code} - {name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-sm text-white/60 mb-1">You will receive</div>
            <motion.div
              className="text-2xl font-bold text-white"
              key={convertedAmount}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currencies[toCurrency].symbol}
              {convertedAmount} {toCurrency}
            </motion.div>
            <div className="text-sm text-white/60 mt-1">
              Rate: 1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)}{" "}
              {toCurrency}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
            onClick={handleTransfer}
            disabled={
              fromCurrency === toCurrency ||
              !amount ||
              isNaN(Number(amount)) ||
              Number(amount) <= 0 ||
              Number(amount) > balances[fromCurrency].amount ||
              isConverting
            }
          >
            {isConverting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Convert Currency
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-400" />
              Exchange Rate Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-white/60">Current Rate</div>
              <div className="text-white text-lg">
                1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-white/60">Processing Time</div>
              <div className="text-white">Instant</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-white/60">Fee</div>
              <div className="text-white">No fee</div>
            </div>

            {(fromCurrency === "CNY" || toCurrency === "CNY") && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-sm">
                Note: CNY has a fixed exchange rate of 1.30 for every 100 units.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-indigo-400" />
              Your Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(balances).map(([currency, data]) => {
              const currencyCode = currency as CurrencyCode
              return (
                <div key={currency} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${currencies[currencyCode].color}/20 flex items-center justify-center mr-3`}
                    >
                      {React.createElement(currencies[currencyCode].icon, { className: "h-4 w-4 text-white/80" })}
                    </div>
                    <div>
                      <div className="text-white">{currencyCode}</div>
                      <div className="text-sm text-white/60">{currencies[currencyCode].name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {currencies[currencyCode].symbol}
                      {data.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-white/60">≈ ${(data.amount / exchangeRates[currency]).toFixed(2)}</div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

