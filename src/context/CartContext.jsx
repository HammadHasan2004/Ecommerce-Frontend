import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product, qty) => {
    setItems(prev => {
      const existing = prev.find(i => i.product._id === product._id)
      if (existing) {
        return prev.map(i => i.product._id === product._id ? { ...i, qty } : i)
      }
      return [...prev, { product, qty }]
    })
  }

  const removeItem = (productId) => setItems(prev => prev.filter(i => i.product._id !== productId))

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  const count = items.length

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
