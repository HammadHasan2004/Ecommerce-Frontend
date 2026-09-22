import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, Package, ChevronLeft } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Stars from '../../components/ui/Stars'
import Badge from '../../components/ui/Badge'
import ProductImage from '../../components/ui/ProductImage'
import { SUPPLIERS, PRODUCTS, REVIEWS } from '../../data/dummy'

export default function SupplierProfilePage() {
  const { id } = useParams()
  const supplier = SUPPLIERS.find(s => s._id === id) || SUPPLIERS[0]
  const products = PRODUCTS.filter(p => p.supplier._id === supplier._id)
  const reviews = REVIEWS.filter(r => r.supplierId === supplier._id)

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/marketplace" className="flex items-center gap-1.5 text-sm text-earth-500 hover:text-saffron-600 transition-colors mb-6">
          <ChevronLeft size={14} /> Back to marketplace
        </Link>

        {/* Profile header */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-16 h-16 rounded-2xl bg-saffron-100 border border-saffron-200 flex items-center justify-center text-saffron-600 font-display font-bold text-3xl shrink-0">
              {supplier.businessName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-earth-900">{supplier.businessName}</h1>
                  <div className="flex items-center gap-1 text-sm text-earth-500 mt-0.5">
                    <MapPin size={13} /> {supplier.address}
                  </div>
                </div>
                <Badge variant="saffron" className="text-xs">{supplier.market}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <Stars rating={supplier.averageRating} size={14} />
                <span className="font-display font-bold text-earth-900">{supplier.averageRating}</span>
                <span className="text-earth-500 text-sm">({supplier.totalReviews} reviews)</span>
                <span className="text-earth-400 text-xs">·</span>
                <span className="text-earth-500 text-sm">{products.length} products</span>
              </div>
              {supplier.bio && (
                <p className="text-sm text-earth-600 mt-3 leading-relaxed max-w-2xl">{supplier.bio}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <h2 className="font-display font-semibold text-earth-800 text-lg mb-4">
              Products <span className="text-earth-400 font-normal text-base">({products.length})</span>
            </h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                  <Link key={p._id} to={`/products/${p._id}`} className="group">
                    <Card hover padding={false} className="overflow-hidden">
                      <div className="aspect-[4/3] overflow-hidden">
                        <ProductImage imageUrl={p.imageUrl} category={p.category} className="group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-earth-800 line-clamp-2 group-hover:text-saffron-600 mb-1">{p.name}</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display font-bold text-sm text-earth-900">Rs {p.price.toLocaleString()}</span>
                          <span className="text-xs text-earth-400">/{p.unit}</span>
                        </div>
                        <div className="text-xs text-earth-400 mt-0.5">Min {p.minOrder} {p.unit}</div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="text-center py-10 text-earth-400 text-sm">No products listed yet.</Card>
            )}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="font-display font-semibold text-earth-800 text-lg mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map(r => (
                <Card key={r._id} className="!p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="font-semibold text-earth-800 text-sm">{r.buyer.fullname}</div>
                    <Stars rating={r.rating} size={11} />
                  </div>
                  <div className="text-xs text-earth-400 mb-2">
                    {new Date(r.createdAt).toLocaleDateString('en-PK', { month: 'short', year: 'numeric', day: 'numeric' })}
                  </div>
                  <p className="text-sm text-earth-700 leading-relaxed">{r.comment}</p>
                </Card>
              )) : (
                <Card className="text-center py-8 text-earth-400 text-sm">No reviews yet.</Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
