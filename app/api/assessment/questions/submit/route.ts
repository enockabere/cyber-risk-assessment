import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
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

  const { answers } = await req.json();

  if (!answers || !Array.isArray(answers)) {
    return NextResponse.json(
      { error: "Invalid answer payload" },
      { status: 400 }
    );
  }

  try {
    // Store answers under a new Submission
    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        backgroundData: {}, // Optional: store related background info here
        answers: {
          create: answers.map(
            (ans: { questionId: string; selectedOptionId: string }) => ({
              questionId: ans.questionId,
              selectedOptionId: ans.selectedOptionId,
            })
          ),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json({
      message: "Submission recorded successfully",
      submissionId: submission.id,
    });
  } catch (err) {
    console.error("❌ Error saving assessment answers:", err);
    return NextResponse.json(
      { error: "Failed to save assessment" },
      { status: 500 }
    );
  }
}
