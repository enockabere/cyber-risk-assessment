import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

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
        options: {
          deleteMany: {}, // Clear old options
          create: body.options.map((opt: any) => ({
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
  } catch (err) {
    console.error("❌ Failed to update question:", err);
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
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
