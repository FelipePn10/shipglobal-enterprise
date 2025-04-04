"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowRightLeft, History, TrendingUp, Download, BarChart3, Zap, Share2 } from "lucide-react"

interface QuickActionsProps {
  onDeposit: () => void
  onConvert: () => void
  onViewHistory: () => void
  onViewRates: () => void
}

export function QuickActions({ onDeposit, onConvert, onViewHistory, onViewRates }: QuickActionsProps) {
  const actions = [
    {
      title: "New Deposit",
      description: "Add funds to your account",
      icon: Plus,
      color: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/20",
      gradient: "from-indigo-500 to-blue-500",
      onClick: onDeposit,
    },
    {
      title: "Convert Currency",
      description: "Exchange between currencies",
      icon: ArrowRightLeft,
      color: "from-violet-500/10 to-violet-500/5 border-violet-500/20 hover:bg-violet-500/20",
      gradient: "from-violet-500 to-purple-500",
      onClick: onConvert,
    },
    {
      title: "Transaction History",
      description: "View all transactions",
      icon: History,
      color: "from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:bg-blue-500/20",
      gradient: "from-blue-500 to-cyan-500",
      onClick: onViewHistory,
    },
    {
      title: "Exchange Rates",
      description: "View current rates",
      icon: TrendingUp,
      color: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/20",
      gradient: "from-emerald-500 to-green-500",
      onClick: onViewRates,
    },
    {
      title: "Export Report",
      description: "Download balance report",
      icon: Download,
      color: "from-amber-500/10 to-amber-500/5 border-amber-500/20 hover:bg-amber-500/20",
      gradient: "from-amber-500 to-yellow-500",
      onClick: () => {},
    },
    {
      title: "Analytics",
      description: "View detailed analytics",
      icon: BarChart3,
      color: "from-rose-500/10 to-rose-500/5 border-rose-500/20 hover:bg-rose-500/20",
      gradient: "from-rose-500 to-pink-500",
      onClick: () => {},
    },
    {
      title: "Quick Transfer",
      description: "Send money instantly",
      icon: Zap,
      color: "from-orange-500/10 to-orange-500/5 border-orange-500/20 hover:bg-orange-500/20",
      gradient: "from-orange-500 to-red-500",
      onClick: () => {},
    },
    {
      title: "Share Balance",
      description: "Share with others",
      icon: Share2,
      color: "from-sky-500/10 to-sky-500/5 border-sky-500/20 hover:bg-sky-500/20",
      gradient: "from-sky-500 to-blue-500",
      onClick: () => {},
    },
  ]

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                scale: { type: "spring", stiffness: 400, damping: 10 },
              }}
              className={`relative flex flex-col items-center justify-center h-24 bg-gradient-to-r ${action.color} border text-white rounded-xl p-3 transition-all overflow-hidden group`}
              onClick={action.onClick}
            >
              {/* Animated gradient background on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-20`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_70%)] opacity-60" />
              </motion.div>

              <div className="relative z-10 flex flex-col items-center">
                <action.icon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">{action.title}</span>
                <span className="text-xs text-white/60">{action.description}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

