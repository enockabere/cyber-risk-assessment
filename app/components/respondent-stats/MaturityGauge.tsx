"use client";

import ReactSpeedometer from "react-d3-speedometer";

interface Props {
  value: number;
  assetCount: number;
  maturityLevel?: {
    level: string;
    description: string;
    color: string;
  } | null;
  loading?: boolean;
}

export default function MaturityGauge({
  value,
  assetCount,
  maturityLevel,
  loading = false,
}: Props) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getSpeedometerColors = (): string[] => {
    return ["#dc2626", "#ea580c", "#d97706", "#eab308", "#16a34a"];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow border border-gray-100 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Maturity Index
        </h3>
        <div className="flex justify-center items-center h-[150px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow border border-gray-100 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Maturity Index
      </h3>

      <div className="flex justify-center">
        <ReactSpeedometer
          value={value}
          minValue={0}
          maxValue={100}
          segments={5}
          segmentColors={getSpeedometerColors()}
          currentValueText={`${value}%`}
          needleColor="#1f2937"
          ringWidth={25}
          needleHeightRatio={0.7}
          width={220}
          height={150}
          textColor="#374151"
          valueFormat=".0f"
          customSegmentStops={[0, 20, 40, 60, 80, 100]}
        />
      </div>
      <div className="mt-4">
        <p className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</p>
        {maturityLevel && (
          <>
            <p className={`text-sm font-semibold ${maturityLevel.color} mt-1`}>
              {maturityLevel.level}
            </p>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              {maturityLevel.description}
            </p>
          </>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          Assets Assigned:{" "}
          <span className="font-semibold text-gray-800">{assetCount}</span>
        </div>
      </div>
      {value > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Initial</span>
            <span>Basic</span>
            <span>Developing</span>
            <span>Advanced</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                value >= 80
                  ? "bg-green-500"
                  : value >= 60
                  ? "bg-yellow-500"
                  : value >= 40
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${Math.min(value, 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
