import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalRespondents,
      totalSubmissions,
      totalAssets,
      assessedAssets,
      highRiskAnswers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "RESPONDENT" } }),
      prisma.submission.count(),
      prisma.asset.count(),
      prisma.universityAsset.count({ where: { hasBeenAssessed: true } }),
      prisma.answer.count({
        where: {
          selectedOption: {
            rating: { in: ["SEVERE", "CRITICAL"] },
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalRespondents,
      totalSubmissions,
      totalAssets,
      assessedAssets,
      unassessedAssets: totalAssets - assessedAssets,
      highRiskAnswers, // interpreted as alerts
      averageRiskScore: 0, // You can compute this if you store numeric scores
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
