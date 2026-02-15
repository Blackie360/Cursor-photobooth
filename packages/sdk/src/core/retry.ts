import type { PayheroErrorDetails } from '../types.js'
import type { RetryOptions, RetryTask } from '../types.js'

const DEFAULT_RETRYABLE = [429, 500, 502, 503, 504]

interface ErrorWithDetails extends Error {
  details?: PayheroErrorDetails
}

function defaultShouldRetry (error: ErrorWithDetails): boolean {
  const details = error.details
  if (!details) return false
  if (details.isRetryable === true) return true
  if (typeof details.status === 'number' && DEFAULT_RETRYABLE.includes(details.status)) {
    return true
  }
  return false
}

export async function withRetry<T> (
  task: RetryTask<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 2,
    baseDelayMs = 300,
    shouldRetry = defaultShouldRetry
  } = options

  let attempt = 0
  let lastError: Error = new Error('Unreachable')

  while (attempt <= maxRetries) {
    try {
      return await task(attempt)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt >= maxRetries || !shouldRetry(lastError as ErrorWithDetails)) {
        throw error
      }
      const delay = baseDelayMs * (2 ** attempt)
      await sleep(delay)
      attempt += 1
    }
  }

  throw lastError
}

function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
