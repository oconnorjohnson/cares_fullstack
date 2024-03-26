"use client";
import { AgChartsReact } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
interface CategoryData {
  category: string;
  preValue: number;
  postValue: number;
}

interface PrePostAnalysisProps {
  chartData: CategoryData[];
}

export default function PrePostAnalysis({ chartData }: PrePostAnalysisProps) {
  const options: AgChartOptions = {
    data: chartData,
    series: [
      {
        type: "bar",
        xKey: "category",
        yKey: "preValue",
        yName: "Pre-Screen",
        cornerRadius: 10,
      },
      {
        type: "bar",
        xKey: "category",
        yKey: "postValue",
        yName: "Post-Screen",
        cornerRadius: 10,
      },
    ],
    axes: [
      { type: "category", position: "bottom" },
      {
        type: "number",
        position: "left",
        title: { text: "Average Responses" },
      },
    ],
  };

  return (
    <Card className="p-8">
      <CardHeader>
        <CardTitle>Pre-Screen to Post-Screen Analysis</CardTitle>
        <CardDescription className="text-md">
          This chart shows the average number of each category for pre-screen
          answers and the average number of each category for post-screen
          answers. Higher values indicate a higher level of stress or difficulty
          in said category.
        </CardDescription>
      </CardHeader>
      <div style={{ width: "100%", height: "300px" }}>
        <AgChartsReact options={options} />
      </div>
    </Card>
  );
}
