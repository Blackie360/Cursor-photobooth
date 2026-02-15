/** Raw PayHero callback payload from their API */
export interface PayheroCallbackRawPayload {
  status?: boolean
  response?: PayheroCallbackResponse
}

export interface PayheroCallbackResponse {
  Amount?: number
  ExternalReference?: string
  CheckoutRequestID?: string
  ResultCode?: number
  ResultDesc?: string
  MpesaReceiptNumber?: string
  Phone?: string
}

/** Parsed/normalized callback payload - all fields defined with defaults when missing */
export interface ParsedCallbackPayload {
  status: boolean
  amount: number
  externalReference: string
  checkoutRequestId: string
  resultCode: number
  resultDescription: string
  receiptNumber: string
  phone: string
  raw: PayheroCallbackRawPayload
}

export interface VerifyCallbackOptions {
  verifyFn?: (ctx: { request: Request; rawBody: string }) => Promise<boolean>
}

/** Environment-like object with PayHero vars */
export interface PayheroEnv {
  PAYHERO_AUTH_TOKEN?: string
  PAYHERO_BASE_URL?: string
}
