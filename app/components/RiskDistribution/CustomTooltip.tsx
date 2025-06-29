import React from "react";

interface TooltipPayloadItem {
  payload: {
    name: string;
    value: number;
    count: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div className="bg-white text-gray-800 p-2 text-xs rounded shadow">
        <strong>{data.name}</strong>
        <div>{data.value}%</div>
        <div>{data.count} responses</div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
