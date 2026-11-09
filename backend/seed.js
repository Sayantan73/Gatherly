require('dotenv').config()

const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Event = require('./src/models/Event')
const User = require('./src/models/User')

const sampleEvents = [
  {
    title: 'Sunday pottery & slow coffee',
    description: 'A relaxed morning getting our hands muddy, learning a few simple pottery techniques, and enjoying excellent coffee together. All materials are provided.',
    venue: 'Clay House Studio, Brooklyn',
    daysFromNow: 8,
    hour: 10,
    minute: 0,
    seatLimit: 16,
    category: 'MAKE SOMETHING',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=85',
  },
  {
    title: 'The neighborhood supper club',
    description: 'One long table, a seasonal menu, and a few new faces. Come hungry, leave with a new favorite recipe and hopefully a couple of new friends.',
    venue: 'The Greenhouse Kitchen, Queens',
    daysFromNow: 13,
    hour: 18,
    minute: 30,
    seatLimit: 24,
    category: 'EAT TOGETHER',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85',
  },
  {
    title: 'A little Sunday morning run',
    description: 'No pace goals and no one left behind. We’ll take a gentle loop through the park, then grab a pastry and a coffee for anyone who fancies it.',
    venue: 'Prospect Park, Brooklyn',
    daysFromNow: 18,
    hour: 9,
    minute: 0,
    seatLimit: 30,
    category: 'GET OUTSIDE',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1000&q=85',
  },
  {
    title: 'Little film night, big feelings',
    description: 'A cozy screening of an independent favorite with a short chat after. Bring a blanket if you like, and come ready to meet other movie people.',
    venue: 'Juniper Community Room, Manhattan',
    daysFromNow: 23,
    hour: 19,
    minute: 0,
    seatLimit: 20,
    category: 'WATCH & TALK',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=85',
  },
]

async function seed() {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'SEED_ORGANIZER_EMAIL', 'SEED_ORGANIZER_PASSWORD', 'SEED_ATTENDEE_EMAIL', 'SEED_ATTENDEE_PASSWORD']
  const missing = required.filter((key) => !process.env[key])
  if (missing.length) throw new Error(`Set these environment variables before seeding: ${missing.join(', ')}`)
  if (process.env.SEED_ORGANIZER_PASSWORD.length < 8 || process.env.SEED_ATTENDEE_PASSWORD.length < 8) {
    throw new Error('Seed demo passwords must be at least 8 characters.')
  }

  await mongoose.connect(process.env.MONGODB_URI)
  const organizerEmail = process.env.SEED_ORGANIZER_EMAIL.trim().toLowerCase()
  const attendeeEmail = process.env.SEED_ATTENDEE_EMAIL.trim().toLowerCase()
  if (organizerEmail === attendeeEmail) {
    throw new Error('Use different email addresses for the organizer and attendee demo accounts.')
  }
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!validEmail.test(organizerEmail) || !validEmail.test(attendeeEmail)) {
    throw new Error('Set valid email addresses for both demo accounts.')
  }
  const organizerPassword = await bcrypt.hash(process.env.SEED_ORGANIZER_PASSWORD, 12)
  const attendeePassword = await bcrypt.hash(process.env.SEED_ATTENDEE_PASSWORD, 12)
  const organizer = await User.findOneAndUpdate(
    { email: organizerEmail },
    { $set: { name: 'Jamie Rivera', email: organizerEmail, passwordHash: organizerPassword, role: 'organizer' } },
    { upsert: true, new: true, runValidators: true },
  )
  await User.findOneAndUpdate(
    { email: attendeeEmail },
    { $set: { name: 'Alex Morgan', email: attendeeEmail, passwordHash: attendeePassword, role: 'attendee' } },
    { upsert: true, new: true, runValidators: true },
  )

  for (const [index, item] of sampleEvents.entries()) {
    const date = new Date()
    date.setDate(date.getDate() + item.daysFromNow)
    date.setHours(item.hour, item.minute, 0, 0)
    const { daysFromNow, hour, minute, ...event } = item
    await Event.findOneAndUpdate(
      { title: event.title, organizer: organizer._id },
      { $set: { ...event, date, organizer: organizer._id, status: 'active' } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    )
    console.log(`Seeded sample event ${index + 1}: ${event.title}`)
  }
  await mongoose.disconnect()
  console.log('Sample accounts and events are ready.')
}

seed().catch(async (error) => {
  console.error('Unable to seed sample data:', error.message)
  await mongoose.disconnect().catch(() => {})
  process.exitCode = 1
})
