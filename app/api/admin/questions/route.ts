import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// POST: Create a new question
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const newQuestion = await prisma.question.create({
      data: {
        text: body.text,
        position: body.position,
        options: {
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

    return NextResponse.json(newQuestion);
  } catch (err) {
    console.error("❌ Failed to save question:", err);
    return NextResponse.json(
      { error: "Failed to save question" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { position: "asc" },
      include: {
        options: true,
      },
    });

    return NextResponse.json(questions);
  } catch (err) {
    console.error("❌ Failed to fetch questions:", err);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
