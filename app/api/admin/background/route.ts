import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    for (const field of data) {
      await prisma.backgroundField.create({
        data: {
          label: field.label,
          fieldType: field.fieldType,
          options: field.options || [],
        },
      });
    }

    return NextResponse.json({ message: "Background fields saved" });
  } catch (err) {
    console.error("❌ Background field save error:", err);
    return NextResponse.json(
      { error: "Failed to save fields" },
      { status: 500 }
    );
  }
}
