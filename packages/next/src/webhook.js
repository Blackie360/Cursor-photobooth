export function parsePayheroCallbackBody (rawBody) {
  const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody

  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid callback payload')
  }

  const response = payload.response || {}

  return {
    status: payload.status,
    amount: response.Amount,
    externalReference: response.ExternalReference,
    checkoutRequestId: response.CheckoutRequestID,
    resultCode: response.ResultCode,
    resultDescription: response.ResultDesc,
    receiptNumber: response.MpesaReceiptNumber,
    phone: response.Phone,
    raw: payload
  }
}

export async function verifyCallbackRequest (request, options = {}) {
  const { verifyFn } = options
  const rawBody = await request.text()

  if (typeof verifyFn === 'function') {
    const isValid = await verifyFn({ request, rawBody })
    if (!isValid) {
      throw new Error('Webhook signature verification failed')
    }
  }

  return parsePayheroCallbackBody(rawBody)
}
