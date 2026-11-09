import { useEffect } from 'react'
import Icon from './Icon'

export default function Alert({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined
    const timeoutId = window.setTimeout(onDismiss, 4000)
    return () => window.clearTimeout(timeoutId)
  }, [message, onDismiss])

  if (!message) return null
  return (
    <div className="fixed left-1/2 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-lg" role="status">
      <Icon className="mt-0.5 shrink-0 text-amber-700" name="check" size={17} />
      <p className="flex-1">{message}</p>
      <button aria-label="Dismiss message" className="rounded p-1 text-amber-800 hover:bg-amber-100" onClick={onDismiss} type="button"><Icon name="close" size={16} /></button>
    </div>
  )
}
