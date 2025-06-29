import { ReactNode } from "react";

export interface BackgroundResponse {
  field: { label: string; fieldType: string };
  value: string;
}

export interface Question {
  position: number;
  text: string;
  assetId?: string;
  assetName?: string; // <-- Add this line
  selectedOption: {
    text: string;
    probability?: string;
    impact?: string;
    controlDescription?: string;
    residualProbability?: string;
    residualImpact?: string;
  };
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "stable";
  color?: string;
  badge?: boolean;
  riskRating?: string;
}
