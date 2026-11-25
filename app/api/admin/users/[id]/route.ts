import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { isAdminRequest } from "@/lib/admin/auth";

export const runtime = "nodejs";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminRequest(request)) return NextResponse.json({ message: "Sessão de administrador inválida." }, { status: 401 });
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ message: "Utilizador inválido." }, { status: 400 });
  try {
    const body = await request.json() as { name?: string; email?: string };
    if (typeof body.name !== "string" || !body.name.trim() || body.name.length > 120 ||
        typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ message: "Nome ou e-mail inválido." }, { status: 400 });
    }
    const user = await prisma.user.update({ where: { id }, data: { name: body.name.trim(), email: body.email.trim().toLowerCase() }, select: { id: true, name: true, email: true, photoURL: true } });
    return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ message: "Esse e-mail já está associado a outra conta." }, { status: 409 });
    }
    return NextResponse.json({ message: "Não foi possível atualizar o utilizador." }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminRequest(request)) return NextResponse.json({ message: "Sessão de administrador inválida." }, { status: 401 });
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ message: "Utilizador inválido." }, { status: 400 });
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ message: "Não foi possível remover o utilizador." }, { status: 404 });
  }
}
