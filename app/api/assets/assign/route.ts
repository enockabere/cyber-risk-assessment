// /app/api/assets/assign/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  const body = await req.json(); // expecting { assetIds: string[] }

  if (!user || !body.assetIds)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  await Promise.all(
    body.assetIds.map((assetId: string) =>
      prisma.universityAsset.upsert({
        where: {
          universityUserId_assetId: { universityUserId: user.id, assetId },
        },
        create: {
          universityUserId: user.id,
          assetId,
        },
        update: {}, // no updates needed
      })
    )
  );

  return NextResponse.json({ success: true });
}
