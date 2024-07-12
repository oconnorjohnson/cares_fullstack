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
import { Label, Pie, PieChart } from "recharts";
interface AgencyData {
  agencyName: string;
  percentage: number;
  fill?: string;
}

interface RequestsByAgencyProps {
  chartData: AgencyData[];
  totalRequests: number;
}

// const chartConfig = {
//   agencyName: {
//     label: "agencyName",
//     color: "hsl(var(--chart-1))",
//   },
// } satisfies ChartConfig;

const chartConfig = {
  totalRequests: {
    label: "Total Requests",
  },
  toolLabel: {
    label: "% of Total Requests",
  },
  "Public Defender": {
    label: "Public Defender",
    color: "hsl(var(--chart-1))",
  },
  Probation: {
    label: "Probation",
    color: "hsl(var(--chart-2))",
  },
  RJP: {
    label: "RJP",
    color: "hsl(var(--chart-3))",
  },
  Other: {
    label: "Other",
    color: "hsl(var(--chart-4))",
  },
  AIC: {
    label: "AIC",
    color: "hsl(var(--chart-5))",
  },
  "District Attorney": {
    label: "District Attorney",
    color: "hsl(var(--chart-2))",
  },
  "Conflict Panel": {
    label: "Conflict Panel",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function RequestsByAgency({
  chartData,
  totalRequests,
}: RequestsByAgencyProps) {
  const dataWithColors = chartData.map((data) => ({
    ...data,
    fill: (chartConfig as Record<string, { color?: string }>)[data.agencyName]
      ?.color,
  }));

  return (
    <Card className="w-full sm:w-1/3 h-full pb-8">
      <CardHeader>
        <CardTitle>Requests Per Agency</CardTitle>
        <CardDescription>Percentage of total requests.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-end min-h-[200px]">
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
