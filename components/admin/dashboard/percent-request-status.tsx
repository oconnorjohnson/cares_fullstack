"use client";
import type { PercentRequestStatusReturn } from "@/server/supabase/functions/read";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

const chartConfig = {
  toolLabel: {
    label: "% of Total Requests",
  },
  paid: {
    label: "Paid",
    color: "hsl(var(--chart-2))",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-3))",
  },
  pendingApproval: {
    label: "Pending Approval",
    color: "hsl(var(--chart-4))",
  },
  denied: {
    label: "Denied",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function PercentRequestStatus({
  chartData,
}: {
  chartData: PercentRequestStatusReturn;
}) {
  const dataWithColors = chartData.map((data) => ({
    ...data,
    fill: (chartConfig as Record<string, { color?: string }>)[
      data.RequestStatusOptions
    ]?.color,
  }));
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Requests Per Process Stage</CardTitle>
        <CardDescription>Percentage of total requests.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={dataWithColors}
            innerRadius={30}
            outerRadius={100}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent hideLabel nameKey="RequestStatusOptions" />
              }
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="percentage" />
          </RadialBarChart>
        </ChartContainer>
        {/* <ChartContainer
          className="mx-auto aspect-square max-h-[300px]"
          config={chartConfig}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent labelKey="toolLabel" indicator="dashed" />
              }
            />
            <Pie
              data={dataWithColors}
              dataKey="percentage"
              nameKey="agencyName"
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
                          {totalRequests.toLocaleString()}
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
        </ChartContainer> */}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-8">
        <div className="flex gap-2 font-medium leading-none">
          What status are requests in?
        </div>
        <div className="leading-none text-muted-foreground">
          Showing percentage of total requests per status.
        </div>
      </CardFooter>
    </Card>
  );
}
