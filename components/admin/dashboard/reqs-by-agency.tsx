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
  CardFooter,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

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
    <Card className="w-1/3 h-[400px] pb-8">
      <CardHeader>
        <CardTitle>Requests Per Agency</CardTitle>
        <CardDescription>Percentage of total requests.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-end">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="agencyName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dashed" />}
            />

            <Bar
              dataKey="percentage"
              fill="var(--color-agencyName)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
