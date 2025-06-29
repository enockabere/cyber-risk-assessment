import React from "react";
import { riskColors } from "@/app/constants/riskStyles";

interface CustomDotProps {
  cx: number;
  cy: number;
  payload: {
    count: number;
    rating: string;
  };
}

const CustomDot: React.FC<CustomDotProps> = ({ cx, cy, payload }) => {
  const size = Math.max(8, Math.min(25, 8 + payload.count * 2));
  const fillColor = riskColors[payload.rating as keyof typeof riskColors];

  return (
    <g>
      <circle cx={cx} cy={cy} r={size + 2} fill={fillColor} fillOpacity={0.2} />
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth={1.5}
      />
      {payload.count > 0 && (
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
        >
          {payload.count}
        </text>
      )}
    </g>
  );
};

export default CustomDot;
