import Icon from './Icon'
import { formatDate, getEventImage } from '../utils/format'

export default function EventCard({ event, index = 0, onClick, registered = false }) {
  const seatsLeft = Math.max(0, event.seatLimit - event.registrationsCount)
  return (
    <button
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
      onClick={onClick}
      type="button"
    >
      <div className="relative h-44 overflow-hidden bg-stone-200 sm:h-48">
        <img alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" src={getEventImage(event, index)} />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/25 to-transparent" />
        <div className="absolute left-3 top-3 grid size-12 content-center rounded-xl bg-white text-center shadow">
          <span className="text-lg font-bold leading-5 text-stone-900">{new Date(event.date).toLocaleDateString('en', { day: '2-digit' })}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">{new Date(event.date).toLocaleDateString('en', { month: 'short' })}</span>
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-lime-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-lime-950">{event.category || 'Gathering'}</span>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="truncate text-lg font-bold tracking-tight text-stone-900">{event.title}</h3>
        <p className="mt-3 flex items-center gap-2 text-xs text-stone-600"><Icon className="shrink-0 text-lime-800" name="calendar" size={15} />{formatDate(event.date, { time: true })}</p>
        <p className="mt-2 flex items-center gap-2 text-xs text-stone-600"><Icon className="shrink-0 text-lime-800" name="pin" size={15} /><span className="truncate">{event.venue}</span></p>
        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="flex items-center gap-1.5 text-xs text-stone-600"><Icon className="text-lime-800" name="users" size={15} />{seatsLeft ? `${seatsLeft} seats left` : 'All seats taken'}</span>
          {registered
            ? <span className="flex items-center gap-1 text-xs font-bold text-lime-800"><Icon name="check" size={14} /> You’re in</span>
            : <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-lime-100 text-lime-900 transition group-hover:bg-lime-300"><Icon name="arrow" size={16} /></span>}
        </div>
      </div>
    </button>
  )
}
