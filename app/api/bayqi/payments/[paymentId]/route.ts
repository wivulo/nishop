import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { getGatewayPayment, GatewayIntegrationError } from "@/lib/bayqi/gateway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonNoStore(body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function GET(_request: Request, { params }: { params: { paymentId: string } }) {
  if (!/^pay_[a-f0-9]{32}$/i.test(params.paymentId)) {
    return jsonNoStore({ message: "Identificador de pagamento inválido." }, 400);
  }

  try {
    const confirmed = await prisma.checkoutAttempt.findUnique({ where: { paymentId: params.paymentId } });
    if (confirmed?.status === 'SUCCEEDED') {
      return jsonNoStore({ paymentId: params.paymentId, status: 'SUCCEEDED',
        merchantReference: confirmed.merchantReference, amount: confirmed.amount,
        currency: confirmed.currency });
    }
    const payment = await getGatewayPayment(params.paymentId);
    try {
      await prisma.checkoutAttempt.updateMany({
        where: { paymentId: payment.paymentId, status: { not: 'SUCCEEDED' } },
        data: { status: payment.status, errorCode: null },
      });
    } catch {
      console.error("[NishopCheckout] Não foi possível sincronizar o estado da tentativa.");
    }
    return jsonNoStore(payment);
  } catch (error) {
    if (error instanceof GatewayIntegrationError) {
      return jsonNoStore(
        { message: error.message, code: error.code, requestId: error.requestId },
        error.status,
      );
    }
    console.error("[NishopCheckout] Falha interna ao consultar cobrança.");
    return jsonNoStore({ message: "Não foi possível consultar o estado do pagamento." }, 503);
  }
}
