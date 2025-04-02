"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  AreaChart,
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  Bar,
  Line,
} from "@/components/ui/chart"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface AnalyticsData {
  month: string
  revenue: number
  expenses: number
  profit: number
  imports: number
  exports: number
}

interface ImprovedAnalyticsChartProps {
  title?: string
  description?: string
  data?: AnalyticsData[]
  defaultView?: "revenue" | "volume" | "profit"
}

const defaultData: AnalyticsData[] = [
  { month: "Jan", revenue: 4500, expenses: 3200, profit: 1300, imports: 12, exports: 8 },
  { month: "Feb", revenue: 5200, expenses: 3800, profit: 1400, imports: 15, exports: 10 },
  { month: "Mar", revenue: 6100, expenses: 4100, profit: 2000, imports: 18, exports: 12 },
  { month: "Apr", revenue: 5800, expenses: 4300, profit: 1500, imports: 16, exports: 11 },
  { month: "May", revenue: 7200, expenses: 4800, profit: 2400, imports: 22, exports: 15 },
  { month: "Jun", revenue: 8100, expenses: 5200, profit: 2900, imports: 25, exports: 18 },
  { month: "Jul", revenue: 7800, expenses: 5100, profit: 2700, imports: 24, exports: 17 },
  { month: "Aug", revenue: 8500, expenses: 5400, profit: 3100, imports: 28, exports: 20 },
  { month: "Sep", revenue: 9200, expenses: 5800, profit: 3400, imports: 30, exports: 22 },
  { month: "Oct", revenue: 8800, expenses: 5600, profit: 3200, imports: 27, exports: 19 },
  { month: "Nov", revenue: 9500, expenses: 6000, profit: 3500, imports: 32, exports: 23 },
  { month: "Dec", revenue: 10200, expenses: 6500, profit: 3700, imports: 35, exports: 25 },
]

export const ImprovedAnalyticsChart: React.FC<ImprovedAnalyticsChartProps> = ({
  title = "Business Performance",
  description = "Overview of your business metrics over time",
  data = defaultData,
  defaultView = "revenue",
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultView)

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--primary))" },
    expenses: { label: "Expenses", color: "hsl(var(--destructive))" },
    profit: { label: "Profit", color: "hsl(var(--success))" },
    imports: { label: "Imports", color: "hsl(var(--primary))" },
    exports: { label: "Exports", color: "hsl(var(--secondary))" },
  }

  // Create wrapper functions that match Recharts' tickFormatter signature
  const currencyTickFormatter = (value: any, _index: number): string => 
    formatCurrency(value as number)
  const numberTickFormatter = (value: any, _index: number): string => 
    formatNumber(value as number)

  return (
    <Card className="shadow-md border-border/40 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="profit">Profit</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="pt-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis width={65} tickFormatter={currencyTickFormatter} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  }
                />
                <ChartLegend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={chartConfig.revenue.color}
                  fill={chartConfig.revenue.color}
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke={chartConfig.expenses.color}
                  fill={chartConfig.expenses.color}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="profit" className="pt-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis width={65} tickFormatter={currencyTickFormatter} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  }
                />
                <ChartLegend />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke={chartConfig.profit.color}
                />
              </LineChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="volume" className="pt-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis width={40} tickFormatter={numberTickFormatter} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatNumber(value as number)}
                    />
                  }
                />
                <ChartLegend />
                <Bar
                  dataKey="imports"
                  fill={chartConfig.imports.color}
                />
                <Bar
                  dataKey="exports"
                  fill={chartConfig.exports.color}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ImprovedAnalyticsChart