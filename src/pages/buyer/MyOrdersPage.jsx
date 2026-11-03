import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { PageLoader, PageError, EmptyState } from '../../components/ui/PageState'
import Button from '../../components/ui/Button'
import { ordersApi } from '../../api/orders'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ordersApi.myOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-ink-950">My Orders</h1>
          <p className="font-urdu text-forest-700 text-xs mt-0.5" dir="rtl">میرے آرڈر</p>
        </div>

        {loading && <PageLoader label="Loading orders…" />}
        {error   && <PageError message={error} onRetry={() => { setLoading(true); ordersApi.myOrders().then(d => setOrders(Array.isArray(d) ? d : [])).catch(e => setError(e.message)).finally(() => setLoading(false)) }} />}

        {!loading && !error && orders.length === 0 && (
          <EmptyState
            icon="📦"
            title="No orders yet"
            urdu="ابھی تک کوئی آرڈر نہیں"
            sub="Start browsing to place your first order."
            action={<Link to="/marketplace"><Button size="md">Browse Marketplace</Button></Link>}
          />
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} className="block group">
                <Card hover className="!p-0 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#EDE5D8] bg-[#FAFAF7] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#EDE5D8] flex items-center justify-center">
                        <Package size={13} className="text-ink-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest">Order</div>
                        <div className="font-mono text-xs text-ink-600">#{order._id.slice(-8).toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <ChevronRight size={15} className="text-ink-400 group-hover:text-forest-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-ink-700">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        {order.items?.length > 0 && ` · ${order.items.map(i => i.product?.name || i.productId).join(', ').substring(0, 48)}…`}
                      </div>
                      <div className="text-xs text-ink-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', { year:'numeric', month:'long', day:'numeric' })}
                      </div>
                    </div>
                    <div className="font-display font-bold text-ink-950 shrink-0">
                      Rs {Number(order.total || order.totalAmount || 0).toLocaleString()}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
