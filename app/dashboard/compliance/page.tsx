"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileCheck, AlertTriangle, CheckCircle, Clock, Search, Filter, Download, Calendar } from "lucide-react"

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for compliance requirements
  const complianceData = [
    {
      id: "comp-001",
      title: "Import License",
      description: "Valid import license for electronics components",
      status: "valid",
      expiryDate: "Dec 15, 2023",
      daysRemaining: 65,
      documents: ["Import_License_2023.pdf"],
      category: "licenses",
    },
    {
      id: "comp-002",
      title: "Customs Registration",
      description: "Customs registration for international trade",
      status: "valid",
      expiryDate: "Feb 28, 2024",
      daysRemaining: 140,
      documents: ["Customs_Registration_Certificate.pdf"],
      category: "registrations",
    },
    {
      id: "comp-003",
      title: "Product Safety Certification",
      description: "Safety certification for electronic products",
      status: "pending",
      expiryDate: "N/A",
      daysRemaining: null,
      documents: ["Safety_Certification_Application.pdf"],
      category: "certifications",
    },
    {
      id: "comp-004",
      title: "Hazardous Materials Handling",
      description: "Certification for handling hazardous materials",
      status: "expiring",
      expiryDate: "Oct 30, 2023",
      daysRemaining: 20,
      documents: ["Hazmat_Handling_Certificate.pdf"],
      category: "certifications",
    },
    {
      id: "comp-005",
      title: "Trade Agreement Compliance",
      description: "Compliance with international trade agreements",
      status: "valid",
      expiryDate: "Jul 15, 2024",
      daysRemaining: 280,
      documents: ["Trade_Agreement_Compliance.pdf"],
      category: "agreements",
    },
    {
      id: "comp-006",
      title: "Environmental Compliance",
      description: "Compliance with environmental regulations",
      status: "valid",
      expiryDate: "Apr 10, 2024",
      daysRemaining: 180,
      documents: ["Environmental_Compliance_Certificate.pdf"],
      category: "certifications",
    },
    {
      id: "comp-007",
      title: "Importer of Record Registration",
      description: "Registration as an importer of record",
      status: "valid",
      expiryDate: "Jan 20, 2024",
      daysRemaining: 100,
      documents: ["Importer_Registration.pdf"],
      category: "registrations",
    },
    {
      id: "comp-008",
      title: "Anti-Dumping Compliance",
      description: "Compliance with anti-dumping regulations",
      status: "expired",
      expiryDate: "Sep 30, 2023",
      daysRemaining: 0,
      documents: ["Anti_Dumping_Compliance.pdf"],
      category: "agreements",
    },
  ]

  // Filter compliance items
  const filteredItems = complianceData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const validItems = filteredItems.filter((item) => item.status === "valid")
  const expiringItems = filteredItems.filter((item) => item.status === "expiring")
  const pendingItems = filteredItems.filter((item) => item.status === "pending")
  const expiredItems = filteredItems.filter((item) => item.status === "expired")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "expiring":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "pending":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
      case "expired":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "expiring":
        return <Clock className="h-5 w-5 text-amber-400" />
      case "pending":
        return <Clock className="h-5 w-5 text-indigo-400" />
      case "expired":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      default:
        return <FileCheck className="h-5 w-5 text-white/80" />
    }
  }

  const getProgressColor = (daysRemaining: number | null) => {
    if (daysRemaining === null) return "[&_[role=progressbar]]:bg-indigo-500"
    if (daysRemaining <= 0) return "[&_[role=progressbar]]:bg-red-500"
    if (daysRemaining <= 30) return "[&_[role=progressbar]]:bg-amber-500"
    return "[&_[role=progressbar]]:bg-green-500"
  }

  const getProgressValue = (daysRemaining: number | null) => {
    if (daysRemaining === null) return 50 // Pending items
    if (daysRemaining <= 0) return 100 // Expired items
    if (daysRemaining >= 365) return 0 // Far from expiry
    return 100 - Math.round((daysRemaining / 365) * 100)
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Compliance</h1>
            <p className="text-white/60">Manage import compliance requirements and certifications</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
              <Calendar className="h-4 w-4 mr-2" />
              Oct 10, 2023
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              <FileCheck className="h-4 w-4 mr-2" />
              New Compliance Item
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-white/60">Valid</p>
              <h3 className="text-2xl font-semibold mt-1 text-white">{validItems.length}</h3>
            </div>
            <div className="p-2 bg-green-500/20 rounded-md border border-green-500/30">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-white/60">Expiring Soon</p>
              <h3 className="text-2xl font-semibold mt-1 text-white">{expiringItems.length}</h3>
            </div>
            <div className="p-2 bg-amber-500/20 rounded-md border border-amber-500/30">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-white/60">Pending</p>
              <h3 className="text-2xl font-semibold mt-1 text-white">{pendingItems.length}</h3>
            </div>
            <div className="p-2 bg-indigo-500/20 rounded-md border border-indigo-500/30">
              <Clock className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-white/60">Expired</p>
              <h3 className="text-2xl font-semibold mt-1 text-white">{expiredItems.length}</h3>
            </div>
            <div className="p-2 bg-red-500/20 rounded-md border border-red-500/30">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search compliance items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md pl-9 pr-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>

        <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>

        <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            All Items
          </TabsTrigger>
          <TabsTrigger
            value="valid"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Valid
          </TabsTrigger>
          <TabsTrigger
            value="expiring"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Expiring Soon
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Expired
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-md ${getStatusColor(item.status)}`}>{getStatusIcon(item.status)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-white/60 mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        {item.expiryDate !== "N/A" && (
                          <p className="text-sm text-white/80">
                            <span className="text-white/60">Expiry: </span>
                            {item.expiryDate}
                          </p>
                        )}
                        {item.documents.map((doc, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="text-white/70 hover:text-white p-0 h-auto"
                          >
                            <FileCheck className="h-4 w-4 mr-1" />
                            {doc}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-48">
                    {item.daysRemaining !== null ? (
                      <div>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-white/60">Expiry Progress</span>
                          {item.daysRemaining > 0 ? (
                            <span className="text-white/90">{item.daysRemaining} days left</span>
                          ) : (
                            <span className="text-red-400">Expired</span>
                          )}
                        </div>
                        <Progress
                          value={getProgressValue(item.daysRemaining)}
                          className={`h-2 bg-white/10 ${getProgressColor(item.daysRemaining)}`}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-8">
                        <span className="text-indigo-400 text-sm">Pending Approval</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="valid" className="mt-6">
          <div className="space-y-4">
            {validItems.map((item) => (
              <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-md ${getStatusColor(item.status)}`}>{getStatusIcon(item.status)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-white/60 mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        {item.expiryDate !== "N/A" && (
                          <p className="text-sm text-white/80">
                            <span className="text-white/60">Expiry: </span>
                            {item.expiryDate}
                          </p>
                        )}
                        {item.documents.map((doc, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="text-white/70 hover:text-white p-0 h-auto"
                          >
                            <FileCheck className="h-4 w-4 mr-1" />
                            {doc}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-48">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-white/60">Expiry Progress</span>
                        <span className="text-white/90">{item.daysRemaining} days left</span>
                      </div>
                      <Progress
                        value={getProgressValue(item.daysRemaining)}
                        className={`h-2 bg-white/10 ${getProgressColor(item.daysRemaining)}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expiring" className="mt-6">
          <div className="space-y-4">
            {expiringItems.map((item) => (
              <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-md ${getStatusColor(item.status)}`}>{getStatusIcon(item.status)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-white/60 mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        {item.expiryDate !== "N/A" && (
                          <p className="text-sm text-white/80">
                            <span className="text-white/60">Expiry: </span>
                            {item.expiryDate}
                          </p>
                        )}
                        {item.documents.map((doc, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="text-white/70 hover:text-white p-0 h-auto"
                          >
                            <FileCheck className="h-4 w-4 mr-1" />
                            {doc}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-48">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-white/60">Expiry Progress</span>
                        <span className="text-amber-400">{item.daysRemaining} days left</span>
                      </div>
                      <Progress
                        value={getProgressValue(item.daysRemaining)}
                        className={`h-2 bg-white/10 ${getProgressColor(item.daysRemaining)}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {pendingItems.map((item) => (
              <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-md ${getStatusColor(item.status)}`}>{getStatusIcon(item.status)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-white/60 mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm text-indigo-400">Awaiting approval</p>
                        {item.documents.map((doc, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="text-white/70 hover:text-white p-0 h-auto"
                          >
                            <FileCheck className="h-4 w-4 mr-1" />
                            {doc}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-48">
                    <div className="flex justify-center items-center h-8">
                      <span className="text-indigo-400 text-sm">Pending Approval</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="mt-6">
          <div className="space-y-4">
            {expiredItems.map((item) => (
              <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-md ${getStatusColor(item.status)}`}>{getStatusIcon(item.status)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-white/60 mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm text-red-400">
                          <span className="text-white/60">Expired on: </span>
                          {item.expiryDate}
                        </p>
                        {item.documents.map((doc, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="text-white/70 hover:text-white p-0 h-auto"
                          >
                            <FileCheck className="h-4 w-4 mr-1" />
                            {doc}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-48">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                      Renew Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}