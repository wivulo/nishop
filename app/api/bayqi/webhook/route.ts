import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { verifyGatewayWebhook } from '@/lib/bayqi/webhook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PaymentSucceededEvent = {
  id?: string;
  type?: string;
  version?: number;
  data?: {
    paymentId?: string;
    method?: string;
    status?: string;
    amount?: number;
    currency?: string;
    merchantReference?: string;
    coreTransactionId?: string;
  };
};

function respond(body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export async function POST(request: Request) {
  const secret = process.env.BAYQI_GATEWAY_WEBHOOK_SECRET;
  if (!secret) return respond({ message: 'Webhook não configurado.' }, 503);
  const rawBody = Buffer.from(await request.arrayBuffer());
  if (rawBody.length > 16_384) return respond({ message: 'Evento demasiado grande.' }, 413);
  const eventId = request.headers.get('webhook-id');
  if (!verifyGatewayWebhook(secret, eventId, request.headers.get('webhook-timestamp'),
    request.headers.get('webhook-signature'), rawBody)) {
    return respond({ message: 'Assinatura inválida.' }, 401);
  }

  let event: PaymentSucceededEvent;
  try { event = JSON.parse(rawBody.toString('utf8')) as PaymentSucceededEvent; }
  catch { return respond({ message: 'Evento inválido.' }, 400); }
  if (!event || typeof event !== 'object') return respond({ message: 'Evento inválido.' }, 400);
  const payment = event.data;
  if (event.id !== eventId || event.type !== 'payment.succeeded' || event.version !== 1 ||
      !payment || payment.status !== 'SUCCEEDED' || payment.method !== 'QIFACIL_REQUEST' ||
      payment.currency !== 'AOA' || typeof payment.amount !== 'number' || !Number.isFinite(payment.amount) ||
      typeof payment.paymentId !== 'string' || !/^pay_[a-f0-9]{32}$/i.test(payment.paymentId) ||
      typeof payment.merchantReference !== 'string' || !payment.merchantReference.startsWith('NISHOP-') ||
      typeof payment.coreTransactionId !== 'string' || !payment.coreTransactionId) {
    return respond({ message: 'Evento não suportado.' }, 400);
  }

  try {
    const attempt = await prisma.checkoutAttempt.findUnique({
      where: { merchantReference: payment.merchantReference },
    });
    if (!attempt) return respond({ message: 'Cobrança ainda não registada.' }, 503);
    if (attempt.paymentId && attempt.paymentId !== payment.paymentId ||
        Math.round(attempt.amount * 100) !== Math.round(payment.amount! * 100)) {
      return respond({ message: 'Evento não corresponde à cobrança.' }, 409);
    }
    await prisma.checkoutAttempt.updateMany({
      where: { attemptId: attempt.attemptId, status: { not: 'SUCCEEDED' } },
      data: { paymentId: payment.paymentId, status: 'SUCCEEDED', errorCode: null },
    });
    return respond({ received: true });
  } catch {
    console.error('[NishopWebhook] Não foi possível registar a confirmação do pagamento.');
    return respond({ message: 'Confirmação temporariamente indisponível.' }, 503);
  }
}
