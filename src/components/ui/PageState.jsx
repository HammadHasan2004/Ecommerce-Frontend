export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 border-2 border-[#DDD5C4] border-t-forest-600 rounded-full animate-spin" />
      <span className="text-sm text-ink-400">{label}</span>
    </div>
  )
}

export function PageError({ message, onRetry }) {
  return (
    <div className="text-center py-20 px-4">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="font-display text-lg font-semibold text-ink-800 mb-1">Something went wrong</h3>
      <p className="text-sm text-ink-500 mb-5 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button onClick={onRetry}
          className="text-sm font-semibold text-forest-700 hover:text-forest-900 underline">
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ icon, title, urdu, sub, action }) {
  return (
    <div className="text-center py-20 border border-dashed border-[#DDD5C4] rounded-2xl bg-[#FEFCF8]">
      <div className="text-4xl mb-4">{icon || '📭'}</div>
      <h3 className="font-display text-xl font-semibold text-ink-700 mb-0.5">{title}</h3>
      {urdu && <p className="font-urdu text-forest-700 text-sm mb-2" dir="rtl">{urdu}</p>}
      {sub && <p className="text-ink-400 text-sm mb-5">{sub}</p>}
      {action}
    </div>
  )
}
