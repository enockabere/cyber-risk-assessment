// /app/api/assets/assign/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    console.log("🔄 Assigning assets...");

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    console.log("📝 Request body:", body);

    if (!body.assetIds || !Array.isArray(body.assetIds)) {
      return NextResponse.json(
        { error: "Invalid request - assetIds array required" },
        { status: 400 }
      );
    }

    console.log("🎯 User:", user.id, "Assets to assign:", body.assetIds);

    // First, remove all existing assignments for this user
    await prisma.universityAsset.deleteMany({
      where: { universityUserId: user.id },
    });

    console.log("🗑️ Cleared existing assignments");

    // Then create new assignments
    if (body.assetIds.length > 0) {
      await Promise.all(
        body.assetIds.map((assetId: string) =>
          prisma.universityAsset.create({
            data: {
              universityUserId: user.id,
              assetId,
            },
          })
        )
      );
      console.log("✅ Created new assignments");
    }

    return NextResponse.json({
      success: true,
      assignedCount: body.assetIds.length,
    });
  } catch (error) {
    console.error("❌ Error assigning assets:", error);
    return NextResponse.json(
      {
        error: "Failed to assign assets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
