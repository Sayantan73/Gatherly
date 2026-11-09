const assert = require('node:assert/strict')
const { test } = require('node:test')
const { getCorsOptions } = require('../src/config/security')
const { ensureDatabaseConnection } = require('../src/middleware/requireDatabase')

test('CORS allows configured frontend origins and removes trailing slashes', async () => {
  const previous = process.env.CLIENT_URL
  process.env.CLIENT_URL = 'https://gatherly-u229.vercel.app/, https://preview.example.com/'
  try {
    const { origin } = getCorsOptions()
    const checkOrigin = (value) => new Promise((resolve, reject) => {
      origin(value, (error, allowed) => error ? reject(error) : resolve(allowed))
    })
    assert.equal(await checkOrigin('https://gatherly-u229.vercel.app'), true)
    assert.equal(await checkOrigin('https://preview.example.com'), true)
    assert.equal(await checkOrigin('https://unknown.example.com'), false)
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
