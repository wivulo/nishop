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
  if (!id) return NextResponse.json({ message: "Produto inválido." }, { status: 400 });
  try {
    const body = await request.json();
    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
    const merged = { ...current, ...body };
    if (typeof merged.name !== "string" || !merged.name.trim() ||
        typeof merged.description !== "string" || !merged.description.trim() ||
        typeof merged.imageSrc !== "string" || !merged.imageSrc.trim() ||
        typeof merged.category !== "string" || !merged.category.trim() ||
        typeof merged.price !== "number" || !Number.isFinite(merged.price) || merged.price < 0 ||
        typeof merged.Emphasis !== "boolean" || !Array.isArray(merged.colors)) {
      return NextResponse.json({ message: "Os dados do produto são inválidos." }, { status: 400 });
    }
    const product = await prisma.product.update({ where: { id }, data: {
      name: merged.name.trim(), description: merged.description.trim(), imageSrc: merged.imageSrc.trim(),
      price: merged.price, category: merged.category.trim(), Emphasis: merged.Emphasis, colors: merged.colors,
    } });
    return NextResponse.json({ product }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ message: "Já existe um produto com esse nome." }, { status: 409 });
    }
    return NextResponse.json({ message: "Não foi possível atualizar o produto." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminRequest(request)) return NextResponse.json({ message: "Sessão de administrador inválida." }, { status: 401 });
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ message: "Produto inválido." }, { status: 400 });
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ message: "Não foi possível remover o produto." }, { status: 404 });
  }
}
