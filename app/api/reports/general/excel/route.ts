import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const submission = await prisma.submission.findFirst({
    where: { userId: user?.id },
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

  if (!submission) {
    return NextResponse.json(
      { error: "No submission found." },
      { status: 404 }
    );
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("General Risk Report");

  sheet.columns = [
    { header: "No.", key: "no", width: 6 },
    { header: "Question", key: "question", width: 50 },
    { header: "Answer", key: "answer", width: 30 },
    { header: "Control Measure", key: "control", width: 40 },
  ];

  const generalQuestions = submission.answers.filter(
    (a) => !a.question.assetId
  );

  generalQuestions.forEach((a, index) => {
    sheet.addRow({
      no: index + 1,
      question: a.question.text,
      answer: a.selectedOption.text,
      control: a.selectedOption.controlDescription || "-",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=General_Risk_Report.xlsx",
    },
  });
}
