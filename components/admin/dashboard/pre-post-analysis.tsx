"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

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
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Pre and Post Screen Analysis</CardTitle>
        <CardDescription>Averages per category.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-end">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />

            <ChartTooltip
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="preValue" fill="var(--color-preValue)" radius={4} />
            <Bar dataKey="postValue" fill="var(--color-postValue)" radius={4} />
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
