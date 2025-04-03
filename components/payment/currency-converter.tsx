"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Euro, JapaneseYenIcon as Yen } from "lucide-react"

// Exchange rates (would typically come from an API)
const EXCHANGE_RATES = {
  EUR: 0.92,
  CNY: 7.23,
  JPY: 151.67,
}

interface CurrencyConverterProps {
  amount: number
}

export function CurrencyConverter({ amount }: CurrencyConverterProps) {
  const [eurAmount, setEurAmount] = useState(0)
  const [cnyAmount, setCnyAmount] = useState(0)
  const [jpyAmount, setJpyAmount] = useState(0)

  useEffect(() => {
    // Calculate conversions
    setEurAmount(amount * EXCHANGE_RATES.EUR)
    setCnyAmount(amount * EXCHANGE_RATES.CNY)
    setJpyAmount(amount * EXCHANGE_RATES.JPY)
  }, [amount])

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Real-time Currency Conversion</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                  <Euro className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-medium">Euro</p>
                  <p className="text-xs text-muted-foreground">EUR</p>
                </div>
              </div>
              <p className="font-bold">€{eurAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-3">
                  <Yen className="h-5 w-5 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <p className="text-sm font-medium">Chinese Yuan</p>
                  <p className="text-xs text-muted-foreground">CNY</p>
                </div>
              </div>
              <p className="font-bold">¥{cnyAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                  <Yen className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-sm font-medium">Japanese Yen</p>
                  <p className="text-xs text-muted-foreground">JPY</p>
                </div>
              </div>
              <p className="font-bold">¥{jpyAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

