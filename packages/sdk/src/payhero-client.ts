import { createHttpClient } from './core/http-client.js'
import { PayheroValidationError } from './core/errors.js'
import type {
  JsonObject,
  PayheroClientConfig,
  StkPushPayload,
  WithdrawToMobilePayload,
  WithdrawToBankPayload
} from './types.js'

export interface PayheroClient {
  initiateStkPush: (payload: StkPushPayload) => Promise<JsonObject>
  getTransactionStatus: (reference: string) => Promise<JsonObject>
  getServiceWalletBalance: () => Promise<JsonObject>
  getPaymentsWalletBalance: (channelId: number | string) => Promise<JsonObject>
  withdrawToMobile: (payload: WithdrawToMobilePayload) => Promise<JsonObject>
  withdrawToBank: (payload: WithdrawToBankPayload) => Promise<JsonObject>
}

function assertRequired (
  payload: object | null,
  keys: string[]
): void {
  if (!payload || typeof payload !== 'object') {
    throw new PayheroValidationError('payload must be an object')
  }
  const obj = payload as Record<string, string | number | boolean | object | null>
  for (const key of keys) {
    const val = obj[key]
    if (!(key in obj) || val == null || val === '') {
      throw new PayheroValidationError(`${key} is required`)
    }
  }
}

export function createPayheroClient (config: PayheroClientConfig): PayheroClient {
  const http = createHttpClient(config)

  return {
    initiateStkPush (payload: StkPushPayload) {
      assertRequired(payload as object, ['amount', 'phone_number', 'channel_id', 'provider'])
      return http.post('/payments', { body: payload }) as Promise<JsonObject>
    },

    getTransactionStatus (reference: string) {
      if (!reference) {
        throw new PayheroValidationError('reference is required')
      }
      return http.get('/transaction-status', {
        query: { reference }
      }) as Promise<JsonObject>
    },

    getServiceWalletBalance () {
      return http.get('/wallets', {
        query: { wallet_type: 'service_wallet' }
      }) as Promise<JsonObject>
    },

    getPaymentsWalletBalance (channelId: number | string) {
      if (
        channelId === '' ||
        channelId == null ||
        (typeof channelId === 'number' && isNaN(channelId))
      ) {
        throw new PayheroValidationError('channelId is required')
      }
      return http.get(`/payment_channels/${channelId}`) as Promise<JsonObject>
    },

    withdrawToMobile (payload: WithdrawToMobilePayload) {
      assertRequired(payload as object, ['amount', 'phone_number', 'network_code'])
      return http.post('/withdraw', {
        body: { ...payload, channel: 'mobile' }
      }) as Promise<JsonObject>
    },

    withdrawToBank (payload: WithdrawToBankPayload) {
      assertRequired(payload as object, ['amount', 'account_number', 'network_code'])
      return http.post('/withdraw', {
        body: { ...payload, channel: 'bank' }
      }) as Promise<JsonObject>
    }
  }
}
