"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

const chartConfig = {
  preValue: {
    label: "preValue",
    color: "hsl(var(--chart-1))",
  },
  postValue: {
    label: "postValue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function PrePostAnalysis({ chartData }: PrePostAnalysisProps) {
  // const options: AgChartOptions = {
  //   data: chartData,
  //   series: [
  //     {
  //       type: "bar",
  //       xKey: "category",
  //       yKey: "preValue",
  //       yName: "Pre-Screen",
  //       cornerRadius: 10,
  //     },
  //     {
  //       type: "bar",
  //       xKey: "category",
  //       yKey: "postValue",
  //       yName: "Post-Screen",
  //       cornerRadius: 10,
  //     },
  //   ],
  //   axes: [
  //     { type: "category", position: "bottom" },
  //     {
  //       type: "number",
  //       position: "left",
  //       title: { text: "Average Responses" },
  //     },
  //   ],
  // };

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

      <ChartContainer config={chartConfig} className="h-[200px] w-1/2">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="category"
            tickLine={false}
            tickMargin={5}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="preValue" fill="var(--color-preValue)" radius={4} />
          <Bar dataKey="postValue" fill="var(--color-postValue)" radius={4} />
        </BarChart>
      </ChartContainer>
      {/* <AgChartsReact options={options} /> */}
    </Card>
  );
}
