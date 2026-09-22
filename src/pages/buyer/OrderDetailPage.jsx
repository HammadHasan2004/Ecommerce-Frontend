import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Star, X } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import ProductImage from '../../components/ui/ProductImage'
import { ORDERS } from '../../data/dummy'

function ReviewModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-earth-900">Leave a Review</h3>
          <button onClick={onClose} className="text-earth-400 hover:text-earth-600 transition-colors"><X size={18} /></button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)}>
              <Star size={24} className={n <= rating ? 'text-saffron-500 fill-saffron-500' : 'text-linen-300'} />
            </button>
          ))}
          <span className="text-sm text-earth-600 ml-1">{rating}/5</span>
        </div>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with this supplier..."
          rows={4}
          className="w-full bg-linen-50 border border-linen-300 rounded-xl p-3 text-sm text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 resize-none mb-4"
        />
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={() => { onSubmit(rating, comment); onClose() }} className="flex-1" disabled={!comment.trim()}>Submit Review</Button>
        </div>
      </Card>
    </div>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const order = ORDERS.find(o => o._id === id) || ORDERS[0]
  const [cancelled, setCancelled] = useState(false)
  const [reviewed, setReviewed] = useState(order.reviewLeft || false)
  const [showReview, setShowReview] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const status = cancelled ? 'cancelled' : order.status

  const handleCancel = async () => {
    setCancelling(true)
    await new Promise(r => setTimeout(r, 700))
    setCancelled(true)
    setCancelling(false)
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showReview && (
          <ReviewModal onClose={() => setShowReview(false)} onSubmit={() => setReviewed(true)} />
        )}

        <Link to="/orders" className="flex items-center gap-1.5 text-sm text-earth-500 hover:text-saffron-600 transition-colors mb-6">
          <ChevronLeft size={14} /> Back to orders
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-earth-900">Order Details</h1>
            <div className="font-mono text-xs text-earth-400 mt-0.5">#{order._id.toUpperCase()}</div>
            <div className="text-xs text-earth-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Items */}
        <Card className="mb-4 !p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-linen-200 bg-linen-50">
            <h3 className="font-semibold text-earth-700 text-sm">Items ({order.items.length})</h3>
          </div>
          <div className="divide-y divide-linen-200">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 px-5 py-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-linen-200 shrink-0">
                  <ProductImage imageUrl={item.product.imageUrl} category={item.product.category} iconSize="text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product._id}`} className="font-semibold text-earth-800 text-sm hover:text-saffron-600 transition-colors line-clamp-1">
                    {item.product.name}
                  </Link>
                  <div className="text-xs text-earth-500 mt-0.5">{item.quantity} {item.product.unit} × Rs {item.price.toLocaleString()}</div>
                </div>
                <div className="font-display font-bold text-earth-900 shrink-0">
                  Rs {(item.quantity * item.price).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-linen-200 bg-linen-50 flex justify-between items-center">
            <span className="font-semibold text-earth-700">Total</span>
            <span className="font-display font-bold text-xl text-earth-900">Rs {order.total.toLocaleString()}</span>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {status === 'pending' && !cancelled && (
            <Button variant="danger" onClick={handleCancel} loading={cancelling} fullWidth>
              Cancel Order
            </Button>
          )}
          {status === 'delivered' && !reviewed && (
            <Button onClick={() => setShowReview(true)} fullWidth icon={<Star size={16} />}>
              Leave a Review
            </Button>
          )}
          {reviewed && (
            <div className="text-center text-sm text-mgreen-600 font-medium py-2 bg-mgreen-50 rounded-xl border border-mgreen-200">
              ✓ Review submitted — thank you!
            </div>
          )}
          {cancelled && (
            <div className="text-center text-sm text-burgundy-600 py-2 bg-burgundy-50 rounded-xl border border-burgundy-200">
              This order has been cancelled. Stock has been restored.
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
