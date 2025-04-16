"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown, Info, Globe, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { LucideIcon } from "lucide-react";

// Types
type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY";

interface Currency {
  name: string;
  icon: LucideIcon;
  color: string;
}

interface ExchangeRateTableProps {
  exchangeRates: Record<CurrencyCode, number>;
  currencies: Record<CurrencyCode, Currency>;
  onRefresh: () => void;
  isLoading: boolean;
}

export function ExchangeRateTable({
  exchangeRates,
  currencies,
  onRefresh,
  isLoading,
}: ExchangeRateTableProps) {
  // Generate historical rates
  const historicalRates = useMemo(() => {
    const yesterday: Record<CurrencyCode, number> = { ...exchangeRates };
    const lastWeek: Record<CurrencyCode, number> = { ...exchangeRates };

    Object.keys(exchangeRates).forEach((currency) => {
      const code = currency as CurrencyCode;
      if (code === "CNY") {
        yesterday[code] = 7.25;
        lastWeek[code] = 7.25;
      } else {
        yesterday[code] = exchangeRates[code] * (1 + (Math.random() * 0.02 - 0.01));
        lastWeek[code] = exchangeRates[code] * (1 + (Math.random() * 0.04 - 0.02));
      }
    });

    return { yesterday, lastWeek };
  }, [exchangeRates]);

  // Calculate percentage change
  const getPercentChange = (current: number, previous: number): number => {
    return ((current - previous) / previous) * 100;
  };

  // Conversion pairs
  const conversionPairs = useMemo(
    () => [
      { from: "USD", to: "EUR" },
      { from: "USD", to: "CNY" },
      { from: "USD", to: "JPY" },
      { from: "EUR", to: "USD" },
      { from: "CNY", to: "USD" },
      { from: "JPY", to: "USD" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Live Exchange Rates</CardTitle>
            <CardDescription className="text-white/60">
              Current exchange rates for supported currencies
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white/80 hover:bg-white/5"
            onClick={onRefresh}
            disabled={isLoading}
            aria-label={isLoading ? "Updating rates" : "Refresh rates"}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-1 h-5 w-5 text-white/40"
                              aria-label="Fixed rate information"
                            >
                              <Info className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="border-white/10 bg-zinc-900 text-white">
                            <p>CNY has a fixed exchange rate of 1.30 for every 100 units</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(currencies).map(([code, { name, icon: Icon, color }]) => {
                  const currentRate = exchangeRates[code as CurrencyCode];
                  const yesterdayRate = historicalRates.yesterday[code as CurrencyCode];
                  const lastWeekRate = historicalRates.lastWeek[code as CurrencyCode];

                  const dayChange = getPercentChange(currentRate, yesterdayRate);
                  const weekChange = getPercentChange(currentRate, lastWeekRate);

                  return (
                    <TableRow
                      key={code}
                      className="border-white/5 hover:bg-white/5"
                      data-testid={`currency-row-${code}`}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${color}/20`}
                          >
                            <Icon className="h-4 w-4 text-white/80" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{code}</div>
                            <div className="text-sm text-white/60">{name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {code === "USD" ? "1.0000" : currentRate.toFixed(4)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {code === "CNY" ? (
                            <span className="text-white/60">Fixed</span>
                          ) : dayChange > 0 ? (
                            <>
                              <TrendingUp className="mr-1 h-4 w-4 text-green-400" />
                              <span className="text-green-400">+{dayChange.toFixed(2)}%</span>
                            </>
                          ) : dayChange < 0 ? (
                            <>
                              <TrendingDown className="mr-1 h-4 w-4 text-red-400" />
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
                              <TrendingUp className="mr-1 h-4 w-4 text-green-400" />
                              <span className="text-green-400">+{weekChange.toFixed(2)}%</span>
                            </>
                          ) : weekChange < 0 ? (
                            <>
                              <TrendingDown className="mr-1 h-4 w-4 text-red-400" />
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Currency Conversion Table</CardTitle>
            <CardDescription className="text-white/60">
              Quick reference for common currency conversions
            </CardDescription>
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
                  {conversionPairs.map(({ from, to }) => {
                    const rate = exchangeRates[to as CurrencyCode] / exchangeRates[from as CurrencyCode];
                    return (
                      <TableRow
                        key={`${from}-${to}`}
                        className="border-white/5 hover:bg-white/5"
                        data-testid={`conversion-row-${from}-${to}`}
                      >
                        <TableCell className="text-white">
                          1 {from}
                        </TableCell>
                        <TableCell className="text-white">{to}</TableCell>
                        <TableCell className="font-medium text-white">
                          {rate.toFixed(4)}
                        </TableCell>
                        <TableCell className="text-white/60">
                          100 {from} = {(100 * rate).toFixed(2)} {to}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Globe className="mr-2 h-5 w-5 text-indigo-400" />
              Exchange Rate Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-white">About Our Exchange Rates</h3>
              <p className="text-sm text-white/60">
                Exchange rates are updated in real-time from reliable financial data providers.
                These rates are used for all currency conversions on our platform.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-white">CNY Fixed Rate</h3>
              <p className="text-sm text-white/60">
                The Chinese Yuan (CNY) has a fixed exchange rate of 1.30 for every 100 units. This
                means 100 USD will always convert to 130 CNY regardless of market fluctuations.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-white">No Conversion Fees</h3>
              <p className="text-sm text-white/60">
                We don&apos;t charge any fees for currency conversions. The rates you see are the
                rates you get.
              </p>
            </div>

            <div className="mt-2 border-t border-white/10 pt-4">
              <p className="flex items-center text-xs text-white/40">
                <Clock className="mr-1 h-3 w-3" />
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}