"use client";

import { useEffect, useState, memo } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

type RiskLevel = "Sustainable" | "Moderate" | "Severe" | "Critical" | null;

interface Question {
  position: number;
  text: string;
  selectedOption: {
    probability?: string;
    impact?: string;
  };
}

interface StatsData {
  totalQuestions: number;
  answeredQuestions: number;
  lastSubmissionDate: string | null;
  averageRating: RiskLevel;
  backgroundCompleted: boolean;
  allQuestionsAnswered: boolean;
}

const riskConfig: Record<
  Exclude<RiskLevel, null>,
  {
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  Sustainable: {
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    icon: CheckCircle,
    description: "Excellent security posture",
  },
  Moderate: {
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    icon: AlertTriangle,
    description: "Some areas need attention",
  },
  Severe: {
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    icon: AlertTriangle,
    description: "Significant risks identified",
  },
  Critical: {
    color: "from-red-600 to-red-800",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    icon: XCircle,
    description: "Immediate action required",
  },
};

const riskMatrix: Record<string, Record<string, Exclude<RiskLevel, null>>> = {
  VERY_LOW: {
    VERY_LOW: "Sustainable",
    LOW: "Sustainable",
    MEDIUM: "Sustainable",
    HIGH: "Moderate",
    VERY_HIGH: "Severe",
  },
  LOW: {
    VERY_LOW: "Sustainable",
    LOW: "Sustainable",
    MEDIUM: "Moderate",
    HIGH: "Severe",
    VERY_HIGH: "Critical",
  },
  MEDIUM: {
    VERY_LOW: "Sustainable",
    LOW: "Moderate",
    MEDIUM: "Moderate",
    HIGH: "Severe",
    VERY_HIGH: "Critical",
  },
  HIGH: {
    VERY_LOW: "Sustainable",
    LOW: "Moderate",
    MEDIUM: "Severe",
    HIGH: "Critical",
    VERY_HIGH: "Critical",
  },
  VERY_HIGH: {
    VERY_LOW: "Moderate",
    LOW: "Severe",
    MEDIUM: "Severe",
    HIGH: "Critical",
    VERY_HIGH: "Critical",
  },
};

function calculateRiskRating(prob?: string, impact?: string): RiskLevel {
  if (!prob || !impact) return null;
  return riskMatrix[prob.toUpperCase()]?.[impact.toUpperCase()] ?? null;
}

function getAverageRiskRating(questions: Question[]): RiskLevel {
  const ratingOrder: Exclude<RiskLevel, null>[] = [
    "Sustainable",
    "Moderate",
    "Severe",
    "Critical",
  ];
  const ratingScores: Record<Exclude<RiskLevel, null>, number> = {
    Sustainable: 0,
    Moderate: 1,
    Severe: 2,
    Critical: 3,
  };

  const validRatings = questions
    .map((q) =>
      calculateRiskRating(q.selectedOption.probability, q.selectedOption.impact)
    )
    .filter((r): r is Exclude<RiskLevel, null> => r !== null);

  if (validRatings.length === 0) return null;

  const total = validRatings.reduce((sum, r) => sum + ratingScores[r], 0);
  return ratingOrder[Math.round(total / validRatings.length)];
}

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    <div className="h-2 bg-gray-200 rounded w-full"></div>
  </div>
);

const ProgressRing = ({
  progress,
  size = 120,
}: {
  progress: number;
  size?: number;
}) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-600 transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{progress}%</span>
      </div>
    </div>
  );
};

const RiskRatingVisualization = ({
  rating,
}: {
  rating: Exclude<RiskLevel, null>;
}) => {
  const config = riskConfig[rating];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-6 text-center`}
    >
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center mx-auto mb-4`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className={`text-2xl font-bold ${config.textColor}`}>{rating}</div>
      <p className="text-sm text-gray-600">{config.description}</p>
    </div>
  );
};

