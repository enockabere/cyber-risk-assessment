import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

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
  const { params } = context;
  const body = await req.json();

  try {
    const updated = await prisma.question.update({
      where: { id: params.id },
      data: {
        text: body.text,
        position: body.position,
        assetId: body.assetId || null, // ✅ add this
        options: {
          deleteMany: {}, // Clear old
          create: (body.options as RiskOptionInput[]).map((opt) => ({
            text: opt.text,
            probability: opt.probability || null,
            impact: opt.impact || null,
            controlDescription: opt.controlDescription || null,
            residualProbability: opt.residualProbability || null,
            residualImpact: opt.residualImpact || null,
          })),
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("❌ Failed to update question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.question.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
