import { clsx } from 'clsx'

const CATEGORY_CONFIGS = {
  'Fabric': {
    bg: '#F5EAD6',
    pattern: 'repeating-linear-gradient(45deg, rgba(160,100,40,0.07) 0px, rgba(160,100,40,0.07) 2px, transparent 2px, transparent 12px), repeating-linear-gradient(-45deg, rgba(160,100,40,0.05) 0px, rgba(160,100,40,0.05) 2px, transparent 2px, transparent 12px)',
    icon: '🧵',
  },
  'Leather': {
    bg: '#EDE3D6',
    pattern: 'repeating-linear-gradient(0deg, rgba(90,60,30,0.06) 0px, rgba(90,60,30,0.06) 1px, transparent 1px, transparent 14px), repeating-linear-gradient(90deg, rgba(90,60,30,0.04) 0px, rgba(90,60,30,0.04) 1px, transparent 1px, transparent 14px)',
    icon: '👜',
  },
  'Thread & Trims': {
    bg: '#F0E8E8',
    pattern: 'repeating-radial-gradient(circle at 50% 50%, rgba(160,60,60,0.06) 0, rgba(160,60,60,0.06) 3px, transparent 3px, transparent 14px)',
    icon: '🧶',
  },
  'Packaging': {
    bg: '#E4EDE6',
    pattern: 'repeating-linear-gradient(60deg, rgba(40,90,60,0.06) 0px, rgba(40,90,60,0.06) 2px, transparent 2px, transparent 14px)',
    icon: '📦',
  },
}

export default function ProductImage({ imageUrl, category, className = '', iconSize = 'text-4xl' }) {
  if (imageUrl) {
    return <img src={imageUrl} alt="" className={clsx('w-full h-full object-cover', className)} />
  }

  const name = typeof category === 'object' ? category?.name : category
  const lower = name?.toLowerCase() || ''
  const key = Object.keys(CATEGORY_CONFIGS).find(k => lower.startsWith(k.toLowerCase().split(' ')[0]))
  const cfg = CATEGORY_CONFIGS[key] || CATEGORY_CONFIGS['Fabric']

  return (
    <div
      className={clsx('w-full h-full flex items-center justify-center', className)}
      style={{ backgroundColor: cfg.bg, backgroundImage: cfg.pattern }}
    >
      <span className={clsx(iconSize, 'opacity-50 select-none')}>{cfg.icon}</span>
    </div>
  )
}
