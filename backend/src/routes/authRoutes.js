const express = require('express')
const { currentUser, login, signup } = require('../controllers/authController')
const { loginLimiter } = require('../config/rateLimiters')
const { authenticate } = require('../middleware/auth')
const { requireDatabase } = require('../middleware/requireDatabase')

const router = express.Router()

router.post('/signup', requireDatabase, signup)
router.post('/login', loginLimiter, requireDatabase, login)
router.get('/me', authenticate, currentUser)

module.exports = router
