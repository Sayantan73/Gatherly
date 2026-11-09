import { useState } from 'react'
import Icon from './Icon'

const fieldClass = 'mt-1.5 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-lime-700 focus:ring-2 focus:ring-lime-700/15'

export default function AuthModal({ mode, onClose, onModeChange, onSubmit, error, loading }) {
  const [role, setRole] = useState('attendee')
  const [showPassword, setShowPassword] = useState(false)
  const signingUp = mode === 'signup'
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-stone-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section aria-labelledby="auth-title" aria-modal="true" className="relative my-auto w-full max-w-md rounded-3xl bg-[#fafaf7] p-6 shadow-2xl sm:p-9" role="dialog">
        <button aria-label="Close dialog" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-stone-500 hover:bg-stone-200 hover:text-stone-900" onClick={onClose} type="button"><Icon name="close" /></button>
        <span className="grid size-10 place-items-center rounded-full bg-lime-300 font-serif text-2xl font-bold">g.</span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-lime-800">{signingUp ? 'Come on in' : 'Good to see you'}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900" id="auth-title">{signingUp ? 'Find your people.' : 'Welcome back.'}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">{signingUp ? 'Create an account to find or host your next gathering.' : 'Sign in to pick up where you left off.'}</p>
        <form className="mt-6 space-y-4" onSubmit={(event) => onSubmit(event, role)}>
          {signingUp && <>
            <label className="block text-xs font-bold text-stone-700">Your name<input autoComplete="name" className={fieldClass} maxLength="80" minLength="2" name="name" placeholder="How should we call you?" required /></label>
            <label className="block text-xs font-bold text-stone-700">I’m here to…<select className={fieldClass} onChange={(event) => setRole(event.target.value)} value={role}><option value="attendee">Find and join events</option><option value="organizer">Host events</option></select></label>
          </>}
          <label className="block text-xs font-bold text-stone-700">Email address<input autoComplete="email" className={fieldClass} maxLength="254" name="email" placeholder="you@example.com" required type="email" /></label>
          <label className="block text-xs font-bold text-stone-700">Password
            <span className="relative mt-1.5 block">
              <input autoComplete={signingUp ? 'new-password' : 'current-password'} className={`${fieldClass} mt-0 pr-12`} maxLength="128" minLength={signingUp ? 8 : undefined} name="password" placeholder={signingUp ? 'At least 8 characters' : 'Your password'} required type={showPassword ? 'text' : 'password'} />
              <button aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute inset-y-1 right-1 grid w-9 place-items-center rounded-md text-stone-500 transition-colors hover:bg-transparent hover:text-lime-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lime-700 active:text-lime-900" onClick={() => setShowPassword((visible) => !visible)} type="button"><Icon className="pointer-events-none" name={showPassword ? 'eyeOff' : 'eye'} size={18} /></button>
            </span>
          </label>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">{error}</p>}
          <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 text-sm font-bold text-white transition hover:bg-stone-700 disabled:cursor-wait disabled:opacity-60" disabled={loading} type="submit">{loading ? 'One moment…' : signingUp ? 'Create account' : 'Log in'} {!loading && <Icon name="arrow" size={16} />}</button>
        </form>
        <p className="mt-5 text-center text-xs text-stone-600">{signingUp ? 'Already part of the gathering?' : 'New around here?'}{' '}
          <button className="font-bold text-lime-900 underline decoration-lime-700 underline-offset-2" onClick={() => { setShowPassword(false); onModeChange(signingUp ? 'login' : 'signup') }} type="button">{signingUp ? 'Log in' : 'Create an account'}</button>
        </p>
      </section>
    </div>
  )
}
