"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface OverviewCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: number
  trendLabel?: string
  className?: string
  onClick?: () => void
}

export default function OverviewCard({ title, value, icon, trend, trendLabel, className, onClick }: OverviewCardProps) {
  const isTrendPositive = trend && trend > 0
  const isTrendNegative = trend && trend < 0

  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/[0.07] transition-colors",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        {icon && <div className="p-2 bg-white/5 rounded-md">{icon}</div>}
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      {trend !== undefined && (
        <div
          className={cn(
            "flex items-center mt-2 text-xs",
            isTrendPositive && "text-green-400",
            isTrendNegative && "text-red-400",
            !isTrendPositive && !isTrendNegative && "text-white/60",
          )}
        >
          {isTrendPositive && <TrendingUp className="h-3 w-3 mr-1" />}
          {isTrendNegative && <TrendingDown className="h-3 w-3 mr-1" />}
          <span>
            {isTrendPositive && "+"}
            {trend}% {trendLabel}
          </span>
        </div>
      )}
    </div>
  )
}

