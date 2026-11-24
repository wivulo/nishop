type GatewayToken = {
  access_token: string;
  expires_in?: number;
};

type GatewayErrorPayload = {
  error?: { code?: string; message?: string; requestId?: string };
  message?: string;
};

export class GatewayIntegrationError extends Error {
  constructor(
    message: string,
    readonly status: number = 502,
    readonly code?: string,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "GatewayIntegrationError";
  }
}

let cachedToken: { value: string; expiresAt: number } | undefined;

function getConfig() {
  if (process.env.BAYQI_GATEWAY_ENVIRONMENT !== "sandbox") {
    throw new GatewayIntegrationError(
      "O checkout BayQi deste Nishop está limitado ao ambiente sandbox.",
      503,
      "sandbox_only",
    );
  }

  const baseUrl = process.env.BAYQI_GATEWAY_BASE_URL?.trim();
  const clientId = process.env.BAYQI_GATEWAY_CLIENT_ID?.trim();
  const clientSecret = process.env.BAYQI_GATEWAY_CLIENT_SECRET;

  if (!baseUrl || !clientId || !clientSecret) {
    throw new GatewayIntegrationError(
      "A integração de pagamento BayQi ainda não está configurada.",
      503,
      "gateway_not_configured",
    );
  }

  let base: URL;
  try {
    base = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  } catch {
    throw new GatewayIntegrationError("O endereço do Gateway é inválido.", 503, "invalid_gateway_url");
  }

  const localHttp =
    process.env.NODE_ENV !== "production" &&
    base.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(base.hostname);
  if (base.protocol !== "https:" && !localHttp) {
    throw new GatewayIntegrationError("O Gateway deve usar HTTPS.", 503, "https_required");
  }

  return { base, clientId, clientSecret };
}

async function readJson<T>(response: Response): Promise<T | undefined> {
  try {
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

async function getAccessToken() {
  const { base, clientId, clientSecret } = getConfig();
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) return cachedToken.value;

  const form = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "payments:create payments:read",
  });

  let response: Response;
  try {
    response = await fetch(new URL("oauth/token", base), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      cache: "no-store",
    });
  } catch {
    throw new GatewayIntegrationError("Não foi possível contactar o Gateway BayQi.", 503, "gateway_unavailable");
  }

  const payload = await readJson<GatewayToken & GatewayErrorPayload>(response);
  if (!response.ok || !payload?.access_token) {
    throw new GatewayIntegrationError(
      payload?.error?.message ?? "O Gateway recusou a autenticação da aplicação.",
      response.status === 429 ? 429 : 502,
      payload?.error?.code ?? "gateway_auth_failed",
      payload?.error?.requestId,
    );
  }

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(1, payload.expires_in ?? 900) * 1000,
  };
  return cachedToken.value;
}

export async function createGatewayPayment(input: {
  amount: number;
  bayqiTag: string;
  merchantReference: string;
  idempotencyKey: string;
}) {
  const { base } = getConfig();
  const token = await getAccessToken();
  let response: Response;
  try {
    response = await fetch(new URL("v1/payments", base), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        method: "QIFACIL_REQUEST",
        amount: input.amount,
        currency: "AOA",
        payer: { bayqiTag: input.bayqiTag },
        merchantReference: input.merchantReference,
      }),
      cache: "no-store",
    });
  } catch {
    throw new GatewayIntegrationError("Não foi possível enviar o pedido ao Gateway BayQi.", 503, "gateway_unavailable");
  }

  const payload = await readJson<GatewayErrorPayload & {
    paymentId: string;
    status: string;
    merchantReference: string;
    createdAtUtc: string;
    created: boolean;
  }>(response);

  if (!response.ok || !payload?.paymentId) {
    const status = [400, 401, 403, 409, 422].includes(response.status) ? response.status : 502;
    throw new GatewayIntegrationError(
      payload?.error?.message ?? "O Gateway não conseguiu iniciar a cobrança.",
      status,
      payload?.error?.code ?? "gateway_payment_failed",
      payload?.error?.requestId,
    );
  }

  return payload;
}

export async function getGatewayPayment(paymentId: string) {
  const { base } = getConfig();
  const token = await getAccessToken();
  let response: Response;
  try {
    response = await fetch(new URL(`v1/payments/${encodeURIComponent(paymentId)}`, base), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    throw new GatewayIntegrationError("Não foi possível consultar o Gateway BayQi.", 503, "gateway_unavailable");
  }

  const payload = await readJson<GatewayErrorPayload & {
    paymentId: string;
    status: string;
    amount: number;
    currency: string;
    merchantReference: string;
    createdAtUtc: string;
    updatedAtUtc: string;
    confirmedAtUtc: string | null;
  }>(response);

  if (!response.ok || !payload?.paymentId) {
    const status = response.status === 404 ? 404 : response.status === 429 ? 429 : 502;
    throw new GatewayIntegrationError(
      payload?.error?.message ?? "O Gateway não conseguiu consultar a cobrança.",
      status,
      payload?.error?.code ?? "gateway_payment_query_failed",
      payload?.error?.requestId,
    );
  }

  return payload;
}
