"use client";

import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function RequestAgencyChart({
  AgencyData,
}: {
  AgencyData: { agencyName: string | null; requestCount: number }[];
}) {
  console.log(AgencyData);
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarChart data={AgencyData}>
        <CartesianGrid strokeDasharray="3 3" />
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
        <Tooltip />
        <Bar dataKey={"requestCount"} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
