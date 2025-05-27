import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

// Numeric weights for RiskRating enums
const ratingWeights = {
  SUSTAINABLE: 0,
  MODERATE: 1,
  SEVERE: 2,
  CRITICAL: 3,
};

// Ordered enum keys
const orderedRatings = ["SUSTAINABLE", "MODERATE", "SEVERE", "CRITICAL"];

// Convert enum to title case for frontend
function normalizeRating(
  rating: string | null
): "Sustainable" | "Moderate" | "Severe" | "Critical" | null {
  switch (rating) {
    case "SUSTAINABLE":
      return "Sustainable";
    case "MODERATE":
      return "Moderate";
    case "SEVERE":
      return "Severe";
    case "CRITICAL":
      return "Critical";
    default:
      return null;
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const backgroundFieldsCount = await prisma.backgroundField.count();
  const backgroundResponsesCount = await prisma.backgroundResponse.count({
    where: { userId: user.id },
  });
  const backgroundCompleted =
    backgroundResponsesCount === backgroundFieldsCount;

  const totalQuestions = await prisma.question.count();

  const latestSubmission = await prisma.submission.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      answers: {
        include: {
          selectedOption: true,
        },
      },
    },
  });

  const answers = latestSubmission?.answers || [];
  const answeredQuestions = answers.length;
  const allQuestionsAnswered = answeredQuestions === totalQuestions;

  const lastSubmissionDate = latestSubmission?.createdAt ?? null;

  const ratingScores = answers
    .map((a) => a.selectedOption.rating)
    .filter(
      (r): r is keyof typeof ratingWeights =>
        r !== null && r !== undefined && r in ratingWeights
    );

  let averageRating: string | null = null;
  if (ratingScores.length > 0) {
    const totalScore = ratingScores.reduce(
      (sum, r) => sum + ratingWeights[r],
      0
    );
    const avgIndex = Math.round(totalScore / ratingScores.length);
    averageRating = orderedRatings[avgIndex];
  }

  const normalizedRating = normalizeRating(averageRating);

  return NextResponse.json({
    totalQuestions,
    answeredQuestions,
    backgroundCompleted,
    allQuestionsAnswered,
    lastSubmissionDate,
    averageRating: normalizedRating,
  });
}
