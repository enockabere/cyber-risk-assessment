import { riskMatrix } from "@/app/constants/riskStyles";
import { Question } from "@/app/types";

export function calculateRiskRating(prob?: string, impact?: string): string {
  if (!prob || !impact) return "Not Rated";
  const p = prob.toUpperCase();
  const i = impact.toUpperCase();
  return riskMatrix[p]?.[i] || "Unknown";
}

export function getAverageRiskRating(questions: Question[]): string | null {
  const ratingOrder = ["Sustainable", "Moderate", "Severe", "Critical"];
  const ratingScores = { Sustainable: 0, Moderate: 1, Severe: 2, Critical: 3 };

  const validRatings = questions
    .map((q) => {
      const prob = q.selectedOption.probability?.toUpperCase();
      const impact = q.selectedOption.impact?.toUpperCase();
      return prob && impact ? riskMatrix[prob]?.[impact] : null;
    })
    .filter((r): r is keyof typeof ratingScores => r !== undefined);

  if (validRatings.length === 0) return null;

  const total = validRatings.reduce((sum, r) => sum + ratingScores[r], 0);
  const avg = Math.round(total / validRatings.length);
  return ratingOrder[avg];
}

export function getHighestRisk(questions: Question[]): string {
  if (questions.length === 0) return "N/A";

  return questions.reduce((max, q) => {
    const rating = calculateRiskRating(
      q.selectedOption.probability,
      q.selectedOption.impact
    );
    const ratingOrder = ["Sustainable", "Moderate", "Severe", "Critical"];
    return ratingOrder.indexOf(rating) > ratingOrder.indexOf(max)
      ? rating
      : max;
  }, "Sustainable");
}
