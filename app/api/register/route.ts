// app/api/register/route.ts
import { hash } from "bcryptjs";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const hashed = await hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  return NextResponse.json(user);
}
