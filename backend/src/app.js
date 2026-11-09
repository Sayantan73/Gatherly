const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { configureTrustProxy, getCorsOptions } = require('./config/security')
const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const jsonObjectBody = require('./middleware/jsonObjectBody')
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler')

const app = express()

configureTrustProxy(app)
app.use(helmet())
app.use(cors(getCorsOptions()))
app.use(express.json({ limit: '20kb' }))
app.use(jsonObjectBody)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
