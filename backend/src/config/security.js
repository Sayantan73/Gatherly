function getCorsOptions() {
  const origins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => new URL(value).origin)
  return { origin: origins }
}

function configureTrustProxy(app) {
  if (!process.env.TRUST_PROXY) return
  const proxyHops = Number(process.env.TRUST_PROXY)
  app.set('trust proxy', Number.isInteger(proxyHops) && proxyHops > 0 ? proxyHops : process.env.TRUST_PROXY)
}

module.exports = { configureTrustProxy, getCorsOptions }
