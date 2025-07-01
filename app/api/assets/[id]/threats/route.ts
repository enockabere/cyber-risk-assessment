import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { RiskLevel } from "@/app/lib/utils/risk-rating";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const threats = await prisma.threat.findMany({
      where: {
        assetId: params.id,
      },
      include: {
        mitigations: true,
      },
    });

    return NextResponse.json(threats);
  } catch (err) {
    console.error("❌ Failed to fetch threats:", err);
    return NextResponse.json(
      { error: "Failed to fetch threats" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const assetId = params.id;
  const body = await req.json();
  const { title, description, riskLevel, mitigations } = body;

  // Validation
  if (!title || !riskLevel || typeof title !== "string") {
    return NextResponse.json(
      { error: "Title and riskLevel are required" },
      { status: 400 }
    );
  }

  try {
    const threat = await prisma.threat.create({
      data: {
        title,
        description: description || null,
        riskLevel: riskLevel as RiskLevel,
        asset: {
          connect: { id: assetId },
        },
        mitigations: {
          create: Array.isArray(mitigations)
            ? mitigations.map((desc: string) => ({ description: desc }))
            : [],
        },
      },
      include: {
        mitigations: true,
      },
    });

    return NextResponse.json(threat, { status: 201 });
  } catch (err) {
    console.error("❌ Failed to create threat:", err);
    return NextResponse.json(
      { error: "Failed to add threat" },
      { status: 500 }
    );
  }
}
