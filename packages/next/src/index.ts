// Re-export SDK (canonical API)
export {
  createPayheroClient,
  PayheroError,
  PayheroApiError,
  PayheroTransportError,
  PayheroValidationError
} from '@payhero/sdk'
export type {
  PayheroClient,
  PayheroClientConfig,
  StkPushPayload,
  WithdrawToMobilePayload,
  WithdrawToBankPayload
} from '@payhero/sdk'

// Next-specific helpers
export { createPayheroFromEnv } from './server.js'
export { parsePayheroCallbackBody, verifyCallbackRequest } from './webhook.js'
export type { ParsedCallbackPayload, VerifyCallbackOptions } from './types.js'
