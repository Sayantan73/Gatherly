import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeApiUrl } from '../src/utils/apiUrl.js'

test('uses the local API proxy when no URL is configured', () => {
  assert.equal(normalizeApiUrl(''), '/api')
  assert.equal(normalizeApiUrl(undefined), '/api')
})

test('adds the API path to a full backend origin', () => {
  assert.equal(normalizeApiUrl('https://api.example.com/'), 'https://api.example.com/api')
})

test('adds the HTTPS scheme and API path to a bare production hostname', () => {
  assert.equal(normalizeApiUrl('gatherly-five-omega.vercel.app/'), 'https://gatherly-five-omega.vercel.app/api')
})

test('does not duplicate an existing API path', () => {
  assert.equal(normalizeApiUrl('https://api.example.com/api/'), 'https://api.example.com/api')
})

test('keeps localhost ports and adds the API path', () => {
  assert.equal(normalizeApiUrl('localhost:5000'), 'http://localhost:5000/api')
  assert.equal(normalizeApiUrl('http://localhost:5000/'), 'http://localhost:5000/api')
})

test('preserves a relative API base path', () => {
  assert.equal(normalizeApiUrl('/api/'), '/api')
  assert.equal(normalizeApiUrl('/backend'), '/backend/api')
})
