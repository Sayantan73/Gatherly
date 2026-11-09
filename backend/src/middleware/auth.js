const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { ensureDatabaseConnection } = require('./requireDatabase')

async function authenticate(req, res, next) {
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ message: 'Please log in to continue.' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    await ensureDatabaseConnection()
    const user = await User.findById(payload.sub).select('_id name email role')
    if (!user) return res.status(401).json({ message: 'Your session has expired. Please log in again.' })
    req.user = user
    return next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' })
    }
    return next(error)
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'This action isn’t available for your account type.' })
    return next()
  }
}

module.exports = { authenticate, allowRoles }
