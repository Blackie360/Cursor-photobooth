import { PayheroApiError, PayheroTransportError, PayheroValidationError } from './errors.js'
import { withRetry } from './retry.js'

export function createHttpClient (config = {}) {
  const {
    baseUrl = 'https://backend.payhero.co.ke/api/v2',
    authToken,
    timeoutMs = 15000,
    maxRetries = 2,
    fetchImpl = globalThis.fetch
  } = config

  if (!authToken) {
    throw new PayheroValidationError('Missing auth token')
  }

  if (typeof fetchImpl !== 'function') {
    throw new PayheroValidationError('Missing fetch implementation')
  }

  async function request (method, path, options = {}) {
    const { body, query } = options
    return withRetry(async () => {
      const url = new URL(normalizePath(baseUrl, path))
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          if (value === undefined || value === null || value === '') {
            continue
          }
          url.searchParams.set(key, String(value))
        }
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const response = await fetchImpl(url, {
          method,
          headers: {
            authorization: normalizeAuthToken(authToken),
            'content-type': 'application/json'
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        })

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
        if (error.name === 'PayheroApiError') {
          throw error
        }

        throw new PayheroTransportError('Network request failed', {
          cause: error,
          isRetryable: true
        })
      } finally {
        clearTimeout(timeoutId)
      }
    }, { maxRetries })
  }

  return {
    get: (path, options) => request('GET', path, options),
    post: (path, options) => request('POST', path, options)
  }
}

function normalizePath (baseUrl, path) {
  const base = baseUrl.replace(/\/$/, '')
  const nextPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${nextPath}`
}

function normalizeAuthToken (authToken) {
  if (authToken.startsWith('Basic ')) {
    return authToken
  }
  return `Basic ${authToken}`
}

async function parsePayload (response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}
