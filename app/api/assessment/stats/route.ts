import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

// Type-safe enums
type RiskLevel = "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
type RiskRating = "SUSTAINABLE" | "MODERATE" | "SEVERE" | "CRITICAL";

// Risk rating weights
const ratingWeights: Record<RiskRating, number> = {
  SUSTAINABLE: 0,
  MODERATE: 1,
  SEVERE: 2,
  CRITICAL: 3,
};

const orderedRatings: RiskRating[] = [
  "SUSTAINABLE",
  "MODERATE",
  "SEVERE",
  "CRITICAL",
];

// Risk matrix definition
const riskMatrix: Record<RiskLevel, Record<RiskLevel, RiskRating>> = {
  VERY_LOW: {
    VERY_LOW: "SUSTAINABLE",
    LOW: "SUSTAINABLE",
    MEDIUM: "SUSTAINABLE",
    HIGH: "MODERATE",
    VERY_HIGH: "SEVERE",
  },
  LOW: {
    VERY_LOW: "SUSTAINABLE",
    LOW: "SUSTAINABLE",
    MEDIUM: "MODERATE",
    HIGH: "SEVERE",
    VERY_HIGH: "CRITICAL",
  },
  MEDIUM: {
    VERY_LOW: "SUSTAINABLE",
    LOW: "MODERATE",
    MEDIUM: "MODERATE",
    HIGH: "SEVERE",
    VERY_HIGH: "CRITICAL",
  },
  HIGH: {
    VERY_LOW: "SUSTAINABLE",
    LOW: "MODERATE",
    MEDIUM: "SEVERE",
    HIGH: "CRITICAL",
    VERY_HIGH: "CRITICAL",
  },
  VERY_HIGH: {
    VERY_LOW: "MODERATE",
    LOW: "SEVERE",
    MEDIUM: "SEVERE",
    HIGH: "CRITICAL",
    VERY_HIGH: "CRITICAL",
  },
};

// Guard to check if a string is a RiskLevel
function isRiskLevel(value: string): value is RiskLevel {
  return ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"].includes(value);
}

// Normalize for display
function normalizeRating(rating: RiskRating | null): string | null {
  if (!rating) return null;
  return rating.charAt(0) + rating.slice(1).toLowerCase(); // e.g. CRITICAL -> Critical
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [backgroundFieldsCount, backgroundResponsesCount, totalQuestions] =
    await Promise.all([
      prisma.backgroundField.count(),
      prisma.backgroundResponse.count({ where: { userId: user.id } }),
      prisma.question.count(),
    ]);

  const backgroundCompleted =
    backgroundResponsesCount === backgroundFieldsCount;

  const latestSubmission = await prisma.submission.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      answers: {
        include: { selectedOption: true },
      },
    },
  });

  const answers = latestSubmission?.answers ?? [];
  const answeredQuestions = answers.length;
  const allQuestionsAnswered = answeredQuestions === totalQuestions;
  const lastSubmissionDate = latestSubmission?.createdAt ?? null;

  // Calculate average rating
  const ratingScores: RiskRating[] = answers
    .map((a) => {
      const prob = a.selectedOption.probability?.toUpperCase();
      const impact = a.selectedOption.impact?.toUpperCase();

      if (prob && impact && isRiskLevel(prob) && isRiskLevel(impact)) {
        return riskMatrix[prob][impact];
      }
      return null;
    })
    .filter((r): r is RiskRating => r !== null);

  let averageRating: string | null = null;
  if (ratingScores.length > 0) {
    const totalScore = ratingScores.reduce(
      (sum, r) => sum + ratingWeights[r],
      0
    );
    const avgIndex = Math.round(totalScore / ratingScores.length);
    averageRating = normalizeRating(orderedRatings[avgIndex]);
  }

  console.log("averageRating:", averageRating);

  return NextResponse.json({
    totalQuestions,
    answeredQuestions,
    backgroundCompleted,
    allQuestionsAnswered,
    lastSubmissionDate,
    averageRating,
  });
}
