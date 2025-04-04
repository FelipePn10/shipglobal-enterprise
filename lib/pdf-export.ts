import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FinancialItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  type: "invoice" | "payment" | "fee";
}

interface ExportOptions {
  companyName?: string;
  companyLogo?: string; // Base64 encoded image
  primaryColor?: string; // Hex color code
  secondaryColor?: string; // Hex color code
  includeCharts?: boolean;
  includeFooter?: boolean;
  orientation?: "portrait" | "landscape";
}

const DEFAULT_OPTIONS: ExportOptions = {
  companyName: "Financial Summary",
  primaryColor: "#4f46e5", // indigo-500
  secondaryColor: "#e5e7eb", // gray-200
  includeCharts: true,
  includeFooter: true,
  orientation: "portrait",
};

/**
 * Exports financial data to a professionally formatted PDF document
 * 
 * @param items - Array of financial transactions
 * @param totalPaid - Total amount paid
 * @param totalPending - Total amount pending
 * @param timeframe - Time period of the report (e.g., "Month", "Quarter", "Year")
 * @param options - Customization options for the PDF
 * @returns The generated PDF document
 */
export function exportFinancialSummaryPDF(
  items: FinancialItem[],
  totalPaid: number,
  totalPending: number,
  timeframe: string,
  options: ExportOptions = {}
): jsPDF {
  // Merge default options with provided options
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // Initialize document with proper orientation
  const doc = new jsPDF({
    orientation: config.orientation,
    unit: "mm",
    format: "a4",
  });

  // Calculate total amounts by type and status for charts
  const totalOverdue = items
    .filter(item => item.status === "overdue")
    .reduce((sum, item) => sum + item.amount, 0);
  
  const typeAmounts = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  // Document metrics
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Convert hex color to RGB for jsPDF
  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const primaryRgb = hexToRgb(config.primaryColor ?? DEFAULT_OPTIONS.primaryColor!);
  const secondaryRgb = hexToRgb(config.secondaryColor ?? DEFAULT_OPTIONS.secondaryColor!);

  // ===== Header =====
  // Header background
  doc.setFillColor(...primaryRgb);
  doc.rect(0, 0, pageWidth, 30, "F");

  // Add logo if provided
  if (config.companyLogo) {
    try {
      doc.addImage(config.companyLogo, "PNG", margin, 5, 20, 20);
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  }

  // Header title
  doc.setFontSize(24);
  doc.setFont("helvetica", "helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(
    config.companyName ?? DEFAULT_OPTIONS.companyName!,
    config.companyLogo ? margin + 25 : margin,
    15
  );
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "helvetica", "normal");
  doc.text(
    "Financial Summary",
    config.companyLogo ? margin + 25 : margin,
    22
  );

  // Date in header
  const today = new Date();
  doc.setFontSize(10);
  doc.setTextColor(220, 220, 220);
  doc.text(
    `Generated: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
    pageWidth - margin - 60,
    22
  );

  // ===== Summary Section =====
  let yPos = 45;
  
  // Title for summary section
  doc.setFontSize(14);
  doc.setFont("helvetica", "helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text(`${timeframe} Summary`, margin, yPos);
  
  yPos += 10;

  // Summary stats in colored boxes
  const boxWidth = (contentWidth - 10) / 3;
  const boxHeight = 30;
  
  // Total Paid Box
  doc.setFillColor(46, 174, 52); // Green
  doc.roundedRect(margin, yPos, boxWidth, boxHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("Total Paid", margin + 10, yPos + 12);
  doc.setFontSize(16);
  doc.setFont("helvetica", "helvetica", "bold");
  doc.text(`$${totalPaid.toLocaleString()}`, margin + 10, yPos + 25);
  
  // Total Pending Box
  doc.setFillColor(74, 144, 226); // Blue
  doc.roundedRect(margin + boxWidth + 5, yPos, boxWidth, boxHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("Total Pending", margin + boxWidth + 15, yPos + 12);
  doc.setFontSize(16);
  doc.text(`$${totalPending.toLocaleString()}`, margin + boxWidth + 15, yPos + 25);
  
  // Total Overdue Box
  doc.setFillColor(235, 87, 87); // Red
  doc.roundedRect(margin + (boxWidth + 5) * 2, yPos, boxWidth, boxHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("Total Overdue", margin + (boxWidth + 5) * 2 + 10, yPos + 12);
  doc.setFontSize(16);
  doc.text(`$${totalOverdue.toLocaleString()}`, margin + (boxWidth + 5) * 2 + 10, yPos + 25);

  yPos += boxHeight + 15;

  // Timeframe info
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(11);
  doc.setFont("helvetica", "helvetica", "normal");
  doc.text(`Timeframe: ${timeframe}`, margin, yPos);
  doc.text(`Total Items: ${items.length}`, margin + 80, yPos);
  
  yPos += 10;

  // ===== Data Visualization Section =====
  if (config.includeCharts && items.length > 0) {
    // Add section title
    doc.setFontSize(14);
    doc.setFont("helvetica", "helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Transaction Breakdown", margin, yPos);
    
    yPos += 10;
    
    // Status Distribution chart (horizontal bar chart)
    const statusCounts = {
      paid: items.filter(item => item.status === "paid").length,
      pending: items.filter(item => item.status === "pending").length,
      overdue: items.filter(item => item.status === "overdue").length
    };
    
    const chartWidth = contentWidth;
    const chartHeight = 35;
    const maxCount = Math.max(...Object.values(statusCounts));
    
    // Chart title
    doc.setFontSize(10);
    doc.setFont("helvetica", "helvetica", "bold");
    doc.text("Status Distribution", margin, yPos);
    
    yPos += 5;
    
    // Chart container
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, chartWidth, chartHeight);
    
    // Draw bars
    const barHeight = 8;
    const barSpacing = 12;
    let barY = yPos + 8;
    
    // Paid bar
    doc.setFillColor(46, 174, 52); // Green
    const paidWidth = (statusCounts.paid / maxCount) * (chartWidth - 60);
    doc.rect(margin + 50, barY, paidWidth, barHeight, "F");
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text("Paid", margin + 10, barY + 6);
    doc.text(`${statusCounts.paid}`, margin + paidWidth + 55, barY + 6);
    
    barY += barSpacing;
    
    // Pending bar
    doc.setFillColor(74, 144, 226); // Blue
    const pendingWidth = (statusCounts.pending / maxCount) * (chartWidth - 60);
    doc.rect(margin + 50, barY, pendingWidth, barHeight, "F");
    doc.text("Pending", margin + 10, barY + 6);
    doc.text(`${statusCounts.pending}`, margin + pendingWidth + 55, barY + 6);
    
    barY += barSpacing;
    
    // Overdue bar
    doc.setFillColor(235, 87, 87); // Red
    const overdueWidth = (statusCounts.overdue / maxCount) * (chartWidth - 60);
    doc.rect(margin + 50, barY, overdueWidth, barHeight, "F");
    doc.text("Overdue", margin + 10, barY + 6);
    doc.text(`${statusCounts.overdue}`, margin + overdueWidth + 55, barY + 6);
    
    yPos += chartHeight + 15;
  }

  // ===== Transactions Table =====
  doc.setFontSize(14);
  doc.setFont("helvetica", "helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("Transaction Details", margin, yPos);
  
  yPos += 5;

  // Define status color function
  const getStatusColor = (status: string): [number, number, number] => {
    switch (status) {
      case "paid": return [46, 174, 52]; // Green
      case "pending": return [74, 144, 226]; // Blue
      case "overdue": return [235, 87, 87]; // Red
      default: return [100, 100, 100]; // Gray
    }
  };

  // Use autotable plugin for better tables
  autoTable(doc, {
    startY: yPos,
    head: [["Description", "Date", "Amount", "Status", "Type"]],
    body: items.map(item => [
      item.description,
      item.date,
      `$${item.amount.toLocaleString()}`,
      item.status,
      item.type
    ]),
    margin: { top: 10, right: margin, bottom: 10, left: margin },
    headStyles: {
      fillColor: [...primaryRgb],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left"
    },
    alternateRowStyles: {
      fillColor: [...secondaryRgb],
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 25 },
      2: { cellWidth: 25, halign: "right" },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 25, halign: "center" }
    },
    didDrawCell: (data) => {
      // Color status cells based on value
      if (data.section === 'body' && data.column.index === 3) {
        const status = items[data.row.index].status;
        const statusColor = getStatusColor(status);
        
        // Draw status indicator
        doc.setFillColor(...statusColor);
        doc.circle(
          data.cell.x + 5, 
          data.cell.y + data.cell.height / 2, 
          2, 
          "F"
        );
      }
    },
    didDrawPage: (data) => {
      // Add page number at bottom
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      // Use the correct method to get page count
      const pageCount = (doc as any).getNumberOfPages();
      const currentPage = data.pageNumber;
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        pageWidth - margin - 15,
        pageHeight - 10
      );
    }
  });

  // ===== Footer =====
  if (config.includeFooter) {
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "helvetica", "normal");
    doc.text(
      config.companyName ?? DEFAULT_OPTIONS.companyName!,
      margin,
      pageHeight - 10
    );
    
    // Generate a unique reference number
    const refNumber = `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    doc.text(
      `Document Reference: ${refNumber}`,
      pageWidth / 2 - 25,
      pageHeight - 10
    );
  }

  // Return the generated document
  return doc;
}

/**
 * Helper function to automatically save the PDF
 */
export function generateAndSaveFinancialSummaryPDF(
  items: FinancialItem[],
  totalPaid: number,
  totalPending: number,
  timeframe: string,
  options: ExportOptions = {}
): void {
  try {
    const doc = exportFinancialSummaryPDF(items, totalPaid, totalPending, timeframe, options);
    const fileName = `financial-summary-${timeframe.toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error generating PDF:", errorMessage);
    throw new Error(`Failed to generate financial summary PDF: ${errorMessage}`);
  }
}