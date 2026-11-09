import { useEffect, useRef } from 'react'
import Icon from './Icon'

export default function LogoutConfirmModal({ onClose, onConfirm }) {
  const dialogRef = useRef(null)
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    cancelButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusableElements = dialogRef.current?.querySelectorAll('button')
      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-stone-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-describedby="logout-description"
        aria-labelledby="logout-title"
        aria-modal="true"
        className="relative w-full max-w-md rounded-3xl border border-stone-200 bg-[#fafaf7] p-6 shadow-2xl sm:p-8"
        ref={dialogRef}
        role="alertdialog"
      >
        <button
          aria-label="Close dialog"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-stone-500 transition hover:bg-stone-200 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
          data-dialog-focusable
          onClick={onClose}
          type="button"
        >
          <Icon name="close" />
        </button>
        <span className="grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-800">
          <Icon name="logout" size={21} />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-lime-800">Before you go</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900" id="logout-title">
          Log out of Gatherly?
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600" id="logout-description">
          You’ll need to log in again to manage your events and registrations.
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 bg-white px-5 text-sm font-bold text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            onClick={onClose}
            ref={cancelButtonRef}
            type="button"
          >
            Stay logged in
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-rose-700 px-5 text-sm font-bold text-white transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
            onClick={onConfirm}
            type="button"
          >
            <Icon name="logout" size={16} />
            Log out
          </button>
        </div>
      </section>
    </div>
  )
}
