import EmptyState from '../components/EmptyState'
import SectionHeading from '../components/SectionHeading'

const avatarColors = ['bg-lime-100 text-lime-950', 'bg-orange-100 text-orange-950', 'bg-fuchsia-100 text-fuchsia-950', 'bg-cyan-100 text-cyan-950', 'bg-amber-100 text-amber-950']

export default function AttendeesPage({ event, attendees, onBack }) {
  return (
    <section className="py-9 sm:py-14">
      <button className="mb-6 text-sm font-semibold text-stone-600 hover:text-stone-950" onClick={onBack} type="button">← Back to my events</button>
      <SectionHeading description={`${event?.title || 'Event'} · ${attendees.length} ${attendees.length === 1 ? 'guest' : 'guests'}`} eyebrow="The good company" title="Guest list" />
      <div className="max-w-3xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {attendees.map((attendee, index) => (
          <div className="flex min-h-[72px] items-center gap-3 border-b border-stone-100 px-4 last:border-0 sm:px-6" key={attendee._id}>
            <span className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${avatarColors[index % avatarColors.length]}`}>{attendee.name[0]?.toUpperCase()}</span>
            <div className="min-w-0 flex-1"><b className="block truncate text-sm text-stone-900">{attendee.name}</b><span className="mt-0.5 block truncate text-xs text-stone-500">{attendee.email}</span></div>
            <span className="hidden text-xs font-semibold text-lime-800 sm:block">✓ Confirmed</span>
          </div>
        ))}
        {!attendees.length && <EmptyState description="Your guest list will show up when people register." title="It’s a little quiet in here" />}
      </div>
    </section>
  )
}
