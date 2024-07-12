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

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: "hsl(var(--chart-5))",
  },
  fundTypeName: {
    label: "fundTypeName",
  },
} satisfies ChartConfig;

type FundPopChartData = {
  fundTypeId: number;
  percentage: number;
  fundTypeName: string;
}[];

export default function FundTypePopularity({
  chartData,
}: {
  chartData: FundPopChartData;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Fund Type Popularity</CardTitle>
        <CardDescription>Frequency of fund types.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[250px]"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fundTypeName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="percentage" fill="var(--color-percentage)" radius={8}>
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
