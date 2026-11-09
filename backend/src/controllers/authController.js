const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

function issueToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role }
}

async function signup(req, res, next) {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body.password === 'string' ? req.body.password : ''
    const { role } = req.body

    if (name.length < 2 || name.length > 80) return res.status(400).json({ message: 'Please enter a name between 2 and 80 characters.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ message: 'Please enter a valid email address.' })
    if (password.length < 8 || password.length > 128) return res.status(400).json({ message: 'Choose a password between 8 and 128 characters.' })
    if (!['organizer', 'attendee'].includes(role)) return res.status(400).json({ message: 'Choose whether you want to host or join events.' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash, role })
    return res.status(201).json({ token: issueToken(user), user: publicUser(user) })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists. Try logging in instead.' })
    return next(error)
  }
}

async function login(req, res, next) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body.password === 'string' ? req.body.password : ''
    if (!email || !password) return res.status(400).json({ message: 'Enter your email and password to sign in.' })

    const user = await User.findOne({ email }).select('+passwordHash')
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false
    if (!valid) return res.status(401).json({ message: 'That email and password don’t match. Please try again.' })
    return res.json({ token: issueToken(user), user: publicUser(user) })
  } catch (error) {
    return next(error)
  }
}

function currentUser(req, res) {
  return res.json({ user: publicUser(req.user) })
}

module.exports = { currentUser, login, signup }
