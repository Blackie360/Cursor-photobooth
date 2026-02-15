import { createPayheroClient } from '@payhero/sdk'

export function createPayheroFromEnv (env = process.env) {
  const authToken = env.PAYHERO_AUTH_TOKEN
  const baseUrl = env.PAYHERO_BASE_URL || 'https://backend.payhero.co.ke/api/v2'

  if (!authToken) {
    throw new Error('PAYHERO_AUTH_TOKEN is required')
  }

  return createPayheroClient({ authToken, baseUrl })
}
