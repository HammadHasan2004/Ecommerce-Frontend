import { clsx } from 'clsx'

const variants = {
  default:   'bg-parch-200 text-ink-700 border border-parch-400',
  forest:    'bg-forest-100 text-forest-800 border border-forest-200',
  amber:     'bg-amber-100 text-amber-700 border border-amber-200',
  rust:      'bg-rust-100 text-rust-700 border border-rust-200',
  pending:   'bg-[#FFF7E6] text-[#8F5E1A] border border-[#F5D68A]',
  confirmed: 'bg-amber-100 text-amber-700 border border-amber-200',
  shipped:   'bg-sky-100 text-sky-700 border border-sky-200',
  delivered: 'bg-forest-100 text-forest-800 border border-forest-200',
  cancelled: 'bg-rust-100 text-rust-700 border border-rust-200',
  /* legacy aliases */
  saffron:   'bg-amber-100 text-amber-700 border border-amber-200',
  green:     'bg-forest-100 text-forest-800 border border-forest-200',
  burgundy:  'bg-rust-100 text-rust-700 border border-rust-200',
  yellow:    'bg-[#FFF7E6] text-[#8F5E1A] border border-[#F5D68A]',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded font-body tracking-wide',
      variants[variant] || variants.default,
      className,
    )}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const dot = {
    pending:   'bg-[#D4893A]',
    confirmed: 'bg-amber-500',
    shipped:   'bg-sky-500',
    delivered: 'bg-forest-600',
    cancelled: 'bg-rust-500',
  }
  return (
    <Badge variant={status}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', dot[status] || 'bg-ink-400')} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
