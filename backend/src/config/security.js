const defaultOrigins = [
  'http://localhost:5173',
  'https://gatherly-u229.vercel.app',
]

function getCorsOptions() {
  const origins = [
    ...defaultOrigins,
    ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
  ].map((value) => new URL(value).origin)

  const allowedOrigins = new Set(origins)
  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      let normalizedOrigin
      try {
        normalizedOrigin = new URL(origin).origin
      } catch {
        return callback(null, false)
      }
      return callback(null, allowedOrigins.has(normalizedOrigin))
    },
  }
}

function configureTrustProxy(app) {
  if (!process.env.TRUST_PROXY) return
  const proxyHops = Number(process.env.TRUST_PROXY)
  app.set('trust proxy', Number.isInteger(proxyHops) && proxyHops > 0 ? proxyHops : process.env.TRUST_PROXY)
}

module.exports = { configureTrustProxy, getCorsOptions }
