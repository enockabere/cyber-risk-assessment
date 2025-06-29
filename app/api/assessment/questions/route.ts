import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userAssets = await prisma.universityAsset.findMany({
    where: { universityUserId: user.id },
    select: { assetId: true },
  });

  const ownedAssetIds = userAssets.map((ua) => ua.assetId);

  const latestSubmission = await prisma.submission.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      answers: {
        include: {
          selectedOption: true,
        },
      },
    },
  });

  const answersMap = new Map(
    latestSubmission?.answers.map((ans) => [
      ans.questionId,
      ans.selectedOptionId,
    ]) || []
  );

  const questions = await prisma.question.findMany({
    where: {
      OR: [{ assetId: null }, { assetId: { in: ownedAssetIds } }],
    },
    orderBy: { position: "asc" },
    include: {
      options: true,
      asset: {
        select: { name: true },
      },
    },
  });

  const enrichedQuestions = questions.map((q) => ({
    id: q.id,
    text: q.text,
    position: q.position,
    options: q.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
    selectedOptionId: answersMap.get(q.id) || null,
    isAssetLinked: !!q.assetId,
    assetName: q.asset?.name || null,
  }));

  return NextResponse.json({ questions: enrichedQuestions });
}
