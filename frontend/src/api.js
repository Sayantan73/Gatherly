function normalizeApiUrl(value) {
  const configuredUrl = value?.trim().replace(/\/+$/, '')
  if (!configuredUrl) return '/api'

  if (/^https?:\/\//i.test(configuredUrl)) {
    const url = new URL(configuredUrl)
    if (!/\/api$/i.test(url.pathname.replace(/\/+$/, ''))) {
      url.pathname = `${url.pathname.replace(/\/+$/, '')}/api`
    }
    return url.toString().replace(/\/+$/, '')
  }

  return /\/api$/i.test(configuredUrl)
    ? configuredUrl
    : `${configuredUrl}/api`
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL)
let token = sessionStorage.getItem('event-token') || ''

export const apiRoutes = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
  },
  events: {
    list: '/events',
    mine: '/events/mine',
    registrations: '/events/registrations/mine',
    create: '/events',
    byId: (id) => `/events/${encodeURIComponent(id)}`,
    attendees: (id) => `/events/${encodeURIComponent(id)}/attendees`,
    register: (id) => `/events/${encodeURIComponent(id)}/register`,
    cancel: (id) => `/events/${encodeURIComponent(id)}/cancel`,
  },
}

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
