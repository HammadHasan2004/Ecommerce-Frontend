import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, ArrowUpRight, X } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Badge from '../../components/ui/Badge'
import ProductImage from '../../components/ui/ProductImage'
import { PRODUCTS, CATEGORIES, SUPPLIERS } from '../../data/dummy'

const MARQUEE_ITEMS = [
  'فیبرک · Fabric', 'چمڑا · Leather', 'دھاگا و زیورات · Thread & Trims', 'پیکیجنگ · Packaging',
  'بولٹن مارکیٹ · Bolton Market', 'جوڈیا بازار · Jodia Bazar', 'لیا مارکیٹ · Lea Market', 'رسد · Rasad',
]

function ProductCard({ product, index }) {
  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="bg-[#FEFCF8] border border-[#E8E0D2] rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_4px_24px_rgba(15,11,7,0.10)] hover:-translate-y-[2px] h-full flex flex-col">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative">
          <ProductImage
            imageUrl={product.imageUrl}
            category={product.category}
            className="group-hover:scale-[1.03] transition-transform duration-500"
          />
          {/* Category chip */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="text-[11px] font-medium bg-white/90 backdrop-blur-sm text-ink-700 px-2 py-0.5 rounded border border-[#E0D8CC]">
              {product.category.icon} {product.category.name}
            </span>
          </div>
          {/* Arrow on hover */}
          <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-forest-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0">
            <ArrowUpRight size={13} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2.5 flex-1">
          <h3 className="font-display font-semibold text-ink-950 text-[15px] leading-snug line-clamp-2 group-hover:text-forest-800 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-xl text-ink-950 leading-none">
              Rs {product.price.toLocaleString()}
            </span>
            <span className="text-xs text-ink-400 font-body">/ {product.unit}</span>
          </div>

          <div className="mt-auto pt-2.5 border-t border-[#EDE5D8] flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-ink-500 min-w-0">
              <MapPin size={10} className="shrink-0 text-forest-500" />
              <span className="truncate">{product.supplier.market}</span>
            </div>
            <span className="text-[11px] text-ink-400 shrink-0 ml-2">
              Min <strong className="text-ink-700">{product.minOrder}</strong>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    const catOk = !activeCategory || p.category._id === activeCategory
    const searchOk = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.supplier.businessName.toLowerCase().includes(search.toLowerCase())
    return catOk && searchOk
  }), [search, activeCategory])

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="bg-forest-950 relative overflow-hidden">
        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(255,255,255,0.5) 28px, rgba(255,255,255,0.5) 29px)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
            <span className="font-urdu text-amber-400 text-sm" dir="rtl">رسد</span>
            <span className="w-px h-4 bg-white/20" />
            <span className="text-white/50 text-xs font-medium uppercase tracking-widest">B2B Raw Material Marketplace</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-white font-bold mb-3 leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', letterSpacing: '-0.02em' }}>
            Karachi's Wholesale<br />
            <em className="text-amber-400 not-italic">Raw Material</em> Exchange
          </h1>

          {/* Urdu subtitle */}
          <p className="font-urdu text-forest-300 text-base mb-8 block" dir="rtl">
            کراچی کے گھریلو کارخانہ داروں کے لیے خام مال کا سب سے بڑا آن لائن بازار
          </p>

          {/* Search */}
          <div className="max-w-2xl">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-4 text-ink-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search fabric, leather, thread & packaging..."
                className="w-full bg-white/95 text-ink-950 placeholder-ink-400 rounded-xl pl-11 pr-12 py-3.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400 border border-white/30"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 text-ink-400 hover:text-ink-700 transition-colors">
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Stat row */}
          <div className="flex items-center gap-6 mt-8 flex-wrap">
            {[
              { num: '1,800+', label: 'Products', urdu: 'مصنوعات' },
              { num: '200+', label: 'Suppliers', urdu: 'فراہم کنندگان' },
              { num: '4', label: 'Categories', urdu: 'اقسام' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                {i > 0 && <span className="w-px h-8 bg-white/15" />}
                <div>
                  <div className="font-display font-bold text-white text-2xl leading-none">{s.num}</div>
                  <div className="text-white/50 text-xs mt-0.5 font-body">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee strip */}
        <div className="border-t border-white/10 py-2.5 overflow-hidden bg-forest-900/50">
          <div className="marquee-track whitespace-nowrap inline-flex gap-10 text-[11px] text-forest-400 font-medium px-10">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="shrink-0">·&nbsp;&nbsp;{item}&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Categories ─────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-ink-950 text-2xl leading-tight">Categories</h2>
              <p className="font-urdu text-forest-700 text-xs mt-0.5" dir="rtl">اقسام</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, idx) => {
              const count = PRODUCTS.filter(p => p.category._id === cat._id).length
              const isActive = activeCategory === cat._id
              return (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategory(isActive ? null : cat._id)}
                  className={`group text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                    isActive
                      ? 'bg-forest-800 border-forest-800 text-white'
                      : 'bg-[#FEFCF8] border-[#E8E0D2] hover:border-forest-400 hover:bg-forest-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-forest-300' : 'text-ink-400'}`}>
                      0{idx + 1}
                    </span>
                  </div>
                  <div className={`font-display font-semibold text-base leading-tight ${isActive ? 'text-white' : 'text-ink-900'}`}>
                    {cat.name}
                  </div>
                  <div className={`font-urdu text-xs mt-0.5 ${isActive ? 'text-forest-300' : 'text-forest-700'}`} dir="rtl">
                    {['کپڑا', 'چمڑا', 'دھاگا و زیورات', 'پیکیجنگ'][idx]}
                  </div>
                  <div className={`text-xs mt-2 font-medium ${isActive ? 'text-forest-200' : 'text-ink-500'}`}>
                    {count} products
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Thin rule ──────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[#DDD5C4]" />
          <span className="text-xs font-medium text-ink-400 uppercase tracking-widest">
            {activeCategory ? CATEGORIES.find(c => c._id === activeCategory)?.name : 'All Products'}
            <span className="font-urdu mr-2 text-forest-600 not-italic" dir="rtl">
              {activeCategory ? ['کپڑا', 'چمڑا', 'دھاگا', 'پیکیجنگ'][CATEGORIES.findIndex(c => c._id === activeCategory)] : 'تمام مصنوعات'}
            </span>
          </span>
          <div className="flex-1 h-px bg-[#DDD5C4]" />
        </div>

        {/* Results meta */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-ink-500">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {search && <> matching "<em className="text-ink-700">{search}</em>"</>}
          </p>
          {(search || activeCategory) && (
            <button onClick={() => { setSearch(''); setActiveCategory(null) }}
              className="text-xs text-forest-700 font-medium hover:underline flex items-center gap-1">
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* ── Product grid ───────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-16">
            {filtered.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-20 border border-[#DDD5C4] border-dashed rounded-2xl bg-[#FEFCF8]">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-semibold text-ink-700 mb-2">No products found</h3>
            <p className="text-ink-500 text-sm">Try a different keyword or category</p>
          </div>
        )}

        {/* ── Supplier row ───────────────────────────────── */}
        <div className="pt-10 border-t border-[#DDD5C4]">
          <div className="flex items-end gap-4 mb-6">
            <div>
              <h2 className="font-display font-semibold text-ink-950 text-2xl">Top Suppliers</h2>
              <p className="font-urdu text-forest-700 text-xs mt-0.5" dir="rtl">معتمد فراہم کنندگان</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPLIERS.map(s => (
              <Link key={s._id} to={`/suppliers/${s._id}`} className="group">
                <div className="bg-[#FEFCF8] border border-[#E8E0D2] rounded-xl p-4 flex items-start gap-3 hover:border-forest-400 hover:bg-forest-50 transition-all duration-150">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-display font-bold text-lg shrink-0 group-hover:bg-forest-800 group-hover:text-white transition-all">
                    {s.businessName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-ink-900 text-sm group-hover:text-forest-800 transition-colors truncate">
                      {s.businessName}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ink-500 mt-0.5">
                      <MapPin size={10} className="shrink-0" />
                      {s.market}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="text-xs font-semibold text-ink-700">{s.averageRating}</span>
                      <span className="text-xs text-ink-400">({s.totalReviews})</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
