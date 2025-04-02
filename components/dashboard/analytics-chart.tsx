"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { MoreHorizontal, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AnalyticsChartProps {
  title: string
  data: any[]
  className?: string
}

export default function AnalyticsChart({ title, data, className }: AnalyticsChartProps) {
  const [timeframe, setTimeframe] = useState("month")

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/10 rounded-md p-3 text-sm shadow-lg backdrop-blur-sm">
          <p className="text-white/90 font-medium mb-1">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <p className="text-white/80">
                Imports: <span className="text-indigo-400 font-medium">{payload[0].value}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              <p className="text-white/80">
                Revenue: <span className="text-rose-400 font-medium">${payload[1].value?.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={cn("bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg", className)}>
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px] h-8 bg-white/5 border-white/10 text-white/80 text-xs">
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
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                Export Data as CSV
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                View Detailed Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="imports" fill="rgba(99,102,241,0.8)" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="revenue" fill="rgba(244,63,94,0.8)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 border-t border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded"></div>
            <span className="text-sm text-white/60">Imports</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded"></div>
            <span className="text-sm text-white/60">Revenue</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  )
}