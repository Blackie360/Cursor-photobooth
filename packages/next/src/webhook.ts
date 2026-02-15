import type {
  ParsedCallbackPayload,
  PayheroCallbackRawPayload,
  VerifyCallbackOptions
} from './types.js'

export function parsePayheroCallbackBody (rawBody: string | PayheroCallbackRawPayload): ParsedCallbackPayload {
  const payload: PayheroCallbackRawPayload =
    typeof rawBody === 'string' ? (JSON.parse(rawBody) as PayheroCallbackRawPayload) : rawBody

  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid callback payload')
  }

  const response = payload.response ?? {}
  const res = response as Record<string, string | number>

  return {
    status: Boolean(payload.status),
    amount: typeof res.Amount === 'number' ? res.Amount : 0,
    externalReference: typeof res.ExternalReference === 'string' ? res.ExternalReference : '',
    checkoutRequestId: typeof res.CheckoutRequestID === 'string' ? res.CheckoutRequestID : '',
    resultCode: typeof res.ResultCode === 'number' ? res.ResultCode : -1,
    resultDescription: typeof res.ResultDesc === 'string' ? res.ResultDesc : '',
    receiptNumber: typeof res.MpesaReceiptNumber === 'string' ? res.MpesaReceiptNumber : '',
    phone: typeof res.Phone === 'string' ? res.Phone : '',
    raw: payload
  }
}

export async function verifyCallbackRequest (
  request: Request,
  options: VerifyCallbackOptions = {}
): Promise<ParsedCallbackPayload> {
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
