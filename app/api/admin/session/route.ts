import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminRequest } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const response = NextResponse.json({ authenticated: isAdminRequest(request) });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
