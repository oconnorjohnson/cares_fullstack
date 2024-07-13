"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
import { Label, Pie, PieChart } from "recharts";

interface AgencyData {
  fundTypeId: number;
  dollars: number;
  fundTypeName: string;
  fill?: string;
}

interface DollarsSpentProps {
  chartData: AgencyData[];
  totalSpent: number;
}

// const chartConfig = {
//   agencyName: {
//     label: "agencyName",
//     color: "hsl(var(--chart-1))",
//   },
// } satisfies ChartConfig;

const chartConfig = {
  totalSpent: {
    label: "Total $ Spent",
  },
  toolLabel: {
    label: "$ Spent Per Fund Category",
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
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

export default function DollarsSpent({
  chartData,
  totalSpent,
}: DollarsSpentProps) {
  const dataWithColors = chartData.map((data) => ({
    ...data,
    fill: (chartConfig as Record<string, { color?: string }>)[data.fundTypeName]
      ?.color,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Requests Per Agency</CardTitle>
        <CardDescription>Percentage of total requests.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
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
              dataKey="dollars"
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
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalSpent.toLocaleString()}
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
      <CardFooter className="flex-col items-start gap-2 text-sm pt-8">
        <div className="flex gap-2 font-medium leading-none">
          What agency requests the most?
        </div>
        <div className="leading-none text-muted-foreground">
          Showing percentage of total requests submitted on behalf of each
          agency.
        </div>
      </CardFooter>
    </Card>
  );
}
