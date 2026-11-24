import { NextResponse } from "next/server";
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
    return jsonNoStore(await getGatewayPayment(params.paymentId));
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
