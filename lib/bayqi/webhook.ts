import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyGatewayWebhook(
  secret: string, eventId: string | null, timestamp: string | null,
  signature: string | null, body: Buffer, nowSeconds = Math.floor(Date.now() / 1000),
) {
  if (!secret.startsWith('whsec_') || !eventId || !timestamp || !signature?.startsWith('v1,') ||
      !/^[0-9]{10,13}$/.test(timestamp)) return false;
  const sentAt = Number(timestamp);
  if (!Number.isSafeInteger(sentAt) || Math.abs(nowSeconds - sentAt) > 300) return false;
  const key = Buffer.from(secret.slice(6), 'base64');
  const supplied = Buffer.from(signature.slice(3), 'base64');
  if (key.length !== 32 || supplied.length !== 32) return false;
  const expected = createHmac('sha256', key)
    .update(eventId).update('.').update(timestamp).update('.').update(body).digest();
  return timingSafeEqual(expected, supplied);
}
