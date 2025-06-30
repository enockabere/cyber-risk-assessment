export type RiskLevel =
  | "Sustainable"
  | "Moderate"
  | "Severe"
  | "Critical"
  | null;

export interface StatsData {
  totalQuestions: number;
  answeredQuestions: number;
  lastSubmissionDate: string | null;
  averageRating: RiskLevel;
  backgroundCompleted: boolean;
  allQuestionsAnswered: boolean;
  assetCount: number; 
}
