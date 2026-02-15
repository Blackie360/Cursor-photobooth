import { createPayheroClient } from '@payhero/sdk'

const client = createPayheroClient({
  authToken: process.env.PAYHERO_AUTH_TOKEN ?? '',
  baseUrl: process.env.PAYHERO_BASE_URL
})

async function run (): Promise<void> {
  const reference = process.env.PAYHERO_REFERENCE ?? 'your-reference'
  const status = await client.getTransactionStatus(reference)
  console.log(status)
}

run().catch((error: Error) => {
  console.error(error)
  process.exit(1)
})
