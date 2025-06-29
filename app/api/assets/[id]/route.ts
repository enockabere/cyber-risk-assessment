import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


// UPDATE
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { name, description } = body;

  try {
    const updated = await prisma.asset.update({
      where: { id: params.id },
      data: {
        name,
        description: description || null,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ Failed to update asset:", err);
    return NextResponse.json(
      { error: "Failed to update asset" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.asset.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("❌ Failed to delete asset:", err);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}


