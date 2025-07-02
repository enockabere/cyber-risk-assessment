import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
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

    const targetQuestion = await prisma.question.findFirst({
      where: {
        text: {
          contains: "Cybersecurity Framework Adopted",
          mode: "insensitive",
        },
      },
    });

    if (!targetQuestion) {
      return NextResponse.json(
        { error: "Target question not found" },
        { status: 404 }
      );
    }

    const latestSubmission = await prisma.submission.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        answers: {
          where: {
            questionId: targetQuestion.id,
          },
          include: {
            selectedOption: true,
          },
        },
      },
    });

    const answer = latestSubmission?.answers?.[0];

    if (!answer) {
      return NextResponse.json({ answered: false, status: "Not Answered" });
    }

    const selectedText = answer.selectedOption.text.toLowerCase();

    let status = "Answered";

    if (selectedText.includes("none")) {
      status = "Answered: None";
    } else if (selectedText.includes("other")) {
      status = "Answered: Other";
    } else {
      status = `Answered: ${answer.selectedOption.text}`;
    }

    return NextResponse.json({
      answered: true,
      status,
      selectedOption: answer.selectedOption.text,
    });
  } catch (error) {
    console.error("❌ Framework check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
