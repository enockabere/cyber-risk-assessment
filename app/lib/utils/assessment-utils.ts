// app/lib/assessment-utils.ts
import { StatsData, RiskLevel } from "@/app/types/assessment";

export function calculateMaturityIndex(stats: StatsData): number {
  const completionFactor =
    stats.allQuestionsAnswered && stats.backgroundCompleted ? 1 : 0.5;
  const answeredScore =
    stats.totalQuestions > 0
      ? stats.answeredQuestions / stats.totalQuestions
      : 0;

  const riskWeight: Record<Exclude<RiskLevel, null>, number> = {
    Sustainable: 1,
    Moderate: 0.7,
    Severe: 0.4,
    Critical: 0.2,
  };

  const riskFactor = stats.averageRating
    ? riskWeight[stats.averageRating] ?? 0.5
    : 0.5;

  const rawScore =
    (answeredScore * 0.5 + completionFactor * 0.2 + riskFactor * 0.3) * 100;

  return Math.round(rawScore);
}
