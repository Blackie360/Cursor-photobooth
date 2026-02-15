import { createPayheroClient } from '@payhero/sdk'
import type { PayheroEnv } from './types.js'

export function createPayheroFromEnv (env: PayheroEnv = process.env as PayheroEnv) {
  const authToken = env.PAYHERO_AUTH_TOKEN
  const baseUrl = env.PAYHERO_BASE_URL ?? 'https://backend.payhero.co.ke/api/v2'

  if (!authToken || typeof authToken !== 'string') {
    throw new Error('PAYHERO_AUTH_TOKEN is required')
  }

  return createPayheroClient({ authToken, baseUrl })
}
