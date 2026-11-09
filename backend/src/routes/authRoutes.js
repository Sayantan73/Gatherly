const express = require('express')
const { currentUser, login, signup } = require('../controllers/authController')
const { loginLimiter } = require('../config/rateLimiters')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', loginLimiter, login)
router.get('/me', authenticate, currentUser)

module.exports = router
