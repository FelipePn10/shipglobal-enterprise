"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { generateAndSaveFinancialSummaryPDF } from "@/lib/pdf-export";
import { toast } from "@/components/ui/use-toast";

interface FinancialItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  type: "invoice" | "payment" | "fee";
}

interface FinancialSummaryProps {
  items: FinancialItem[];
  totalPaid: number;
  totalPending: number;
  className?: string;
  companyName?: string;
  companyLogo?: string;
}

export default function FinancialSummary({
  items,
  totalPaid,
  totalPending,
  className,
  companyName = "Redirex",
  companyLogo,
}: FinancialSummaryProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter" | "year">("month");
  const [isExporting, setIsExporting] = useState(false);

  // Memoize timeframe label to prevent recalculation
  const getTimeframeLabel = useMemo(() => {
    const labels: Record<typeof timeframe, string> = {
      week: "Week",
      month: "Month",
      quarter: "Quarter",
      year: "Year",
    };
    return () => labels[timeframe];
  }, [timeframe]);

  const getStatusColor = (status: FinancialItem["status"]) => {
    switch (status) {
      case "paid":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "overdue":
        return "text-red-400";
      default:
        return "text-white/60";
    }
  };

  const getTypeIcon = (type: FinancialItem["type"]) => {
    switch (type) {
      case "invoice":
        return <DollarSign className="h-4 w-4 text-white/60" />;
      case "payment":
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case "fee":
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      // Get the accent colors from the UI
      const primaryColor = "#4f46e5"; // indigo-500
      const secondaryColor = "#f9fafb"; // gray-50

      // Export options based on current UI state
      const exportOptions = {
        companyName,
        companyLogo,
        primaryColor,
        secondaryColor,
        includeCharts: true,
        includeFooter: true,
        orientation: "portrait" as const,
      };

      // Use the enhanced PDF export function
      await generateAndSaveFinancialSummaryPDF(
        items,
        totalPaid,
        totalPending,
        getTimeframeLabel(),
        exportOptions,
      );

      toast?.({
        title: "Export Successful",
        description: `Financial summary for this ${getTimeframeLabel().toLowerCase()} has been downloaded.`,
        variant: "default",
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast?.({
        title: "Export Failed",
        description: "There was an error generating your financial report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg",
        className,
      )}
      aria-label="Financial summary"
    >
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Financial Summary</h3>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as "week" | "month" | "quarter" | "year")}>
            <SelectTrigger
              className="w-[120px] h-8 bg-white/5 border-white/10 text-white/80 text-xs"
              aria-label="Select timeframe"
            >
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
              <SelectItem
                value="week"
                className="text-white/80 hover:text-white focus:text-white"
              >
                This Week
              </SelectItem>
              <SelectItem
                value="month"
                className="text-white/80 hover:text-white focus:text-white"
              >
                This Month
              </SelectItem>
              <SelectItem
                value="quarter"
                className="text-white/80 hover:text-white focus:text-white"
              >
                This Quarter
              </SelectItem>
              <SelectItem
                value="year"
                className="text-white/80 hover:text-white focus:text-white"
              >
                This Year
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/60 hover:text-white"
            aria-label="Filter transactions"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white/10 backdrop-blur-lg border-white/10"
            >
              <DropdownMenuItem
                className="text-white/80 hover:text-white focus:text-white"
                onClick={() => console.log("Export as CSV")} // Placeholder
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white/80 hover:text-white focus:text-white"
                onClick={() => window.print()}
              >
                Print Report
              </DropdownMenuItem>
              <Link href="/dashboard/finances">
                <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                  View All Transactions
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 rounded-lg p-3 border border-indigo-500/20">
          <p className="text-sm text-white/60">Total Paid</p>
          <p className="text-xl font-semibold text-white">
            ${totalPaid.toLocaleString()}
          </p>
          <div className="flex items-center mt-1 text-xs text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+8.5% vs last {timeframe}</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-rose-500/10 to-rose-500/5 rounded-lg p-3 border border-rose-500/20">
          <p className="text-sm text-white/60">Pending</p>
          <p className="text-xl font-semibold text-white">
            ${totalPending.toLocaleString()}
          </p>
          <div className="flex items-center mt-1 text-xs text-yellow-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+12.3% vs last {timeframe}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex justify-between text-xs text-white/60 px-2 py-1 mb-2">
          <span>Description</span>
          <span>Amount</span>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {items.length === 0 ? (
            <p className="text-center text-white/60 text-sm">
              No transactions available
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white/5 hover:bg-white/[0.07] rounded-lg px-3 py-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 p-1.5 bg-white/5 rounded-md">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <p className="text-sm text-white/90">{item.description}</p>
                    <p className="text-xs text-white/60">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white/90">
                    ${item.amount.toLocaleString()}
                  </p>
                  <p className={cn("text-xs", getStatusColor(item.status))}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-white/10 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white"
          onClick={handleExportPDF}
          disabled={isExporting}
          aria-label={isExporting ? "Exporting report" : "Export report as PDF"}
        >
          {isExporting ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </>
          )}
        </Button>
        <Link href="/dashboard/finances">
          <Button
            className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white"
            aria-label="View all transactions"
          >
            View All Transactions
          </Button>
        </Link>
      </div>
    </div>
  );
}