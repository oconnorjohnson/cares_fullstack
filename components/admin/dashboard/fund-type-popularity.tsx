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

const chartConfig = {
  toolLabel: {
    label: "% of Total Requests",
  },
  "Walmart Gift Card": {
    label: "Walmart Gift Card",
    color: "hsl(var(--chart-1))",
  },
  "Arco Gift Card": {
    label: "Arco Gift Card",
    color: "hsl(var(--chart-2))",
  },
  "Bus Pass": {
    label: "Bus Pass",
    color: "hsl(var(--chart-3))",
  },
  Cash: {
    label: "Cash",
    color: "hsl(var(--chart-4))",
  },
  Invoice: {
    label: "Invoice",
    color: "hsl(var(--chart-5))",
  },
  Check: {
    label: "Check",
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
  const dataWithColors = chartData.map((data) => ({
    ...data,
    fill: (chartConfig as Record<string, { color?: string }>)[data.fundTypeName]
      ?.color,
  }));

  return (
    <Card className="w-1/3 h-full pb-8">
      <CardHeader>
        <CardTitle>Fund Type Popularity</CardTitle>
        <CardDescription>Frequency of fund types.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-end">
        <ChartContainer config={chartConfig}>
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
              nameKey="fundTypeName"
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
                        {/* <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalRequests.toLocaleString()}
                        </tspan> */}
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Most Requested
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>

          {/* <BarChart accessibilityLayer data={chartData}>
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
          </BarChart> */}
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
