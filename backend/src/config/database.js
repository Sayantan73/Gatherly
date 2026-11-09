const mongoose = require('mongoose')

mongoose.set('bufferCommands', false)

const User = require('../models/User')
const Event = require('../models/Event')

let connectionPromise

function connectDatabase(uri) {
  if (!uri) return Promise.reject(new Error('MONGODB_URI is not configured.'))
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection)
  if (mongoose.connection.readyState !== 2) connectionPromise = null

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
    })
      .then(async () => {
        await Promise.all([User.init(), Event.init()])
        return mongoose.connection
      })
      .catch((error) => {
        connectionPromise = null
        throw error
      })
  }

  return connectionPromise
}

module.exports = { connectDatabase }
