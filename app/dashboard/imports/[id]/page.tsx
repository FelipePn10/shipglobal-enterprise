"use client";

import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Truck,
  FileCheck,
} from "lucide-react";
import CommunicationLog from "@/components/dashboard/communication-log";
import DocumentList, { Document } from "@/components/dashboard/document-list";
import FinancialSummary from "@/components/dashboard/financial-summary";

// Types
interface ImportDetails {
  id: string;
  title: string;
  status: "shipping" | "customs" | "delivered" | "issue" | "processing";
  origin: string;
  destination: string;
  eta: string;
  lastUpdated: string;
  progress: number;
  description: string;
  timeline: {
    date: string;
    status: string;
    description: string;
  }[];
  details: {
    carrier: string;
    trackingNumber: string;
    containerNumber: string;
    weight: string;
    dimensions: string;
    incoterms: string;
    insurance: string;
    specialInstructions: string;
  };
}

interface CommunicationMessage {
  id: string;
  sender: { name: string; role: string };
  content: string;
  timestamp: string;
  attachments?: { name: string; type: string; size: string; url: string }[];
}

interface FinancialItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending";
  type: "payment" | "fee" | "invoice";
}

interface FinancialData {
  items: FinancialItem[];
  totalPaid: number;
  totalPending: number;
}

interface APImportResponse {
  importId: string;
  title: string;
  status: string;
  origin: string;
  destination: string;
  eta: string;
  lastUpdated: string;
  progress: number;
}

export default function ImportDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const importId = params.id as string;
  const [importData, setImportData] = useState<ImportDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImportDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/imports/${importId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch import details");
      }
      const data: APImportResponse = await response.json();
      setImportData({
        id: data.importId,
        title: data.title,
        status: data.status as ImportDetails["status"],
        origin: data.origin,
        destination: data.destination,
        eta: data.eta,
        lastUpdated: new Date(data.lastUpdated).toLocaleString(),
        progress: data.progress,
        description: "Details fetched from database.",
        timeline: [
          {
            date: "Sep 15, 2023",
            status: "Order Placed",
            description: "Purchase order submitted to supplier",
          },
        ],
        details: {
          carrier: "OceanFreight International",
          trackingNumber: "OFI-78945612",
          containerNumber: "MSCU7891234",
          weight: "1,250 kg",
          dimensions: "Standard 20ft container",
          incoterms: "FOB Shenzhen",
          insurance: "Full coverage",
          specialInstructions: "Handle with care.",
        },
      });
    } catch {
      setError("Unable to load import details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [importId]);

  useEffect(() => {
    fetchImportDetails();
  }, [fetchImportDetails]);

  const communicationData: CommunicationMessage[] = [
    {
      id: "msg-001",
      sender: { name: "Sarah Johnson", role: "Customs Agent" },
      content: "We need additional documentation.",
      timestamp: "Today, 2:30 PM",
      attachments: [
        { name: "Required_Documents_List.pdf", type: "PDF", size: "245 KB", url: "#" },
      ],
    },
  ];

  const documentsData: Document[] = [
    {
      id: "doc-001",
      name: "Commercial_Invoice.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadedBy: "John Smith",
      uploadDate: "Sep 15, 2023",
      status: "approved",
      category: "Invoices",
    },
  ];

  const financialData: FinancialData = {
    items: [
      {
        id: "fin-001",
        description: "Supplier Payment",
        amount: 45000,
        date: "Sep 15, 2023",
        status: "paid",
        type: "payment",
      },
    ],
    totalPaid: 45000,
    totalPending: 0,
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipping":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "customs":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "issue":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "order placed":
        return <FileCheck className="h-5 w-5 text-white/80" />;
      case "processing":
        return <Package className="h-5 w-5 text-white/80" />;
      case "ready for pickup":
        return <CheckCircle className="h-5 w-5 text-white/80" />;
      case "in transit to port":
        return <Truck className="h-5 w-5 text-white/80" />;
      case "customs clearance (origin)":
        return <FileCheck className="h-5 w-5 text-white/80" />;
      case "departed port of origin":
        return <Truck className="h-5 w-5 text-white/80" />;
      case "estimated arrival":
        return <Clock className="h-5 w-5 text-white/80" />;
      case "pending":
        return <Clock className="h-5 w-5 text-white/60" />;
      default:
        return <Package className="h-5 w-5 text-white/80" />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <p className="text-white/80">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !importData) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center gap-4">
          <p className="text-red-400">{error || "No import data available."}</p>
          <Button
            variant="outline"
            className="border-white/10 text-white/80 hover:bg-white/5"
            onClick={fetchImportDetails}
            aria-label="Retry loading import details"
          >
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 text-white/70 hover:text-white"
          onClick={() => router.back()}
          aria-label="Back to imports list"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Imports
        </Button>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-white">{importData.title}</h1>
              <div
                className={cn(
                  "border px-2 py-1 text-xs font-medium",
                  getStatusColor(importData.status),
                )}
              >
                {importData.status.charAt(0).toUpperCase() + importData.status.slice(1)}
              </div>
            </div>
            <p className="text-white/60">ID: {importData.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/10 text-white/80 hover:bg-white/5"
              aria-label="Report an issue with this import"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
            <Button
              className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
              aria-label="Track this shipment"
            >
              <Truck className="mr-2 h-4 w-4" />
              Track Shipment
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="rounded-lg border border-indigo-500/20 bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 p-3">
            <MapPin className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-white/60">Origin</p>
            <p className="text-lg font-medium text-white">{importData.origin}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="rounded-lg border border-rose-500/20 bg-gradient-to-r from-rose-500/20 to-rose-500/5 p-3">
            <MapPin className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <p className="text-sm text-white/60">Destination</p>
            <p className="text-lg font-medium text-white">{importData.destination}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/20 to-amber-500/5 p-3">
            <Calendar className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-white/60">Estimated Arrival</p>
            <p className="text-lg font-medium text-white">{importData.eta}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <h3 className="mb-2 text-lg font-medium text-white">Shipment Progress</h3>
          <p className="mb-4 text-white/60">{importData.description}</p>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-white/60">Progress</span>
              <span className="text-white/90">{importData.progress}%</span>
            </div>
            <Progress value={importData.progress} className="h-2 bg-white/10" />
          </div>

          <div className="space-y-4">
            {importData.timeline.map((event, index) => (
              <div key={`${event.date}-${event.status}`} className="flex gap-4">
                <div
                  className={cn(
                    "relative flex flex-col items-center",
                    index !== importData.timeline.length - 1 &&
                      "after:absolute after:bottom-0 after:top-10 after:w-0.5 after:bg-white/10",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      event.status.toLowerCase() === "pending"
                        ? "bg-white/10"
                        : "border border-white/10 bg-gradient-to-r from-indigo-500/20 to-rose-500/20",
                    )}
                  >
                    {getStatusIcon(event.status)}
                  </div>
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          event.status.toLowerCase() === "pending"
                            ? "text-white/60"
                            : "text-white/90",
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
            className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            aria-label="Shipment details tab"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            aria-label="Documents tab"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="communication"
            className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            aria-label="Communication tab"
          >
            Communication
          </TabsTrigger>
          <TabsTrigger
            value="finances"
            className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            aria-label="Finances tab"
          >
            Finances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-6">
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-medium text-white">Shipment Details</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
  );
}