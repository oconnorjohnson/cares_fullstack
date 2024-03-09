"use client";

import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from "recharts";

export default function RequestAgencyChart({
  AgencyData,
}: {
  AgencyData: { agencyName: string; count: number | null }[];
}) {
  console.log(AgencyData);
  const TooltipWrapperStyle = {
    color: "black",
  };
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarChart data={AgencyData}>
        <XAxis
          dataKey={"agencyName"}
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip wrapperStyle={TooltipWrapperStyle} />
        <Bar dataKey={"requestCount"} radius={[10, 10, 0, 0]} fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
}
