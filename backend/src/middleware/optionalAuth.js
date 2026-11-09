const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { ensureDatabaseConnection } = require('./requireDatabase')

async function optionalAuth(req, res, next) {
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return next()
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    await ensureDatabaseConnection()
    req.user = await User.findById(payload.sub).select('_id name email role')
    return next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') return next()
    return next(error)
  }
}

module.exports = optionalAuth
