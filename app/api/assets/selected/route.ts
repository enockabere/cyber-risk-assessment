// /app/api/assets/selected/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const assignedAssets = await prisma.universityAsset.findMany({
    where: { universityUserId: user.id },
    include: {
      asset: {
        include: {
          threats: {
            include: { mitigations: true },
          },
        },
      },
    },
  });

  return NextResponse.json(assignedAssets);
}
