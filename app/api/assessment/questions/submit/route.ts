import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
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

  const { answers } = await req.json();

  if (
    !answers ||
    !Array.isArray(answers) ||
    answers.some(
      (a) =>
        typeof a !== "object" ||
        typeof a.questionId !== "string" ||
        typeof a.selectedOptionId !== "string" ||
        a.selectedOptionId.trim() === ""
    )
  ) {
    return NextResponse.json(
      { error: "Invalid or incomplete answer payload" },
      { status: 400 }
    );
  }

  try {
    // Optional: Ensure all questions were answered
    const totalQuestions = await prisma.question.count({
      where: {
        OR: [
          { assetId: null }, // background questions
          {
            asset: {
              universities: {
                some: { universityUserId: user.id },
              },
            },
          },
        ],
      },
    });

    const answeredQuestionIds = new Set(answers.map((a) => a.questionId));

    if (answeredQuestionIds.size < totalQuestions) {
      return NextResponse.json(
        {
          error: `Please answer all ${totalQuestions} questions before submitting.`,
        },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        backgroundData: {}, // Add custom background info if needed
        answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            selectedOptionId: a.selectedOptionId,
          })),
        },
      },
      include: { answers: true },
    });

    return NextResponse.json({
      message: "Assessment submitted successfully.",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("❌ Submission error:", error);
    return NextResponse.json(
      { error: "Failed to save assessment answers." },
      { status: 500 }
    );
  }
}
