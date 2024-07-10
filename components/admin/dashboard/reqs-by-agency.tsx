"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface AgencyData {
  agencyName: string;
  percentage: number;
}

interface RequestsByAgencyProps {
  chartData: AgencyData[];
}

const chartConfig = {
  agencyName: {
    label: "agencyName",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function RequestsByAgency({ chartData }: RequestsByAgencyProps) {
  return (
    <Card className="w-1/2 p-4">
      <CardHeader>
        <CardTitle>Percentage of Total Requests by Agency</CardTitle>
        {/* <CardDescription className="text-md">
          This chart shows the percentage of total requests made by each agency.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="agencyName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <YAxis domain={[0, "dataMax"]} tick={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="percentage"
              fill="var(--color-agencyName)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
