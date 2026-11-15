import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const SUPPLIER_CONFLICT_MESSAGE =
  'Your cart has items from another supplier. Place that order first or clear the cart.'

const supplierOf = (product) => product.supplier?._id || product.supplier

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const upsert = (prev, product, qty) => {
    const existing = prev.find(i => i.product._id === product._id)
    if (existing) {
      return prev.map(i => i.product._id === product._id ? { ...i, qty } : i)
    }
    return [...prev, { product, qty }]
  }

  // Returns { ok: true } or { ok: false, message } when the product is from a different supplier.
  const addItem = (product, qty) => {
    if (items.length > 0 && supplierOf(items[0].product) !== supplierOf(product)) {
      return { ok: false, message: SUPPLIER_CONFLICT_MESSAGE }
    }
    setItems(prev => upsert(prev, product, qty))
    return { ok: true }
  }

  const clearAndAdd = (product, qty) => {
    setItems([{ product, qty }])
    return { ok: true }
  }

  const removeItem = (productId) => setItems(prev => prev.filter(i => i.product._id !== productId))

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  const count = items.length

  return (
    <CartContext.Provider value={{ items, addItem, clearAndAdd, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
