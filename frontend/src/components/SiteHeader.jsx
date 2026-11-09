import Icon from './Icon'

const linkStyle = (active) => `whitespace-nowrap border-b-2 px-1 py-5 text-sm font-semibold transition-colors ${
  active ? 'border-lime-700 text-stone-950' : 'border-transparent text-stone-500 hover:text-stone-900'
}`

export default function SiteHeader({ user, page, onNavigate, onLogin, onSignup, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#fafaf7]/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-6 px-4 sm:px-7 lg:px-10">
        <button aria-label="Gatherly home" className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight text-stone-900" onClick={() => onNavigate(user?.role === 'organizer' ? 'dashboard' : 'discover')} type="button">
          <span className="grid size-8 place-items-center rounded-full bg-lime-300 font-serif text-xl font-bold">g.</span>gatherly
        </button>
        <nav aria-label="Main navigation" className="flex h-full flex-1 items-center gap-4 overflow-x-auto sm:gap-7">
          {(!user || user.role === 'attendee') && <button className={linkStyle(page === 'discover')} onClick={() => onNavigate('discover')} type="button">Discover</button>}
          {user?.role === 'attendee' && <button className={linkStyle(page === 'registrations')} onClick={() => onNavigate('registrations')} type="button">My registrations</button>}
          {user?.role === 'organizer' && <button className={linkStyle(['dashboard', 'event-form', 'attendees'].includes(page))} onClick={() => onNavigate('dashboard')} type="button">My events</button>}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <span className="hidden items-center gap-2 text-sm font-medium text-stone-700 sm:flex"><span className="grid size-8 place-items-center rounded-full bg-lime-100 font-bold text-lime-950">{user.name?.[0]?.toUpperCase()}</span>{user.name}</span>
              <button aria-label="Sign out" className="grid size-9 place-items-center rounded-full border border-stone-300 text-stone-600 transition hover:border-stone-800 hover:text-stone-950" onClick={onLogout} title="Sign out" type="button"><Icon name="logout" size={17} /></button>
            </>
          ) : (
            <>
              <button className="inline-flex min-h-10 items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-500 hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 sm:px-4" onClick={onLogin} type="button">Log in</button>
              <button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-stone-900 px-3 text-sm font-semibold text-white transition hover:bg-stone-700 sm:px-4" onClick={onSignup} type="button">Join now <Icon name="arrow" size={16} /></button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
