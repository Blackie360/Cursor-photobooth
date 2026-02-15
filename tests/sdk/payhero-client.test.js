import test from 'node:test'
import assert from 'node:assert/strict'
import { createPayheroClient } from '../../packages/sdk/src/index.js'

test('getTransactionStatus builds request correctly', async () => {
  const calls = []
  const fetchImpl = async (url) => {
    calls.push(String(url))
    return {
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true })
    }
  }

  const client = createPayheroClient({
    authToken: 'Basic test-token',
    fetchImpl
  })

  const result = await client.getTransactionStatus('ABC123')

  assert.equal(result.success, true)
  assert.match(calls[0], /transaction-status\?reference=ABC123/)
})
