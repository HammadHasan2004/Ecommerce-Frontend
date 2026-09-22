import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ProductImage from '../../components/ui/ProductImage'
import { useCart } from '../../context/CartContext'

export default function CartPage() {
  const { items, removeItem, addItem, clearCart, total } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)

  const handleQtyChange = (item, delta) => {
    const newQty = item.qty + delta * item.product.minOrder
    if (newQty < item.product.minOrder) return
    if (newQty > item.product.stock) return
    addItem(item.product, newQty)
  }

  const handleCheckout = async () => {
    setPlacing(true)
    await new Promise(r => setTimeout(r, 1000))
    clearCart()
    setPlacing(false)
    setPlaced(true)
    setTimeout(() => navigate('/orders'), 1500)
  }

  if (placed) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-display text-2xl font-bold text-earth-900 mb-2">Order placed!</h2>
          <p className="text-earth-500 text-sm">Redirecting to your orders...</p>
        </div>
      </Layout>
    )
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-linen-200 flex items-center justify-center mx-auto mb-5">
            <ShoppingCart size={32} className="text-earth-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-earth-800 mb-2">Your cart is empty</h2>
          <p className="text-earth-500 text-sm mb-6">Browse the marketplace and add products to your cart.</p>
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
            <h1 className="font-display text-2xl font-bold text-earth-900">Your Cart</h1>
            <p className="text-earth-500 text-sm">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={clearCart} className="text-sm text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1.5 transition-colors">
            <Trash2 size={14} /> Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item.product._id} className="!p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-linen-200 shrink-0">
                    <ProductImage imageUrl={item.product.imageUrl} category={item.product.category} iconSize="text-3xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product._id}`} className="font-semibold text-earth-800 text-sm hover:text-saffron-600 transition-colors line-clamp-2 block">
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-earth-500 mt-0.5">{item.product.supplier.businessName}</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-linen-300 rounded-lg overflow-hidden">
                        <button onClick={() => handleQtyChange(item, -1)} className="px-2.5 py-1.5 hover:bg-linen-200 transition-colors text-earth-600 disabled:opacity-40" disabled={item.qty <= item.product.minOrder}>
                          <Minus size={13} />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold text-earth-900 border-x border-linen-300">{item.qty}</span>
                        <button onClick={() => handleQtyChange(item, 1)} className="px-2.5 py-1.5 hover:bg-linen-200 transition-colors text-earth-600">
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-bold text-earth-900">Rs {(item.product.price * item.qty).toLocaleString()}</div>
                        <div className="text-xs text-earth-400">Rs {item.product.price}/{item.product.unit}</div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product._id)} className="text-earth-300 hover:text-burgundy-500 transition-colors shrink-0 self-start mt-0.5">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <Card className="sticky top-24">
              <h3 className="font-display font-semibold text-earth-800 text-base mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-earth-600 truncate max-w-[150px]">{item.product.name}</span>
                    <span className="text-earth-800 font-medium shrink-0 ml-2">Rs {(item.product.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-linen-200 pt-3 mb-5">
                <div className="flex justify-between">
                  <span className="font-semibold text-earth-800">Total</span>
                  <span className="font-display font-bold text-lg text-earth-900">Rs {total.toLocaleString()}</span>
                </div>
              </div>
              <Button fullWidth size="lg" onClick={handleCheckout} loading={placing} iconRight={<ArrowRight size={16} />}>
                Place Order
              </Button>
              <Link to="/marketplace" className="block text-center text-sm text-saffron-600 hover:text-saffron-700 mt-3 transition-colors">
                Continue shopping
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
