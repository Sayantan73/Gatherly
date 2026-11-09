import SectionHeading from '../components/SectionHeading'

const fieldClass = 'mt-1.5 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-lime-700 focus:ring-2 focus:ring-lime-700/15'
const labelClass = 'block text-xs font-bold text-stone-700'

export default function EventFormPage({ initialValues, editing, registeredCount = 0, onSubmit, onBack, error, saving }) {
  return (
    <section className="mx-auto max-w-3xl py-8 sm:py-12">
      <button className="mb-6 text-sm font-semibold text-stone-600 hover:text-stone-950" onClick={onBack} type="button">← Back to my events</button>
      <SectionHeading description="Every great story starts with an invitation." eyebrow={editing ? 'Make it just right' : 'Let’s make a plan'} title={editing ? 'Edit your event' : 'Start a gathering'} />
      <form className="space-y-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" onSubmit={(event) => onSubmit(event, initialValues._id)}>
        <label className={labelClass}>Event name<input className={fieldClass} defaultValue={initialValues.title} maxLength="100" minLength="3" name="title" placeholder="e.g. Sunday morning ceramics" required /></label>
        <label className={labelClass}>A little about it<textarea className={`${fieldClass} min-h-32 resize-y py-3`} defaultValue={initialValues.description} maxLength="2000" minLength="10" name="description" placeholder="What should people know before they come?" required /></label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>Date & time<input className={fieldClass} defaultValue={initialValues.date} name="date" required type="datetime-local" /></label>
          <label className={labelClass}>How many seats?<input className={fieldClass} defaultValue={initialValues.seatLimit || 50} max="10000" min={Math.max(1, registeredCount)} name="seatLimit" required type="number" /></label>
        </div>
        <label className={labelClass}>Where’s it happening?<input className={fieldClass} defaultValue={initialValues.venue} maxLength="200" minLength="3" name="venue" placeholder="Venue name and city" required /></label>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">{error}</p>}
        <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-between">
          <button className="min-h-11 rounded-lg border border-stone-300 px-4 text-sm font-bold text-stone-700 hover:border-stone-800" onClick={onBack} type="button">Keep it for later</button>
          <button className="min-h-11 rounded-lg bg-stone-900 px-5 text-sm font-bold text-white transition hover:bg-stone-700 disabled:opacity-60" disabled={saving} type="submit">{saving ? 'Saving…' : editing ? 'Save changes' : 'Publish event'} →</button>
        </div>
      </form>
    </section>
  )
}
