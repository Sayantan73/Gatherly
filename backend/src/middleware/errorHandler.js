function notFoundHandler(req, res) {
  return res.status(404).json({ message: 'We couldn’t find that page.' })
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)
  if (error.name === 'DatabaseUnavailableError') {
    console.error('MongoDB connection failed:', error.cause || error)
    return res.status(503).json({ message: 'The event database is temporarily unavailable. Please try again shortly.' })
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Please check the request format and try again.' })
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'That request is too large. Please shorten it and try again.' })
  }
  console.error(error)
  return res.status(500).json({ message: 'Something went wrong on our end. Please try again.' })
}

module.exports = { errorHandler, notFoundHandler }
