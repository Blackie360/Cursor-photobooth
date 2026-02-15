import { PayheroApiError, PayheroTransportError, PayheroValidationError } from './errors.js'
import { withRetry } from './retry.js'
import type {
  HttpClientConfig,
  JsonObject,
  JsonValue
} from '../types.js'

interface HttpRequestOptions {
  body?: JsonObject
  query?: Record<string, string | number | boolean>
}

interface HttpClient {
  get: (path: string, options?: HttpRequestOptions) => Promise<JsonValue>
  post: (path: string, options?: HttpRequestOptions) => Promise<JsonValue>
}

export function createHttpClient (config: Partial<HttpClientConfig> = {}): HttpClient {
  const {
    baseUrl = 'https://backend.payhero.co.ke/api/v2',
    authToken,
    timeoutMs = 15000,
    maxRetries = 2,
    fetchImpl = globalThis.fetch
  } = config

  if (!authToken || typeof authToken !== 'string') {
    throw new PayheroValidationError('Missing auth token')
  }
  const token: string = authToken

  if (typeof fetchImpl !== 'function') {
    throw new PayheroValidationError('Missing fetch implementation')
  }

  async function request (
    method: 'GET' | 'POST',
    path: string,
    options: HttpRequestOptions = {}
  ): Promise<JsonValue> {
    const { body, query } = options
    return withRetry<JsonValue>(async () => {
      const url = new URL(normalizePath(baseUrl, path))
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          if (value === null || value === '') continue
          if (typeof value === 'undefined') continue
          url.searchParams.set(key, String(value))
        }
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const response = await fetchImpl(url, {
          method,
          headers: {
            authorization: normalizeAuthToken(token),
            'content-type': 'application/json'
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        } as RequestInit)

        const payload = await parsePayload(response)

        if (!response.ok) {
          throw new PayheroApiError('PayHero API request failed', {
            status: response.status,
            payload,
            isRetryable: response.status >= 500 || response.status === 429
          })
        }

        return payload
      } catch (error) {
        if (error instanceof PayheroApiError) {
          throw error
        }
        const err = error instanceof Error ? error : new Error(String(error))
        throw new PayheroTransportError('Network request failed', {
          cause: err,
          isRetryable: true
        })
      } finally {
        clearTimeout(timeoutId)
      }
    }, { maxRetries })
  }

  return {
    get: (path: string, options?: HttpRequestOptions) =>
      request('GET', path, options),
    post: (path: string, options?: HttpRequestOptions) =>
      request('POST', path, options)
  }
}

function normalizePath (baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, '')
  const nextPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${nextPath}`
}

function normalizeAuthToken (authToken: string): string {
  if (authToken.startsWith('Basic ')) {
    return authToken
  }
  return `Basic ${authToken}`
}

async function parsePayload (response: Response): Promise<JsonValue> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const data = await response.json()
    return data as JsonValue
  }
  return response.text()
}
