# Next.js App Router Example

Use `@payhero/next` inside server routes, server actions, and API routes. The package wraps `@payhero/sdk` with env-based factory and webhook utilities.

## Install

```bash
pnpm add @payhero/next
# or in this monorepo: it depends on workspace @payhero/sdk
```

## STK Push (Route Handler)

```js
import { createPayheroFromEnv } from '@payhero/next'

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
```

## Webhook / Callback Handler

PayHero sends callbacks to your configured endpoint. Parse and verify the body:

```js
import { parsePayheroCallbackBody, verifyCallbackRequest } from '@payhero/next'

// Simple parse (no signature verification)
export async function POST (request) {
  const rawBody = await request.text()
  const payload = parsePayheroCallbackBody(rawBody)
  // payload: status, amount, externalReference, checkoutRequestId, resultCode, resultDescription, receiptNumber, phone, raw
  return Response.json({ received: true })
}

// With optional verification
export async function POST (request) {
  const payload = await verifyCallbackRequest(request, {
    verifyFn: async ({ request, rawBody }) => {
      // Implement your signature/checksum verification
      return true
    }
  })
  return Response.json({ received: true })
}
```

## Environment

Set `PAYHERO_AUTH_TOKEN` and optionally `PAYHERO_BASE_URL` in `.env.local` or your deployment config.
