"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DocumentList from "@/components/dashboard/document-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FolderPlus, Filter, Search } from "lucide-react"

// Define the Document interface to match what DocumentList expects
interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadDate: string
  status: "pending" | "approved" | "rejected"
  category: string
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data with explicit typing and correct status values
  const documentsData: Document[] = [
    {
      id: "doc-001",
      name: "Electronics_Invoice.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadedBy: "John Smith",
      uploadDate: "Oct 5, 2023",
      status: "approved",
      category: "Invoices",
    },
    {
      id: "doc-002",
      name: "Furniture_Bill_of_Lading.pdf",
      type: "PDF",
      size: "0.8 MB",
      uploadedBy: "Emma Davis",
      uploadDate: "Oct 2, 2023",
      status: "pending",
      category: "Shipping",
    },
    {
      id: "doc-003",
      name: "Textile_Certificate_of_Origin.pdf",
      type: "PDF",
      size: "1.5 MB",
      uploadedBy: "Michael Chen",
      uploadDate: "Sep 30, 2023",
      status: "pending",
      category: "Certificates",
    },
    {
      id: "doc-004",
      name: "Automotive_Parts_Invoice.xlsx",
      type: "XLS",
      size: "2.3 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "Sep 28, 2023",
      status: "approved",
      category: "Invoices",
    },
    {
      id: "doc-005",
      name: "Import_Permits_Q3.docx",
      type: "DOC",
      size: "1.7 MB",
      uploadedBy: "Robert Smith",
      uploadDate: "Sep 25, 2023",
      status: "approved",
      category: "Permits",
    },
    {
      id: "doc-006",
      name: "Shipping_Insurance_Policy.pdf",
      type: "PDF",
      size: "3.1 MB",
      uploadedBy: "John Smith",
      uploadDate: "Sep 22, 2023",
      status: "approved",
      category: "Insurance",
    },
    {
      id: "doc-007",
      name: "Customs_Declaration_Form.pdf",
      type: "PDF",
      size: "0.9 MB",
      uploadedBy: "Emma Davis",
      uploadDate: "Sep 20, 2023",
      status: "approved",
      category: "Customs",
    },
    {
      id: "doc-008",
      name: "Product_Specifications.xlsx",
      type: "XLS",
      size: "4.2 MB",
      uploadedBy: "Michael Chen",
      uploadDate: "Sep 18, 2023",
      status: "approved",
      category: "Products",
    },
    {
      id: "doc-009",
      name: "Supplier_Contract.docx",
      type: "DOC",
      size: "1.5 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "Sep 15, 2023",
      status: "approved",
      category: "Contracts",
    },
    {
      id: "doc-010",
      name: "Packaging_Requirements.pdf",
      type: "PDF",
      size: "2.0 MB",
      uploadedBy: "Robert Smith",
      uploadDate: "Sep 12, 2023",
      status: "approved",
      category: "Specifications",
    },
  ]

  // Filter documents by category
  const invoices = documentsData.filter((doc) => doc.category === "Invoices")
  const shipping = documentsData.filter((doc) => doc.category === "Shipping")
  const certificates = documentsData.filter((doc) => doc.category === "Certificates")
  const permits = documentsData.filter((doc) => doc.category === "Permits")
  const contracts = documentsData.filter((doc) => doc.category === "Contracts")
  const pending = documentsData.filter((doc) => doc.status === "pending")

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Documents</h1>
            <p className="text-white/60">Manage and organize all your import-related documents</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search documents by name, type, or uploader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md pl-9 pr-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>

        <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            All Documents
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Pending Approval
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Invoices
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Shipping
          </TabsTrigger>
          <TabsTrigger
            value="certificates"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Certificates
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Other
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <DocumentList documents={documentsData} />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <DocumentList documents={pending} />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <DocumentList documents={invoices} />
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <DocumentList documents={shipping} />
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          <DocumentList documents={certificates} />
        </TabsContent>

        <TabsContent value="other" className="mt-6">
          <DocumentList documents={[...permits, ...contracts]} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}