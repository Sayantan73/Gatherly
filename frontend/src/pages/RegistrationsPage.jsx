import EmptyState from '../components/EmptyState'
import EventCard from '../components/EventCard'
import SectionHeading from '../components/SectionHeading'

export default function RegistrationsPage({ events, onOpenEvent, onDiscover }) {
  return (
    <section className="py-9 sm:py-14">
      <SectionHeading action={<button className="min-h-11 rounded-lg border border-stone-300 px-4 text-sm font-bold text-stone-700 transition hover:border-stone-800 hover:text-stone-950" onClick={onDiscover} type="button">Find more events →</button>} description="Good plans, all in one place." eyebrow="You’re on the list" title="My registrations" />
      {events.length
        ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{events.map((event, index) => <EventCard event={event} index={index} key={event._id} onClick={() => onOpenEvent(event._id)} registered />)}</div>
        : <EmptyState action={<button className="min-h-10 rounded-lg bg-stone-900 px-4 text-sm font-bold text-white" onClick={onDiscover} type="button">Explore events</button>} description="Find an event that feels like you and save your seat." title="No plans on your calendar yet" />}
    </section>
  )
}
