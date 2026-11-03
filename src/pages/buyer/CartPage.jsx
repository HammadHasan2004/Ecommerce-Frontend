import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ProductImage from '../../components/ui/ProductImage'
import { useCart } from '../../context/CartContext'
import { ordersApi } from '../../api/orders'

export default function CartPage() {
  const { items, removeItem, addItem, clearCart, total } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [error, setError] = useState('')

  const handleQtyChange = (item, delta) => {
    const newQty = item.qty + delta * item.product.minOrder
    if (newQty < item.product.minOrder) return
    if (item.product.stock && newQty > item.product.stock) return
    addItem(item.product, newQty)
  }

  const handleCheckout = async () => {
    setPlacing(true); setError('')
    try {
      const orderItems = items.map(i => ({ productId: i.product._id, quantity: i.qty }))
      await ordersApi.create(orderItems)
      clearCart()
      setPlaced(true)
      setTimeout(() => navigate('/orders'), 1500)
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (placed) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-display text-2xl font-bold text-ink-950 mb-2">Order placed!</h2>
          <p className="font-urdu text-forest-700 text-sm mb-1" dir="rtl">آرڈر مل گیا</p>
          <p className="text-ink-500 text-sm mt-2">Redirecting to your orders…</p>
        </div>
      </Layout>
    )
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-[#EDE5D8] flex items-center justify-center mx-auto mb-5">
            <ShoppingCart size={32} className="text-ink-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-800 mb-1">Your cart is empty</h2>
          <p className="font-urdu text-forest-700 text-sm mb-4" dir="rtl">ٹوکری خالی ہے</p>
          <p className="text-ink-500 text-sm mb-6">Browse the marketplace and add products to your cart.</p>
          <Link to="/marketplace"><Button size="lg" iconRight={<ArrowRight size={16} />}>Browse Products</Button></Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-950">Your Cart</h1>
            <p className="text-ink-500 text-sm">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={clearCart} className="text-sm text-rust-600 hover:text-rust-700 flex items-center gap-1.5 transition-colors">
            <Trash2 size={14} /> Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item.product._id} className="!p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#E8E0D2] shrink-0">
                    <ProductImage imageUrl={item.product.imageUrl} category={item.product.category} iconSize="text-3xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product._id}`}
                      className="font-semibold text-ink-800 text-sm hover:text-forest-700 transition-colors line-clamp-2 block">
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-ink-500 mt-0.5">{item.product.supplier?.businessName}</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#DDD5C4] rounded-lg overflow-hidden">
                        <button onClick={() => handleQtyChange(item, -1)}
                          className="px-2.5 py-1.5 hover:bg-[#F0E8DE] transition-colors text-ink-600 disabled:opacity-40"
                          disabled={item.qty <= item.product.minOrder}>
                          <Minus size={13} />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold text-ink-950 border-x border-[#DDD5C4]">{item.qty}</span>
                        <button onClick={() => handleQtyChange(item, 1)}
                          className="px-2.5 py-1.5 hover:bg-[#F0E8DE] transition-colors text-ink-600">
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-bold text-ink-950">
                          Rs {(item.product.price * item.qty).toLocaleString()}
                        </div>
                        <div className="text-xs text-ink-400">Rs {item.product.price}/{item.product.unit}</div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product._id)}
                    className="text-ink-300 hover:text-rust-500 transition-colors shrink-0 self-start mt-0.5">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-24">
              <h3 className="font-display font-semibold text-ink-800 text-base mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-ink-600 truncate max-w-[150px]">{item.product.name}</span>
                    <span className="text-ink-800 font-medium shrink-0 ml-2">
                      Rs {(item.product.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#EDE5D8] pt-3 mb-5">
                <div className="flex justify-between">
                  <span className="font-semibold text-ink-800">Total</span>
                  <span className="font-display font-bold text-lg text-ink-950">Rs {total.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mb-3 p-3 bg-rust-50 border border-rust-200 rounded-lg text-xs text-rust-700">{error}</div>
              )}

              <Button fullWidth size="lg" onClick={handleCheckout} loading={placing} iconRight={<ArrowRight size={16} />}>
                Place Order
              </Button>
              <Link to="/marketplace" className="block text-center text-sm text-forest-700 hover:text-forest-900 mt-3 transition-colors">
                Continue shopping
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
