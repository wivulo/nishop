import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { createGatewayPayment, GatewayIntegrationError } from "@/lib/bayqi/gateway";

export const runtime = "nodejs";

function jsonNoStore(body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

type CheckoutBody = {
  items?: Array<{ productId?: number; quantity?: number }>;
  bayqiTag?: string;
  attemptId?: string;
};

function errorResponse(error: unknown) {
  if (error instanceof GatewayIntegrationError) {
    return jsonNoStore(
      { message: error.message, code: error.code, requestId: error.requestId },
      error.status,
    );
  }
  console.error("[NishopCheckout] Falha interna ao criar cobrança.");
  return jsonNoStore({ message: "Não foi possível iniciar o pagamento." }, 503);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const bayqiTag = body.bayqiTag?.trim();
    const attemptId = body.attemptId?.trim();

    if (!bayqiTag || bayqiTag.length > 64 || /[\s\u0000-\u001f\u007f]/.test(bayqiTag)) {
      return jsonNoStore({ message: "Indica uma BayQi Tag válida." }, 400);
    }
    if (!attemptId || !/^[A-Za-z0-9._:-]{8,100}$/.test(attemptId)) {
      return jsonNoStore({ message: "A referência da tentativa de pagamento é inválida." }, 400);
    }
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 20) {
      return jsonNoStore({ message: "O carrinho está vazio ou excede o limite de produtos." }, 400);
    }

    const quantities = new Map<number, number>();
    for (const item of body.items) {
      if (!Number.isInteger(item.productId) || !Number.isInteger(item.quantity) || item.quantity! < 1 || item.quantity! > 20) {
        return jsonNoStore({ message: "O carrinho contém quantidades inválidas." }, 400);
      }
      const nextQuantity = (quantities.get(item.productId!) ?? 0) + item.quantity!;
      if (nextQuantity > 20) {
        return jsonNoStore({ message: "A quantidade máxima por produto é 20." }, 400);
      }
      quantities.set(item.productId!, nextQuantity);
    }

    const products = await prisma.product.findMany({ where: { id: { in: [...quantities.keys()] } } });
    if (products.length !== quantities.size) {
      return jsonNoStore({ message: "Um ou mais produtos já não estão disponíveis." }, 400);
    }

    const totalCents = products.reduce((sum, product) => {
      if (!Number.isFinite(product.price) || product.price < 0) return Number.NaN;
      return sum + Math.round(product.price * 100) * (quantities.get(product.id) ?? 0);
    }, 0);
    const amount = Number((totalCents / 100).toFixed(2));
    if (!Number.isFinite(amount) || amount <= 0 || amount >= 10000000000000000) {
      return jsonNoStore({ message: "O valor total do carrinho é inválido." }, 400);
    }

    const merchantReference = `NISHOP-${attemptId}`;
    const payment = await createGatewayPayment({
      amount,
      bayqiTag,
      merchantReference,
      idempotencyKey: `nishop-${attemptId}`,
    });

    return jsonNoStore({ ...payment, amount, currency: "AOA" }, payment.created ? 201 : 200);
  } catch (error) {
    return errorResponse(error);
  }
}
