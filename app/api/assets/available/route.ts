import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const assets = await prisma.asset.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, description: true },
  });

  return NextResponse.json(assets);
}
