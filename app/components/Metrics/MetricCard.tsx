"use client";

import React, { memo } from "react";
import { TrendingUp } from "lucide-react";
import { riskStyles, colorClasses } from "@/app/constants/riskStyles";
import { ComponentType } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "stable";
  color?: string;
  badge?: boolean;
  riskRating?: string;
}

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
  }: MetricCardProps) => {
    const riskStyle =
      badge && riskRating
        ? riskStyles[riskRating] ?? riskStyles["Not Rated"]
        : null;

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

              {riskStyle ? (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mt-2 ${riskStyle.bg}`}
                >
                  <span>{riskStyle.icon}</span>
                  {value}
                </div>
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

MetricCard.displayName = "MetricCard";
export default MetricCard;
