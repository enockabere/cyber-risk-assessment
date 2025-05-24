// /app/api/admin/scoring/prefill/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(_: NextRequest) {
  const questions = await prisma.question.findMany({
    where: { scoringModelId: null },
  });

  for (const q of questions) {
    const model = await prisma.scoringModel.create({
      data: {
        name: "Default for " + q.id,
        thresholds: {
          low: 1,
          medium: 2,
          high: 3,
        },
      },
    });

    await prisma.question.update({
      where: { id: q.id },
      data: { scoringModelId: model.id },
    });
  }

  return NextResponse.json({ message: "Default scoring models assigned." });
}
