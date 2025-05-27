import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

type RatingLevel = "Sustainable" | "Moderate" | "Severe" | "Critical";

const riskMatrix: Record<string, Record<string, RatingLevel>> = {
  VERY_LOW: {
    VERY_LOW: "Sustainable",
    LOW: "Sustainable",
    MEDIUM: "Sustainable",
    HIGH: "Moderate",
    VERY_HIGH: "Severe",
  },
  LOW: {
    VERY_LOW: "Sustainable",
    LOW: "Sustainable",
    MEDIUM: "Moderate",
    HIGH: "Severe",
    VERY_HIGH: "Critical",
  },
  MEDIUM: {
    VERY_LOW: "Sustainable",
    LOW: "Moderate",
    MEDIUM: "Moderate",
    HIGH: "Severe",
    VERY_HIGH: "Critical",
  },
  HIGH: {
    VERY_LOW: "Sustainable",
    LOW: "Moderate",
    MEDIUM: "Severe",
    HIGH: "Critical",
    VERY_HIGH: "Critical",
  },
  VERY_HIGH: {
    VERY_LOW: "Moderate",
    LOW: "Severe",
    MEDIUM: "Severe",
    HIGH: "Critical",
    VERY_HIGH: "Critical",
  },
};

const ratingColors = {
  Sustainable: "#00D2AA", // Vibrant teal
  Moderate: "#FFB020", // Golden orange
  Severe: "#FF6B35", // Coral red
  Critical: "#FF1744", // Bright red
};

const ratingGradients = {
  Sustainable: "from-emerald-400 to-teal-500",
  Moderate: "from-yellow-400 to-orange-500",
  Severe: "from-orange-400 to-red-500",
  Critical: "from-red-500 to-pink-600",
};

interface Props {
  questions: {
    selectedOption: {
      probability?: string;
      impact?: string;
    };
  }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700">
        <div
          className="font-semibold text-lg mb-2"
          style={{ color: ratingColors[data.rating as RatingLevel] }}
        >
          {data.rating} Risk
        </div>
        <div className="space-y-1 text-sm">
          <div>
            Impact: <span className="font-medium">{data.impactLabel}</span>
          </div>
          <div>
            Probability:{" "}
            <span className="font-medium">{data.probabilityLabel}</span>
          </div>
          <div>
            Count: <span className="font-bold text-blue-300">{data.count}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const size = Math.max(12, Math.min(40, 12 + payload.count * 3));

  return (
    <g>
      {/* Outer glow effect */}
      <circle
        cx={cx}
        cy={cy}
        r={size + 4}
        fill={ratingColors[payload.rating as RatingLevel]}
        fillOpacity={0.2}
      />
      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={ratingColors[payload.rating as RatingLevel]}
        stroke="#ffffff"
        strokeWidth={2}
        style={{
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
        }}
      />
      {/* Count text */}
      {payload.count > 0 && (
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          {payload.count}
        </text>
      )}
    </g>
  );
};

export default function RiskMatrixChart({ questions }: Props) {
  const levelLabels = ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"];
  const displayLabels = ["Very Low", "Low", "Medium", "High", "Very High"];

  // Create a matrix to count risks in each cell
  const riskCounts: Record<
    string,
    Record<string, { count: number; rating: RatingLevel }>
  > = {};

  // Initialize matrix
  levelLabels.forEach((impact) => {
    riskCounts[impact] = {};
    levelLabels.forEach((probability) => {
      const rating = riskMatrix[probability]?.[impact] || "Sustainable";
      riskCounts[impact][probability] = { count: 0, rating };
    });
  });

  // Count risks in each cell
  questions.forEach((q) => {
    const prob = q.selectedOption.probability?.toUpperCase();
    const impact = q.selectedOption.impact?.toUpperCase();
    if (prob && impact && riskCounts[impact]?.[prob]) {
      riskCounts[impact][prob].count += 1;
    }
  });

  // Prepare data for the chart
  const chartData = levelLabels.flatMap((impact, yIndex) =>
    levelLabels.map((probability, xIndex) => {
      const cell = riskCounts[impact][probability];
      return {
        x: xIndex + 1,
        y: yIndex + 1,
        count: cell.count,
        rating: cell.rating,
        impactLabel: displayLabels[xIndex],
        probabilityLabel: displayLabels[yIndex],
        size: Math.max(12, Math.min(40, 12 + cell.count * 3)),
      };
    })
  );

  // Create legend data
  const legendData = Object.entries(ratingColors).map(([rating, color]) => ({
    value: rating,
    type: "circle",
    color: color,
  }));

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 shadow-2xl border border-gray-200">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Risk Assessment Matrix
        </h2>
        <p className="text-gray-600 text-sm">
          Interactive visualization of risks by impact and probability levels
        </p>
      </div>

      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, bottom: 80, left: 80 }}
            data={chartData}
          >
            <defs>
              {Object.entries(ratingColors).map(([rating, color]) => (
                <linearGradient
                  key={rating}
                  id={`gradient-${rating}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth={1}
            />

            <XAxis
              type="number"
              dataKey="x"
              domain={[0.5, 5.5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => displayLabels[value - 1]}
              axisLine={{ stroke: "#64748b", strokeWidth: 2 }}
              tickLine={{ stroke: "#64748b", strokeWidth: 1 }}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
              label={{
                value: "Impact Level",
                position: "insideBottom",
                offset: -10,
                style: {
                  textAnchor: "middle",
                  fill: "#1e293b",
                  fontSize: 14,
                  fontWeight: "bold",
                },
              }}
            />

            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 5.5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => displayLabels[value - 1]}
              axisLine={{ stroke: "#64748b", strokeWidth: 2 }}
              tickLine={{ stroke: "#64748b", strokeWidth: 1 }}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
              label={{
                value: "Probability Level",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fill: "#1e293b",
                  fontSize: 14,
                  fontWeight: "bold",
                },
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Scatter data={chartData} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {Object.entries(ratingColors).map(([rating, color]) => (
          <div key={rating} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(ratingColors).map(([rating, color]) => {
          const count = chartData
            .filter((d) => d.rating === rating)
            .reduce((sum, d) => sum + d.count, 0);
          return (
            <div
              key={rating}
              className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {rating}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
