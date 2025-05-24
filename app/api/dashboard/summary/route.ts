import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const [total, avg, flagged] = await Promise.all([
    prisma.submission.count(),
    prisma.submission.aggregate({ _avg: { riskScore: true } }),
    prisma.submission.count({ where: { flagged: true } }),
  ]);

  return NextResponse.json({
    totalSubmissions: total,
    averageRiskScore: avg._avg.riskScore ?? 0,
    flaggedAlerts: flagged,
  });
}
