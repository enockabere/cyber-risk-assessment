import { hash } from "bcryptjs";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role = "respondent" } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashed = await hash(password, 10);
    const allowedRoles = ["RESPONDENT", "ADMIN"];
    const cleanRole = allowedRoles.includes(role.toUpperCase())
      ? role.toUpperCase()
      : "RESPONDENT";

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        role: cleanRole as UserRole,
        status: "active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    console.log("✅ User registered:", user);
    return NextResponse.json({ message: "User created", user });
  } catch (error) {
    console.error("❌ Register API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
