const API_URL = import.meta.env.VITE_API_URL || '/api'
let token = sessionStorage.getItem('event-token') || ''

export function setAuthToken(value) {
  token = value
  if (value) sessionStorage.setItem('event-token', value)
  else sessionStorage.removeItem('event-token')
}

export async function api(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  } catch {
    throw new Error('Can’t reach the event server right now. Please try again in a moment.')
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401 && token) setAuthToken('')
    const message = response.status >= 500
      ? 'The event service is temporarily unavailable. Please try again in a moment.'
      : data.message || 'Something went wrong. Please try again.'
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return data
}
