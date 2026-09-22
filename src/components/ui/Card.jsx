import { clsx } from 'clsx'

export default function Card({ children, className = '', hover = false, padding = true, accent, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        'bg-[#FEFCF8] rounded-xl border border-[#E8E0D2]',
        'shadow-[0_1px_4px_rgba(15,11,7,0.05),0_4px_16px_rgba(15,11,7,0.04)]',
        padding && 'p-5',
        hover && [
          'transition-all duration-200 cursor-pointer',
          'hover:shadow-[0_4px_24px_rgba(15,11,7,0.10),0_1px_4px_rgba(15,11,7,0.06)]',
          'hover:-translate-y-[2px]',
        ],
        accent && 'border-t-2 border-t-forest-600',
        className,
      )}
    >
      {children}
    </div>
  )
}
