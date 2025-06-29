import { StatsData, RiskLevel } from "@/app/types/assessment";

export function calculateMaturityIndex(stats: StatsData | null): number {
  // Handle null stats case
  if (!stats) {
    console.log("⚠️ No stats provided to calculateMaturityIndex");
    return 0;
  }

  console.log("🧮 Calculating maturity with stats:", stats);

  // Destructure with safe defaults
  const {
    totalQuestions = 0,
    answeredQuestions = 0,
    allQuestionsAnswered = false,
    backgroundCompleted = false,
    averageRating = null,
    assetCount = 0,
  } = stats;

  // If no questions exist yet, return 0
  if (totalQuestions === 0) {
    console.log("⚠️ No questions exist yet");
    return 0;
  }

  // 1. COMPLETION SCORE (0-40 points)
  // Progressive scoring for question completion
  const questionCompletionRate = answeredQuestions / totalQuestions;
  const questionScore = questionCompletionRate * 30; // 0-30 points

  // Bonus for completing ALL questions
  const allQuestionsBonus = allQuestionsAnswered ? 10 : 0; // 0-10 points
  const completionScore = questionScore + allQuestionsBonus;

  // 2. BACKGROUND SCORE (0-20 points)
  const backgroundScore = backgroundCompleted ? 20 : 0;

  // 3. RISK MANAGEMENT SCORE (0-30 points)
  // Better risk ratings = higher maturity
  const riskScores: Record<Exclude<RiskLevel, null>, number> = {
    Sustainable: 30, // Excellent risk management
    Moderate: 20, // Good risk management
    Severe: 10, // Poor risk management
    Critical: 5, // Very poor risk management
  };

  const riskScore =
    averageRating && averageRating in riskScores
      ? riskScores[averageRating as Exclude<RiskLevel, null>]
      : 0; // No rating = no points

  // 4. ASSET COVERAGE SCORE (0-10 points)
  // Having assets shows organizational scope
  const assetScore = assetCount > 0 ? 10 : 0;

  // TOTAL SCORE CALCULATION
  const totalScore = completionScore + backgroundScore + riskScore + assetScore;
  const finalScore = Math.min(Math.round(totalScore), 100); // Cap at 100

  // Enhanced logging
  console.log("📊 Maturity calculation breakdown:", {
    questionCompletionRate: `${(questionCompletionRate * 100).toFixed(1)}%`,
    questionScore: questionScore.toFixed(1),
    allQuestionsBonus,
    completionScore: completionScore.toFixed(1),
    backgroundScore,
    averageRating,
    riskScore,
    assetCount,
    assetScore,
    totalScore: totalScore.toFixed(1),
    finalScore,
  });

  return finalScore;
}

// Alternative implementation with different weighting strategy
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

  // Weighted factors approach (each factor 0-1, then weighted)
  const factors = {
    // Assessment Completion (40% weight)
    completion: {
      value:
        allQuestionsAnswered && backgroundCompleted
          ? 1
          : (answeredQuestions / totalQuestions) *
            (backgroundCompleted ? 1 : 0.7),
      weight: 0.4,
    },

    // Risk Quality (45% weight) - Most important factor
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

    // Asset Coverage (15% weight)
    assetCoverage: {
      value: assetCount > 0 ? 1 : 0,
      weight: 0.15,
    },
  };

  // Calculate weighted score
  const weightedScore = Object.values(factors).reduce(
    (sum, factor) => sum + factor.value * factor.weight,
    0
  );

  const finalScore = Math.round(weightedScore * 100);

  console.log("📊 Alternative maturity calculation:", {
    factors: Object.fromEntries(
      Object.entries(factors).map(([key, factor]) => [
        key,
        {
          value: factor.value.toFixed(2),
          contribution: (factor.value * factor.weight * 100).toFixed(1),
        },
      ])
    ),
    weightedScore: weightedScore.toFixed(3),
    finalScore,
  });

  return finalScore;
}

// Utility function to get maturity level description
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
