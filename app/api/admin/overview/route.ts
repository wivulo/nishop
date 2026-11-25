import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { isAdminRequest } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ message: "Sessão de administrador inválida." }, { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const [users, products, attempts, paid, failed, revenue, recentAttempts, recentViews] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.checkoutAttempt.count(),
    prisma.checkoutAttempt.count({ where: { status: "SUCCEEDED" } }),
    prisma.checkoutAttempt.count({ where: { status: { in: ["FAILED", "DECLINED", "ERROR"] } } }),
    prisma.checkoutAttempt.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amount: true } }),
    prisma.checkoutAttempt.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { attemptId: true, paymentId: true, merchantReference: true, amount: true, currency: true, status: true, errorCode: true, createdAt: true, items: true },
    }),
    prisma.productView.findMany({
      where: { createdAt: { gte: since } },
      select: { productId: true, productName: true, createdAt: true },
    }),
  ]);

  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(since);
    date.setDate(since.getDate() + index);
    return {
      date: date.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat("pt-AO", { weekday: "short" }).format(date),
      views: 0,
    };
  });
  const dailyByDate = new Map(daily.map(item => [item.date, item]));
  const popularProducts = new Map<string, { productId: number | null; productName: string; views: number }>();
  for (const view of recentViews) {
    const day = dailyByDate.get(view.createdAt.toISOString().slice(0, 10));
    if (day) day.views += 1;
    const key = `${view.productId ?? "removed"}:${view.productName}`;
    const product = popularProducts.get(key) ?? { productId: view.productId, productName: view.productName, views: 0 };
    product.views += 1;
    popularProducts.set(key, product);
  }

  const totalViews = await prisma.productView.count();
  const pending = attempts - paid - failed;
  const response = NextResponse.json({
    totals: {
      users,
      products,
      purchases: paid,
      attempts,
      failedAttempts: failed,
      pendingAttempts: Math.max(0, pending),
      views: totalViews,
      revenue: revenue._sum.amount ?? 0,
    },
    dailyViews: daily,
    popularProducts: [...popularProducts.values()].sort((a, b) => b.views - a.views).slice(0, 5),
    recentAttempts,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
