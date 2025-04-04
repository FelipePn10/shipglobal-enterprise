"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown, Info, Globe, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { LucideIcon } from "lucide-react"

// Types
type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY"

interface ExchangeRateTableProps {
  exchangeRates: Record<string, number>
  currencies: Record<CurrencyCode, { symbol: string; name: string; icon: LucideIcon; color: string }>
  onRefresh: () => void
  isLoading: boolean
}

export function ExchangeRateTable({ exchangeRates, currencies, onRefresh, isLoading }: ExchangeRateTableProps) {
  // Generate random historical rates for demo purposes
  const [historicalRates] = useState(() => {
    const yesterday = { ...exchangeRates }
    const lastWeek = { ...exchangeRates }

    // Add small random variations to create historical data
    Object.keys(exchangeRates).forEach((currency) => {
      if (currency === "CNY") {
        // CNY has fixed rate
        yesterday[currency] = 7.25
        lastWeek[currency] = 7.25
      } else {
        yesterday[currency] = exchangeRates[currency] * (1 + (Math.random() * 0.02 - 0.01))
        lastWeek[currency] = exchangeRates[currency] * (1 + (Math.random() * 0.04 - 0.02))
      }
    })

    return { yesterday, lastWeek }
  })

  // Calculate percentage change
  const getPercentChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Live Exchange Rates</CardTitle>
            <CardDescription className="text-white/60">
              Current exchange rates for all supported currencies
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white/80 hover:bg-white/5"
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Rates
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/60">Currency</TableHead>
                  <TableHead className="text-white/60">Current Rate</TableHead>
                  <TableHead className="text-white/60">24h Change</TableHead>
                  <TableHead className="text-white/60">7d Change</TableHead>
                  <TableHead className="text-white/60">
                    <div className="flex items-center">
                      Fixed Rate
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 text-white/40">
                              <Info className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-900 border-white/10 text-white">
                            <p>CNY has a fixed exchange rate of 1.30 for every 100 units</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(currencies).map(([code, { name, symbol, icon: Icon, color }]) => {
                  const currentRate = exchangeRates[code]
                  const yesterdayRate = historicalRates.yesterday[code]
                  const lastWeekRate = historicalRates.lastWeek[code]

                  const dayChange = getPercentChange(currentRate, yesterdayRate)
                  const weekChange = getPercentChange(currentRate, lastWeekRate)

                  return (
                    <TableRow key={code} className="border-white/5 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${color}/20 flex items-center justify-center mr-3`}
                          >
                            <Icon className="h-4 w-4 text-white/80" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{code}</div>
                            <div className="text-sm text-white/60">{name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {code === "USD" ? "1.0000" : currentRate.toFixed(4)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {code === "CNY" ? (
                            <span className="text-white/60">Fixed</span>
                          ) : dayChange > 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                              <span className="text-green-400">+{dayChange.toFixed(2)}%</span>
                            </>
                          ) : dayChange < 0 ? (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                              <span className="text-red-400">{dayChange.toFixed(2)}%</span>
                            </>
                          ) : (
                            <span className="text-white/60">0.00%</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {code === "CNY" ? (
                            <span className="text-white/60">Fixed</span>
                          ) : weekChange > 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                              <span className="text-green-400">+{weekChange.toFixed(2)}%</span>
                            </>
                          ) : weekChange < 0 ? (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                              <span className="text-red-400">{weekChange.toFixed(2)}%</span>
                            </>
                          ) : (
                            <span className="text-white/60">0.00%</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {code === "CNY" ? (
                          <span className="text-amber-400">Yes (1.30 per 100 units)</span>
                        ) : (
                          <span className="text-white/60">No</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Currency Conversion Table</CardTitle>
            <CardDescription className="text-white/60">Quick reference for common currency conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/60">From</TableHead>
                    <TableHead className="text-white/60">To</TableHead>
                    <TableHead className="text-white/60">Rate</TableHead>
                    <TableHead className="text-white/60">Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { from: "USD", to: "EUR" },
                    { from: "USD", to: "CNY" },
                    { from: "USD", to: "JPY" },
                    { from: "EUR", to: "USD" },
                    { from: "CNY", to: "USD" },
                    { from: "JPY", to: "USD" },
                  ].map(({ from, to }) => {
                    const rate = exchangeRates[to] / exchangeRates[from]
                    return (
                      <TableRow key={`${from}-${to}`} className="border-white/5 hover:bg-white/5">
                        <TableCell className="text-white">
                          {currencies[from as CurrencyCode].symbol}1 {from}
                        </TableCell>
                        <TableCell className="text-white">{to}</TableCell>
                        <TableCell className="text-white font-medium">{rate.toFixed(4)}</TableCell>
                        <TableCell className="text-white/60">
                          {currencies[from as CurrencyCode].symbol}100 = {currencies[to as CurrencyCode].symbol}
                          {(100 * rate).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="h-5 w-5 mr-2 text-indigo-400" />
              Exchange Rate Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">About Our Exchange Rates</h3>
              <p className="text-white/60 text-sm">
                Exchange rates are updated in real-time from reliable financial data providers. These rates are used for
                all currency conversions on our platform.
              </p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">CNY Fixed Rate</h3>
              <p className="text-white/60 text-sm">
                The Chinese Yuan (CNY) has a fixed exchange rate of 1.30 for every 100 units as specified. This means
                100 USD will always convert to 130 CNY regardless of market fluctuations.
              </p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">No Conversion Fees</h3>
              <p className="text-white/60 text-sm">
                We don't charge any fees for currency conversions. The rates you see are the rates you get.
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-white/10">
              <p className="text-white/40 text-xs flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

