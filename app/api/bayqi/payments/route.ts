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
  payer?: { identifierType?: string; identifier?: string };
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
  let attemptIdForLog: string | undefined;
  try {
    const body = (await request.json()) as CheckoutBody | null;
    if (!body || typeof body !== 'object') return jsonNoStore({ message: 'Pedido inválido.' }, 400);
    const identifierType = body.payer?.identifierType ?? (body.bayqiTag ? "BAYQI_TAG" : undefined);
    const identifier = body.payer?.identifier ?? body.bayqiTag;
    const attemptId = typeof body.attemptId === 'string' ? body.attemptId.trim() : undefined;

    if (typeof identifier !== 'string' || typeof identifierType !== 'string' ||
        identifier.length > 64 || !({
          BAYQI_TAG: /^@?[A-Za-z0-9._-]{3,63}$/,
          PHONE: /^(?:\+?244)?9[0-9]{8}$/,
          IUF: /^[0-8][0-9]{8}$/,
          DOCUMENT: /^[A-Za-z0-9 /-]{4,32}$/,
        } as Record<string, RegExp>)[identifierType]?.test(identifier.trim())) {
      return jsonNoStore({ message: "Indica um identificador BayQi válido." }, 400);
    }
    if (!attemptId || !/^[A-Za-z0-9._:-]{8,100}$/.test(attemptId)) {
      return jsonNoStore({ message: "A referência da tentativa de pagamento é inválida." }, 400);
    }
    attemptIdForLog = attemptId;
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 20) {
      return jsonNoStore({ message: "O carrinho está vazio ou excede o limite de produtos." }, 400);
    }

    const quantities = new Map<number, number>();
    for (const item of body.items) {
      if (!item || !Number.isInteger(item.productId) || !Number.isInteger(item.quantity) || item.quantity! < 1 || item.quantity! > 20) {
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
    const items = products.map(product => ({
      productId: product.id,
      name: product.name,
      quantity: quantities.get(product.id) ?? 0,
      unitPrice: product.price,
    }));

    const existing = await prisma.checkoutAttempt.upsert({
      where: { attemptId },
      create: { attemptId, merchantReference, amount, currency: "AOA", status: "CREATING", items },
      update: {},
    });
    if (existing.amount !== amount || existing.merchantReference !== merchantReference) {
      return jsonNoStore({ message: "Esta tentativa já pertence a outra compra." }, 409);
    }

    const payment = await createGatewayPayment({
      amount,
      identifierType: identifierType as "BAYQI_TAG" | "PHONE" | "IUF" | "DOCUMENT",
      identifier: identifier.trim(),
      merchantReference,
      idempotencyKey: `nishop-${attemptId}`,
    });

    await prisma.checkoutAttempt.updateMany({
      where: { attemptId, status: { not: "SUCCEEDED" } },
      data: { paymentId: payment.paymentId, status: payment.status, errorCode: null },
    });

    return jsonNoStore({ ...payment, amount, currency: "AOA" }, payment.created ? 201 : 200);
  } catch (error) {
    if (attemptIdForLog) {
      try {
        await prisma.checkoutAttempt.updateMany({
          where: { attemptId: attemptIdForLog, paymentId: null,
            status: { in: ["CREATING", "UNKNOWN"] } },
          data: {
            status: error instanceof GatewayIntegrationError && error.code === "gateway_unavailable"
              ? "UNKNOWN"
              : "FAILED",
            errorCode: error instanceof GatewayIntegrationError ? error.code : "internal_error",
          },
        });
      } catch {
        console.error("[NishopCheckout] Não foi possível atualizar o registo da tentativa.");
      }
    }
    return errorResponse(error);
  }
}
