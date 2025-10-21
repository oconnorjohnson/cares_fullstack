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
  decreasedCount?: number;
}

const categoryMapping: Record<string, string> = {
  housingSituation: "Housing Situation",
  housingQuality: "Housing Quality",
  utilityStress: "Utility Stress",
  foodInsecurityStress: "Food Insecurity Stress",
  foodMoneyStress: "Food Money Stress",
  transpoConfidence: "Transportation Confidence",
  transpoStress: "Transportation Stress",
  financialDifficulties: "Financial Difficulties",
};

const chartConfig = {
  preValue: {
    label: "Average Pre-Screen Answer",
    color: "hsl(var(--chart-1))",
  },
  postValue: {
    label: "Average Post-Screen Answer",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function PrePostAnalysis({
  chartData,
  decreasedCount,
}: PrePostAnalysisProps) {
  const transformedChartData = chartData.map((data) => ({
    ...data,
    category: categoryMapping[data.category] || data.category,
  }));
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Pre/Post Screen Analysis</CardTitle>
        <CardDescription>Averages per category.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[300px]"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={transformedChartData}>
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
      <CardFooter className="flex-col items-start gap-2 text-sm pt-8">
        <div className="flex gap-2 font-medium leading-none">
          What effect are RFF dollars having on our clients?
          {decreasedCount !== undefined && <TrendingUp className="h-4 w-4" />}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing average answer per category before and after receiving aid.
          {decreasedCount !== undefined && (
            <>
              {" "}
              <span className="font-medium text-foreground">
                {decreasedCount}
              </span>{" "}
              {decreasedCount === 1 ? "request" : "requests"} saw improved
              outcomes (decreased scores).
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
