"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ImportStatusCard from "@/components/dashboard/import-status-card"
import { Button } from "@/components/ui/button"
import { Package, Search, Plus, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ImportsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for imports
  const importData = [
    {
      id: "IMP-2023-0042",
      title: "Electronics Shipment",
      status: "shipping" as const,
      origin: "Shenzhen, China",
      destination: "Los Angeles, USA",
      eta: "Oct 15, 2023",
      lastUpdated: "2 hours ago",
      progress: 65,
    },
    {
      id: "IMP-2023-0041",
      title: "Furniture Import",
      status: "customs" as const,
      origin: "Milan, Italy",
      destination: "New York, USA",
      eta: "Oct 12, 2023",
      lastUpdated: "5 hours ago",
      progress: 45,
    },
    {
      id: "IMP-2023-0040",
      title: "Textile Materials",
      status: "issue" as const,
      origin: "Mumbai, India",
      destination: "London, UK",
      eta: "Delayed",
      lastUpdated: "1 day ago",
      progress: 30,
    },
    {
      id: "IMP-2023-0039",
      title: "Automotive Parts",
      status: "processing" as const,
      origin: "Stuttgart, Germany",
      destination: "Detroit, USA",
      eta: "Oct 18, 2023",
      lastUpdated: "3 hours ago",
      progress: 25,
    },
    {
      id: "IMP-2023-0038",
      title: "Food Products",
      status: "pending" as const,
      origin: "Barcelona, Spain",
      destination: "Miami, USA",
      eta: "Oct 25, 2023",
      lastUpdated: "1 day ago",
      progress: 10,
    },
    {
      id: "IMP-2023-0037",
      title: "Medical Supplies",
      status: "delivered" as const,
      origin: "Zurich, Switzerland",
      destination: "Boston, USA",
      eta: "Delivered",
      lastUpdated: "2 days ago",
      progress: 100,
    },
    {
      id: "IMP-2023-0036",
      title: "Office Furniture",
      status: "delivered" as const,
      origin: "Stockholm, Sweden",
      destination: "Chicago, USA",
      eta: "Delivered",
      lastUpdated: "3 days ago",
      progress: 100,
    },
    {
      id: "IMP-2023-0035",
      title: "Clothing Shipment",
      status: "customs" as const,
      origin: "Bangkok, Thailand",
      destination: "Vancouver, Canada",
      eta: "Oct 14, 2023",
      lastUpdated: "6 hours ago",
      progress: 50,
    },
    {
      id: "IMP-2023-0034",
      title: "Machinery Parts",
      status: "shipping" as const,
      origin: "Tokyo, Japan",
      destination: "Seattle, USA",
      eta: "Oct 17, 2023",
      lastUpdated: "12 hours ago",
      progress: 60,
    },
  ]

  const filteredImports = importData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchQuery.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && item.status === statusFilter
  })

  const handleImportClick = (id: string) => {
    router.push(`/dashboard/imports/${id}`)
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Imports</h1>
            <p className="text-white/60">Manage and track all your import shipments</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
              <Calendar className="h-4 w-4 mr-2" />
              Oct 10, 2023
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Import
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search imports by ID, title, origin, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md pl-9 pr-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white/80">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
            <SelectItem value="all" className="text-white/80 hover:text-white focus:text-white">
              All Statuses
            </SelectItem>
            <SelectItem value="pending" className="text-white/80 hover:text-white focus:text-white">
              Pending
            </SelectItem>
            <SelectItem value="processing" className="text-white/80 hover:text-white focus:text-white">
              Processing
            </SelectItem>
            <SelectItem value="customs" className="text-white/80 hover:text-white focus:text-white">
              In Customs
            </SelectItem>
            <SelectItem value="shipping" className="text-white/80 hover:text-white focus:text-white">
              Shipping
            </SelectItem>
            <SelectItem value="delivered" className="text-white/80 hover:text-white focus:text-white">
              Delivered
            </SelectItem>
            <SelectItem value="issue" className="text-white/80 hover:text-white focus:text-white">
              Issues
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredImports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImports.map((item) => (
            <ImportStatusCard
              key={item.id}
              id={item.id}
              title={item.title}
              status={item.status}
              origin={item.origin}
              destination={item.destination}
              eta={item.eta}
              lastUpdated={item.lastUpdated}
              progress={item.progress}
              onClick={() => handleImportClick(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-16 w-16 text-white/20 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No imports found</h3>
          <p className="text-white/60 max-w-md">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters to find what you're looking for."
              : "You don't have any imports yet. Create your first import to get started."}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Button className="mt-6 bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Import
            </Button>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

