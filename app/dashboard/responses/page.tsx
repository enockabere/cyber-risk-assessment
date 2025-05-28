"use client";

import React, { useEffect, useState, memo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  FileText,
  Activity,
} from "lucide-react";

// Mock components - replace with your actual imports
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 animate-pulse ${className}`}></div>
);

// Interfaces
interface BackgroundResponse {
  field: { label: string; fieldType: string };
  value: string;
}

interface Question {
  position: number;
  text: string;
  selectedOption: {
    text: string;
    probability?: string;
    impact?: string;
    controlDescription?: string;
    residualProbability?: string;
    residualImpact?: string;
  };
}

// Risk matrix and styles
const riskMatrix: Record<string, Record<string, string>> = {
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

const riskColors = {
  Sustainable: "#00D2AA",
  Moderate: "#FFB020",
  Severe: "#FF6B35",
  Critical: "#FF1744",
};

const riskStyles: Record<
  string,
  { bg: string; tooltip: string; icon: string }
> = {
  Critical: {
    bg: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
    tooltip: "Immediate action required",
    icon: "🔴",
  },
  Severe: {
    bg: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg",
    tooltip: "High priority for mitigation",
    icon: "🟠",
  },
  Moderate: {
    bg: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg",
    tooltip: "Monitor and address as needed",
    icon: "🟡",
  },
  Sustainable: {
    bg: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
    tooltip: "Low risk, maintain controls",
    icon: "🟢",
  },
  "Not Rated": {
    bg: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg",
    tooltip: "No rating available",
    icon: "⚪",
  },
};

// Utility functions
function calculateRiskRating(prob?: string, impact?: string): string {
  if (!prob || !impact) return "Not Rated";
  const p = prob.toUpperCase();
  const i = impact.toUpperCase();
  return riskMatrix[p]?.[i] || "Unknown";
}

function getAverageRiskRating(questions: Question[]): string | null {
  const ratingOrder = ["Sustainable", "Moderate", "Severe", "Critical"];
  const ratingScores = { Sustainable: 0, Moderate: 1, Severe: 2, Critical: 3 };

  const validRatings = questions
    .map((q) => {
      const prob = q.selectedOption.probability?.toUpperCase();
      const impact = q.selectedOption.impact?.toUpperCase();
      return prob && impact ? riskMatrix[prob]?.[impact] : null;
    })
    .filter((r): r is keyof typeof ratingScores => r !== undefined);

  if (validRatings.length === 0) return null;

  const total = validRatings.reduce((sum, r) => sum + ratingScores[r], 0);
  const avg = Math.round(total / validRatings.length);
  return ratingOrder[avg];
}

// Enhanced Risk Matrix Chart Component
const RiskMatrixChart = memo(({ questions }: { questions: Question[] }) => {
  const levelLabels = ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"];
  const displayLabels = ["Very Low", "Low", "Medium", "High", "Very High"];

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
      };
    })
  );

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const size = Math.max(8, Math.min(25, 8 + payload.count * 2));

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={size + 2}
          fill={riskColors[payload.rating as keyof typeof riskColors]}
          fillOpacity={0.2}
        />
        <circle
          cx={cx}
          cy={cy}
          r={size}
          fill={riskColors[payload.rating as keyof typeof riskColors]}
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs">
          <div
            className="font-semibold mb-1"
            style={{
              color: riskColors[data.rating as keyof typeof riskColors],
            }}
          >
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
            tickFormatter={(value) => displayLabels[value - 1]}
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
            tickFormatter={(value) => displayLabels[value - 1]}
            tick={{ fontSize: 10 }}
            label={{
              value: "Probability",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={chartData} shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
});

// Risk Distribution Chart
const RiskDistributionChart = memo(
  ({ questions }: { questions: Question[] }) => {
    const riskCounts = questions.reduce((acc, q) => {
      const rating = calculateRiskRating(
        q.selectedOption.probability,
        q.selectedOption.impact
      );
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(riskCounts).map(([rating, count]) => ({
      name: rating,
      value: count,
      color: riskColors[rating as keyof typeof riskColors] || "#gray",
    }));

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
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

// Enhanced Metric Card
const MetricCard = memo(
  ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = "blue",
    badge = false,
    riskRating,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    trend?: "up" | "down" | "stable";
    color?: string;
    badge?: boolean;
    riskRating?: string;
  }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      red: "from-red-500 to-red-600",
      orange: "from-orange-500 to-orange-600",
      purple: "from-purple-500 to-purple-600",
    };

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${
            colorClasses[color as keyof typeof colorClasses]
          } p-4`}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90">{title}</p>

              {badge && riskRating ? (
                (() => {
                  const style =
                    riskStyles[riskRating] ?? riskStyles["Not Rated"];
                  return (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mt-2 ${style.bg}`}
                    >
                      <span>{style.icon}</span>
                      {value}
                    </div>
                  );
                })()
              ) : (
                <p className="text-2xl font-bold">{value}</p>
              )}

              {subtitle && (
                <p className="text-xs opacity-80 mt-1">{subtitle}</p>
              )}
            </div>

            <Icon className="h-8 w-8 text-white opacity-80" />
          </div>
        </div>
        {trend && (
          <div className="px-4 py-2 bg-gray-50">
            <div
              className={`flex items-center gap-1 text-xs ${
                trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              <TrendingUp className="h-3 w-3" />
              <span className="capitalize">{trend} trend</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Enhanced Question Card
const QuestionCard = memo(
  ({ question, index }: { question: Question; index: number }) => {
    const { probability, impact, controlDescription } = question.selectedOption;
    const rating = calculateRiskRating(probability, impact);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <h3 className="font-medium text-gray-800 text-sm leading-relaxed">
                {question.text}
              </h3>
            </div>
            <p className="text-xs text-gray-600 ml-9">
              <span className="font-medium text-gray-700">Selected:</span>{" "}
              {question.selectedOption?.text ?? (
                <span className="italic text-gray-400">N/A</span>
              )}
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              riskStyles[rating]?.bg ?? riskStyles["Not Rated"].bg
            }`}
          >
            <span>{riskStyles[rating].icon}</span>
            {rating}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs ml-9">
          {probability && (
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500 font-medium">Probability</p>
              <p className="text-gray-800 font-semibold">{probability}</p>
            </div>
          )}
          {impact && (
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500 font-medium">Impact</p>
              <p className="text-gray-800 font-semibold">{impact}</p>
            </div>
          )}
          {controlDescription && (
            <div className="bg-blue-50 p-2 rounded sm:col-span-2 lg:col-span-1">
              <p className="text-blue-600 font-medium">Control Measure</p>
              <p className="text-blue-800 font-semibold">
                {controlDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Main Component
export default function ResponsesPage() {
  const [backgroundResponses, setBackgroundResponses] = useState<
    BackgroundResponse[]
  >([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const averageRating = getAverageRiskRating(questions);
  const highestRisk =
    questions.length > 0
      ? questions.reduce((max, q) => {
          const rating = calculateRiskRating(
            q.selectedOption.probability,
            q.selectedOption.impact
          );
          const ratingOrder = ["Sustainable", "Moderate", "Severe", "Critical"];
          return ratingOrder.indexOf(rating) > ratingOrder.indexOf(max)
            ? rating
            : max;
        }, "Sustainable")
      : "N/A";

  const controlsCount = questions.filter(
    (q) => q.selectedOption.controlDescription
  ).length;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/assessment/responses");
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setBackgroundResponses(data.backgroundResponses || []);
          setQuestions(data.questions || []);
        }
      } catch (err) {
        setError("Failed to load assessment responses.");
        console.error("Error fetching responses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Risk Assessment Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive overview of your risk profile and mitigation
              strategies
            </p>
          </div>
          {averageRating && (
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md">
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">
                  Overall Risk Rating
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold mt-1 ${riskStyles[averageRating].bg}`}
                >
                  <span className="text-xl">
                    {riskStyles[averageRating].icon}
                  </span>
                  {averageRating}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {error}
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Assessments"
            value={questions.length}
            subtitle="Risk scenarios evaluated"
            icon={FileText}
            color="blue"
          />
          <MetricCard
            title="Highest Risk Level"
            value={highestRisk}
            subtitle="Requires immediate attention"
            icon={AlertTriangle}
            color="red"
            badge={true}
            riskRating={highestRisk}
          />
          <MetricCard
            title="Control Measures"
            value={controlsCount}
            subtitle={`${Math.round(
              (controlsCount / questions.length) * 100
            )}% coverage`}
            icon={Shield}
            color="green"
          />
          <MetricCard
            title="Risk Categories"
            value={
              new Set(
                questions.map((q) =>
                  calculateRiskRating(
                    q.selectedOption.probability,
                    q.selectedOption.impact
                  )
                )
              ).size
            }
            subtitle="Distinct risk levels identified"
            icon={Activity}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Risk Matrix Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Risk Assessment Matrix
                </h2>
                <p className="text-gray-600 text-sm">
                  Visual mapping of probability vs impact
                </p>
              </div>
            </div>
            <RiskMatrixChart questions={questions} />
            <div className="mt-4 flex flex-wrap gap-3">
              {Object.entries(riskColors).map(([rating, color]) => (
                <div key={rating} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-medium text-gray-600">
                    {rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Risk Distribution
                </h2>
                <p className="text-gray-600 text-sm">Breakdown by severity</p>
              </div>
            </div>
            <RiskDistributionChart questions={questions} />
          </div>
        </div>

        {/* Background Information */}
        {backgroundResponses.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Background Information
                </h2>
                <p className="text-gray-600 text-sm">
                  Contextual details for the assessment
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {backgroundResponses.map((item, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {item.field.label}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {item.value || (
                      <span className="text-gray-400 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Assessment Details */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Risk Assessment Details
              </h2>
              <p className="text-gray-600 text-sm">
                Individual risk scenarios and their evaluations
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No risk assessments completed yet
                </p>
              </div>
            ) : (
              questions.map((q, index) => (
                <QuestionCard
                  key={q.position || index}
                  question={q}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
