"use client";
import type { RequestsByRaceData } from "@/server/supabase/functions/read";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const chartConfig = {
  count: {
    label: "Request Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function RequestsByRace({
  chartData,
}: {
  chartData: RequestsByRaceData;
}) {
  // Transform data for bar chart
  const dataWithColors = chartData.map((data) => ({
    ...data,
    fill: "hsl(var(--chart-1))",
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Requests by Client Race</CardTitle>
        <CardDescription>
          Breakdown of requests by client demographics.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full h-[300px]"
        >
          <BarChart data={dataWithColors} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="race"
              width={100}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => (
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{item.payload.race}</div>
                      <div className="text-sm text-muted-foreground">
                        {value} requests ({item.payload.percentage}%)
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-8">
        <div className="flex gap-2 font-medium leading-none">
          Demographic distribution of requests
        </div>
        <div className="leading-none text-muted-foreground">
          Showing count and percentage of requests by client race.
        </div>
      </CardFooter>
    </Card>
  );
}
