import Icon from '../components/Icon'
import { formatDate, getEventImage } from '../utils/format'

export default function EventDetailPage({ event, user, onBack, onRegister, onEdit, registering }) {
  const full = event.registrationsCount >= event.seatLimit
  const unavailable = event.status === 'cancelled' || new Date(event.date) <= new Date() || full

  return (
    <section className="py-8 sm:py-12">
      <button className="mb-6 text-sm font-semibold text-stone-600 transition hover:text-stone-950" onClick={onBack} type="button">← Back to events</button>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <div>
          <div className="relative h-64 overflow-hidden rounded-2xl bg-stone-200 sm:h-[390px]">
            <img alt="" className="size-full object-cover" src={getEventImage(event)} />
            <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${event.status === 'cancelled' ? 'bg-rose-100 text-rose-900' : 'bg-lime-200 text-lime-950'}`}>{event.status === 'cancelled' ? 'Cancelled' : event.category || 'Gathering'}</span>
          </div>
          <div className="py-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime-900">A reason to get together</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">{event.title}<span className="text-lime-700">.</span></h1>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-stone-600">{event.description}</p>
            <div className="mt-6 flex items-center gap-3 text-xs text-stone-600"><span className="grid size-9 place-items-center rounded-full bg-lime-100 font-bold text-lime-950">{event.organizer?.name?.[0]?.toUpperCase() || 'G'}</span><span>Put together by <b className="text-stone-900">{event.organizer?.name || 'a local organizer'}</b></span></div>
          </div>
        </div>
        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <InfoRow icon="calendar" title={formatDate(event.date, { weekday: 'long', year: true })} detail={formatDate(event.date, { time: true })} />
          <InfoRow icon="pin" title={event.venue} detail="Come as you are" />
          <InfoRow icon="users" title={`${event.registrationsCount} of ${event.seatLimit} people`} detail={full ? 'This gathering is full' : `${event.seatLimit - event.registrationsCount} seats still open`} />
          {user?.role === 'organizer' && event.isOwner
            ? <button className="mt-2 min-h-12 w-full rounded-lg bg-stone-900 px-4 text-sm font-bold text-white transition hover:bg-stone-700" onClick={onEdit} type="button">Edit your event <Icon className="ml-2 inline" name="arrow" size={16} /></button>
            : user?.role === 'attendee'
              ? <button className={`mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition ${event.isRegistered ? 'bg-lime-100 text-lime-950' : 'bg-stone-900 text-white hover:bg-stone-700 disabled:bg-stone-300'}`} disabled={event.isRegistered || unavailable || registering} onClick={onRegister} type="button">
                {event.isRegistered ? <><Icon name="check" /> You’re on the list</> : unavailable ? 'Registration unavailable' : registering ? 'Saving your seat…' : <>Save me a seat <Icon name="arrow" size={16} /></>}
              </button>
              : user ? <p className="rounded-lg bg-stone-100 px-3 py-3 text-center text-xs text-stone-600">Only attendees can register for events.</p>
                : <button className="mt-2 min-h-12 w-full rounded-lg bg-stone-900 px-4 text-sm font-bold text-white transition hover:bg-stone-700" onClick={onRegister} type="button">Join now <Icon className="ml-2 inline" name="arrow" size={16} /></button>}
          <p className="mt-3 text-center text-[10px] text-stone-500">Free to join · Good company guaranteed</p>
        </aside>
      </div>
    </section>
  )
}

function InfoRow({ icon, title, detail }) {
  return (
    <div className="mb-5 flex gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lime-100 text-lime-900"><Icon name={icon} /></span>
      <div className="min-w-0 pt-0.5"><b className="block text-xs text-stone-900">{title}</b><span className="mt-1 block text-xs text-stone-500">{detail}</span></div>
    </div>
  )
}
