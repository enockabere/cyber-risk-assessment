import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

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

  // Find latest submission by the user
  const latestSubmission = await prisma.submission.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      answers: {
        include: {
          question: true,
          selectedOption: true,
        },
      },
    },
  });

  // Get all questions
  const questions = await prisma.question.findMany({
    orderBy: { position: "asc" },
    include: {
      options: true,
    },
  });

  const answersMap = new Map();
  latestSubmission?.answers.forEach((ans) => {
    answersMap.set(ans.questionId, ans.selectedOptionId);
  });

  const enrichedQuestions = questions.map((q) => ({
    ...q,
    selectedOptionId: answersMap.get(q.id) || null,
  }));

  return NextResponse.json({ questions: enrichedQuestions });
}
