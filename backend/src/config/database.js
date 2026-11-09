const mongoose = require('mongoose')
const User = require('../models/User')
const Event = require('../models/Event')

async function connectDatabase(uri) {
  await mongoose.connect(uri)
  await Promise.all([User.init(), Event.init()])
  return mongoose.connection
}

module.exports = { connectDatabase }
