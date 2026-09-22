import { Star } from 'lucide-react'
import { clsx } from 'clsx'

export default function Stars({ rating, max = 5, size = 14, className = '' }) {
  return (
    <span className={clsx('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating)
            ? 'text-amber-500 fill-amber-500'
            : 'text-[#DDD5C4] fill-[#DDD5C4]'}
        />
      ))}
    </span>
  )
}
