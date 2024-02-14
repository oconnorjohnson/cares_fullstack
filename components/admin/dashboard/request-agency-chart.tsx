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
  AgencyData: { agencyName: string | null; requestCount: number }[];
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
        <Bar dataKey={"requestCount"} radius={[20, 20, 0, 0]} fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
}
