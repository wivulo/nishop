# Redux Toolkit TypeScript Example

## Nishop Management

The authenticated management dashboard is served at `/management`. It manages
the product catalogue and customer accounts, and shows completed payments,
checkout attempts, revenue, and product detail views. Configure
`NISHOP_ADMIN_EMAIL`, `NISHOP_ADMIN_PASSWORD`, and a random
`NISHOP_ADMIN_SESSION_SECRET` of at least 32 bytes in the deployment platform.
For example, generate a session secret with `openssl rand -base64 48`.

The dashboard records product views when a product detail is opened and records
checkout attempts before requesting a Gateway payment. Existing payments from
before this feature are not backfilled into the dashboard.

The Vercel build runs `prisma migrate deploy` before `next build`, applying
pending production migrations without running `migrate dev` or resetting the
database. Keep the Prisma migrations folder in source control.

## BayQi Gateway checkout (sandbox)

Checkout creates a QiFacil request through the BayQi Gateway from a Next.js
server route. The Gateway client secret is read only on the server; never use a
`NEXT_PUBLIC_` prefix for it. Configure these server-side environment variables
in the deployment platform:

- `BAYQI_GATEWAY_BASE_URL`: HTTPS base URL of the Gateway sandbox.
- `BAYQI_GATEWAY_ENVIRONMENT`: set to `sandbox`; the checkout rejects other values.
- `BAYQI_GATEWAY_CLIENT_ID`: sandbox application client ID.
- `BAYQI_GATEWAY_CLIENT_SECRET`: sandbox application client secret.

The sandbox application must be active, linked to the seller represented by
the product catalogue, and approved for `QIFACIL_REQUEST`, `payments:create`,
and `payments:read`. Checkout takes the total from the Nishop product database,
creates an idempotent payment request, and polls the Gateway for its status.
The dedicated `/checkout` page offers BayQi Wallet and marks Multicaixa Express
as coming soon. The buyer can identify the Wallet by BayQi Tag, phone, IUF, or
identity document. Nishop sends the identifier only to the Gateway; the Gateway
resolves the last three through its authenticated internal channel to the
Central API. Deploy the matching Gateway and Central versions before enabling
those three options.

Register `https://<nishop-domain>/api/bayqi/webhook` as the application webhook
endpoint in the BayQi partner portal. Store the returned `whsec_...` secret as
`BAYQI_GATEWAY_WEBHOOK_SECRET` in Nishop's server environment. The endpoint
verifies the Gateway signature and updates the matching checkout attempt when
it receives `payment.succeeded`. The checkout also polls the Gateway so a
delayed webhook does not leave the buyer waiting indefinitely.
`PENDING_CUSTOMER` means the buyer must approve the request in BayQi Wallet;
Nishop never collects a PIN or OTP. Only `SUCCEEDED` is treated as a completed
payment. The Gateway Central/Wallet sandbox flow must be enabled separately.

The payment routes allow up to 60 seconds on Vercel and limit each Gateway
request to 25 seconds. If a payment request still times out, inspect the Vercel
function logs for `[NishopCheckout] Etapa iniciada`: the last stage identifies
whether the delay was in the product database, attempt storage, Gateway call,
or payment storage. Retrying the same checkout reuses its attempt reference.

Add the Gateway values only after receiving the sandbox secrets. The sanitized
variable names are listed in `.env.example`.

This example shows how to integrate Next.js with [Redux Toolkit](https://redux-toolkit.js.org).

The **Redux Toolkit** is a standardized way to write Redux logic (create actions and reducers, setup the store with some default middlewares like redux devtools extension). This example demonstrates each of these features with Next.js

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-redux&project-name=with-redux&repository-name=with-redux)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example with-redux with-redux-app
```

```bash
yarn create next-app --example with-redux with-redux-app
```

```bash
pnpm create next-app --example with-redux with-redux-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
