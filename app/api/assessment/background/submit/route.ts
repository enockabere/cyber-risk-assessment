import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { responses } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    for (const { fieldId, value } of responses) {
      await prisma.backgroundResponse.upsert({
        where: {
          userId_fieldId: {
            userId: user.id,
            fieldId,
          },
        },
        update: {
          value,
        },
        create: {
          userId: user.id,
          fieldId,
          value,
        },
      });
    }

    return NextResponse.json({ message: "Background info saved successfully" });
  } catch (error) {
    console.error("❌ Failed to save background info:", error);
    return NextResponse.json(
      { error: "Failed to save background info" },
      { status: 500 }
    );
  }
}
