# PayHero Monorepo

Monorepo for PayHero Kenya integrations with two publishable packages:

- **@payhero/sdk**: Framework-agnostic Node.js client
- **@payhero/next**: Next.js App Router server integration (wraps `@payhero/sdk`)

## Quickstart

```bash
pnpm install
pnpm build
pnpm test
```

## Environment

| Variable | Required | Default |
|----------|----------|---------|
| `PAYHERO_AUTH_TOKEN` | Yes | — |
| `PAYHERO_BASE_URL` | No | `https://backend.payhero.co.ke/api/v2` |

---

## Generic Node Usage (@payhero/sdk)

Use `@payhero/sdk` in any Node.js backend (Express, Fastify, plain scripts, etc.):

```js
import { createPayheroClient } from '@payhero/sdk'

const client = createPayheroClient({
  authToken: process.env.PAYHERO_AUTH_TOKEN,
  baseUrl: process.env.PAYHERO_BASE_URL
})

const result = await client.initiateStkPush({
  amount: 100,
  phone_number: '0787677676',
  channel_id: 133,
  provider: 'm-pesa'
})
```

**API methods:** `initiateStkPush`, `getTransactionStatus`, `getServiceWalletBalance`, `getPaymentsWalletBalance`, `withdrawToMobile`, `withdrawToBank`

**Errors:** `PayheroError`, `PayheroApiError`, `PayheroTransportError`, `PayheroValidationError`

---

## Next.js App Router Usage (@payhero/next)

Use `@payhero/next` in server routes and server actions. It provides env-based setup and webhook helpers:

```js
import { createPayheroFromEnv, parsePayheroCallbackBody } from '@payhero/next'

// In a route handler
export async function POST () {
  const payhero = createPayheroFromEnv()
  const result = await payhero.initiateStkPush({
    amount: 100,
    phone_number: '0787677676',
    channel_id: 133,
    provider: 'm-pesa'
  })
  return Response.json(result)
}

// Webhook / callback handler
export async function POST (request) {
  const payload = await parsePayheroCallbackBody(await request.text())
  // handle payload.status, payload.externalReference, etc.
}
```

`@payhero/next` re-exports all `@payhero/sdk` symbols, so you can import everything from one package if preferred.

---

## Packages

| Package | Entry points | Dependencies |
|---------|--------------|--------------|
| `@payhero/sdk` | ESM + CJS | None (zero Next.js) |
| `@payhero/next` | ESM + CJS | `@payhero/sdk` |

Both packages expose dual-module outputs via `package.json` `exports`: `import` → ESM, `require` → CJS.

---

## Publishing & Versioning

- **Internal dependency**: `@payhero/next` uses `@payhero/sdk` via `workspace:*`
- **Versioning**: Bump versions manually in each `packages/*/package.json`; consider [changesets](https://github.com/changesets/changesets) later for automated bumps and changelogs
- **Build before publish**: Run `pnpm build` so `dist/` is populated; add `files` to `package.json` if you want to restrict published contents

---

## Examples

- `examples/node-basic/` – Plain Node.js usage
- `examples/next-app-router/` – Next.js App Router usage

---

## Notes

Initial scaffold and baseline. Further endpoint coverage and production hardening can be added incrementally.
