require('dotenv').config()

const { readEnvironment } = require('./src/config/env')
const { connectDatabase } = require('./src/config/database')
const app = require('./src/app')

async function start() {
  const config = readEnvironment()
  await connectDatabase(config.mongoUri)
  app.listen(config.port, () => console.log(`Gatherly API listening on port ${config.port}`))
}

start().catch((error) => {
  console.error('Unable to start the API:', error.message)
  process.exitCode = 1
})