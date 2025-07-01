import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST: Create a new asset
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Asset name is required" },
      { status: 400 }
    );
  }

  try {
    // Check if asset already exists
    const existing = await prisma.asset.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Asset already exists" },
        { status: 409 }
      );
    }

    const newAsset = await prisma.asset.create({
      data: {
        name,
        description: description || null,
      },
    });

    return NextResponse.json(newAsset, { status: 201 });
  } catch (err) {
    console.error("❌ Failed to create asset:", err);
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}

// GET: List all assets with optional threats
export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        threats: {
          include: {
            mitigations: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(assets);
  } catch (err) {
    console.error("❌ Failed to fetch assets:", err);
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}
