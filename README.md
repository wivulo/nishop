# Redux Toolkit TypeScript Example

## Nishop Management

The management dashboard from `nishop-managment` is served by this Next.js app
at `/management`. Its static files live under `public/management`; open
`/management` to use the dashboard. It is the original demo dashboard backed by
its bundled sample JSON and client-side login; it is not yet connected to the
Nishop product database and must not be treated as production authentication.

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
`PENDING_CUSTOMER` means the buyer must approve the request in BayQi Wallet;
Nishop never collects a PIN or OTP. Only `SUCCEEDED` is treated as a completed
payment. The Gateway Central/Wallet sandbox flow must be enabled separately.

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
