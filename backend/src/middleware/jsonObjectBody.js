function jsonObjectBody(req, res, next) {
  if (req.body === undefined && ['POST', 'PATCH', 'PUT'].includes(req.method)) {
    req.body = {}
  }
  if (req.body !== undefined && (typeof req.body !== 'object' || Array.isArray(req.body))) {
    return res.status(400).json({ message: 'Please send your information as a JSON object.' })
  }
  return next()
}

module.exports = jsonObjectBody
