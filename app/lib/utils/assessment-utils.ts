import { StatsData, RiskLevel } from "@/app/types/assessment";

export function calculateMaturityIndex(stats: StatsData | null): number {
  if (!stats) {
    console.log("⚠️ No stats provided to calculateMaturityIndex");
    return 0;
  }
  const {
    totalQuestions = 0,
    answeredQuestions = 0,
    allQuestionsAnswered = false,
    backgroundCompleted = false,
    averageRating = null,
    assetCount = 0,
  } = stats;
  if (totalQuestions === 0) {
    console.log("⚠️ No questions exist yet");
    return 0;
  }
  const questionCompletionRate = answeredQuestions / totalQuestions;
  const questionScore = questionCompletionRate * 30;

  const allQuestionsBonus = allQuestionsAnswered ? 10 : 0;
  const completionScore = questionScore + allQuestionsBonus;

  const backgroundScore = backgroundCompleted ? 20 : 0;

  const riskScores: Record<Exclude<RiskLevel, null>, number> = {
    Sustainable: 30,
    Moderate: 20,
    Severe: 10,
    Critical: 5,
  };

  const riskScore =
    averageRating && averageRating in riskScores
      ? riskScores[averageRating as Exclude<RiskLevel, null>]
      : 0;
  const assetScore = assetCount > 0 ? 10 : 0;
  const totalScore = completionScore + backgroundScore + riskScore + assetScore;
  const finalScore = Math.min(Math.round(totalScore), 100);

  return finalScore;
}

export function calculateMaturityIndexAlternative(
  stats: StatsData | null
): number {
  if (!stats) return 0;

  const {
    totalQuestions = 0,
    answeredQuestions = 0,
    allQuestionsAnswered = false,
    backgroundCompleted = false,
    averageRating = null,
    assetCount = 0,
  } = stats;

  if (totalQuestions === 0) return 0;

  const factors = {
    completion: {
      value:
        allQuestionsAnswered && backgroundCompleted
          ? 1
          : (answeredQuestions / totalQuestions) *
            (backgroundCompleted ? 1 : 0.7),
      weight: 0.4,
    },
    riskQuality: {
      value: (() => {
        if (!averageRating) return 0;
        const qualityMap: Record<Exclude<RiskLevel, null>, number> = {
          Sustainable: 1.0,
          Moderate: 0.7,
          Severe: 0.4,
          Critical: 0.1,
        };
        return qualityMap[averageRating as Exclude<RiskLevel, null>] || 0;
      })(),
      weight: 0.45,
    },
    assetCoverage: {
      value: assetCount > 0 ? 1 : 0,
      weight: 0.15,
    },
  };
  const weightedScore = Object.values(factors).reduce(
    (sum, factor) => sum + factor.value * factor.weight,
    0
  );

  const finalScore = Math.round(weightedScore * 100);

  return finalScore;
}

export function getMaturityLevel(score: number): {
  level: string;
  description: string;
  color: string;
} {
  if (score >= 80) {
    return {
      level: "Advanced",
      description:
        "Excellent risk management maturity with comprehensive coverage",
      color: "text-green-600",
    };
  } else if (score >= 60) {
    return {
      level: "Developing",
      description: "Good progress with room for improvement in risk management",
      color: "text-yellow-600",
    };
  } else if (score >= 40) {
    return {
      level: "Basic",
      description: "Basic risk awareness but significant gaps remain",
      color: "text-orange-600",
    };
  } else {
    return {
      level: "Initial",
      description:
        "Limited risk management maturity - immediate attention needed",
      color: "text-red-600",
    };
  }
}
