"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, LineChart } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts"

// Types
type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY"

interface BalanceChartProps {
  data: Array<{
    date: string
    USD: number
    EUR: number
    CNY: number
    JPY: number
  }>
  currencies: Record<CurrencyCode, { symbol: string; name: string; icon: LucideIcon; color: string }>
}

export function BalanceChart({ data, currencies }: BalanceChartProps) {
  const [chartType, setChartType] = useState("line")
  const [timeRange, setTimeRange] = useState("30d")

  // Filter data based on time range
  const filteredData = (() => {
    switch (timeRange) {
      case "7d":
        return data.slice(-7)
      case "14d":
        return data.slice(-14)
      case "30d":
      default:
        return data
    }
  })()

  // Format large numbers
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-lg">
          <p className="text-white/80 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              <span className="text-white/80 text-xs mr-2">{entry.name}:</span>
              <span className="text-white font-medium text-xs">
                {entry.name === "CNY" || entry.name === "JPY" ? "¥" : entry.name === "EUR" ? "€" : "$"}
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-400" />
            Balance History
          </CardTitle>
          <CardDescription className="text-white/60">Track your balance changes over time</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Tabs value={chartType} onValueChange={setChartType} className="w-auto">
            <TabsList className="bg-zinc-800 border-zinc-700 h-8">
              <TabsTrigger
                value="line"
                className="h-6 px-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <LineChart className="h-3 w-3 mr-1" />
                Line
              </TabsTrigger>
              <TabsTrigger
                value="area"
                className="h-6 px-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <LineChart className="h-3 w-3 mr-1" />
                Area
              </TabsTrigger>
              <TabsTrigger
                value="bar"
                className="h-6 px-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Bar
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
            <TabsList className="bg-zinc-800 border-zinc-700 h-8">
              <TabsTrigger
                value="7d"
                className="h-6 px-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                7D
              </TabsTrigger>
              <TabsTrigger
                value="14d"
                className="h-6 px-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                14D
              </TabsTrigger>
              <TabsTrigger
                value="30d"
                className="h-6 px-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                30D
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <motion.div
            key={`${chartType}-${timeRange}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {chartType === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    tick={{ fill: "#999", fontSize: 12 }}
                    tickLine={{ stroke: "#666" }}
                  />
                  <YAxis
                    stroke="#666"
                    tick={{ fill: "#999", fontSize: 12 }}
                    tickLine={{ stroke: "#666" }}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="USD"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3b82f6", stroke: "#3b82f6" }}
                    activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="EUR"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#8b5cf6", stroke: "#8b5cf6" }}
                    activeDot={{ r: 5, stroke: "#8b5cf6", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="CNY"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#ef4444", stroke: "#ef4444" }}
                    activeDot={{ r: 5, stroke: "#ef4444", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="JPY"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#10b981", stroke: "#10b981" }}
                    activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 2 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}

            {chartType === "area" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    tick={{ fill: "#999", fontSize: 12 }}
                    tickLine={{ stroke: "#666" }}
                  />
                  <YAxis
                    stroke="#666"
                    tick={{ fill: "#999", fontSize: 12 }}
                    tickLine={{ stroke: "#666" }}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="USD" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} stackId="1" />
                  <Area type="monotone" dataKey="EUR" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} stackId="1" />
                  <Area type="monotone" dataKey="CNY" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} stackId="1" />
                  <Area type="monotone" dataKey="JPY" stroke="#10b981" fill="#10b981" fillOpacity={0.2} stackId="1" />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    tick={{ fill: "#999", fontSize: 12 }}
                    tickLine={{ stroke: "#666" }}
                  />
                  <YAxis
                    stroke="#666"
                    tick={{ fill: "#999", fontSize: 12 }}
                    tickLine={{ stroke: "#666" }}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="USD" fill="#3b82f6" />
                  <Bar dataKey="EUR" fill="#8b5cf6" />
                  <Bar dataKey="CNY" fill="#ef4444" />
                  <Bar dataKey="JPY" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        <div className="flex justify-center mt-4 space-x-6">
          {Object.entries(currencies).map(([code, { icon: Icon, color }]) => (
            <div key={code} className="flex items-center">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color.split(" ")[0]} mr-2`} />
              <div className="flex items-center text-white/80 text-sm">
                <Icon className="h-3 w-3 mr-1" />
                {code}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

