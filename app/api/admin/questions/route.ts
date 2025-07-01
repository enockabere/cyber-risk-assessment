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

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const newQuestion = await prisma.question.create({
      data: {
        text: body.text,
        position: body.position,
        assetId: body.assetId || null,
        options: {
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
        asset: { select: { id: true, name: true } },
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
