import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { text, type, weight, sectionId } = await req.json();

  const updated = await prisma.question.update({
    where: { id: params.id },
    data: {
      text,
      type,
      weight: weight ?? null,
      sectionId,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.question.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
