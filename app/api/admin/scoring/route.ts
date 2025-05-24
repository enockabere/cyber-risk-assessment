import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const models = await prisma.scoringModel.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(models);
}

export async function POST(req: NextRequest) {
  const { name, description, thresholds } = await req.json();

  if (!name || typeof thresholds !== "object") {
    return NextResponse.json(
      { error: "Name and valid thresholds are required" },
      { status: 400 }
    );
  }

  const model = await prisma.scoringModel.create({
    data: {
      name,
      description,
      thresholds,
    },
  });

  return NextResponse.json(model);
}
