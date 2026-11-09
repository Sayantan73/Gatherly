import Icon from './Icon'

export default function StatCard({ label, value, icon }) {
  return (
    <div className="flex min-h-24 items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-lime-100 text-lime-900"><Icon name={icon} /></span>
      <div><p className="text-2xl font-bold tracking-tight text-stone-900">{value}</p><p className="mt-0.5 text-xs text-stone-500">{label}</p></div>
    </div>
  )
}
