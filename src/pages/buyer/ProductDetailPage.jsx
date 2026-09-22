import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, MapPin, Star, ChevronLeft, Minus, Plus, Package, Truck, ShieldCheck } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Stars from '../../components/ui/Stars'
import ProductImage from '../../components/ui/ProductImage'
import Card from '../../components/ui/Card'
import { PRODUCTS, REVIEWS } from '../../data/dummy'
import { useCart } from '../../context/CartContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addItem, items } = useCart()
  const product = PRODUCTS.find(p => p._id === id) || PRODUCTS[0]
  const [qty, setQty] = useState(product.minOrder)
  const [added, setAdded] = useState(false)

  const reviews = REVIEWS.filter(r => r.supplierId === product.supplier._id)
  const inCart = items.find(i => i.product._id === product._id)

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const relatedProducts = PRODUCTS.filter(p => p.category._id === product.category._id && p._id !== product._id).slice(0, 4)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-earth-500 mb-6">
          <Link to="/marketplace" className="hover:text-saffron-600 flex items-center gap-1 transition-colors">
            <ChevronLeft size={14} /> Marketplace
          </Link>
          <span>/</span>
          <span className="text-earth-400">{product.category.name}</span>
          <span>/</span>
          <span className="text-earth-700 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-linen-300 shadow-warm">
              <ProductImage imageUrl={product.imageUrl} category={product.category} iconSize="text-8xl" />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">{product.category.icon} {product.category.name}</Badge>
                {product.stock > 0
                  ? <Badge variant="green">In Stock ({product.stock.toLocaleString()} {product.unit})</Badge>
                  : <Badge variant="cancelled">Out of Stock</Badge>
                }
              </div>
              <h1 className="font-display text-3xl font-bold text-earth-900 leading-tight mb-1">{product.name}</h1>

              <Link to={`/suppliers/${product.supplier._id}`} className="flex items-center gap-2 mt-3 group">
                <div className="w-8 h-8 rounded-full bg-saffron-100 border border-saffron-200 flex items-center justify-center text-saffron-600 font-bold text-sm">
                  {product.supplier.businessName[0]}
                </div>
                <div>
                  <span className="text-sm font-semibold text-earth-800 group-hover:text-saffron-600 transition-colors">
                    {product.supplier.businessName}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-earth-500">
                    <MapPin size={10} />
                    {product.supplier.address}
                  </div>
                </div>
              </Link>
            </div>

            {/* Price */}
            <div className="bg-saffron-50 border border-saffron-200 rounded-xl p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-earth-900">
                  Rs {product.price.toLocaleString()}
                </span>
                <span className="text-earth-500">/{product.unit}</span>
              </div>
              <p className="text-xs text-earth-500 mt-1">
                Minimum order: <strong className="text-saffron-700">{product.minOrder} {product.unit}</strong> ·
                Total from <strong className="text-earth-800"> Rs {(product.price * product.minOrder).toLocaleString()}</strong>
              </p>
            </div>

            {/* Quantity selector */}
            <div>
              <label className="text-sm font-medium text-earth-700 block mb-2">
                Quantity ({product.unit})
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-linen-400 rounded-xl overflow-hidden bg-linen-50">
                  <button
                    onClick={() => setQty(q => Math.max(product.minOrder, q - product.minOrder))}
                    className="px-3 py-2.5 text-earth-600 hover:bg-linen-200 transition-colors disabled:opacity-40"
                    disabled={qty <= product.minOrder}
                  >
                    <Minus size={16} />
                  </button>
                  <div className="px-5 py-2.5 font-display font-semibold text-earth-900 text-lg border-x border-linen-300 min-w-[80px] text-center">
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + product.minOrder))}
                    className="px-3 py-2.5 text-earth-600 hover:bg-linen-200 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-xs text-earth-500">
                  <strong className="text-earth-700">=  Rs {(product.price * qty).toLocaleString()}</strong> total
                </div>
              </div>
              <p className="text-xs text-earth-400 mt-1.5">Increments of {product.minOrder} {product.unit}</p>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3">
              <Button
                size="lg"
                icon={<ShoppingCart size={17} />}
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="flex-1"
              >
                {added ? 'Added!' : inCart ? 'Update Cart' : 'Add to Cart'}
              </Button>
              <Link to="/cart">
                <Button variant="outline" size="lg">View Cart</Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <Package size={15} />, text: 'Bulk pricing available' },
                { icon: <Truck size={15} />, text: 'Direct from supplier' },
                { icon: <ShieldCheck size={15} />, text: 'Verified sellers' },
              ].map(item => (
                <div key={item.text} className="flex flex-col items-center gap-1 text-center p-2.5 bg-linen-100 rounded-xl border border-linen-200">
                  <span className="text-saffron-500">{item.icon}</span>
                  <span className="text-xs text-earth-600 leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supplier + Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <h3 className="font-display font-semibold text-earth-800 text-base mb-4">About the Supplier</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-saffron-100 border border-saffron-200 flex items-center justify-center text-saffron-600 font-display font-bold text-xl">
                  {product.supplier.businessName[0]}
                </div>
                <div>
                  <div className="font-semibold text-earth-800">{product.supplier.businessName}</div>
                  <div className="flex items-center gap-1 text-xs text-earth-500">
                    <MapPin size={10} /> {product.supplier.market}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <Stars rating={product.supplier.averageRating} size={13} />
                <span className="font-semibold text-earth-800">{product.supplier.averageRating}</span>
                <span className="text-earth-500">({product.supplier.totalReviews} reviews)</span>
              </div>
              <p className="text-xs text-earth-600 leading-relaxed mb-4">{product.supplier.bio}</p>
              <Link to={`/suppliers/${product.supplier._id}`}>
                <Button variant="outline" size="sm" fullWidth>View Supplier Profile</Button>
              </Link>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display font-semibold text-earth-800 text-base mb-4">
              Customer Reviews ({reviews.length})
            </h3>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(r => (
                  <Card key={r._id} className="!p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-earth-800 text-sm">{r.buyer.fullname}</div>
                        <div className="text-xs text-earth-400">@{r.buyer.username}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stars rating={r.rating} size={12} />
                        <span className="text-xs text-earth-500">{new Date(r.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <p className="text-sm text-earth-700 leading-relaxed">{r.comment}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-10 text-earth-400 text-sm">No reviews yet</Card>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-linen-300">
            <h3 className="font-display font-semibold text-earth-900 text-lg mb-5">More from {product.category.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <Link key={p._id} to={`/products/${p._id}`} className="group">
                  <Card hover padding={false} className="overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <ProductImage imageUrl={p.imageUrl} category={p.category} className="group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-semibold text-earth-800 line-clamp-2 group-hover:text-saffron-600 mb-1">{p.name}</h4>
                      <span className="font-display font-bold text-sm text-earth-900">Rs {p.price.toLocaleString()}<span className="text-xs text-earth-400 font-normal">/{p.unit}</span></span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
