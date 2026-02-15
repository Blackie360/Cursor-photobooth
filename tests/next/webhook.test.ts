import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePayheroCallbackBody } from '../../packages/next/dist/index.js'

test('parsePayheroCallbackBody maps callback shape', () => {
  const data = parsePayheroCallbackBody({
    status: true,
    response: {
      Amount: 10,
      ExternalReference: 'INV-009',
      CheckoutRequestID: 'ws_CO_123',
      ResultCode: 0,
      ResultDesc: 'ok',
      MpesaReceiptNumber: 'AB123',
      Phone: '+254700000000'
    }
  })

  assert.equal(data.externalReference, 'INV-009')
  assert.equal(data.receiptNumber, 'AB123')
})
