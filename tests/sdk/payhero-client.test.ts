import test from 'node:test'
import assert from 'node:assert/strict'
import { createPayheroClient } from '../../packages/sdk/dist/index.js'

test('getTransactionStatus builds request correctly', async () => {
  const calls: string[] = []
  const fetchImpl: typeof fetch = async (url) => {
    calls.push(String(url))
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
  }

  const client = createPayheroClient({
    authToken: 'Basic test-token',
    fetchImpl
  })

  const result = await client.getTransactionStatus('ABC123')

  assert.equal(result.success, true)
  assert.match(calls[0], /transaction-status\?reference=ABC123/)
})
