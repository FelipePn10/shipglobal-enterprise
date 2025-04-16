"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
} from "recharts";

// Types
type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY";

interface ChartData {
  date: string;
  USD: number;
  EUR: number;
  CNY: number;
  JPY: number;
}

interface CurrencyDetails {
  symbol: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface BalanceChartProps {
  data: ChartData[];
  currencies: Record<CurrencyCode, CurrencyDetails>;
}

interface TooltipPayload {
  name: CurrencyCode;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export function BalanceChart({ data, currencies }: BalanceChartProps) {
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line");
  const [timeRange, setTimeRange] = useState<"7d" | "14d" | "30d">("30d");

  // Filter data based on time range
  const filteredData = useCallback(() => {
    switch (timeRange) {
      case "7d":
        return data.slice(-7);
      case "14d":
        return data.slice(-14);
      case "30d":
      default:
        return data;
    }
  }, [data, timeRange])();

  // Format large numbers
  const formatYAxis = useCallback((value: number): string => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return `${value}`;
  }, []);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length && label) {
      return (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-lg">
          <p className="mb-2 text-sm text-white/80">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="mb-1 flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="mr-2 text-xs text-white/80">{entry.name}:</span>
              <span className="text-xs font-medium text-white">
                {entry.name === "CNY" || entry.name === "JPY"
                  ? "¥"
                  : entry.name === "EUR"
                  ? "€"
                  : "$"}
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center text-white">
            <BarChart3 className="mr-2 h-5 w-5 text-indigo-400" />
            Balance History
          </CardTitle>
          <CardDescription className="text-white/60">
            Track your balance changes over time
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Tabs value={chartType} onValueChange={(value: string) => setChartType(value as "line" | "area" | "bar")} className="w-auto">
            <TabsList className="h-8 border-zinc-700 bg-zinc-800">
              <TabsTrigger
                value="line"
                className="h-6 px-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <LineChart className="mr-1 h-3 w-3" />
                Line
              </TabsTrigger>
              <TabsTrigger
                value="area"
                className="h-6 px-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <LineChart className="mr-1 h-3 w-3" />
                Area
              </TabsTrigger>
              <TabsTrigger
                value="bar"
                className="h-6 px-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <BarChart3 className="mr-1 h-3 w-3" />
                Bar
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={timeRange} onValueChange={(value: string) => setTimeRange(value as "7d" | "14d" | "30d")} className="w-auto">
            <TabsList className="h-8 border-zinc-700 bg-zinc-800">
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
          <div
            key={`${chartType}-${timeRange}`}
            className="h-full"
            role="region"
            aria-label={`Balance history ${chartType} chart for ${timeRange}`}
          >
            {chartType === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={filteredData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
                <AreaChart
                  data={filteredData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
                  <Area
                    type="monotone"
                    dataKey="USD"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    stackId="1"
                  />
                  <Area
                    type="monotone"
                    dataKey="EUR"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    stackId="1"
                  />
                  <Area
                    type="monotone"
                    dataKey="CNY"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                    stackId="1"
                  />
                  <Area
                    type="monotone"
                    dataKey="JPY"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    stackId="1"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
          </div>
        </div>

        <div className="mt-4 flex justify-center space-x-6">
          {Object.entries(currencies).map(([code, { icon: Icon, color }]) => (
            <div key={code} className="flex items-center">
              <div
                className={`mr-2 h-3 w-3 rounded-full bg-gradient-to-r ${color.split(" ")[0]}`}
              />
              <div className="flex items-center text-sm text-white/80">
                <Icon className="mr-1 h-3 w-3" />
                {code}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}