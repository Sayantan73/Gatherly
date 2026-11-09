const { connectDatabase } = require('../config/database')

async function ensureDatabaseConnection() {
  try {
    return await connectDatabase(process.env.MONGODB_URI)
  } catch (cause) {
    const error = new Error('The database connection is unavailable.')
    error.name = 'DatabaseUnavailableError'
    error.status = 503
    error.cause = cause
    throw error
  }
}

function requireDatabase(req, res, next) {
  ensureDatabaseConnection().then(() => next(), next)
}

module.exports = { ensureDatabaseConnection, requireDatabase }
