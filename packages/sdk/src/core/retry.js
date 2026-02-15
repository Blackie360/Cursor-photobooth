const DEFAULT_RETRYABLE = [429, 500, 502, 503, 504]

export async function withRetry (task, options = {}) {
  const {
    maxRetries = 2,
    baseDelayMs = 300,
    shouldRetry = defaultShouldRetry
  } = options

  let attempt = 0
  let lastError

  while (attempt <= maxRetries) {
    try {
      return await task(attempt)
    } catch (error) {
      lastError = error
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error
      }
      const delay = baseDelayMs * (2 ** attempt)
      await sleep(delay)
      attempt += 1
    }
  }

  throw lastError
}

function defaultShouldRetry (error) {
  return Boolean(error?.details?.isRetryable || DEFAULT_RETRYABLE.includes(error?.details?.status))
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