const ProgressCard = memo(
  ({ stats, loading }: { stats: StatsData | null; loading: boolean }) => {
    const total = stats?.totalQuestions ?? 0;
    const answered = stats?.answeredQuestions ?? 0;
    const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

    return (
      <div className="bg-white rounded-3xl p-8 shadow border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Assessment Progress
            </h3>
            <p className="text-sm text-gray-500">
              Track your completion status
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <ProgressRing progress={progress} />
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {answered}
                  <span className="text-lg text-gray-500">/{total}</span>
                </div>
                <p className="text-sm text-gray-500">Questions Completed</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-sm font-medium text-gray-700">
                  Background Info
                </span>
                <span
                  className={`flex items-center gap-2 font-medium ${
                    stats?.backgroundCompleted
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {stats?.backgroundCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {stats?.backgroundCompleted ? "Complete" : "Incomplete"}
                </span>
              </div>
              <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-sm font-medium text-gray-700">
                  Questions
                </span>
                <span
                  className={`flex items-center gap-2 font-medium ${
                    stats?.allQuestionsAnswered
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {stats?.allQuestionsAnswered ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {stats?.allQuestionsAnswered ? "All Complete" : "In Progress"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

const RiskRatingCard = memo(
  ({
    rating,
    loading,
    lastSubmissionDate,
  }: {
    rating: RiskLevel;
    loading: boolean;
    lastSubmissionDate: string | null;
  }) => {
    const formatDate = (date: string | null) => {
      if (!date) return "No submission yet";
      return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div className="bg-white rounded-3xl p-8 shadow border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Risk Assessment
            </h3>
            <p className="text-sm text-gray-500">
              Your overall security rating
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : rating ? (
          <>
            <RiskRatingVisualization rating={rating} />
            <div className="mt-6 text-sm text-gray-500 text-center flex justify-center items-center gap-2">
              <Clock className="w-4 h-4" />
              Last updated: {formatDate(lastSubmissionDate)}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Complete the assessment to see your risk rating
            </p>
          </div>
        )}
      </div>
    );
  }
);

const CTASection = memo(({ stats }: { stats: StatsData | null }) => {
  const total = stats?.totalQuestions ?? 0;
  const answered = stats?.answeredQuestions ?? 0;
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  let title = "Start Your Cybersecurity Assessment";
  let description = "Get personalized insights into your security posture.";
  let buttonLabel = "Begin Assessment";
  let gradient = "from-blue-600 to-purple-600";

  if (answered > 0 && progress < 100) {
    title = "Continue Your Assessment";
    description = `You're ${progress}% done. Complete to see your full risk analysis.`;
    buttonLabel = "Continue Assessment";
    gradient = "from-amber-500 to-orange-600";
  } else if (progress === 100) {
    title = "Update Your Security Assessment";
    description = "Retake the assessment to stay up to date.";
    buttonLabel = "Retake Assessment";
    gradient = "from-green-500 to-teal-600";
  }

  return (
    <div className="col-span-full mt-12">
      <div
        className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 text-white text-center shadow-xl`}
      >
        <div className="max-w-xl mx-auto space-y-4">
          <TrendingUp className="w-10 h-10 mx-auto" />
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-white/90">{description}</p>
          <Button
            onClick={() => (window.location.href = "/dashboard/assessment")}
            className="bg-white text-gray-800 hover:bg-gray-100"
          >
            {buttonLabel}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default function RespondentStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [averageRating, setAverageRating] = useState<RiskLevel>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      await new Promise((res) => setTimeout(res, 1000));
      const mockStats: StatsData = {
        totalQuestions: 25,
        answeredQuestions: 18,
        lastSubmissionDate: new Date().toISOString(),
        averageRating: null,
        backgroundCompleted: true,
        allQuestionsAnswered: false,
      };

      const mockQuestions: Question[] = Array(18)
        .fill(null)
        .map((_, i) => ({
          position: i + 1,
          text: `Question ${i + 1}`,
          selectedOption: {
            probability: ["LOW", "MEDIUM", "HIGH"][
              Math.floor(Math.random() * 3)
            ],
            impact: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
          },
        }));

      const rating = getAverageRiskRating(mockQuestions);
      setStats({ ...mockStats, averageRating: rating });
      setAverageRating(rating);
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-4">
      <div className="max-w-6xl mx-auto px-6">
        {/* <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Security Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Monitor your cybersecurity posture in real-time
          </p>
        </div> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <ProgressCard stats={stats} loading={loading} />
          <RiskRatingCard
            rating={averageRating}
            loading={loading}
            lastSubmissionDate={stats?.lastSubmissionDate ?? null}
          />
        </div>
        <CTASection stats={stats} />
      </div>
    </div>
  );
}
