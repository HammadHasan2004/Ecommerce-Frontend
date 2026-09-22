import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ProductImage from '../../components/ui/ProductImage'
import { SUPPLIER_ORDERS } from '../../data/dummy'

const STATUS_TRANSITIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['delivered'],
  delivered: [],
  cancelled: [],
}

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState(SUPPLIER_ORDERS)
  const [expanded, setExpanded] = useState(null)

  const updateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-earth-900">Incoming Orders</h1>
          <p className="text-earth-500 text-sm">{orders.length} total orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-16 text-earth-400 text-sm">No orders received yet.</Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const isOpen = expanded === order._id
              const transitions = STATUS_TRANSITIONS[order.status]
              return (
                <Card key={order._id} padding={false} className="overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : order._id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-linen-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <div className="font-semibold text-earth-800 text-sm">{order.buyer.fullname}</div>
                        <div className="text-xs text-earth-400">@{order.buyer.username}</div>
                      </div>
                      <div>
                        <div className="font-display font-bold text-earth-900">Rs {order.total.toLocaleString()}</div>
                        <div className="text-xs text-earth-500">
                          {new Date(order.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <ChevronDown size={15} className={`text-earth-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-linen-200 bg-linen-50">
                      <div className="divide-y divide-linen-200">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 px-5 py-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-linen-200 shrink-0">
                              <ProductImage imageUrl={item.product.imageUrl} category={item.product.category} iconSize="text-xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-earth-800 text-sm truncate">{item.product.name}</div>
                              <div className="text-xs text-earth-500">{item.quantity} {item.product.unit} × Rs {item.price.toLocaleString()}</div>
                            </div>
                            <div className="font-display font-bold text-earth-900 shrink-0 text-sm">
                              Rs {(item.quantity * item.price).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {transitions.length > 0 && (
                        <div className="px-5 py-4 border-t border-linen-200 flex gap-2 flex-wrap">
                          <span className="text-xs text-earth-500 self-center mr-1">Update status:</span>
                          {transitions.map(status => (
                            <Button
                              key={status}
                              size="sm"
                              variant={status === 'cancelled' ? 'danger' : status === 'delivered' ? 'success' : 'primary'}
                              onClick={() => updateStatus(order._id, status)}
                            >
                              Mark as {status}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
