const assert = require('node:assert/strict')
const { test } = require('node:test')
const mongoose = require('mongoose')
const Event = require('../src/models/Event')
const { serializeEvent, validateEventInput } = require('../src/utils/events')

const future = new Date(Date.now() + 60_000).toISOString()
const validEvent = {
  title: 'Sunday pottery',
  description: 'A friendly morning making pottery together.',
  date: future,
  venue: 'Clay House Studio',
  seatLimit: 12,
}

test('accepts a complete valid future event', () => {
  assert.equal(validateEventInput(validEvent), null)
})

test('rejects missing required fields', () => {
  assert.match(validateEventInput({ title: validEvent.title }), /complete every event field/i)
})

test('rejects past or malformed event dates', () => {
  assert.match(validateEventInput({ date: 'not-a-date' }, true), /future/i)
  assert.match(validateEventInput({ date: new Date(Date.now() - 60_000).toISOString() }, true), /future/i)
})

test('rejects invalid seat limits', () => {
  for (const seatLimit of [0, -1, 1.5, 10001, 'not a number']) {
    assert.match(validateEventInput({ seatLimit }, true), /seat limit/i)
  }
})

test('rejects event fields beyond their documented lengths', () => {
  assert.match(validateEventInput({ title: 'x'.repeat(101) }, true), /event name/i)
  assert.match(validateEventInput({ venue: 'x'.repeat(201) }, true), /venue/i)
})

test('event model rejects capacity below registrations', async () => {
  const event = new Event({
    ...validEvent,
    date: new Date(future),
    organizer: new mongoose.Types.ObjectId(),
    seatLimit: 1,
    registrations: [
      { attendee: new mongoose.Types.ObjectId() },
      { attendee: new mongoose.Types.ObjectId() },
    ],
  })

  await assert.rejects(event.validate(), (error) => Boolean(error.errors.seatLimit))
})

test('event model rejects duplicate attendees', async () => {
  const attendee = new mongoose.Types.ObjectId()
  const event = new Event({
    ...validEvent,
    date: new Date(future),
    organizer: new mongoose.Types.ObjectId(),
    registrations: [{ attendee }, { attendee }],
  })

  await assert.rejects(event.validate(), (error) => Boolean(error.errors.registrations))
})

test('serializes counts and only exposes registration and ownership flags', () => {
  const organizerId = 'organizer-id'
  const attendeeId = 'attendee-id'
  const event = {
    _id: 'event-id',
    title: validEvent.title,
    description: validEvent.description,
    date: future,
    venue: validEvent.venue,
    seatLimit: 12,
    organizer: { _id: organizerId, name: 'Jamie Rivera', email: 'private@example.invalid' },
    registrations: [{ attendee: attendeeId, registeredAt: new Date() }],
    status: 'active',
  }

  const attendeeView = serializeEvent(event, { _id: attendeeId })
  assert.equal(attendeeView.registrationsCount, 1)
  assert.equal(attendeeView.isRegistered, true)
  assert.equal(attendeeView.isOwner, false)
  assert.equal('registrations' in attendeeView, false)
  assert.equal('email' in attendeeView.organizer, false)
  assert.equal(serializeEvent(event, { _id: organizerId }).isOwner, true)
})
