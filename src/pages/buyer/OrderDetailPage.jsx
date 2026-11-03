import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Star, X } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import ProductImage from '../../components/ui/ProductImage'
import { PageLoader, PageError } from '../../components/ui/PageState'
import { ordersApi } from '../../api/orders'
import { reviewsApi } from '../../api/reviews'

function ReviewModal({ order, onClose, onDone }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supplierId = order.items?.[0]?.product?.supplier?._id || order.items?.[0]?.product?.supplier

  const handleSubmit = async () => {
    if (!comment.trim()) return
    setLoading(true); setError('')
    try {
      await reviewsApi.create(supplierId, { orderId: order._id, rating, comment })
      onDone()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-ink-950">Leave a Review</h3>
            <p className="font-urdu text-forest-700 text-xs" dir="rtl">تبصرہ لکھیں</p>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600"><X size={18} /></button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)}>
              <Star size={24} className={n <= rating ? 'text-amber-500 fill-amber-500' : 'text-[#DDD5C4] fill-[#DDD5C4]'} />
            </button>
          ))}
          <span className="text-sm text-ink-600 ml-1">{rating}/5</span>
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with this supplier…"
          rows={4}
          className="w-full bg-[#FEFCF8] border border-[#DDD5C4] rounded-xl p-3 text-sm text-ink-950 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none mb-3"
        />
        {error && <p className="text-xs text-rust-600 mb-3">{error}</p>}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} loading={loading} disabled={!comment.trim()} className="flex-1">
            Submit Review
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    ordersApi.get(id)
      .then(data => { setOrder(data); setReviewed(data.reviewLeft || false) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const updated = await ordersApi.cancel(id)
      setOrder(prev => ({ ...prev, status: updated?.status || 'cancelled' }))
    } catch (err) {
      alert(err.message)
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <Layout><PageLoader label="Loading order…" /></Layout>
  if (error)   return <Layout><PageError message={error} /></Layout>
  if (!order)  return null

  const total = order.total || order.totalAmount || 0

  return (
    <Layout>
      {showReview && <ReviewModal order={order} onClose={() => setShowReview(false)} onDone={() => setReviewed(true)} />}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/orders" className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700 transition-colors mb-6">
          <ChevronLeft size={14} /> Back to orders
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-950">Order Details</h1>
            <div className="font-mono text-xs text-ink-400 mt-0.5">#{order._id.slice(-8).toUpperCase()}</div>
            <div className="text-xs text-ink-500 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-PK', { year:'numeric', month:'long', day:'numeric' })}
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Items */}
        <Card className="mb-4 !p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EDE5D8] bg-[#FAFAF7]">
            <h3 className="font-semibold text-ink-700 text-sm">Items ({order.items?.length || 0})</h3>
          </div>
          <div className="divide-y divide-[#EDE5D8]">
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex gap-4 px-5 py-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E8E0D2] shrink-0">
                  <ProductImage imageUrl={item.product?.imageUrl} category={item.product?.category} iconSize="text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product?._id || item.productId}`}
                    className="font-semibold text-ink-800 text-sm hover:text-forest-700 transition-colors line-clamp-1 block">
                    {item.product?.name || item.productId}
                  </Link>
                  <div className="text-xs text-ink-500 mt-0.5">
                    {item.quantity} {item.product?.unit} × Rs {Number(item.priceAtOrder ?? item.price).toLocaleString()}
                  </div>
                </div>
                <div className="font-display font-bold text-ink-950 shrink-0">
                  Rs {(item.quantity * item.priceAtOrder ?? item.price).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-[#EDE5D8] bg-[#FAFAF7] flex justify-between items-center">
            <span className="font-semibold text-ink-700">Total</span>
            <span className="font-display font-bold text-xl text-ink-950">Rs {Number(total).toLocaleString()}</span>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {order.status === 'pending' && (
            <Button variant="danger" onClick={handleCancel} loading={cancelling} fullWidth>
              Cancel Order
            </Button>
          )}
          {order.status === 'delivered' && !reviewed && (
            <Button onClick={() => setShowReview(true)} fullWidth icon={<Star size={16} />}>
              Leave a Review
            </Button>
          )}
          {reviewed && (
            <div className="text-center text-sm text-forest-700 font-medium py-2.5 bg-forest-50 rounded-xl border border-forest-200">
              ✓ Review submitted — شکریہ
            </div>
          )}
          {order.status === 'cancelled' && (
            <div className="text-center text-sm text-rust-600 py-2.5 bg-rust-50 rounded-xl border border-rust-200">
              This order has been cancelled.
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
