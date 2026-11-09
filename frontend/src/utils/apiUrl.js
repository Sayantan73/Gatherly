function appendApiPath(value) {
  const url = new URL(value)
  const pathname = url.pathname.replace(/\/+$/, '')
  if (!/\/api$/i.test(pathname)) {
    url.pathname = `${pathname}/api`
  }
  return url.toString().replace(/\/+$/, '')
}

export function normalizeApiUrl(value) {
  const configuredUrl = value?.trim().replace(/\/+$/, '')
  if (!configuredUrl) return '/api'

  if (/^https?:\/\//i.test(configuredUrl)) {
    return appendApiPath(configuredUrl)
  }

  if (/^\/\//.test(configuredUrl)) {
    return appendApiPath(`https:${configuredUrl}`)
  }

  const isHost = /^(localhost|(?:[\w-]+\.)+[a-z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(:\d+)?(?:\/.*)?$/i.test(configuredUrl)
  if (isHost) {
    const protocol = configuredUrl.toLowerCase().startsWith('localhost') ? 'http' : 'https'
    return appendApiPath(`${protocol}://${configuredUrl}`)
  }

  return /\/api$/i.test(configuredUrl) ? configuredUrl : `${configuredUrl}/api`
}
