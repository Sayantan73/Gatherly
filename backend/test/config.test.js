const assert = require('node:assert/strict')
const { test } = require('node:test')
const { getCorsOptions } = require('../src/config/security')
const { ensureDatabaseConnection } = require('../src/middleware/requireDatabase')

test('CORS accepts comma-separated frontend origins and removes trailing slashes', () => {
  const previous = process.env.CLIENT_URL
  process.env.CLIENT_URL = 'https://gatherly-u229.vercel.app/, https://preview.example.com/'
  try {
    assert.deepEqual(getCorsOptions(), {
      origin: ['https://gatherly-u229.vercel.app', 'https://preview.example.com'],
    })
  } finally {
    if (previous === undefined) delete process.env.CLIENT_URL
    else process.env.CLIENT_URL = previous
  }
})

test('database failures become explicit service-unavailable errors', async () => {
  const previous = process.env.MONGODB_URI
  delete process.env.MONGODB_URI
  try {
    await assert.rejects(ensureDatabaseConnection(), (error) => {
      assert.equal(error.name, 'DatabaseUnavailableError')
      assert.equal(error.status, 503)
      return true
    })
  } finally {
    if (previous === undefined) delete process.env.MONGODB_URI
    else process.env.MONGODB_URI = previous
  }
})
