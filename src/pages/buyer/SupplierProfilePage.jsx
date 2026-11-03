import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, ChevronLeft } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Stars from '../../components/ui/Stars'
import Badge from '../../components/ui/Badge'
import ProductImage from '../../components/ui/ProductImage'
import { PageLoader, PageError } from '../../components/ui/PageState'
import { suppliersApi } from '../../api/suppliers'
import { productsApi } from '../../api/products'
import { reviewsApi } from '../../api/reviews'

export default function SupplierProfilePage() {
  const { id } = useParams()
  const [supplier, setSupplier] = useState(null)
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      suppliersApi.getById(id),
      reviewsApi.list(id).catch(() => []),
    ]).then(async ([sup, revs]) => {
      if (cancelled) return
      setSupplier(sup)
      setReviews(Array.isArray(revs) ? revs : [])
      // Fetch products for this supplier
      const allProds = await productsApi.list().catch(() => [])
      if (!cancelled) {
        setProducts((Array.isArray(allProds) ? allProds : []).filter(p =>
          (p.supplier?._id || p.supplier) === id
        ))
      }
    }).catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <Layout><PageLoader label="Loading supplier…" /></Layout>
  if (error)   return <Layout><PageError message={error} /></Layout>
  if (!supplier) return null

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/marketplace" className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700 transition-colors mb-6">
          <ChevronLeft size={14} /> Back to marketplace
        </Link>

        {/* Profile header */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-16 h-16 rounded-2xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-display font-bold text-3xl shrink-0">
              {supplier.businessName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-ink-950">{supplier.businessName}</h1>
                  <div className="flex items-center gap-1 text-sm text-ink-500 mt-0.5">
                    <MapPin size={13} /> {supplier.address}
                  </div>
                </div>
                {supplier.market && <Badge variant="forest">{supplier.market}</Badge>}
              </div>
              {(supplier.averageRating > 0) && (
                <div className="flex items-center gap-3 mt-3">
                  <Stars rating={supplier.averageRating} size={14} />
                  <span className="font-display font-bold text-ink-900">{supplier.averageRating}</span>
                  <span className="text-ink-500 text-sm">({supplier.totalReviews} reviews)</span>
                  <span className="text-ink-400 text-xs">·</span>
                  <span className="text-ink-500 text-sm">{products.length} products</span>
                </div>
              )}
              {supplier.bio && (
                <p className="text-sm text-ink-600 mt-3 leading-relaxed max-w-2xl">{supplier.bio}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display font-semibold text-ink-800 text-lg">Products</h2>
              <span className="font-urdu text-forest-700 text-xs" dir="rtl">مصنوعات</span>
              <span className="text-ink-400 text-sm">({products.length})</span>
            </div>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                  <Link key={p._id} to={`/products/${p._id}`} className="group">
                    <div className="bg-[#FEFCF8] border border-[#E8E0D2] rounded-xl overflow-hidden hover:shadow-[0_4px_16px_rgba(15,11,7,0.08)] hover:-translate-y-[2px] transition-all">
                      <div className="aspect-[4/3] overflow-hidden">
                        <ProductImage imageUrl={p.imageUrl} category={p.category} className="group-hover:scale-[1.04] transition-transform duration-300" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-ink-800 line-clamp-2 group-hover:text-forest-700 mb-1">{p.name}</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display font-bold text-sm text-ink-950">Rs {Number(p.price).toLocaleString()}</span>
                          <span className="text-xs text-ink-400">/{p.unit}</span>
                        </div>
                        <div className="text-xs text-ink-400 mt-0.5">Min {p.minOrder} {p.unit}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="text-center py-10 text-ink-400 text-sm">No products listed yet.</Card>
            )}
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display font-semibold text-ink-800 text-lg">Reviews</h2>
              <span className="font-urdu text-forest-700 text-xs" dir="rtl">تبصرے</span>
            </div>
            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map(r => (
                <Card key={r._id} className="!p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="font-semibold text-ink-800 text-sm">{r.buyer?.fullname}</div>
                    <Stars rating={r.rating} size={11} />
                  </div>
                  <div className="text-xs text-ink-400 mb-2">
                    {new Date(r.createdAt).toLocaleDateString('en-PK', { month:'short', year:'numeric', day:'numeric' })}
                  </div>
                  <p className="text-sm text-ink-700 leading-relaxed">{r.comment}</p>
                </Card>
              )) : (
                <Card className="text-center py-8 text-ink-400 text-sm">No reviews yet.</Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
