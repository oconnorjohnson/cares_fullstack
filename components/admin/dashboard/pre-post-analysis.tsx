"use client";

import { Chart } from "react-charts";
import React from "react";
import type { AnswerCategories } from "@/server/actions/calculations/actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PrePostAnalysisProps {
  preAnswers: AnswerCategories;
  postAnswers: AnswerCategories;
}

export default function PrePostAnalysis({
  preAnswers,
  postAnswers,
}: PrePostAnalysisProps) {
  // Transform your data here
  const data = React.useMemo(
    () => [
      {
        label: "Pre",
        data: Object.entries(preAnswers).map(([category, value]) => ({
          category,
          value,
        })),
      },
      {
        label: "Post",
        data: Object.entries(postAnswers).map(([category, value]) => ({
          category,
          value,
        })),
      },
    ],
    [preAnswers, postAnswers],
  );

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum: any) => datum.category,
    }),
    [],
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum: { category: string; value: number }) => datum.value,
        elementType: "bar" as const, // Explicitly set as a constant of type "bar"
        scale: {
          type: "linear" as const, // Explicitly set as a constant of type "linear"
          domain: [0, 5], // Ensures the scale starts at 0
        },
      },
    ],
    [],
  );

  return (
    <Card className="p-8">
      <CardHeader>
        <CardTitle>Pre-Screen to Post-Screen Analysis</CardTitle>
        <CardDescription className="text-md">
          This chart shows the average number of each category for pre-screen
          answers and the average number of each category for post-screen
          answers. Higher values indicate a higher level of stress or difficulty
          in said category.
        </CardDescription>
      </CardHeader>
      <div style={{ width: "100%", height: "300px" }}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </div>
    </Card>
  );
}
