import { useCallback, useEffect, useState } from 'react'
import Alert from './components/Alert'
import AuthModal from './components/AuthModal'
import LogoutConfirmModal from './components/LogoutConfirmModal'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import { api, apiRoutes, setAuthToken } from './api'
import AttendeesPage from './pages/AttendeesPage'
import DiscoverPage from './pages/DiscoverPage'
import EventDetailPage from './pages/EventDetailPage'
import EventFormPage from './pages/EventFormPage'
import OrganizerDashboardPage from './pages/OrganizerDashboardPage'
import RegistrationsPage from './pages/RegistrationsPage'
import { toLocalDateTimeInput } from './utils/format'

const blankEvent = { title: '', description: '', date: '', venue: '', seatLimit: '50' }

function storedUser() {
  try {
    return JSON.parse(sessionStorage.getItem('event-user') || 'null')
  } catch {
    return null
  }
}

export default function App() {
  const [user, setUser] = useState(storedUser)
  const [page, setPage] = useState(() => storedUser()?.role === 'organizer' ? 'dashboard' : 'discover')
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [notice, setNotice] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [eventLoading, setEventLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [savingEvent, setSavingEvent] = useState(false)
  const [formError, setFormError] = useState('')
  const [editingEvent, setEditingEvent] = useState(null)

  const dismissNotice = useCallback(() => setNotice(''), [])

  const refreshEvents = useCallback(async () => {
    const result = await api(apiRoutes.events.list)
    setEvents(result.events)
  }, [])

  const refreshPersonalEvents = useCallback(async (currentUser = user) => {
    if (!currentUser) return
    const path = currentUser.role === 'organizer' ? apiRoutes.events.mine : apiRoutes.events.registrations
    const result = await api(path)
    if (currentUser.role === 'organizer') setEvents(result.events)
    else setRegistrations(result.events)
  }, [user])

  useEffect(() => {
    let active = true
    api(apiRoutes.events.list)
      .then((result) => { if (active) setEvents(result.events) })
      .catch((error) => { if (active) setNotice(error.message) })
      .finally(() => { if (active) setEventLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!user) return undefined
    let active = true
    const path = user.role === 'organizer' ? apiRoutes.events.mine : apiRoutes.events.registrations
    api(path)
      .then((result) => {
        if (!active) return
        if (user.role === 'organizer') setEvents(result.events)
        else setRegistrations(result.events)
      })
      .catch((error) => {
        if (active) {
          setNotice(error.message)
          if (error.status === 401) signOut(false)
        }
      })
    return () => { active = false }
  }, [user])

  const navigate = (nextPage) => {
    setNotice('')
    setPage(nextPage)
    if (nextPage === 'discover') {
      refreshEvents().catch((error) => setNotice(error.message))
    } else if (nextPage === 'dashboard' || nextPage === 'registrations') {
      refreshPersonalEvents().catch((error) => setNotice(error.message))
    }
  }

  const openEvent = async (id) => {
    setNotice('')
    try {
      const result = await api(apiRoutes.events.byId(id))
      setSelectedEvent(result.event)
      setPage('event')
    } catch (error) {
      setNotice(error.message)
    }
  }

  const openAttendees = async (event) => {
    try {
      const result = await api(apiRoutes.events.attendees(event._id))
      setSelectedEvent(event)
      setAttendees(result.attendees)
      setPage('attendees')
    } catch (error) {
      setNotice(error.message)
    }
  }

  const openAuth = (mode = 'login') => {
    setAuthMode(mode)
    setAuthError('')
    setAuthOpen(true)
  }

  const handleAuth = async (event, role) => {
    event.preventDefault()
    setAuthError('')
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    if (authMode === 'signup') data.role = role
    setAuthLoading(true)
    try {
      const authRoute = authMode === 'signup' ? apiRoutes.auth.signup : apiRoutes.auth.login
      const result = await api(authRoute, { method: 'POST', body: data })
      setAuthToken(result.token)
      sessionStorage.setItem('event-user', JSON.stringify(result.user))
      setUser(result.user)
      setPage(selectedEvent && result.user.role === 'attendee' ? 'event' : result.user.role === 'organizer' ? 'dashboard' : 'discover')
      setAuthOpen(false)
      event.currentTarget.reset()
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  function signOut(showMessage = true) {
    setAuthToken('')
    sessionStorage.removeItem('event-user')
    setUser(null)
    setSelectedEvent(null)
    setPage('discover')
    if (showMessage) setNotice('You have been signed out.')
  }

  const register = async () => {
    if (!user) {
      openAuth('signup')
      return
    }
    if (!selectedEvent) return
    setRegistering(true)
    try {
      const result = await api(apiRoutes.events.register(selectedEvent._id), { method: 'POST' })
      setSelectedEvent(result.event)
      setNotice('You’re on the list! Your seat is confirmed.')
      await Promise.all([refreshPersonalEvents(user), refreshEvents()])
    } catch (error) {
      setNotice(error.message)
    } finally {
      setRegistering(false)
    }
  }

  const startCreate = () => {
    if (user?.role !== 'organizer') {
      if (user) setNotice('An organizer account is needed to host an event.')
      else openAuth('signup')
      return
    }
    setEditingEvent(null)
    setFormError('')
    setPage('event-form')
  }

  const startEdit = (event) => {
    setEditingEvent({
      ...event,
      date: toLocalDateTimeInput(event.date),
      seatLimit: String(event.seatLimit),
    })
    setFormError('')
    setPage('event-form')
  }

  const saveEvent = async (event, eventId) => {
    event.preventDefault()
    setSavingEvent(true)
    setFormError('')
    const formData = new FormData(event.currentTarget)
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      date: formData.get('date'),
      venue: formData.get('venue'),
      seatLimit: Number(formData.get('seatLimit')),
    }
    try {
      await api(eventId ? apiRoutes.events.byId(eventId) : apiRoutes.events.create, {
        method: eventId ? 'PATCH' : 'POST',
        body: payload,
      })
      setPage('dashboard')
      setNotice(eventId ? 'Your event has been updated.' : 'Your event is live!')
      await refreshPersonalEvents(user)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSavingEvent(false)
    }
  }

  const cancelEvent = async (event) => {
    if (!window.confirm(`Cancel “${event.title}”? Attendees will no longer be able to register.`)) return
    try {
      await api(apiRoutes.events.cancel(event._id), { method: 'POST' })
      setNotice('Event cancelled.')
      await refreshPersonalEvents(user)
    } catch (error) {
      setNotice(error.message)
    }
  }

  const handleHostEvent = () => {
    if (user?.role === 'organizer') startCreate()
    else if (user) setNotice('An organizer account is needed to host an event.')
    else openAuth('signup')
  }

  return (
    <div className="min-h-screen min-w-[320px] bg-[#fafaf7] text-stone-900">
      <SiteHeader onLogin={() => openAuth('login')} onLogout={() => setLogoutConfirmOpen(true)} onNavigate={navigate} onSignup={() => openAuth('signup')} page={page} user={user} />
      <main className="mx-auto min-h-[calc(100vh-150px)] max-w-7xl px-4 sm:px-7 lg:px-10">
        <div className="pt-4">
          <Alert message={notice} onDismiss={dismissNotice} />
        </div>
        {page === 'discover' && <DiscoverPage events={events} loading={eventLoading} onHostEvent={handleHostEvent} onOpenEvent={openEvent} />}
        {page === 'event' && selectedEvent && <EventDetailPage event={selectedEvent} onBack={() => navigate(user?.role === 'organizer' ? 'dashboard' : 'discover')} onEdit={() => startEdit(selectedEvent)} onRegister={register} registering={registering} user={user} />}
        {page === 'dashboard' && user?.role === 'organizer' && <OrganizerDashboardPage events={events} onAttendees={openAttendees} onCancel={cancelEvent} onCreate={startCreate} onEdit={startEdit} />}
        {page === 'registrations' && user?.role === 'attendee' && <RegistrationsPage events={registrations} onDiscover={() => navigate('discover')} onOpenEvent={openEvent} />}
        {page === 'attendees' && user?.role === 'organizer' && selectedEvent && <AttendeesPage attendees={attendees} event={selectedEvent} onBack={() => navigate('dashboard')} />}
        {page === 'event-form' && user?.role === 'organizer' && <EventFormPage editing={Boolean(editingEvent)} error={formError} initialValues={editingEvent || blankEvent} onBack={() => navigate('dashboard')} onSubmit={saveEvent} registeredCount={editingEvent?.registrationsCount || 0} saving={savingEvent} />}
        {page !== 'discover' && page !== 'event' && page !== 'dashboard' && page !== 'registrations' && page !== 'attendees' && page !== 'event-form' && <DiscoverPage events={events} loading={eventLoading} onHostEvent={handleHostEvent} onOpenEvent={openEvent} />}
      </main>
      <SiteFooter />
      {authOpen && <AuthModal error={authError} loading={authLoading} mode={authMode} onClose={() => setAuthOpen(false)} onModeChange={(mode) => { setAuthMode(mode); setAuthError('') }} onSubmit={handleAuth} />}
      {logoutConfirmOpen && <LogoutConfirmModal onClose={() => setLogoutConfirmOpen(false)} onConfirm={() => { setLogoutConfirmOpen(false); signOut() }} />}
    </div>
  )
}
