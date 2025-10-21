"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DateRangeSelector from "./date-range-selector";
import { format } from "date-fns";

export default function AnalyticsDateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate")!)
    : null;
  const endDate = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate")!)
    : null;

  const handleDateChange = (start: Date | null, end: Date | null) => {
    const params = new URLSearchParams();
    if (start) params.set("startDate", format(start, "yyyy-MM-dd"));
    if (end) params.set("endDate", format(end, "yyyy-MM-dd"));

    // Navigate with new params (or empty if both null)
    const queryString = params.toString();
    router.push(`/admin/analytics${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="p-4 border-b flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        {(startDate || endDate) && (
          <p className="text-sm text-muted-foreground mt-1">
            {startDate && endDate
              ? `Showing data from ${format(startDate, "MMM dd, yyyy")} to ${format(endDate, "MMM dd, yyyy")}`
              : startDate
                ? `Showing data from ${format(startDate, "MMM dd, yyyy")}`
                : `Showing data until ${format(endDate!, "MMM dd, yyyy")}`}
          </p>
        )}
      </div>
      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
      />
    </div>
  );
}
