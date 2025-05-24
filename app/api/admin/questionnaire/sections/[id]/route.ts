import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { title, description, parentId, position } = await req.json();

  const updated = await prisma.questionnaireSection.update({
    where: { id: params.id },
    data: {
      title,
      description,
      parentId: parentId || null,
      position: position ?? "0",
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.questionnaireSection.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
