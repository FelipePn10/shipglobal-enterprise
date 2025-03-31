"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

interface ServiceComparisonTableProps {
  headers: string[]
  rows: string[][]
}

export default function ServiceComparisonTable({ headers, rows }: ServiceComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {headers.map((header, index) => (
                <th key={index} className={cn("px-6 py-4 text-white/90", index === 0 ? "text-left" : "text-center")}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex < rows.length - 1 ? "border-b border-white/10" : ""}>
                {row.map((cell, cellIndex) => {
                  // Check if the cell content is a boolean indicator
                  const isCheckmark = cell === "✓" || cell === "yes" || cell === "true"
                  const isCross = cell === "✗" || cell === "no" || cell === "false"

                  return (
                    <td
                      key={cellIndex}
                      className={cn("px-6 py-4", cellIndex === 0 ? "text-white/80 text-left" : "text-center")}
                    >
                      {isCheckmark ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : isCross ? (
                        <X className="h-5 w-5 text-rose-500 mx-auto" />
                      ) : (
                        <span className={cellIndex === 0 ? "text-white/80" : "text-white/60"}>{cell}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

