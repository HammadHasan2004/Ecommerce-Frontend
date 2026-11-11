import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ProductImage from '../../components/ui/ProductImage'
import { PageLoader, PageError } from '../../components/ui/PageState'
import { ordersApi } from '../../api/orders'

const STATUS_TRANSITIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped:   ['delivered'],
  delivered: [],
  cancelled: [],
}

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [shipFormFor, setShipFormFor] = useState(null)
  const [shipFields, setShipFields] = useState({ courierName: '', trackingNumber: '' })
  const [shipError, setShipError] = useState('')

  useEffect(() => {
    ordersApi.supplierOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const openShipForm = (orderId) => {
    setShipFormFor(orderId)
    setShipFields({ courierName: '', trackingNumber: '' })
    setShipError('')
  }

  const updateStatus = async (orderId, newStatus, extra = {}) => {
    setUpdating(orderId + newStatus)
    try {
      const updated = await ordersApi.updateStatus(orderId, newStatus, extra)
      // Merge only these fields; spreading the response would overwrite the populated buyer.
      setOrders(prev => prev.map(o => o._id === orderId ? {
        ...o,
        status: updated?.status ?? newStatus,
        courierName: updated?.courierName ?? o.courierName,
        trackingNumber: updated?.trackingNumber ?? o.trackingNumber,
        statusHistory: updated?.statusHistory ?? o.statusHistory,
      } : o))
      return true
    } catch (err) {
      alert(err.message)
      return false
    } finally {
      setUpdating(null)
    }
  }

  const confirmShipped = async (orderId) => {
    const courierName = shipFields.courierName.trim()
    const trackingNumber = shipFields.trackingNumber.trim()
    if (!courierName || !trackingNumber) {
      setShipError('Courier name and tracking number are required')
      return
    }
    setShipError('')
    const ok = await updateStatus(orderId, 'shipped', { courierName, trackingNumber })
    if (ok) setShipFormFor(null)
  }

  if (loading) return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <PageLoader label="Loading orders…" />
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-widest">Supplier</span>
            <span className="h-px w-8 bg-[#DDD5C4]" />
            <span className="font-urdu text-forest-700 text-xs" dir="rtl">آرڈر</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-950">Incoming Orders</h1>
          <p className="text-ink-500 text-sm mt-0.5">
            {orders.length} order{orders.length !== 1 ? 's' : ''} received
          </p>
        </div>

        {error && <PageError message={error} />}

        {!error && orders.length === 0 && (
          <Card className="text-center py-16">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-display font-semibold text-ink-700 text-lg mb-1">No orders yet</p>
            <p className="font-urdu text-forest-600 text-sm" dir="rtl">ابھی تک کوئی آرڈر نہیں</p>
            <p className="text-ink-400 text-sm mt-2">Orders will appear here once buyers purchase your products.</p>
          </Card>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map(order => {
              const isOpen = expanded === order._id
              const transitions = STATUS_TRANSITIONS[order.status] || []
              return (
                <Card key={order._id} padding={false} className="overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : order._id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAF7] transition-colors"
                  >
                    <div className="flex items-center gap-5 text-left">
                      <div>
                        <div className="font-semibold text-ink-800 text-sm">{order.buyer?.fullname}</div>
                        <div className="text-xs text-ink-400">@{order.buyer?.username}</div>
                      </div>
                      <div>
                        <div className="font-display font-bold text-ink-950">
                          Rs {Number(order.totalAmount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-ink-500">
                          {new Date(order.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={order.status} />
                      <ChevronDown size={15} className={`text-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#EDE5D8] bg-[#FAFAF7]">
                      <div className="px-5 py-3 border-b border-[#EDE5D8] text-sm">
                        <span className="font-semibold text-ink-700">Deliver to: </span>
                        <span className="text-ink-600 whitespace-pre-line">{order.deliveryAddress || 'Not provided'}</span>
                        {(order.courierName || order.trackingNumber) && (
                          <div className="text-xs text-ink-500 mt-1">
                            Courier: {order.courierName || '—'} · Tracking #: {order.trackingNumber || '—'}
                          </div>
                        )}
                      </div>
                      <div className="divide-y divide-[#EDE5D8]">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex items-center gap-4 px-5 py-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E8E0D2] shrink-0">
                              <ProductImage imageUrl={item.product?.imageUrl} category={item.product?.category} iconSize="text-xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-ink-800 text-sm truncate">{item.product?.name}</div>
                              <div className="text-xs text-ink-500">
                                {item.quantity} {item.product?.unit} × Rs {Number(item.price).toLocaleString()}
                              </div>
                            </div>
                            <div className="font-display font-bold text-ink-900 shrink-0 text-sm">
                              Rs {(item.quantity * item.price).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {transitions.length > 0 && (
                        <div className="px-5 py-4 border-t border-[#EDE5D8] flex gap-2 flex-wrap items-center">
                          <span className="text-xs text-ink-500 mr-1">Update:</span>
                          {transitions.map(status => (
                            <Button
                              key={status}
                              size="sm"
                              variant={status === 'cancelled' ? 'danger' : status === 'delivered' ? 'success' : 'primary'}
                              loading={updating === order._id + status}
                              onClick={() => status === 'shipped' ? openShipForm(order._id) : updateStatus(order._id, status)}
                            >
                              Mark {status}
                            </Button>
                          ))}
                        </div>
                      )}

                      {shipFormFor === order._id && (
                        <div className="px-5 py-4 border-t border-[#EDE5D8] space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-ink-700 mb-1">Courier name</label>
                              <input
                                type="text"
                                value={shipFields.courierName}
                                onChange={e => setShipFields(f => ({ ...f, courierName: e.target.value }))}
                                className="w-full bg-[#FEFCF8] border border-[#DDD5C4] rounded-lg px-3 py-2 text-sm text-ink-950 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-forest-400"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-ink-700 mb-1">Tracking number</label>
                              <input
                                type="text"
                                value={shipFields.trackingNumber}
                                onChange={e => setShipFields(f => ({ ...f, trackingNumber: e.target.value }))}
                                className="w-full bg-[#FEFCF8] border border-[#DDD5C4] rounded-lg px-3 py-2 text-sm text-ink-950 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-forest-400"
                              />
                            </div>
                          </div>
                          {shipError && <p className="text-xs text-rust-600">{shipError}</p>}
                          <div className="flex gap-2">
                            <Button size="sm" loading={updating === order._id + 'shipped'} onClick={() => confirmShipped(order._id)}>
                              Confirm shipped
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setShipFormFor(null)}>Cancel</Button>
                          </div>
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
