// app/dashboard/finances/page.tsx
"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import FinancialSummary from "@/components/dashboard/financial-summary"
import AnalyticsChart from "@/components/dashboard/analytics-chart"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Download,
  FileText,
  Plus,
  Filter,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportFinancialSummaryPDF } from "@/lib/pdf-export"

interface FinancialItem {
  id: string
  description: string
  amount: number
  date: string
  status: "paid" | "pending"
  type: "fee" | "invoice" | "payment"
}

export default function FinancesPage() {
  const [timeframe, setTimeframe] = useState("month")

  const financialData: { items: FinancialItem[]; totalPaid: number; totalPending: number } = {
    items: [
      {
        id: "fin-001",
        description: "Customs Clearance Fee",
        amount: 1250,
        date: "Oct 5, 2023",
        status: "paid",
        type: "fee",
      },
      {
        id: "fin-002",
        description: "Electronics Shipment Invoice",
        amount: 12500,
        date: "Oct 3, 2023",
        status: "pending",
        type: "invoice",
      },
      {
        id: "fin-003",
        description: "Furniture Import Payment",
        amount: 8750,
        date: "Sep 28, 2023",
        status: "paid",
        type: "payment",
      },
      {
        id: "fin-004",
        description: "Textile Materials Refund",
        amount: 3200,
        date: "Sep 25, 2023",
        status: "pending",
        type: "payment",
      },
      {
        id: "fin-005",
        description: "Shipping Insurance",
        amount: 950,
        date: "Sep 20, 2023",
        status: "paid",
        type: "fee",
      },
      {
        id: "fin-006",
        description: "Warehouse Storage Fee",
        amount: 1800,
        date: "Sep 18, 2023",
        status: "paid",
        type: "fee",
      },
      {
        id: "fin-007",
        description: "Automotive Parts Invoice",
        amount: 9500,
        date: "Sep 15, 2023",
        status: "paid",
        type: "invoice",
      },
      {
        id: "fin-008",
        description: "Customs Duty",
        amount: 2750,
        date: "Sep 12, 2023",
        status: "paid",
        type: "fee",
      },
      {
        id: "fin-009",
        description: "Freight Forwarding",
        amount: 4200,
        date: "Sep 10, 2023",
        status: "paid",
        type: "fee",
      },
      {
        id: "fin-010",
        description: "Import License Renewal",
        amount: 1500,
        date: "Sep 5, 2023",
        status: "paid",
        type: "fee",
      },
    ],
    totalPaid: 30700,
    totalPending: 15700,
  }

  const invoices = financialData.items.filter((item) => item.type === "invoice")
  const payments = financialData.items.filter((item) => item.type === "payment")
  const fees = financialData.items.filter((item) => item.type === "fee")
  const pending = financialData.items.filter((item) => item.status === "pending")

  const analyticsData = [
    { name: "Jan", imports: 12, revenue: 18000 },
    { name: "Feb", imports: 15, revenue: 22500 },
    { name: "Mar", imports: 18, revenue: 27000 },
    { name: "Apr", imports: 16, revenue: 24000 },
    { name: "May", imports: 21, revenue: 31500 },
    { name: "Jun", imports: 24, revenue: 36000 },
    { name: "Jul", imports: 22, revenue: 33000 },
    { name: "Aug", imports: 25, revenue: 37500 },
    { name: "Sep", imports: 28, revenue: 42000 },
    { name: "Oct", imports: 30, revenue: 45000 },
    { name: "Nov", imports: 0, revenue: 0 },
    { name: "Dec", imports: 0, revenue: 0 },
  ]

  const summaryCards = [
    {
      title: "Total Revenue",
      value: "$316,500",
      trend: 12.5,
      trendLabel: "vs last month",
      icon: <DollarSign className="h-5 w-5 text-white/80" />,
    },
    {
      title: "Pending Payments",
      value: "$15,700",
      trend: -5.2,
      trendLabel: "vs last month",
      icon: <CreditCard className="h-5 w-5 text-white/80" />,
    },
    {
      title: "Total Expenses",
      value: "$124,200",
      trend: 8.3,
      trendLabel: "vs last month",
      icon: <ArrowUpRight className="h-5 w-5 text-white/80" />,
    },
    {
      title: "Net Profit",
      value: "$192,300",
      trend: 15.7,
      trendLabel: "vs last month",
      icon: <ArrowDownRight className="h-5 w-5 text-white/80" />,
    },
  ]

  const handleExportAllPDF = () => {
    exportFinancialSummaryPDF(financialData.items, financialData.totalPaid, financialData.totalPending, timeframe)
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Finances</h1>
            <p className="text-white/60">Manage your import finances and transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white/80">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                <SelectItem value="week" className="text-white/80 hover:text-white focus:text-white">
                  This Week
                </SelectItem>
                <SelectItem value="month" className="text-white/80 hover:text-white focus:text-white">
                  This Month
                </SelectItem>
                <SelectItem value="quarter" className="text-white/80 hover:text-white focus:text-white">
                  This Quarter
                </SelectItem>
                <SelectItem value="year" className="text-white/80 hover:text-white focus:text-white">
                  This Year
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
              <Calendar className="h-4 w-4 mr-2" />
              Oct 10, 2023
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/60">{item.title}</p>
                <h3 className="text-2xl font-semibold mt-1 text-white">{item.value}</h3>
              </div>
              <div className="p-2 bg-gradient-to-r from-indigo-500/20 to-rose-500/20 rounded-md">{item.icon}</div>
            </div>

            <div className="mt-3 flex items-center">
              <span
                className={`flex items-center text-xs font-medium ${
                  item.trend > 0 ? "text-green-400" : item.trend < 0 ? "text-red-400" : "text-white/60"
                }`}
              >
                {item.trend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {item.trend > 0 ? "+" : ""}
                {item.trend}%
              </span>
              {item.trendLabel && <span className="text-xs text-white/60 ml-1">{item.trendLabel}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AnalyticsChart title="Financial Performance" data={analyticsData} />

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-4">
            <Button className="flex flex-col items-center justify-center h-24 bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 hover:bg-indigo-500/20 text-white">
              <FileText className="h-6 w-6 mb-2" />
              <span>Generate Invoice</span>
            </Button>
            <Button className="flex flex-col items-center justify-center h-24 bg-gradient-to-r from-rose-500/10 to-rose-500/5 border border-rose-500/20 hover:bg-rose-500/20 text-white">
              <DollarSign className="h-6 w-6 mb-2" />
              <span>Record Payment</span>
            </Button>
            <Button
              className="flex flex-col items-center justify-center h-24 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 hover:bg-amber-500/20 text-white"
              onClick={handleExportAllPDF}
            >
              <Download className="h-6 w-6 mb-2" />
              <span>Export Report</span>
            </Button>
            <Button className="flex flex-col items-center justify-center h-24 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/20 text-white">
              <Filter className="h-6 w-6 mb-2" />
              <span>View Analytics</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            All Transactions
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Invoices
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="fees"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Fees
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Pending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <FinancialSummary
            items={financialData.items}
            totalPaid={financialData.totalPaid}
            totalPending={financialData.totalPending}
          />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <FinancialSummary
            items={invoices}
            totalPaid={invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)}
            totalPending={invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)}
          />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <FinancialSummary
            items={payments}
            totalPaid={payments.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)}
            totalPending={payments.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)}
          />
        </TabsContent>

        <TabsContent value="fees" className="mt-6">
          <FinancialSummary
            items={fees}
            totalPaid={fees.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)}
            totalPending={fees.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <FinancialSummary
            items={pending}
            totalPaid={0}
            totalPending={pending.reduce((sum, i) => sum + i.amount, 0)}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}