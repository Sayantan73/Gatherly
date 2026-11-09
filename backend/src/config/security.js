function getCorsOptions() {
  const origins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((url) => url.trim()).filter(Boolean)
    : ['http://localhost:5173']
  return { origin: origins }
}

function configureTrustProxy(app) {
  if (!process.env.TRUST_PROXY) return
  const proxyHops = Number(process.env.TRUST_PROXY)
  app.set('trust proxy', Number.isInteger(proxyHops) && proxyHops > 0 ? proxyHops : process.env.TRUST_PROXY)
}

module.exports = { configureTrustProxy, getCorsOptions }
