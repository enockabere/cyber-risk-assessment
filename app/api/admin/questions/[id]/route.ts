import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { RiskLevel } from "@prisma/client";

interface RiskOptionInput {
  text: string;
  probability?: string;
  impact?: string;
  controlDescription?: string;
  residualProbability?: string;
  residualImpact?: string;
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const body = await req.json();

  try {
    // Check if there are existing answers
    const hasAnswers = await prisma.answer.findFirst({
      where: { questionId: id },
    });

    if (hasAnswers) {
      return NextResponse.json(
        { error: "Cannot update question with existing answers." },
        { status: 400 }
      );
    }

    const updated = await prisma.question.update({
      where: { id },
      data: {
        text: body.text,
        position: body.position,
        assetId: body.assetId || null,
        options: {
          deleteMany: {}, // Clear existing options
          create: (body.options as RiskOptionInput[]).map((opt) => ({
            text: opt.text,
            probability: opt.probability
              ? (opt.probability as RiskLevel)
              : null,
            impact: opt.impact ? (opt.impact as RiskLevel) : null,
            controlDescription: opt.controlDescription || null,
            residualProbability: opt.residualProbability
              ? (opt.residualProbability as RiskLevel)
              : null,
            residualImpact: opt.residualImpact
              ? (opt.residualImpact as RiskLevel)
              : null,
          })),
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("❌ Failed to update question:", error);
    return NextResponse.json(
      {
        error: "Failed to update question",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    // Step 1: Delete answers related to this question
    await prisma.answer.deleteMany({
      where: { questionId: id },
    });

    // Step 2: Delete risk options related to this question
    await prisma.riskOption.deleteMany({
      where: { questionId: id },
    });

    // Step 3: Delete the question
    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: unknown) {
    console.error("❌ Failed to delete question:", error);
    return NextResponse.json(
      {
        error: "Failed to delete question",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
