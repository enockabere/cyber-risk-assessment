import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { email, name, password, role = "respondent" } = await req.json();

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
      role: ["admin", "respondent"].includes(role) ? role : "respondent",
      status: "active",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ message: "User created", user });
}
