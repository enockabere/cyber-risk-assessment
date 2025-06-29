"use client";

import React, { memo, FC } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import CustomDot from "./CustomDot";
import CustomTooltip from "./CustomTooltip";
import {
  levelLabels,
  displayLabels,
  riskMatrix,
} from "@/app/constants/riskStyles";
import { Question } from "@/app/types";

interface RiskMatrixChartProps {
  questions: Question[];
}

interface ChartPoint {
  x: number;
  y: number;
  count: number;
  rating: string;
  impactLabel: string;
  probabilityLabel: string;
}

const RiskMatrixChart: FC<RiskMatrixChartProps> = memo(({ questions }) => {
  const riskCounts: Record<
    string,
    Record<string, { count: number; rating: string }>
  > = {};

  levelLabels.forEach((impact) => {
    riskCounts[impact] = {};
    levelLabels.forEach((probability) => {
      const rating = riskMatrix[probability]?.[impact] || "Sustainable";
      riskCounts[impact][probability] = { count: 0, rating };
    });
  });

  questions.forEach((q) => {
    const prob = q.selectedOption.probability?.toUpperCase();
    const impact = q.selectedOption.impact?.toUpperCase();
    if (prob && impact && riskCounts[impact]?.[prob]) {
      riskCounts[impact][prob].count += 1;
    }
  });

  const chartData: ChartPoint[] = levelLabels.flatMap((impact, yIndex) =>
    levelLabels.map((probability, xIndex) => {
      const cell = riskCounts[impact][probability];
      return {
        x: xIndex + 1,
        y: yIndex + 1,
        count: cell.count,
        rating: cell.rating,
        impactLabel: displayLabels[xIndex],
        probabilityLabel: displayLabels[yIndex],
      };
    })
  );

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          data={chartData}
          margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.3)"
          />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0.5, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value: number) => displayLabels[value - 1]}
            tick={{ fontSize: 10 }}
            label={{
              value: "Impact",
              position: "insideBottom",
              offset: -5,
              style: { fontSize: 12 },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0.5, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value: number) => displayLabels[value - 1]}
            tick={{ fontSize: 10 }}
            label={{
              value: "Probability",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={chartData}
            shape={(props) => <CustomDot {...props} />}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
});

RiskMatrixChart.displayName = "RiskMatrixChart";
export default RiskMatrixChart;
