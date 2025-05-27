"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  rating: "Sustainable" | "Moderate" | "Severe" | "Critical";
}

const colorMap: Record<Props["rating"], string> = {
  Sustainable: "rgba(34,197,94,0.8)",
  Moderate: "rgba(234,179,8,0.8)",
  Severe: "rgba(251,146,60,0.8)",
  Critical: "rgba(239,68,68,0.8)",
};

export default function AverageRiskRatingChart({ rating }: Props) {
  const chartData: ChartData<"doughnut"> = {
    labels: [rating],
    datasets: [
      {
        data: [1, 0], // add a second value to make it render a segment
        backgroundColor: [colorMap[rating], "#e5e7eb"], // Tailwind gray-200
        borderWidth: 0,
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "70%", // ✅ properly placed here
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: () => `Rating: ${rating}`,
        },
      },
    },
  };

  return <Doughnut data={chartData} options={chartOptions} />;
}
