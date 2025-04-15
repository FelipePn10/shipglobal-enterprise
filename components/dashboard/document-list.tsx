"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Download, Eye, FileText, FileImage, FileSpreadsheet, FileCode } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadDate: string
  status: "pending" | "approved" | "rejected"
  category: string
}

interface DocumentListProps {
  documents: Document[]
  className?: string
}

export default function DocumentList({ documents, className }: DocumentListProps) {
  const getDocumentIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF":
        return <FileText className="h-5 w-5 text-rose-400" />
      case "JPG":
      case "PNG":
      case "GIF":
        return <FileImage className="h-5 w-5 text-indigo-400" />
      case "XLS":
      case "XLSX":
      case "CSV":
        return <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
      case "DOC":
      case "DOCX":
        return <FileText className="h-5 w-5 text-blue-400" />
      default:
        return <FileCode className="h-5 w-5 text-amber-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className={cn("bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg", className)}>
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Documents</h3>
      <Link href="/dashboard/documents">
        <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white text-xs">
          Upload Document
        </Button>
      </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs font-medium text-white/60">Name</th>
              <th className="text-left p-4 text-xs font-medium text-white/60">Uploaded By</th>
              <th className="text-left p-4 text-xs font-medium text-white/60">Date</th>
              <th className="text-left p-4 text-xs font-medium text-white/60">Status</th>
              <th className="text-right p-4 text-xs font-medium text-white/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-md">{getDocumentIcon(doc.type)}</div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{doc.name}</p>
                      <p className="text-xs text-white/60">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-white/80">{doc.uploadedBy}</td>
                <td className="p-4 text-sm text-white/80">{doc.uploadDate}</td>
                <td className="p-4">
                  <span
                    className={cn(
                      "inline-flex px-2 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(doc.status),
                    )}
                  >
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                      <Download className="h-4 w-4" />
                    </Button>
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
                          Share Document
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-white/20" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No documents found</h3>
          <p className="text-white/60 max-w-md">
            You dont have any documents yet. Upload your first document to get started.
          </p>
          <Button className="mt-6 bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
            Upload Document
          </Button>
        </div>
      )}
    </div>
  )
}