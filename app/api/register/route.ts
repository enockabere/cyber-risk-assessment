import { hash } from "bcryptjs";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, name } = await req.json(); // 👈 include `name`
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 400 }
    );
  }

  const hashed = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
    },
  });

  return NextResponse.json(user);
}
