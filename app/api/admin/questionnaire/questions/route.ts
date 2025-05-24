import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const questions = await prisma.question.findMany({
    include: {
      section: true,
      scoringModel: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const { text, type, weight, sectionId, position } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  if (!["TEXT", "MULTIPLE_CHOICE", "RATING", "CHECKBOX"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid question type" },
      { status: 400 }
    );
  }

  if (!sectionId || typeof sectionId !== "string") {
    return NextResponse.json({ error: "Section is required" }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: {
      text,
      type,
      weight: weight ?? null,
      sectionId,
      position: position ?? 0,
    },
  });

  return NextResponse.json(question);
}
