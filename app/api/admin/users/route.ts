import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { isAdminRequest } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ message: "Sessão de administrador inválida." }, { status: 401 });
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
    select: { id: true, name: true, email: true, photoURL: true },
  });
  const response = NextResponse.json({ users });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
