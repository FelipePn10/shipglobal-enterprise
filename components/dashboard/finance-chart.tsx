"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

interface FinanceData {
  month: string;
  income: number;
  expenses: number;
}

interface FinanceChartProps {
  title?: string;
  description?: string;
  data?: FinanceData[];
}

const defaultData: FinanceData[] = [
  { month: "Jan", income: 5000, expenses: 3500 },
  { month: "Feb", income: 5200, expenses: 3600 },
  { month: "Mar", income: 5500, expenses: 3800 },
  { month: "Apr", income: 5300, expenses: 3700 },
  { month: "May", income: 5800, expenses: 4000 },
  { month: "Jun", income: 6000, expenses: 4200 },
  { month: "Jul", income: 5900, expenses: 4100 },
  { month: "Aug", income: 6200, expenses: 4300 },
  { month: "Sep", income: 6500, expenses: 4500 },
  { month: "Oct", income: 6300, expenses: 4400 },
  { month: "Nov", income: 6700, expenses: 4600 },
  { month: "Dec", income: 7000, expenses: 4800 },
];

export default function FinanceChart({
  title = "Financial Overview",
  description = "Income and expenses over time",
  data = defaultData,
}: FinanceChartProps) {
  // Memoize chart configuration to prevent recreation
  const chartConfig = useMemo(
    () => ({
      income: { label: "Income", color: "hsl(var(--success))" },
      expenses: { label: "Expenses", color: "hsl(var(--destructive))" },
    }),
    [],
  );

  // Formatter for currency values
  const currencyTickFormatter = (value: number): string => formatCurrency(value);

  // Handle empty data case
  if (!data.length) {
    return (
      <Card className="shadow-md border-border/40 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-white/60">No financial data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-border/40 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} aria-label="Income and expenses over time">
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
              dataKey="income"
              stroke={chartConfig.income.color}
              fill={chartConfig.income.color}
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
      </CardContent>
    </Card>
  );
}