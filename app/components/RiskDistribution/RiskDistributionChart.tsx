"use client";

import React, { memo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LabelProps,
} from "recharts";
import { riskColors } from "@/app/constants/riskStyles";
import { Question } from "@/app/types";
import CustomTooltip from "./CustomTooltip";

interface RiskDistributionChartProps {
  questions: Question[];
}

interface ChartData {
  name: string;
  value: number;
  count: number;
  color: string;
}

// Helper to calculate the risk rating based on probability and impact
const calculateRiskRating = (probability?: string, impact?: string): string => {
  if (!probability || !impact) return "Unknown";
  // This logic assumes a risk matrix exists elsewhere.
  // Replace with your actual lookup logic if needed.
  type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
  type RiskRating = "Critical" | "Severe" | "Moderate" | "Low" | "Sustainable";

  const riskMatrix: Record<RiskLevel, Record<RiskLevel, RiskRating>> = {
    HIGH: { HIGH: "Critical", MEDIUM: "Severe", LOW: "Moderate" },
    MEDIUM: { HIGH: "Severe", MEDIUM: "Moderate", LOW: "Low" },
    LOW: { HIGH: "Moderate", MEDIUM: "Low", LOW: "Sustainable" },
  };

  const prob = probability.toUpperCase() as RiskLevel;
  const imp = impact.toUpperCase() as RiskLevel;

  return riskMatrix[prob]?.[imp] ?? "Unknown";
};

const RiskDistributionChart = memo(
  ({ questions }: RiskDistributionChartProps) => {
    const totalQuestions = questions.length;

    const riskCounts = questions.reduce<Record<string, number>>((acc, q) => {
      const rating = calculateRiskRating(
        q.selectedOption.probability,
        q.selectedOption.impact
      );
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    const chartData: ChartData[] = Object.entries(riskCounts).map(
      ([rating, count]) => ({
        name: rating,
        value: parseFloat(((count / totalQuestions) * 100).toFixed(2)),
        count,
        color: riskColors[rating as keyof typeof riskColors] || "#999999",
      })
    );

    const renderLabel = ({ name, value }: LabelProps): string =>
      `${name}: ${value}%`;

    return (
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={renderLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

RiskDistributionChart.displayName = "RiskDistributionChart";
export default RiskDistributionChart;
