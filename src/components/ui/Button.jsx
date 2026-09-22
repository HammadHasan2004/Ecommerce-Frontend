import { clsx } from 'clsx'

const variants = {
  primary:   'bg-forest-700 hover:bg-forest-800 active:bg-forest-900 text-white',
  cta:       'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white',
  secondary: 'bg-parch-200 hover:bg-parch-300 text-ink-800 border border-parch-400',
  outline:   'bg-transparent border border-forest-700 text-forest-700 hover:bg-forest-50',
  ghost:     'bg-transparent hover:bg-parch-200 text-ink-700',
  danger:    'bg-rust-600 hover:bg-rust-700 text-white',
  success:   'bg-forest-600 hover:bg-forest-700 text-white',
  dark:      'bg-ink-950 hover:bg-ink-800 text-white',
  /* legacy aliases */
  saffron:   'bg-amber-500 hover:bg-amber-600 text-white',
}

const sizes = {
  xs: 'text-xs px-2.5 py-1 rounded gap-1',
  sm: 'text-sm px-3 py-1.5 rounded-md gap-1.5',
  md: 'text-sm px-4 py-2 rounded-lg gap-2',
  lg: 'text-[15px] px-6 py-2.5 rounded-lg gap-2',
  xl: 'text-base px-8 py-3 rounded-xl gap-2.5',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconRight,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-body font-medium transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant] || variants.primary,
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
}
