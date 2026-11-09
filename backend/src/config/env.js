function readEnvironment() {
  const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((key) => !process.env[key])
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be a random value of at least 32 characters.')
  }

  return {
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
  }
}

module.exports = { readEnvironment }
