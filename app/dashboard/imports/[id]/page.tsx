"use client"

import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Package, Calendar, MapPin, Clock, AlertTriangle, CheckCircle, Truck, FileCheck } from "lucide-react"
import CommunicationLog from "@/components/dashboard/communication-log"
import DocumentList, { Document } from "@/components/dashboard/document-list" 
import FinancialSummary from "@/components/dashboard/financial-summary"

export default function ImportDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const importId = params.id as string


  const importData = {
    id: importId,
    title: "Electronics Shipment",
    status: "shipping",
    origin: "Shenzhen, China",
    destination: "Los Angeles, USA",
    eta: "Oct 15, 2023",
    lastUpdated: "2 hours ago",
    progress: 65,
    description:
      "Shipment of electronic components including microchips, circuit boards, and display panels for assembly in the US facility.",
    timeline: [
      { date: "Sep 15, 2023", status: "Order Placed", description: "Purchase order submitted to supplier" },
      { date: "Sep 20, 2023", status: "Processing", description: "Order confirmed and processing started" },
      { date: "Sep 28, 2023", status: "Ready for Pickup", description: "Goods ready for pickup at supplier facility" },
      { date: "Oct 2, 2023", status: "In Transit to Port", description: "Shipment en route to port of origin" },
      { date: "Oct 5, 2023", status: "Customs Clearance (Origin)", description: "Cleared export customs" },
      { date: "Oct 7, 2023", status: "Departed Port of Origin", description: "Vessel departed from Shenzhen Port" },
      { date: "Oct 15, 2023", status: "Estimated Arrival", description: "Expected arrival at Los Angeles Port" },
      { date: "Oct 17, 2023", status: "Pending", description: "Customs clearance at destination" },
      { date: "Oct 20, 2023", status: "Pending", description: "Delivery to final destination" },
    ],
    details: {
      carrier: "OceanFreight International",
      trackingNumber: "OFI-78945612",
      containerNumber: "MSCU7891234",
      weight: "1,250 kg",
      dimensions: "Standard 20ft container",
      incoterms: "FOB Shenzhen",
      insurance: "Full coverage",
      specialInstructions: "Handle with care. Temperature-sensitive electronics.",
    },
  }

  const communicationData = [
    {
      id: "msg-001",
      sender: {
        name: "Sarah Johnson",
        role: "Customs Agent",
      },
      content:
        "We need additional documentation for the electronics shipment. Please provide the certificate of origin by tomorrow.",
      timestamp: "Today, 2:30 PM",
      attachments: [
        {
          name: "Required_Documents_List.pdf",
          type: "PDF",
          size: "245 KB",
          url: "#",
        },
      ],
    },
    {
      id: "msg-002",
      sender: {
        name: "Michael Chen",
        role: "Logistics Manager",
      },
      content:
        "The shipment has cleared export customs and is now en route to the port. Everything is on schedule so far.",
      timestamp: "Oct 5, 2023, 11:15 AM",
    },
    {
      id: "msg-003",
      sender: {
        name: "John Smith",
        role: "You",
      },
      content:
        "Thanks for the update. Please keep me informed of any changes to the ETA. Are there any potential delays we should be aware of?",
      timestamp: "Oct 5, 2023, 1:45 PM",
    },
    {
      id: "msg-004",
      sender: {
        name: "Michael Chen",
        role: "Logistics Manager",
      },
      content:
        "There's some congestion at the port of Los Angeles, but we've accounted for that in the ETA. We'll monitor the situation and update you if anything changes.",
      timestamp: "Oct 5, 2023, 3:30 PM",
    },
  ]

  const documentsData: Document[] = [
    {
      id: "doc-001",
      name: "Electronics_Commercial_Invoice.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadedBy: "John Smith",
      uploadDate: "Sep 15, 2023",
      status: "approved",
      category: "Invoices",
    },
    {
      id: "doc-002",
      name: "Bill_of_Lading.pdf",
      type: "PDF",
      size: "0.8 MB",
      uploadedBy: "Michael Chen",
      uploadDate: "Oct 2, 2023",
      status: "approved",
      category: "Shipping",
    },
    {
      id: "doc-003",
      name: "Certificate_of_Origin.pdf",
      type: "PDF",
      size: "1.5 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "Oct 3, 2023",
      status: "pending",
      category: "Certificates",
    },
    {
      id: "doc-004",
      name: "Packing_List.xlsx",
      type: "XLS",
      size: "2.3 MB",
      uploadedBy: "John Smith",
      uploadDate: "Sep 28, 2023",
      status: "approved",
      category: "Packing",
    },
    {
      id: "doc-005",
      name: "Insurance_Certificate.pdf",
      type: "PDF",
      size: "1.1 MB",
      uploadedBy: "Emma Davis",
      uploadDate: "Sep 30, 2023",
      status: "approved",
      category: "Insurance",
    },
  ]

  const financialData = {
    items: [
      {
        id: "fin-001",
        description: "Supplier Payment",
        amount: 45000,
        date: "Sep 15, 2023",
        status: "paid" as const,
        type: "payment" as const,
      },
      {
        id: "fin-002",
        description: "Shipping Cost",
        amount: 8500,
        date: "Oct 2, 2023",
        status: "paid" as const,
        type: "fee" as const,
      },
      {
        id: "fin-003",
        description: "Insurance Premium",
        amount: 2250,
        date: "Sep 30, 2023",
        status: "paid" as const,
        type: "fee" as const,
      },
      {
        id: "fin-004",
        description: "Customs Clearance Fee",
        amount: 1750,
        date: "Oct 17, 2023",
        status: "pending" as const,
        type: "fee" as const,
      },
      {
        id: "fin-005",
        description: "Destination Handling",
        amount: 950,
        date: "Oct 20, 2023",
        status: "pending" as const,
        type: "fee" as const,
      },
    ],
    totalPaid: 55750,
    totalPending: 2700,
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipping":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
      case "customs":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "delivered":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "issue":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "order placed":
        return <FileCheck className="h-5 w-5 text-white/80" />
      case "processing":
        return <Package className="h-5 w-5 text-white/80" />
      case "ready for pickup":
        return <CheckCircle className="h-5 w-5 text-white/80" />
      case "in transit to port":
        return <Truck className="h-5 w-5 text-white/80" />
      case "customs clearance (origin)":
        return <FileCheck className="h-5 w-5 text-white/80" />
      case "departed port of origin":
        return <Truck className="h-5 w-5 text-white/80" />
      case "estimated arrival":
        return <Clock className="h-5 w-5 text-white/80" />
      case "pending":
        return <Clock className="h-5 w-5 text-white/60" />
      default:
        return <Package className="h-5 w-5 text-white/80" />
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" className="text-white/70 hover:text-white mb-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Imports
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-white">{importData.title}</h1>
              <div className={cn("px-2 py-1 rounded text-xs font-medium border", getStatusColor(importData.status))}>
                {importData.status.charAt(0).toUpperCase() + importData.status.slice(1)}
              </div>
            </div>
            <p className="text-white/60">ID: {importData.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              <Truck className="h-4 w-4 mr-2" />
              Track Shipment
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 rounded-lg border border-indigo-500/20">
            <MapPin className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-white/60">Origin</p>
            <p className="text-lg font-medium text-white">{importData.origin}</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-rose-500/20 to-rose-500/5 rounded-lg border border-rose-500/20">
            <MapPin className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <p className="text-sm text-white/60">Destination</p>
            <p className="text-lg font-medium text-white">{importData.destination}</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-amber-500/20 to-amber-500/5 rounded-lg border border-amber-500/20">
            <Calendar className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-white/60">Estimated Arrival</p>
            <p className="text-lg font-medium text-white">{importData.eta}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-2">Shipment Progress</h3>
          <p className="text-white/60 mb-4">{importData.description}</p>

          <div className="mb-6">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-white/60">Progress</span>
              <span className="text-white/90">{importData.progress}%</span>
            </div>
            <Progress value={importData.progress} className="h-2 bg-white/10" />
          </div>

          <div className="space-y-4">
            {importData.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div
                  className={cn(
                    "relative flex flex-col items-center",
                    index !== importData.timeline.length - 1 &&
                      "after:absolute after:top-10 after:bottom-0 after:w-0.5 after:bg-white/10",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      event.status.toLowerCase() === "pending"
                        ? "bg-white/10"
                        : "bg-gradient-to-r from-indigo-500/20 to-rose-500/20 border border-white/10",
                    )}
                  >
                    {getStatusIcon(event.status)}
                  </div>
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          event.status.toLowerCase() === "pending" ? "text-white/60" : "text-white/90",
                        )}
                      >
                        {event.status}
                      </p>
                      <p className="text-sm text-white/60">{event.description}</p>
                    </div>
                    <p className="text-sm text-white/60">{event.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="communication"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Communication
          </TabsTrigger>
          <TabsTrigger
            value="finances"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Finances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Shipment Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-white/60">Carrier</p>
                    <p className="text-white/90">{importData.details.carrier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Tracking Number</p>
                    <p className="text-white/90">{importData.details.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Container Number</p>
                    <p className="text-white/90">{importData.details.containerNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Weight</p>
                    <p className="text-white/90">{importData.details.weight}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-white/60">Dimensions</p>
                    <p className="text-white/90">{importData.details.dimensions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Incoterms</p>
                    <p className="text-white/90">{importData.details.incoterms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Insurance</p>
                    <p className="text-white/90">{importData.details.insurance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Special Instructions</p>
                    <p className="text-white/90">{importData.details.specialInstructions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentList documents={documentsData} />
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <div className="h-[calc(100vh-400px)]">
            <CommunicationLog messages={communicationData} />
          </div>
        </TabsContent>

        <TabsContent value="finances" className="mt-6">
          <FinancialSummary
            items={financialData.items}
            totalPaid={financialData.totalPaid}
            totalPending={financialData.totalPending}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}