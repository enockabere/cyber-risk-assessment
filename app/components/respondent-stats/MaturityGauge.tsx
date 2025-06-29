"use client";

import ReactSpeedometer from "react-d3-speedometer";

interface Props {
  value: number;
  assetCount: number;
}
export default function MaturityGauge({ value, assetCount }: Props) {
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
          segments={3}
          segmentColors={["#2ecc71", "#f1c40f", "#c0392b"]}
          currentValueText={`Maturity Index: ${value}`}
          needleColor="#000000"
          ringWidth={30}
          needleHeightRatio={0.7}
          width={220}
          height={150}
          textColor="#333"
        />
      </div>

      <p className="mt-4 text-green-700 text-xl font-semibold">{value}</p>

      <div className="mt-2 text-sm text-gray-600">
        Total Assets Assigned:{" "}
        <span className="font-semibold text-gray-800">{assetCount}</span>
      </div>
    </div>
  );
}
