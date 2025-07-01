// app/api/admin/reports/respondents/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const respondents = await prisma.user.findMany({
    where: { role: "RESPONDENT" },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(respondents);
}
