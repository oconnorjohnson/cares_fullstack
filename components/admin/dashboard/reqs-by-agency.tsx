"use client";
import { AgChartsReact } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AgencyData {
  agencyName: string;
  percentage: number;
}

interface RequestsByAgencyProps {
  chartData: AgencyData[];
}

export default function RequestsByAgency({ chartData }: RequestsByAgencyProps) {
  const options: AgChartOptions = {
    data: chartData,
    series: [
      {
        type: "bar",
        xKey: "agencyName",
        yKey: "percentage",
        yName: "Requests",
        cornerRadius: 10,
      },
    ],
    axes: [
      { type: "category", position: "bottom" },
      {
        type: "number",
        position: "left",
        title: { text: "Requests" },
      },
    ],
  };

  return (
    <Card className="w-full h-full py-4">
      <CardHeader>
        <CardTitle>Percentage of Total Requests by Agency</CardTitle>
        <CardDescription className="text-md">
          This chart shows the percentage of total requests made by each agency.
        </CardDescription>
      </CardHeader>
      <div style={{ width: "100%", height: "300px" }}>
        <AgChartsReact options={options} />
      </div>
    </Card>
  );
}
