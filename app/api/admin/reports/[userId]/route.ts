// app/api/admin/reports/[userId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const submission = await prisma.submission.findFirst({
    where: { userId: params.userId },
    orderBy: { createdAt: "desc" },
    include: {
      answers: {
        include: {
          question: true,
          selectedOption: true,
        },
      },
    },
  });

  return NextResponse.json(submission);
}
