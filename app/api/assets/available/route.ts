import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    console.log("📦 Fetching available assets...");

    const assets = await prisma.asset.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, description: true },
    });

    console.log("📦 Found assets:", assets.length);

    return NextResponse.json(assets);
  } catch (error) {
    console.error("❌ Error fetching available assets:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch assets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
