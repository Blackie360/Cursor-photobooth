# Next.js App Router Example

Use `@payhero/next` inside server routes and server actions.

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
