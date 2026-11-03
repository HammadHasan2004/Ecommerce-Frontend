import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import LoginPage             from './pages/auth/LoginPage'
import RegisterPage          from './pages/auth/RegisterPage'
import MarketplacePage       from './pages/buyer/MarketplacePage'
import ProductDetailPage     from './pages/buyer/ProductDetailPage'
import SupplierProfilePage   from './pages/buyer/SupplierProfilePage'
import MyOrdersPage          from './pages/buyer/MyOrdersPage'
import OrderDetailPage       from './pages/buyer/OrderDetailPage'
import CartPage              from './pages/buyer/CartPage'
import SupplierDashboardPage from './pages/supplier/SupplierDashboardPage'
import SupplierProductsPage  from './pages/supplier/SupplierProductsPage'
import SupplierOrdersPage    from './pages/supplier/SupplierOrdersPage'
import BusinessProfilePage   from './pages/supplier/BusinessProfilePage'
import CompleteProfilePage   from './pages/supplier/CompleteProfilePage'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4]">
      <div className="w-8 h-8 border-2 border-[#DDD5C4] border-t-forest-600 rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'buyer' ? '/marketplace' : '/supplier/dashboard'} replace />
  }
  return children
}

// Listens for the auth-expired event dispatched by the API client
function AuthExpiredWatcher() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const handler = async () => {
      await logout()
      navigate('/login', { replace: true })
    }
    window.addEventListener('rasad:auth-expired', handler)
    return () => window.removeEventListener('rasad:auth-expired', handler)
  }, [logout, navigate])
  return null
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <>
      <AuthExpiredWatcher />
      <Routes>
        <Route path="/" element={
          user
            ? <Navigate to={user.role === 'buyer' ? '/marketplace' : '/supplier/dashboard'} replace />
            : <Navigate to="/login" replace />
        } />
        <Route path="/login"    element={!user ? <LoginPage />    : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />

        {/* Buyer */}
        <Route path="/marketplace"  element={<ProtectedRoute role="buyer"><MarketplacePage /></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
        <Route path="/suppliers/:id" element={<ProtectedRoute><SupplierProfilePage /></ProtectedRoute>} />
        <Route path="/orders"       element={<ProtectedRoute role="buyer"><MyOrdersPage /></ProtectedRoute>} />
        <Route path="/orders/:id"   element={<ProtectedRoute role="buyer"><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/cart"         element={<ProtectedRoute role="buyer"><CartPage /></ProtectedRoute>} />

        {/* Supplier */}
        <Route path="/supplier/complete-profile" element={<ProtectedRoute role="supplier"><CompleteProfilePage /></ProtectedRoute>} />
        <Route path="/supplier/dashboard"  element={<ProtectedRoute role="supplier"><SupplierDashboardPage /></ProtectedRoute>} />
        <Route path="/supplier/products"   element={<ProtectedRoute role="supplier"><SupplierProductsPage /></ProtectedRoute>} />
        <Route path="/supplier/orders"     element={<ProtectedRoute role="supplier"><SupplierOrdersPage /></ProtectedRoute>} />
        <Route path="/supplier/profile"    element={<ProtectedRoute role="supplier"><BusinessProfilePage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
