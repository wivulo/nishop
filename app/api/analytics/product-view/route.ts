import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { productId?: number };
    if (!Number.isInteger(body.productId) || !body.productId || body.productId < 1) {
      return NextResponse.json({ message: "Produto inválido." }, { status: 400 });
    }
    const product = await prisma.product.findUnique({ where: { id: body.productId }, select: { id: true, name: true } });
    if (!product) return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
    await prisma.productView.create({ data: { productId: product.id, productName: product.name } });
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Não foi possível registar a visualização." }, { status: 500 });
  }
}
