import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const sections = await prisma.questionnaireSection.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      parent: true,
      children: true,
    },
  });

  return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
  const { title, description, parentId } = await req.json();

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const section = await prisma.questionnaireSection.create({
    data: {
      title,
      description,
      parentId: parentId || null, 
    },
  });

  return NextResponse.json(section);
}
