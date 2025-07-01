import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

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

  const latestSubmission = await prisma.submission.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      answers: {
        include: {
          question: {
            include: {
              asset: true, // to get asset name
            },
          },
          selectedOption: true,
        },
      },
    },
  });

  if (!latestSubmission) {
    return NextResponse.json({ questions: [] });
  }

  // Extract asset-linked questions
  const assetQuestions = latestSubmission.answers
    .filter((ans) => ans.question.assetId)
    .map((ans) => ({
      assetId: ans.question.assetId!,
      assetName: ans.question.asset?.name ?? "Unnamed Asset",
      position: ans.question.position,
      text: ans.question.text,
      selectedOption: {
        text: ans.selectedOption.text,
        probability: ans.selectedOption.probability,
        impact: ans.selectedOption.impact,
        controlDescription: ans.selectedOption.controlDescription,
        residualProbability: ans.selectedOption.residualProbability,
        residualImpact: ans.selectedOption.residualImpact,
      },
    }));

  return NextResponse.json({ questions: assetQuestions });
}
