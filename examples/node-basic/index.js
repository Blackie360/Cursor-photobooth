import { createPayheroClient } from '@payhero/sdk'

const client = createPayheroClient({
  authToken: process.env.PAYHERO_AUTH_TOKEN,
  baseUrl: process.env.PAYHERO_BASE_URL
})

async function run () {
  const status = await client.getTransactionStatus('your-reference')
  console.log(status)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
