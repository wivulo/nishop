import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  isAdminLoginConfigured,
  validateAdminCredentials,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminLoginConfigured()) {
    return NextResponse.json({ message: "Configura o acesso de administrador nas variáveis de ambiente." }, { status: 503 });
  }

  try {
    const body = await request.json() as { email?: string; password?: string };
    if (typeof body.email !== "string" || typeof body.password !== "string" ||
        !validateAdminCredentials(body.email, body.password)) {
      return NextResponse.json({ message: "E-mail ou palavra-passe inválidos." }, { status: 401 });
    }

    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ message: "Pedido de autenticação inválido." }, { status: 400 });
  }
}
