function validateEventInput(body, partial = false) {
  const required = ['title', 'description', 'date', 'venue', 'seatLimit']
  if (!partial && required.some((key) => body[key] === undefined)) {
    return 'Please complete every event field.'
  }
  if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length < 3 || body.title.trim().length > 100)) {
    return 'The event name must be between 3 and 100 characters.'
  }
  if (body.description !== undefined && (typeof body.description !== 'string' || body.description.trim().length < 10 || body.description.trim().length > 2000)) {
    return 'The description must be between 10 and 2,000 characters.'
  }
  if (body.venue !== undefined && (typeof body.venue !== 'string' || body.venue.trim().length < 3 || body.venue.trim().length > 200)) {
    return 'The venue must be between 3 and 200 characters.'
  }
  if (body.date !== undefined && (!Number.isFinite(Date.parse(body.date)) || Date.parse(body.date) <= Date.now())) {
    return 'Choose a date and time in the future.'
  }
  if (body.seatLimit !== undefined && (!Number.isInteger(Number(body.seatLimit)) || Number(body.seatLimit) < 1 || Number(body.seatLimit) > 10000)) {
    return 'Seat limit must be a whole number between 1 and 10,000.'
  }
  return null
}

function serializeEvent(event, user) {
  const item = typeof event.toObject === 'function' ? event.toObject() : event
  const registrations = item.registrations || []
  const organizerId = item.organizer?._id || item.organizer
  return {
    _id: item._id,
    title: item.title,
    description: item.description,
    date: item.date,
    venue: item.venue,
    seatLimit: item.seatLimit,
    registrationsCount: registrations.length,
    organizer: item.organizer && typeof item.organizer === 'object'
      ? { name: item.organizer.name }
      : item.organizer,
    category: item.category,
    imageUrl: item.imageUrl,
    status: item.status,
    isRegistered: Boolean(user && registrations.some((registration) => {
      const attendeeId = registration.attendee?._id || registration.attendee
      return attendeeId?.toString() === user._id.toString()
    })),
    isOwner: Boolean(user && organizerId && organizerId.toString() === user._id.toString()),
  }
}

module.exports = { serializeEvent, validateEventInput }
