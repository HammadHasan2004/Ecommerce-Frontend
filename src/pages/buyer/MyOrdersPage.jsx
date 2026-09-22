import { Link } from 'react-router-dom'
import { ClipboardList, ChevronRight, Package } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { ORDERS } from '../../data/dummy'

export default function MyOrdersPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-earth-900">My Orders</h1>
          <p className="text-earth-500 text-sm">{ORDERS.length} orders placed</p>
        </div>

        {ORDERS.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-linen-200 flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={28} className="text-earth-400" />
            </div>
            <h3 className="font-display text-xl font-semibold text-earth-700 mb-2">No orders yet</h3>
            <p className="text-earth-500 text-sm mb-5">Start browsing to place your first order.</p>
            <Link to="/marketplace" className="text-saffron-600 font-medium hover:underline text-sm">Browse Marketplace</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ORDERS.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} className="block group">
                <Card hover className="!p-0 overflow-hidden">
                  <div className="px-5 py-4 border-b border-linen-200 bg-linen-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-linen-200 flex items-center justify-center">
                        <Package size={15} className="text-earth-500" />
                      </div>
                      <div>
                        <div className="text-xs text-earth-500 font-medium">ORDER</div>
                        <div className="font-mono text-xs text-earth-700">#{order._id.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <ChevronRight size={16} className="text-earth-400 group-hover:text-saffron-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-earth-700">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} ·{' '}
                        {order.items.map(i => i.product.name).join(', ').substring(0, 50)}
                        {order.items.map(i => i.product.name).join(', ').length > 50 ? '…' : ''}
                      </div>
                      <div className="text-xs text-earth-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="font-display font-bold text-earth-900">Rs {order.total.toLocaleString()}</div>
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
