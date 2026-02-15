import { createHttpClient } from './core/http-client.js'
import { PayheroValidationError } from './core/errors.js'

export function createPayheroClient (config = {}) {
  const http = createHttpClient(config)

  return {
    initiateStkPush,
    getTransactionStatus,
    getServiceWalletBalance,
    getPaymentsWalletBalance,
    withdrawToMobile,
    withdrawToBank
  }

  function initiateStkPush (payload) {
    assertRequired(payload, ['amount', 'phone_number', 'channel_id', 'provider'])
    return http.post('/payments', { body: payload })
  }

  function getTransactionStatus (reference) {
    if (!reference) {
      throw new PayheroValidationError('reference is required')
    }

    return http.get('/transaction-status', {
      query: { reference }
    })
  }

  function getServiceWalletBalance () {
    return http.get('/wallets', {
      query: { wallet_type: 'service_wallet' }
    })
  }

  function getPaymentsWalletBalance (channelId) {
    if (!channelId) {
      throw new PayheroValidationError('channelId is required')
    }

    return http.get(`/payment_channels/${channelId}`)
  }

  function withdrawToMobile (payload) {
    assertRequired(payload, ['amount', 'phone_number', 'network_code'])
    return http.post('/withdraw', {
      body: {
        ...payload,
        channel: 'mobile'
      }
    })
  }

  function withdrawToBank (payload) {
    assertRequired(payload, ['amount', 'account_number', 'network_code'])
    return http.post('/withdraw', {
      body: {
        ...payload,
        channel: 'bank'
      }
    })
  }
}

function assertRequired (payload, keys) {
  if (!payload || typeof payload !== 'object') {
    throw new PayheroValidationError('payload must be an object')
  }

  for (const key of keys) {
    if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
      throw new PayheroValidationError(`${key} is required`)
    }
  }
}
