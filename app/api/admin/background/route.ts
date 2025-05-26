import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const existingFields = await prisma.backgroundField.findMany();

    if (existingFields.length === 0) {
      for (const field of data) {
        await prisma.backgroundField.create({
          data: {
            label: field.label,
            fieldType: field.fieldType,
            options: field.options || [],
          },
        });
      }
    } else {
      for (const field of data) {
        await prisma.backgroundField.updateMany({
          where: { label: field.label },
          data: {
            fieldType: field.fieldType,
            options: field.options || [],
          },
        });
      }
    }

    return NextResponse.json({ message: "Fields saved or updated" });
  } catch (err) {
    console.error("❌ Error saving background fields:", err);
    return NextResponse.json(
      { error: "Failed to save fields" },
      { status: 500 }
    );
  }
}
