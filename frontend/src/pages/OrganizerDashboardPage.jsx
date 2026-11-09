import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import StatCard from '../components/StatCard'

export default function OrganizerDashboardPage({ events, onCreate, onEdit, onAttendees, onCancel }) {
  const registrations = events.reduce((total, event) => total + event.registrationsCount, 0)
  const upcoming = events.filter((event) => event.status === 'active' && new Date(event.date) > new Date()).length

  return (
    <section className="py-9 sm:py-14">
      <SectionHeading action={<button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 text-sm font-bold text-white transition hover:bg-stone-700" onClick={onCreate} type="button"><Icon name="plus" size={17} /> Create an event</button>} description="Make something happen. Keep an eye on who’s coming." eyebrow="Your corner of the world" title="Your events" />
      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon="calendar" label="Events created" value={events.length} />
        <StatCard icon="users" label="People coming" value={registrations} />
        <StatCard icon="ticket" label="Upcoming events" value={upcoming} />
      </div>
      <div className="space-y-3">
        {events.map((event) => {
          const fill = Math.min(100, Math.round(event.registrationsCount / event.seatLimit * 100))
          return (
            <article className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5" key={event._id}>
              <div className="grid size-12 shrink-0 content-center rounded-xl bg-lime-100 text-center text-lime-950"><b className="text-lg leading-5">{new Date(event.date).toLocaleDateString('en', { day: '2-digit' })}</b><span className="text-[9px] font-bold uppercase">{new Date(event.date).toLocaleDateString('en', { month: 'short' })}</span></div>
              <div className="min-w-0 flex-1">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${event.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-lime-100 text-lime-900'}`}>{event.status}</span>
                <h2 className="mt-2 truncate font-semibold text-stone-900">{event.title}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500"><Icon name="pin" size={14} />{event.venue}<span className="text-stone-300">·</span><Icon name="users" size={14} />{event.registrationsCount} / {event.seatLimit} going</p>
                <div aria-label={`${fill}% of seats taken`} className="mt-3 h-1 max-w-xs overflow-hidden rounded-full bg-stone-100"><span className="block h-full rounded-full bg-lime-600" style={{ width: `${fill}%` }} /></div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <button className="min-h-9 rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 transition hover:border-stone-800 hover:text-stone-950" onClick={() => onAttendees(event)} type="button">Guest list</button>
                <button className="min-h-9 rounded-lg px-3 text-xs font-bold text-stone-600 transition hover:bg-stone-100 disabled:opacity-40" disabled={event.status === 'cancelled'} onClick={() => onEdit(event)} type="button">Edit</button>
                {event.status !== 'cancelled' && <button className="min-h-9 rounded-lg px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-50" onClick={() => onCancel(event)} type="button">Cancel</button>}
              </div>
            </article>
          )
        })}
        {!events.length && <EmptyState action={<button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-stone-900 px-4 text-sm font-bold text-white" onClick={onCreate} type="button"><Icon name="plus" size={16} /> Create an event</button>} description="Make your first event and invite people along." title="Your next thing starts here" />}
      </div>
    </section>
  )
}
