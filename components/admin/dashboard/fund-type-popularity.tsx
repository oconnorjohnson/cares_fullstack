"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label, Pie, PieChart } from "recharts";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

// const chartConfig = {
//   toolLabel: {
//     label: "% of Total Requests",
//   },
//   "Walmart Gift Card": {
//     label: "Walmart Gift Card",
//     color: "hsl(var(--chart-1))",
//   },
//   "Arco Gift Card": {
//     label: "Arco Gift Card",
//     color: "hsl(var(--chart-2))",
//   },
//   "Bus Pass": {
//     label: "Bus Pass",
//     color: "hsl(var(--chart-3))",
//   },
//   Cash: {
//     label: "Cash",
//     color: "hsl(var(--chart-4))",
//   },
//   Invoice: {
//     label: "Invoice",
//     color: "hsl(var(--chart-5))",
//   },
//   Check: {
//     label: "Check",
//     color: "hsl(var(--chart-3))",
//   },
// } satisfies ChartConfig;

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type FundPopChartData = {
  fundTypeId: number;
  percentage: number;
  fundTypeName: string;
  fill?: string;
}[];

export default function FundTypePopularity({
  chartData,
}: {
  chartData: FundPopChartData;
}) {
  console.log(chartData);
  const dataWithColors = chartData.map((data) => ({
    ...data,
    fill: (chartConfig as Record<string, { color?: string }>)[data.fundTypeName]
      ?.color,
  }));
  console.log(dataWithColors);
  return (
    <Card className="w-1/3 h-full pb-8">
      <CardHeader>
        <CardTitle>Fund Type Popularity</CardTitle>
        <CardDescription>Frequency of fund types.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-end min-h-[200px]">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={dataWithColors}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fundTypeName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelKey="% of Total Requests"
                  indicator="dashed"
                />
              }
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
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
