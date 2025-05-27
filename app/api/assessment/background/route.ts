// app/api/assessment/background/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const fields = await prisma.backgroundField.findMany({
      orderBy: { label: "asc" },
    });

    // Fetch user responses
    const responses = await prisma.backgroundResponse.findMany({
      where: { userId },
    });

    // Combine fields and responses
    const enrichedFields = fields.map((field) => {
      const matched = responses.find((r) => r.fieldId === field.id);
      return {
        ...field,
        response: matched?.value || null,
      };
    });

    const isCompleted = responses.length >= fields.length;

    return NextResponse.json({
      completed: isCompleted,
      fields: enrichedFields,
    });
  } catch (err) {
    console.error("❌ Error loading background data:", err);
    return NextResponse.json(
      { error: "Failed to load background information" },
      { status: 500 }
    );
  }
}
