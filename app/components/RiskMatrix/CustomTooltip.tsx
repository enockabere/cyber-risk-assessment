import React from "react";
import { riskColors } from "@/app/constants/riskStyles";

interface TooltipPayload {
  payload: {
    rating: string;
    impactLabel: string;
    probabilityLabel: string;
    count: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    const color = riskColors[data.rating as keyof typeof riskColors];

    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs">
        <div className="font-semibold mb-1" style={{ color }}>
          {data.rating} Risk
        </div>
        <div>Impact: {data.impactLabel}</div>
        <div>Probability: {data.probabilityLabel}</div>
        <div>
          Count: <span className="font-bold">{data.count}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
