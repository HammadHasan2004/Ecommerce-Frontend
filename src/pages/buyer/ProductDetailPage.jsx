import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, MapPin, ChevronLeft, Minus, Plus, Package, Truck, ShieldCheck } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Stars from '../../components/ui/Stars'
import ProductImage from '../../components/ui/ProductImage'
import Card from '../../components/ui/Card'
import { PageLoader, PageError } from '../../components/ui/PageState'
import { productsApi } from '../../api/products'
import { reviewsApi } from '../../api/reviews'
import { useCart } from '../../context/CartContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addItem, items } = useCart()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError('')
    productsApi.get(id)
      .then(async p => {
        if (cancelled) return
        setProduct(p)
        setQty(p.minOrder || 1)
        // Fetch reviews and related in parallel
        const [revs, all] = await Promise.all([
          reviewsApi.list(p.supplier?._id || p.supplier).catch(() => []),
          productsApi.list({ category: p.category?._id || p.category }).catch(() => []),
        ])
        if (!cancelled) {
          setReviews(Array.isArray(revs) ? revs : [])
          setRelated((Array.isArray(all) ? all : []).filter(r => r._id !== id).slice(0, 4))
        }
      })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <Layout><PageLoader label="Loading product…" /></Layout>
  if (error)   return <Layout><PageError message={error} /></Layout>
  if (!product) return null

  const inCart = items.find(i => i.product._id === product._id)
  const min = product.minOrder || 1
  const stock = product.stock || 0

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-ink-500 mb-6">
          <Link to="/marketplace" className="hover:text-forest-700 flex items-center gap-1 transition-colors">
            <ChevronLeft size={14} /> Marketplace
          </Link>
          <span>/</span>
          <span className="text-ink-400">{product.category?.name}</span>
          <span>/</span>
          <span className="text-ink-700 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <div className="aspect-square rounded-xl overflow-hidden border border-[#E8E0D2] shadow-[0_4px_24px_rgba(15,11,7,0.08)]">
            <ProductImage imageUrl={product.imageUrl} category={product.category} iconSize="text-8xl" />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Badge variant="default">{product.category?.name}</Badge>
                {stock > 0
                  ? <Badge variant="forest">In Stock ({stock.toLocaleString()} {product.unit})</Badge>
                  : <Badge variant="rust">Out of Stock</Badge>
                }
              </div>
              <h1 className="font-display text-3xl font-bold text-ink-950 leading-tight mb-3">{product.name}</h1>

              <Link to={`/suppliers/${product.supplier?._id || product.supplier}`}
                className="flex items-center gap-2.5 mt-3 group w-fit">
                <div className="w-9 h-9 rounded-xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-display font-bold text-base">
                  {(product.supplier?.businessName || '?')[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-800 group-hover:text-forest-700 transition-colors">
                    {product.supplier?.businessName}
                  </div>
                  {product.supplier?.address && (
                    <div className="flex items-center gap-1 text-xs text-ink-500">
                      <MapPin size={10} /> {product.supplier.address}
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Price box */}
            <div className="bg-forest-50 border border-forest-200 rounded-xl p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-4xl text-ink-950">
                  Rs {Number(product.price).toLocaleString()}
                </span>
                <span className="text-ink-500">/ {product.unit}</span>
              </div>
              <p className="text-xs text-ink-500 mt-1.5">
                Min order:{' '}
                <strong className="text-forest-700">{min} {product.unit}</strong>
                {' '}· Total from{' '}
                <strong className="text-ink-800">Rs {(product.price * min).toLocaleString()}</strong>
              </p>
            </div>

            {/* Qty selector */}
            <div>
              <label className="text-[13px] font-semibold text-ink-700 uppercase tracking-wide block mb-2">
                Quantity ({product.unit})
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#DDD5C4] rounded-xl overflow-hidden bg-[#FEFCF8]">
                  <button onClick={() => setQty(q => Math.max(min, q - min))}
                    className="px-3 py-2.5 text-ink-600 hover:bg-[#F0E8DE] transition-colors disabled:opacity-30"
                    disabled={qty <= min}>
                    <Minus size={16} />
                  </button>
                  <div className="px-5 py-2.5 font-display font-semibold text-ink-950 text-lg border-x border-[#DDD5C4] min-w-[80px] text-center">
                    {qty}
                  </div>
                  <button onClick={() => setQty(q => stock ? Math.min(stock, q + min) : q + min)}
                    className="px-3 py-2.5 text-ink-600 hover:bg-[#F0E8DE] transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-sm text-ink-600">
                  = <strong className="text-ink-900">Rs {(product.price * qty).toLocaleString()}</strong>
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-1.5">In increments of {min} {product.unit}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" icon={<ShoppingCart size={17} />} onClick={handleAdd}
                disabled={stock === 0} className="flex-1">
                {added ? 'Added to cart!' : inCart ? 'Update Cart' : 'Add to Cart'}
              </Button>
              <Link to="/cart">
                <Button variant="outline" size="lg">View Cart</Button>
              </Link>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Package size={14} />, text: 'Bulk pricing' },
                { icon: <Truck size={14} />, text: 'Direct supplier' },
                { icon: <ShieldCheck size={14} />, text: 'Verified seller' },
              ].map(t => (
                <div key={t.text} className="flex flex-col items-center gap-1 text-center p-2.5 bg-forest-50 rounded-xl border border-forest-100">
                  <span className="text-forest-600">{t.icon}</span>
                  <span className="text-xs text-ink-600 leading-tight">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supplier card + Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <h3 className="font-display font-semibold text-ink-800 text-base mb-4">About Supplier</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-display font-bold text-xl">
                {(product.supplier?.businessName || '?')[0]}
              </div>
              <div>
                <div className="font-semibold text-ink-800">{product.supplier?.businessName}</div>
                {product.supplier?.market && (
                  <div className="flex items-center gap-1 text-xs text-ink-500">
                    <MapPin size={10} /> {product.supplier.market}
                  </div>
                )}
              </div>
            </div>
            {product.supplier?.averageRating > 0 && (
              <div className="flex items-center gap-2 text-sm mb-3">
                <Stars rating={product.supplier.averageRating} size={13} />
                <span className="font-semibold text-ink-800">{product.supplier.averageRating}</span>
                <span className="text-ink-500">({product.supplier.totalReviews})</span>
              </div>
            )}
            {product.supplier?.bio && (
              <p className="text-xs text-ink-600 leading-relaxed mb-4">{product.supplier.bio}</p>
            )}
            <Link to={`/suppliers/${product.supplier?._id || product.supplier}`}>
              <Button variant="outline" size="sm" fullWidth>View Profile</Button>
            </Link>
          </Card>

          <div className="lg:col-span-2">
            <h3 className="font-display font-semibold text-ink-800 text-base mb-4">Reviews ({reviews.length})</h3>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(r => (
                  <Card key={r._id} className="!p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-ink-800 text-sm">{r.buyer?.fullname}</div>
                        <div className="text-xs text-ink-400">@{r.buyer?.username}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stars rating={r.rating} size={12} />
                        <span className="text-xs text-ink-500">
                          {new Date(r.createdAt).toLocaleDateString('en-PK', { year:'numeric', month:'short', day:'numeric' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-ink-700 leading-relaxed">{r.comment}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-10 text-ink-400 text-sm">No reviews yet</Card>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#DDD5C4]">
            <h3 className="font-display font-semibold text-ink-900 text-lg mb-5">
              More from {product.category?.name}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p._id} to={`/products/${p._id}`} className="group">
                  <div className="bg-[#FEFCF8] border border-[#E8E0D2] rounded-xl overflow-hidden hover:shadow-[0_4px_16px_rgba(15,11,7,0.08)] hover:-translate-y-[2px] transition-all">
                    <div className="aspect-[4/3] overflow-hidden">
                      <ProductImage imageUrl={p.imageUrl} category={p.category} className="group-hover:scale-[1.04] transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-semibold text-ink-800 line-clamp-2 group-hover:text-forest-700 mb-1">{p.name}</h4>
                      <span className="font-display font-bold text-sm text-ink-950">
                        Rs {Number(p.price).toLocaleString()}
                        <span className="text-xs text-ink-400 font-normal">/{p.unit}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
