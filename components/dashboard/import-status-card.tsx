"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface ImportStatusCardProps {
  importId: string
  title: string
  status: "pending" | "processing" | "customs" | "shipping" | "delivered" | "issue"
  origin: string
  destination: string
  eta?: string
  lastUpdated: string
  progress?: number
  className?: string
  onClick?: () => void
}

export default function ImportStatusCard({
  importId,
  title,
  status,
  origin,
  destination,
  eta,
  lastUpdated,
  progress = 0,
  className,
  onClick,
}: ImportStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "processing":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "customs":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "shipping":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
      case "delivered":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "issue":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "processing":
        return "Processing"
      case "customs":
        return "In Customs"
      case "shipping":
        return "Shipping"
      case "delivered":
        return "Delivered"
      case "issue":
        return "Issue Detected"
      default:
        return status
    }
  }

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
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-xs text-white/60">ID: {importId}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("px-2 py-1 rounded text-xs font-medium border", getStatusColor(status))}>
            {getStatusText(status)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                Track Shipment
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                View Documents
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                Contact Support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs text-white/60">Origin</p>
          <p className="text-sm text-white/90">{origin}</p>
        </div>
        <div>
          <p className="text-xs text-white/60">Destination</p>
          <p className="text-sm text-white/90">{destination}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-white/60">Progress</span>
          <span className="text-white/90">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex justify-between items-center text-xs">
        {eta && (
          <div className="text-white/60">
            ETA: <span className="text-white/90">{eta}</span>
          </div>
        )}
        <div className="text-white/60">
          Updated: <span className="text-white/90">{lastUpdated}</span>
        </div>
      </div>
    </div>
  )
}

