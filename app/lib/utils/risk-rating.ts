// app/lib/utils/risk-rating.ts

export const RiskLevel = {
  VERY_LOW: "VERY_LOW",
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  VERY_HIGH: "VERY_HIGH",
} as const;

export type RiskLevel = keyof typeof RiskLevel;

export const RiskRating = {
  SUSTAINABLE: "SUSTAINABLE",
  MODERATE: "MODERATE",
  SEVERE: "SEVERE",
  CRITICAL: "CRITICAL",
} as const;

export type RiskRating = keyof typeof RiskRating;

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
