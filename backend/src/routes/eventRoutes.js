const express = require('express')
const {
  cancelEvent,
  createEvent,
  getAttendees,
  getEvent,
  listMine,
  listRegistrations,
  listUpcoming,
  registerForEvent,
  updateEvent,
} = require('../controllers/eventController')
const { authenticate, allowRoles } = require('../middleware/auth')
const optionalAuth = require('../middleware/optionalAuth')

const router = express.Router()

router.get('/', optionalAuth, listUpcoming)
router.get('/mine', authenticate, allowRoles('organizer'), listMine)
router.get('/registrations/mine', authenticate, allowRoles('attendee'), listRegistrations)
router.post('/', authenticate, allowRoles('organizer'), createEvent)
router.get('/:id/attendees', authenticate, allowRoles('organizer'), getAttendees)
router.post('/:id/register', authenticate, allowRoles('attendee'), registerForEvent)
router.post('/:id/cancel', authenticate, allowRoles('organizer'), cancelEvent)
router.patch('/:id', authenticate, allowRoles('organizer'), updateEvent)
router.get('/:id', optionalAuth, getEvent)

module.exports = router
