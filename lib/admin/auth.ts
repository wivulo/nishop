import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "nishop_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function safeEqual(left: string, right: string) {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function sessionSecret() {
  const secret = process.env.NISHOP_ADMIN_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) return null;
  return secret;
}

export function isAdminLoginConfigured() {
  return Boolean(
    process.env.NISHOP_ADMIN_EMAIL?.trim() &&
    process.env.NISHOP_ADMIN_PASSWORD &&
    sessionSecret(),
  );
}

export function validateAdminCredentials(email: string, password: string) {
  const configuredEmail = process.env.NISHOP_ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.NISHOP_ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword || !sessionSecret()) return false;
  return safeEqual(email.trim().toLowerCase(), configuredEmail) &&
    safeEqual(password, configuredPassword);
}

export function createAdminSessionToken() {
  const secret = sessionSecret();
  if (!secret) throw new Error("NISHOP_ADMIN_SESSION_SECRET must contain at least 32 bytes.");

  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }))
    .toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function isAdminRequest(request: Request) {
  const secret = sessionSecret();
  if (!secret) return false;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader.split(";").map(part => part.trim())
    .find(part => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  const token = cookie?.slice(ADMIN_SESSION_COOKIE.length + 1);
  if (!token) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(signature, expected)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
