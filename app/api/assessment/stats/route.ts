import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

type RiskLevel = "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
type RiskRating = "SUSTAINABLE" | "MODERATE" | "SEVERE" | "CRITICAL";

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

function isRiskLevel(value: string): value is RiskLevel {
  return ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"].includes(value);
}

function normalizeRating(rating: RiskRating | null): string | null {
  if (!rating) return null;
  return rating.charAt(0) + rating.slice(1).toLowerCase();
}

export async function GET() {
  try {
    console.log("📊 Stats API called");

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch user's assets
    const userAssets = await prisma.universityAsset.findMany({
      where: { universityUserId: user.id },
      select: { assetId: true },
    });
    const userAssetIds = userAssets.map((a) => a.assetId);

    // Fetch only relevant questions: global or related to user's assets
    const relevantQuestions = await prisma.question.findMany({
      where: {
        OR: [{ assetId: null }, { assetId: { in: userAssetIds } }],
      },
      select: { id: true },
    });
    const relevantQuestionIds = relevantQuestions.map((q) => q.id);
    const totalQuestions = relevantQuestionIds.length;

    const [backgroundFieldsCount, backgroundResponsesCount] = await Promise.all(
      [
        prisma.backgroundField.count(),
        prisma.backgroundResponse.count({ where: { userId: user.id } }),
      ]
    );

    const backgroundCompleted =
      backgroundFieldsCount > 0 &&
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
    const relevantAnswers = answers.filter((a) =>
      relevantQuestionIds.includes(a.questionId)
    );
    const answeredQuestions = relevantAnswers.length;
    const allQuestionsAnswered =
      totalQuestions > 0 && answeredQuestions === totalQuestions;
    const lastSubmissionDate = latestSubmission?.createdAt ?? null;

    const ratingScores: RiskRating[] = relevantAnswers
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

    const assetCount = userAssetIds.length;

    const result = {
      totalQuestions,
      answeredQuestions,
      backgroundCompleted,
      allQuestionsAnswered,
      lastSubmissionDate,
      averageRating,
      assetCount,
    };

    console.log("📤 Returning result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Stats API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
