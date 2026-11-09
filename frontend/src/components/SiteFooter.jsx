export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-stone-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10">
        <span className="flex items-center gap-2 font-bold text-stone-800"><span className="grid size-6 place-items-center rounded-full bg-lime-300 font-serif text-base">g.</span>gatherly</span>
        <span>Good things happen together.</span>
        <span>Made for the moments that matter <b className="text-lime-700">✳</b></span>
      </div>
    </footer>
  )
}
