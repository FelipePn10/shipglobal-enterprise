"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import OverviewCard from "@/components/dashboard/overview-card";
import ImportStatusCard from "@/components/dashboard/import-status-card";
import CommunicationLog from "@/components/dashboard/communication-log";
import FinancialSummary from "@/components/dashboard/financial-summary";
import DocumentList from "@/components/dashboard/document-list";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import { Package, MessageSquare, DollarSign, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Types
interface OverviewItem {
  title: string;
  value: number | string;
  trend: number;
  trendLabel: string;
  icon: JSX.Element;
}

interface ImportStatus {
  importId: string;
  title: string;
  status: "shipping" | "customs" | "issue" | "processing";
  origin: string;
  destination: string;
  eta: string;
  lastUpdated: string;
  progress: number;
}

interface Sender {
  name: string;
  role: string;
}

interface Attachment {
  name: string;
  type: string;
  size: string;
  url: string;
}

interface CommunicationMessage {
  id: string;
  sender: Sender;
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

interface FinancialItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending";
  type: "fee" | "invoice" | "payment";
}

interface FinancialData {
  items: FinancialItem[];
  totalPaid: number;
  totalPending: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  status: "approved" | "pending";
  category: string;
}

interface AnalyticsDataPoint {
  name: string;
  imports: number;
  revenue: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const overviewData: OverviewItem[] = [
    {
      title: "Active Imports",
      value: 12,
      trend: 8.5,
      trendLabel: "vs last month",
      icon: <Package className="h-5 w-5 text-white/80" />,
    },
    {
      title: "Pending Documents",
      value: 5,
      trend: -2,
      trendLabel: "vs last month",
      icon: <FileText className="h-5 w-5 text-white/80" />,
    },
    {
      title: "Unread Messages",
      value: 3,
      trend: 0,
      trendLabel: "no change",
      icon: <MessageSquare className="h-5 w-5 text-white/80" />,
    },
    {
      title: "Monthly Spend",
      value: "$24,500",
      trend: 12,
      trendLabel: "vs last month",
      icon: <DollarSign className="h-5 w-5 text-white/80" />,
    },
  ];

  const importStatusData: ImportStatus[] = [
    {
      importId: "IMP-2023-0042",
      title: "Electronics Shipment",
      status: "shipping",
      origin: "Shenzhen, China",
      destination: "Los Angeles, USA",
      eta: "Oct 15, 2023",
      lastUpdated: "2 hours ago",
      progress: 65,
    },
    {
      importId: "IMP-2023-0041",
      title: "Furniture Import",
      status: "customs",
      origin: "Milan, Italy",
      destination: "New York, USA",
      eta: "Oct 12, 2023",
      lastUpdated: "5 hours ago",
      progress: 45,
    },
    {
      importId: "IMP-2023-0040",
      title: "Textile Materials",
      status: "issue",
      origin: "Mumbai, India",
      destination: "London, UK",
      eta: "Delayed",
      lastUpdated: "1 day ago",
      progress: 30,
    },
    {
      importId: "IMP-2023-0039",
      title: "Automotive Parts",
      status: "processing",
      origin: "Stuttgart, Germany",
      destination: "Detroit, USA",
      eta: "Oct 18, 2023",
      lastUpdated: "3 hours ago",
      progress: 25,
    },
  ];

  const communicationData: CommunicationMessage[] = [
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
        "The furniture shipment has cleared customs and is now in transit to the warehouse. Expected delivery on schedule.",
      timestamp: "Today, 11:15 AM",
    },
    {
      id: "msg-003",
      sender: {
        name: "Robert Smith",
        role: "Supplier",
      },
      content:
        "We've resolved the issue with the textile materials. The replacement shipment will be dispatched next Monday.",
      timestamp: "Yesterday, 4:45 PM",
    },
    {
      id: "msg-004",
      sender: {
        name: "Emma Davis",
        role: "Account Manager",
      },
      content:
        "Your monthly import report is ready. I've attached the summary for your review. Let me know if you have any questions.",
      timestamp: "Yesterday, 10:30 AM",
      attachments: [
        {
          name: "September_Import_Summary.xlsx",
          type: "Excel",
          size: "1.2 MB",
          url: "#",
        },
      ],
    },
  ];

  const financialData: FinancialData = {
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
    ],
    totalPaid: 10950,
    totalPending: 15700,
  };

  const documentsData: Document[] = [
    {
      id: "doc-001",
      name: "Electronics_Invoice.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadedBy: "John Smith",
      uploadDate: "Oct 5, 2023",
      status: "approved",
      category: "invoice",
    },
    {
      id: "doc-002",
      name: "Furniture_Bill_of_Lading.pdf",
      type: "PDF",
      size: "0.8 MB",
      uploadedBy: "Emma Davis",
      uploadDate: "Oct 2, 2023",
      status: "pending",
      category: "shipping",
    },
    {
      id: "doc-003",
      name: "Textile_Certificate_of_Origin.pdf",
      type: "PDF",
      size: "1.5 MB",
      uploadedBy: "Michael Chen",
      uploadDate: "Sep 30, 2023",
      status: "pending",
      category: "certificate",
    },
    {
      id: "doc-004",
      name: "Automotive_Parts_Invoice.xlsx",
      type: "XLS",
      size: "2.3 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "Sep 28, 2023",
      status: "approved",
      category: "invoice",
    },
    {
      id: "doc-005",
      name: "Import_Permits_Q3.docx",
      type: "DOC",
      size: "1.7 MB",
      uploadedBy: "Robert Smith",
      uploadDate: "Sep 25, 2023",
      status: "approved",
      category: "permit",
    },
  ];

  const analyticsData: AnalyticsDataPoint[] = [
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
  ];

  const handleImportClick = (importId: string) => {
    router.push(`/dashboard/imports/${importId}`);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
            <p className="text-white/60">
              Welcome back, John. Heres an overview of your import operations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/10 text-white/80 hover:bg-white/5"
              aria-label="Current date"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Oct 10, 2023
            </Button>
            <Link href="/dashboard/imports">
              <Button
                className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
                aria-label="Start new import"
              >
                <Package className="mr-2 h-4 w-4" />
                New Import
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="overview"
            className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            aria-label="Overview tab"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="imports"
            className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            aria-label="Imports tab"
          >
            Imports
          </TabsTrigger>
          <TabsTrigger
            value="finances"
            className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            aria-label="Finances tab"
          >
            Finances
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            aria-label="Documents tab"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            aria-label="Messages tab"
          >
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewData.map((item) => (
              <OverviewCard
                key={item.title}
                title={item.title}
                value={item.value}
                trend={item.trend}
                trendLabel={item.trendLabel}
                icon={item.icon}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">Recent Imports</h2>
                  <Link href="/dashboard/imports">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white"
                      aria-label="View all imports"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {importStatusData.slice(0, 4).map((item) => (
                    <ImportStatusCard
                      key={item.importId}
                      importId={item.importId}
                      title={item.title}
                      status={item.status}
                      origin={item.origin}
                      destination={item.destination}
                      eta={item.eta}
                      lastUpdated={item.lastUpdated}
                      progress={item.progress}
                      onClick={() => handleImportClick(item.importId)}
                    />
                  ))}
                </div>
              </div>

              <AnalyticsChart title="Import Performance" data={analyticsData} />
            </div>

            <div className="space-y-6">
              <CommunicationLog
                title="Recent Messages"
                messages={communicationData.slice(0, 3)}
              />

              <FinancialSummary
                items={financialData.items.slice(0, 3)}
                totalPaid={financialData.totalPaid}
                totalPending={financialData.totalPending}
              />
            </div>
          </div>

          <DocumentList documents={documentsData.slice(0, 3)} />
        </TabsContent>

        <TabsContent value="imports" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {importStatusData.map((item) => (
              <ImportStatusCard
                key={item.importId}
                importId={item.importId}
                title={item.title}
                status={item.status}
                origin={item.origin}
                destination={item.destination}
                eta={item.eta}
                lastUpdated={item.lastUpdated}
                progress={item.progress}
                onClick={() => handleImportClick(item.importId)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="finances" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FinancialSummary
              items={financialData.items}
              totalPaid={financialData.totalPaid}
              totalPending={financialData.totalPending}
            />
            <AnalyticsChart title="Financial Performance" data={analyticsData} />
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentList documents={documentsData} />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <div className="h-[calc(100vh-250px)]">
            <CommunicationLog messages={communicationData} />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}