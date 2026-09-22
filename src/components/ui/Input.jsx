import { clsx } from 'clsx'

export default function Input({
  label,
  error,
  hint,
  icon,
  iconRight,
  className = '',
  containerClass = '',
  ...props
}) {
  return (
    <div className={clsx('flex flex-col gap-1', containerClass)}>
      {label && (
        <label className="text-[13px] font-semibold text-ink-700 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={clsx(
            'w-full bg-[#FEFCF8] border text-ink-950 placeholder-ink-400 rounded-lg',
            'px-3 py-2.5 text-sm font-body transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-forest-500',
            error ? 'border-rust-400 bg-rust-50' : 'border-[#DDD5C4] hover:border-ink-300',
            icon && 'pl-10',
            iconRight && 'pr-10',
            className,
          )}
        />
        {iconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-rust-600 mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-500 mt-0.5">{hint}</p>}
    </div>
  )
}

export function Select({ label, error, className = '', containerClass = '', children, ...props }) {
  return (
    <div className={clsx('flex flex-col gap-1', containerClass)}>
      {label && <label className="text-[13px] font-semibold text-ink-700 tracking-wide uppercase">{label}</label>}
      <select
        {...props}
        className={clsx(
          'w-full bg-[#FEFCF8] border text-ink-950 rounded-lg',
          'px-3 py-2.5 text-sm font-body transition-all duration-150 appearance-none cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-forest-500',
          error ? 'border-rust-400' : 'border-[#DDD5C4] hover:border-ink-300',
          className,
        )}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rust-600 mt-0.5">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className = '', containerClass = '', ...props }) {
  return (
    <div className={clsx('flex flex-col gap-1', containerClass)}>
      {label && <label className="text-[13px] font-semibold text-ink-700 tracking-wide uppercase">{label}</label>}
      <textarea
        {...props}
        className={clsx(
          'w-full bg-[#FEFCF8] border text-ink-950 placeholder-ink-400 rounded-lg',
          'px-3 py-2.5 text-sm font-body transition-all duration-150 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-forest-500',
          error ? 'border-rust-400 bg-rust-50' : 'border-[#DDD5C4] hover:border-ink-300',
          className,
        )}
      />
      {error && <p className="text-xs text-rust-600 mt-0.5">{error}</p>}
    </div>
  )
}
