"use client";

import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from "recharts";
import type { AnswerCategories } from "@/server/actions/calculations/actions";
interface PrePostAnalysisProps {
  preAnswers: AnswerCategories;
  postAnswers: AnswerCategories;
}
export default function PrePostAnalysis({ preAnswers }: PrePostAnalysisProps) {
  return <></>;
}
