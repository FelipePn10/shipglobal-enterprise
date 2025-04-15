"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils";

interface EnhancedChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color?: string }>;
  label?: string;
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
  type?: "currency" | "percentage" | "number" | "date";
  title?: string;
  showIndicator?: boolean;
  indicatorColors?: string[];
}

export function EnhancedChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
  type = "number",
  title,
  showIndicator = true,
  indicatorColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"],
}: EnhancedChartTooltipProps) {
  // Memoize formatValue at the top to ensure consistent hook calls
  const formatValue = useMemo(
    () =>
      (value: number): string => {
        if (valueFormatter) return valueFormatter(value);

        switch (type) {
          case "currency":
            return formatCurrency(value);
          case "percentage":
            return formatPercentage(value);
          case "date":
            return formatDate(new Date(value));
          default:
            return value.toLocaleString();
        }
      },
    [valueFormatter, type],
  );

  // Return null if tooltip is inactive or payload is invalid
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Format label if provided
  const formattedLabel = labelFormatter ? labelFormatter(label || "") : label;

  return (
    <Card
      className="shadow-lg border-0 bg-background/95 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200"
      role="tooltip"
      aria-label="Chart tooltip"
    >
      <CardContent className="p-3">
        {title && (
          <p className="text-sm font-medium mb-2 text-foreground">{title}</p>
        )}
        {formattedLabel && (
          <p className="text-xs text-muted-foreground mb-2">{formattedLabel}</p>
        )}
        <div className="space-y-1.5">
          {payload.map((entry, index) => {
            // Skip invalid entries
            if (!entry.name || typeof entry.value !== "number") {
              return null;
            }
            return (
              <div
                key={`item-${index}`}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  {showIndicator && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          entry.color ||
                          indicatorColors[index % indicatorColors.length],
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-xs font-medium">{entry.name}:</span>
                </div>
                <span className="text-xs font-semibold">
                  {formatValue(entry.value)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default EnhancedChartTooltip;