const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
  date: {
    type: Date,
    required: true,
    validate: { validator: (value) => value > new Date(), message: 'Event date must be in the future.' },
  },
  venue: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
  seatLimit: { type: Number, required: true, min: 1, max: 10000 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, default: 'A LITTLE SOMETHING', maxlength: 50 },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active', index: true },
  registrations: [{
    attendee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registeredAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true })

eventSchema.pre('validate', function validateRegistrationLimits() {
  if (this.registrations.length > this.seatLimit) {
    this.invalidate('seatLimit', 'Seat limit cannot be lower than the number of registered attendees.')
  }
  const attendeeIds = this.registrations.map(({ attendee }) => attendee?.toString()).filter(Boolean)
  if (new Set(attendeeIds).size !== attendeeIds.length) {
    this.invalidate('registrations', 'An attendee can only register for an event once.')
  }
})

eventSchema.index({ date: 1, status: 1 })
eventSchema.index({ 'registrations.attendee': 1 })

module.exports = mongoose.model('Event', eventSchema)
