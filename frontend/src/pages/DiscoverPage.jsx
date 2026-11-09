import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import EventCard from '../components/EventCard'
import Icon from '../components/Icon'

export default function DiscoverPage({ events, loading, onOpenEvent, onHostEvent }) {
  const [search, setSearch] = useState('')
  const visibleEvents = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return events
    return events.filter((event) => `${event.title} ${event.venue} ${event.description}`.toLowerCase().includes(query))
  }, [events, search])

  return (
    <>
      <section className="grid items-center gap-9 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-16">
        <div className="order-2 px-1 lg:order-1">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-lime-900"><span className="size-2 rounded-full bg-lime-600" /> Make room for something good</p>
          <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-stone-950 sm:text-6xl lg:text-7xl">Find your<br /><span className="font-serif font-medium italic text-lime-800">kind of people.</span></h1>
          <p className="mt-5 max-w-md text-base leading-7 text-stone-600">Little gatherings, big ideas, new friends. Find something happening near you.</p>
          <button className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-lg bg-lime-300 px-5 text-sm font-bold text-stone-900 transition hover:bg-lime-400" onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })} type="button">Explore events <Icon name="arrow" /></button>
          <div className="mt-8 flex items-center gap-3 text-xs text-stone-500"><span className="flex -space-x-2">{['J', 'A', 'M', '+'].map((letter, index) => <span className={`grid size-7 place-items-center rounded-full border-2 border-[#fafaf7] text-[10px] font-bold ${index === 3 ? 'bg-stone-900 text-white' : 'bg-[#e9edda] text-stone-800'}`} key={letter}>{letter}</span>)}</span> Good things happen together</div>
        </div>
        <div className="relative order-1 h-[280px] sm:h-[390px] lg:order-2 lg:h-[460px]">
          <img alt="Friends sharing a meal outdoors" className="size-full rounded-2xl object-cover shadow-xl" src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=85" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-stone-950/25 to-transparent" />
          <div className="absolute -right-2 -top-3 grid size-20 rotate-6 place-content-center rounded-full bg-lime-300 text-center text-[9px] font-extrabold leading-tight tracking-wider shadow-lg sm:-right-4 sm:-top-4 sm:size-24"><span className="mb-1 text-xl">✳</span>YOUR NEXT<br />GOOD STORY</div>
          <div className="absolute -bottom-4 left-3 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-xl sm:-left-5 sm:bottom-6">
            <span className="grid size-9 place-items-center rounded-full bg-lime-100 text-lime-900"><Icon name="calendar" /></span>
            <span><b className="block text-xs text-stone-900">Something’s on</b><small className="mt-0.5 block text-[10px] text-stone-500">There’s a seat for you</small></span>
            <span className="ml-3 size-2 rounded-full bg-lime-500" />
          </div>
        </div>
      </section>

      <section className="scroll-mt-24 py-10 sm:py-14" id="events">
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime-900">A good place to start</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Plans worth getting out for<span className="text-lime-700">.</span></h2></div>
          <label className="flex h-11 w-full items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-stone-500 focus-within:border-lime-700 sm:w-80"><Icon name="search" size={18} /><input aria-label="Search events or places" className="min-w-0 flex-1 border-0 bg-transparent text-xs text-stone-900 outline-none placeholder:text-stone-400" onChange={(event) => setSearch(event.target.value)} placeholder="Search events or places" value={search} /></label>
        </div>
        {loading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div aria-hidden="true" className="h-80 animate-pulse rounded-2xl bg-stone-200" key={item} />)}</div>
          : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{visibleEvents.map((event, index) => <EventCard event={event} index={index} key={event._id} onClick={() => onOpenEvent(event._id)} />)}
            {!visibleEvents.length && <EmptyState description={search ? 'Try another search or clear the search field.' : 'Check back soon for new events, or start a gathering of your own.'} title={search ? 'No matching events' : 'Nothing on the calendar just yet'} action={!search && <button className="text-sm font-bold text-lime-900 underline underline-offset-4" onClick={onHostEvent} type="button">Host the first event</button>} />}
          </div>}
      </section>

      <section className="mb-10 flex flex-col gap-5 rounded-2xl bg-lime-100 p-6 sm:flex-row sm:items-center sm:p-9">
        <span className="text-4xl text-lime-800">✳</span><div className="flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-900">Got a gathering in mind?</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">Bring your people together.</h2><p className="mt-1 text-sm text-stone-600">Create an event and save a seat for everyone.</p></div>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-stone-900 px-4 text-sm font-bold text-white transition hover:bg-stone-700 sm:self-auto" onClick={onHostEvent} type="button">Host an event <Icon name="arrow" size={16} /></button>
      </section>
    </>
  )
}
