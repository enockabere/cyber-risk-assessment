import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
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

    const backgroundResponses = await prisma.backgroundResponse.findMany({
      where: { userId: user.id },
      include: { field: true },
    });

    const latestSubmission = await prisma.submission.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        answers: {
          include: {
            question: {
              include: {
                asset: true, // Needed to access asset.name
              },
            },
            selectedOption: true,
          },
        },
      },
    });

    const questions =
      latestSubmission?.answers.map((ans) => ({
        position: ans.question.position,
        text: ans.question.text,
        assetId: ans.question.assetId || undefined,
        assetName: ans.question.asset?.name || undefined,
        selectedOption: {
          text: ans.selectedOption.text,
          probability: ans.selectedOption.probability ?? undefined,
          impact: ans.selectedOption.impact ?? undefined,
          controlDescription:
            ans.selectedOption.controlDescription ?? undefined,
          residualProbability:
            ans.selectedOption.residualProbability ?? undefined,
          residualImpact: ans.selectedOption.residualImpact ?? undefined,
        },
      })) ?? [];

    return NextResponse.json({
      backgroundResponses,
      questions,
    });
  } catch (error) {
    console.error("Error in assessment responses route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
