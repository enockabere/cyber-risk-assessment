// /app/api/assets/selected/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🎯 Fetching selected assets...");

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    console.log("👤 User email:", userEmail);

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ User found:", user.id);

    const assignedAssets = await prisma.universityAsset.findMany({
      where: { universityUserId: user.id },
      include: {
        asset: {
          include: {
            threats: {
              include: { mitigations: true },
            },
          },
        },
      },
    });

    console.log("🎯 Found assigned assets:", assignedAssets.length);

    return NextResponse.json(assignedAssets);
  } catch (error) {
    console.error("❌ Error fetching selected assets:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch selected assets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
