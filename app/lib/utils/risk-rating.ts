// app/lib/utils/risk-rating.ts

export type RiskLevel = "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
export type RiskRating = "SUSTAINABLE" | "MODERATE" | "SEVERE" | "CRITICAL";

/**
 * Calculates the risk rating based on probability and impact
 */
export function calculateRiskRating(
  prob: RiskLevel,
  impact: RiskLevel
): RiskRating {
  const riskMatrix: Record<RiskLevel, number> = {
    VERY_LOW: 1,
    LOW: 2,
    MEDIUM: 3,
    HIGH: 4,
    VERY_HIGH: 5,
  };

  const total = riskMatrix[prob] * riskMatrix[impact];

  if (total <= 4) return "SUSTAINABLE";
  if (total <= 9) return "MODERATE";
  if (total <= 16) return "SEVERE";
  return "CRITICAL";
}
