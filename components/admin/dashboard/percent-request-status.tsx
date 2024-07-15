"use client";
import type { PercentRequestStatusReturn } from "@/server/supabase/functions/read";

export default function PercentRequestStatus({
  chartData,
}: {
  chartData: PercentRequestStatusReturn;
}) {
  return <div className="w-full">{chartData[0].percentage}</div>;
}
