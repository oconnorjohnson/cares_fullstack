"use client";
import type { RequestsByRaceData } from "@/server/supabase/functions/read";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Define colors for each race category
const chartConfig = {
  count: {
    label: "Request Count",
  },
  White: {
    label: "White",
    color: "hsl(var(--chart-1))",
  },
  "Hispanic / Latino": {
    label: "Hispanic / Latino",
    color: "hsl(var(--chart-2))",
  },
  "African American / Black": {
    label: "African American / Black",
    color: "hsl(var(--chart-3))",
  },
  Asian: {
    label: "Asian",
    color: "hsl(var(--chart-4))",
  },
  "Native American / Alaska Native": {
    label: "Native American / Alaska Native",
    color: "hsl(var(--chart-5))",
  },
  "Pacific Islander": {
    label: "Pacific Islander",
    color: "hsl(var(--chart-1))",
  },
  "Two or More Races": {
    label: "Two or More Races",
    color: "hsl(var(--chart-2))",
  },
  Other: {
    label: "Other",
    color: "hsl(var(--chart-3))",
  },
  Unknown: {
    label: "Unknown",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;

export default function RequestsByRace({
  chartData,
}: {
  chartData: RequestsByRaceData;
}) {
  console.log("RequestsByRace chartData:", chartData);

  // Calculate total count for the center label
  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);

  // Transform data with colors
  const dataWithColors = chartData.map((data) => ({
    ...data,
    fill:
      (chartConfig as Record<string, { color?: string }>)[data.race]?.color ||
      "hsl(var(--chart-1))",
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
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
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
            <Pie
              data={dataWithColors}
              dataKey="count"
              nameKey="race"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Requests
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
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
