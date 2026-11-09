import Icon from './Icon'

export default function EmptyState({ title, description, action }) {
  return (
    <div className="col-span-full flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white/70 px-5 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-lime-100 text-lime-800"><Icon name="ticket" size={22} /></span>
      <h2 className="mt-4 text-xl font-semibold text-stone-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
