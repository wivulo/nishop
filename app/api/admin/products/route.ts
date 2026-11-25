import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { isAdminRequest } from "@/lib/admin/auth";

export const runtime = "nodejs";

function validProduct(body: any) {
  return typeof body?.name === "string" && body.name.trim().length > 0 && body.name.trim().length <= 160 &&
    typeof body.description === "string" && body.description.trim().length > 0 &&
    typeof body.imageSrc === "string" && body.imageSrc.trim().length > 0 &&
    typeof body.category === "string" && body.category.trim().length > 0 &&
    typeof body.price === "number" && Number.isFinite(body.price) && body.price >= 0 &&
    typeof body.Emphasis === "boolean" && (body.colors === undefined || Array.isArray(body.colors));
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ message: "Sessão de administrador inválida." }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
  const response = NextResponse.json({ products });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ message: "Sessão de administrador inválida." }, { status: 401 });
  try {
    const body = await request.json();
    if (!validProduct(body)) return NextResponse.json({ message: "Preenche os campos obrigatórios do produto." }, { status: 400 });
    const product = await prisma.product.create({
      data: {
        name: body.name.trim(), description: body.description.trim(), imageSrc: body.imageSrc.trim(),
        price: body.price, category: body.category.trim(), Emphasis: body.Emphasis,
        colors: body.colors ?? [],
      },
    });
    return NextResponse.json({ product }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ message: "Já existe um produto com esse nome." }, { status: 409 });
    }
    return NextResponse.json({ message: "Não foi possível guardar o produto." }, { status: 500 });
  }
}
