export default function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-800">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">{title}<span className="text-lime-700">.</span></h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{description}</p>}
      </div>
      {action}
    </div>
  )
}
