"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SDOHPercentages } from "@/server/supabase/functions/read";

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;
export default function SDOHCategoryDistribution({
  chartData,
}: {
  chartData: SDOHPercentages;
}) {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Social Determinants of Health</CardTitle>
        <CardDescription>By total requests.</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis dataKey="SDOHCategory" />
            <Radar
              dataKey="percentage"
              fill="var(--color-percentage)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          What SDOH categories are most common?
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Showing percentage of total requests containing each SDOH category.
        </div>
      </CardFooter>
    </Card>
  );
}
