import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { hash } from "bcryptjs";
import { UserRole } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { name, email, role, status, password } = await req.json();
  interface DataToUpdate {
    name?: string;
    email?: string;
    status?: string;
    role?: UserRole;
    password?: string;
  }

  const dataToUpdate: DataToUpdate = { name, email, status };

  if (role) {
    dataToUpdate.role = role.toUpperCase() as UserRole;
  }

  if (password) {
    dataToUpdate.password = await hash(password, 10);
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
    },
  });

  return NextResponse.json(updated);
}
