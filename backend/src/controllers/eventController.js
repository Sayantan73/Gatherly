const mongoose = require('mongoose')
const Event = require('../models/Event')
const { serializeEvent, validateEventInput } = require('../utils/events')

function validId(id) {
  return mongoose.isValidObjectId(id)
}

async function listUpcoming(req, res, next) {
  try {
    const filter = { status: 'active', date: { $gt: new Date() } }
    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      const escaped = req.query.search.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { venue: { $regex: escaped, $options: 'i' } },
      ]
    }
    const events = await Event.find(filter).populate('organizer', 'name').sort({ date: 1 }).limit(100)
    return res.json({ events: events.map((event) => serializeEvent(event, req.user)) })
  } catch (error) {
    return next(error)
  }
}

async function listMine(req, res, next) {
  try {
    const events = await Event.find({ organizer: req.user._id }).populate('organizer', 'name').sort({ date: -1 })
    return res.json({ events: events.map((event) => serializeEvent(event, req.user)) })
  } catch (error) {
    return next(error)
  }
}

async function listRegistrations(req, res, next) {
  try {
    const events = await Event.find({ 'registrations.attendee': req.user._id }).populate('organizer', 'name').sort({ date: 1 })
    return res.json({ events: events.map((event) => serializeEvent(event, req.user)) })
  } catch (error) {
    return next(error)
  }
}

async function createEvent(req, res, next) {
  try {
    const validationError = validateEventInput(req.body)
    if (validationError) return res.status(400).json({ message: validationError })
    const event = await Event.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      date: new Date(req.body.date),
      venue: req.body.venue.trim(),
      seatLimit: Number(req.body.seatLimit),
      organizer: req.user._id,
    })
    await event.populate('organizer', 'name')
    return res.status(201).json({ event: serializeEvent(event, req.user) })
  } catch (error) {
    return next(error)
  }
}

async function getAttendees(req, res, next) {
  if (!validId(req.params.id)) return res.status(404).json({ message: 'We couldn’t find that event.' })
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id })
      .populate('registrations.attendee', 'name email')
    if (!event) return res.status(404).json({ message: 'We couldn’t find that event.' })
    const attendees = event.registrations.map(({ attendee, registeredAt }) => ({
      _id: attendee._id,
      name: attendee.name,
      email: attendee.email,
      registeredAt,
    }))
    return res.json({ attendees })
  } catch (error) {
    return next(error)
  }
}

async function registerForEvent(req, res, next) {
  if (!validId(req.params.id)) return res.status(404).json({ message: 'We couldn’t find that event.' })
  try {
    const event = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        status: 'active',
        date: { $gt: new Date() },
        'registrations.attendee': { $ne: req.user._id },
        $expr: { $lt: [{ $size: { $ifNull: ['$registrations', []] } }, '$seatLimit'] },
      },
      { $push: { registrations: { attendee: req.user._id, registeredAt: new Date() } } },
      { new: true },
    ).populate('organizer', 'name')
    if (event) return res.status(201).json({ event: serializeEvent(event, req.user) })

    const current = await Event.findById(req.params.id).select('status date seatLimit registrations')
    if (!current) return res.status(404).json({ message: 'We couldn’t find that event.' })
    if (current.status !== 'active') return res.status(409).json({ message: 'This event has been cancelled, so registration isn’t available.' })
    if (current.date <= new Date()) return res.status(409).json({ message: 'This event has already taken place.' })
    if (current.registrations.some(({ attendee }) => attendee.toString() === req.user._id.toString())) {
      return res.status(409).json({ message: 'You already have a seat for this event.' })
    }
    return res.status(409).json({ message: 'Sorry, this event is full. Keep an eye out for another gathering.' })
  } catch (error) {
    return next(error)
  }
}

async function cancelEvent(req, res, next) {
  if (!validId(req.params.id)) return res.status(404).json({ message: 'We couldn’t find that event.' })
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user._id, status: 'active' },
      { $set: { status: 'cancelled' } },
      { new: true },
    )
    if (!event) return res.status(404).json({ message: 'We couldn’t find an active event you own.' })
    return res.json({ event: serializeEvent(event, req.user) })
  } catch (error) {
    return next(error)
  }
}

async function updateEvent(req, res, next) {
  if (!validId(req.params.id)) return res.status(404).json({ message: 'We couldn’t find that event.' })
  try {
    const validationError = validateEventInput(req.body, true)
    if (validationError) return res.status(400).json({ message: validationError })
    const updates = {}
    for (const key of ['title', 'description', 'venue']) {
      if (req.body[key] !== undefined) updates[key] = req.body[key].trim()
    }
    if (req.body.date !== undefined) updates.date = new Date(req.body.date)
    if (req.body.seatLimit !== undefined) updates.seatLimit = Number(req.body.seatLimit)

    const filter = { _id: req.params.id, organizer: req.user._id, status: 'active' }
    if (updates.seatLimit !== undefined) {
      filter.$expr = { $lte: [{ $size: { $ifNull: ['$registrations', []] } }, updates.seatLimit] }
    }
    const event = await Event.findOneAndUpdate(filter, { $set: updates }, { new: true, runValidators: true })
      .populate('organizer', 'name')
    if (event) return res.json({ event: serializeEvent(event, req.user) })

    const current = await Event.findOne({ _id: req.params.id, organizer: req.user._id }).select('status registrations')
    if (!current) return res.status(404).json({ message: 'We couldn’t find an event you own.' })
    if (current.status !== 'active') return res.status(409).json({ message: 'Cancelled events can’t be edited.' })
    if (updates.seatLimit !== undefined && updates.seatLimit < current.registrations.length) {
      return res.status(400).json({ message: `Seat limit can’t be lower than the ${current.registrations.length} people already registered.` })
    }
    return res.status(409).json({ message: 'This event changed while you were editing. Please refresh and try again.' })
  } catch (error) {
    return next(error)
  }
}

async function getEvent(req, res, next) {
  if (!validId(req.params.id)) return res.status(404).json({ message: 'We couldn’t find that event.' })
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name')
    if (!event) return res.status(404).json({ message: 'We couldn’t find that event.' })
    return res.json({ event: serializeEvent(event, req.user) })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  cancelEvent,
  createEvent,
  getAttendees,
  getEvent,
  listMine,
  listRegistrations,
  listUpcoming,
  registerForEvent,
  updateEvent,
}
