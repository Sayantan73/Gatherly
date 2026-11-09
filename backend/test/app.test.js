const assert = require('node:assert/strict')
const { after, before, test } = require('node:test')
const app = require('../src/app')

let server
let baseUrl

before(async () => {
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
})

test('health endpoint responds without a database connection', async () => {
  const response = await fetch(`${baseUrl}/api/health`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'ok' })
})

test('CORS allows the deployed frontend origin', async () => {
  const response = await fetch(`${baseUrl}/api/events`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://gatherly-u229.vercel.app',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'authorization,content-type',
    },
  })
  assert.equal(response.status, 204)
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://gatherly-u229.vercel.app')
})

test('unknown paths return a JSON 404', async () => {
  const response = await fetch(`${baseUrl}/not-a-route`)
  assert.equal(response.status, 404)
  assert.equal(typeof (await response.json()).message, 'string')
})

test('malformed JSON receives a client error', async () => {
  const response = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"name":',
  })
  assert.equal(response.status, 400)
  assert.match((await response.json()).message, /request format/i)
})

test('non-object JSON request bodies are rejected', async () => {
  const response = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '[]',
  })
  assert.equal(response.status, 400)
  assert.match((await response.json()).message, /JSON object/i)
})

test('organizer event routes require authentication', async () => {
  const response = await fetch(`${baseUrl}/api/events/mine`)
  assert.equal(response.status, 401)
  assert.match((await response.json()).message, /log in/i)
})

test('attendee registration routes require authentication', async () => {
  const response = await fetch(`${baseUrl}/api/events/registrations/mine`)
  assert.equal(response.status, 401)
  assert.match((await response.json()).message, /log in/i)
})
