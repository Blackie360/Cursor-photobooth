/** JSON-serializable value for API payloads */
export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonArray
export interface JsonObject {
  [key: string]: JsonValue
}
export interface JsonArray extends Array<JsonValue> {}

export interface PayheroClientConfig {
  baseUrl?: string
  authToken: string
  timeoutMs?: number
  maxRetries?: number
  fetchImpl?: typeof fetch
}

export interface HttpClientConfig {
  baseUrl?: string
  authToken: string
  timeoutMs?: number
  maxRetries?: number
  fetchImpl?: typeof fetch
}

export interface RequestQuery {
  [key: string]: string | number | boolean
}

export interface RequestOptions {
  body?: JsonObject
  query?: RequestQuery
}

export interface HttpGetOptions {
  query?: RequestQuery
}

export interface HttpPostOptions {
  body?: JsonObject
}

export interface PayheroErrorDetails {
  status?: number
  payload?: JsonValue
  isRetryable?: boolean
  cause?: Error
}

export interface StkPushPayload extends JsonObject {
  amount: number
  phone_number: string
  channel_id: number
  provider: string
}

export interface WithdrawToMobilePayload extends JsonObject {
  amount: number
  phone_number: string
  network_code: string
}

export interface WithdrawToBankPayload extends JsonObject {
  amount: number
  account_number: string
  network_code: string
}

export interface RetryOptions {
  maxRetries?: number
  baseDelayMs?: number
  shouldRetry?: (error: Error & { details?: PayheroErrorDetails }) => boolean
}

export type RetryTask<T> = (attempt: number) => Promise<T>
