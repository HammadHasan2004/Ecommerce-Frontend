import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { PageLoader, PageError } from '../../components/ui/PageState'
import { analyticsApi } from '../../api/analytics'
import { ordersApi } from '../../api/orders'
import { productsApi } from '../../api/products'
import { useAuth } from '../../context/AuthContext'

function StatCard({ label, urdu, value, sub, accent = false }) {
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-3 ${
      accent ? 'bg-forest-800 border-forest-700' : 'bg-[#FEFCF8] border-[#E8E0D2]'
    }`}>
      <div>
        <div className={`text-xs font-semibold uppercase tracking-widest ${accent ? 'text-forest-300' : 'text-ink-500'}`}>{label}</div>
        <div className={`font-urdu text-[11px] mt-0.5 ${accent ? 'text-forest-400' : 'text-forest-700'}`} dir="rtl">{urdu}</div>
      </div>
      <div className={`font-display font-bold leading-none ${accent ? 'text-white' : 'text-ink-950'}`}
        style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {sub && <div className={`text-xs ${accent ? 'text-forest-300' : 'text-ink-500'}`}>{sub}</div>}
    </div>
  )
}

export default function SupplierDashboardPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [myProducts, setMyProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      analyticsApi.dashboard(),
      productsApi.list(),
    ]).then(([stats, prods]) => {
      setAnalytics(stats)
      setMyProducts(Array.isArray(prods) ? prods.slice(0, 3) : [])
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Layout><div className="max-w-7xl mx-auto px-4 py-10"><PageLoader label="Loading dashboard…" /></div></Layout>

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-widest">Supplier Dashboard</span>
              <span className="h-px w-8 bg-[#DDD5C4]" />
              <span className="font-urdu text-forest-700 text-xs" dir="rtl">ڈیش بورڈ</span>
            </div>
            <h1 className="font-display text-ink-950 font-bold leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              {user?.fullname?.split(' ')[0] || 'Supplier'}'s Store
            </h1>
          </div>
          <Link to="/supplier/products"
            className="hidden sm:flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0">
            Add Product <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8 mt-4">
          <div className="flex-1 h-px bg-[#DDD5C4]" />
          <TrendingUp size={13} className="text-ink-400" />
          <div className="flex-1 h-px bg-[#DDD5C4]" />
        </div>

        {error && <PageError message={error} />}

        {/* Stats */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            <StatCard label="Revenue" urdu="محصول"
              value={`₨ ${((analytics.revenue || 0) / 1000).toFixed(0)}K`} sub="All time" accent />
            <StatCard label="Avg. Order Value" urdu="اوسط آرڈر"
              value={`₨ ${((analytics.averageOrderValue || 0) / 1000).toFixed(1)}K`} sub="Per order" />
            <StatCard label="Customers" urdu="گاہک"
              value={analytics.totalCustomers || 0} sub="Unique buyers" />
            <StatCard label="Delivered" urdu="فراہم شدہ"
              value={analytics.totalDeliveredOrders || 0} sub="Orders" />
          </div>
        )}

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders — supplier sees their orders from /supplier/orders page */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-semibold text-ink-900 text-lg">Incoming Orders</h2>
                <span className="font-urdu text-forest-700 text-xs" dir="rtl">آرڈر</span>
              </div>
              <Link to="/supplier/orders" className="text-xs text-forest-700 font-semibold hover:text-forest-900 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <Card padding={false} className="overflow-hidden">
              <div className="px-5 py-10 text-center text-ink-400 text-sm">
                <p>Go to <Link to="/supplier/orders" className="text-forest-700 font-semibold hover:underline">Incoming Orders</Link> to manage and update order statuses.</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="font-display font-semibold text-ink-900 text-base">Quick Actions</h2>
                <span className="font-urdu text-forest-700 text-[11px]" dir="rtl">فوری اقدام</span>
              </div>
              <div className="space-y-2">
                {[
                  { to: '/supplier/products', label: 'Add New Product', urdu: 'نئی مصنوعات', icon: '＋' },
                  { to: '/supplier/orders',   label: 'Manage Orders',   urdu: 'آرڈر',        icon: '📦' },
                  { to: '/supplier/profile',  label: 'Update Profile',  urdu: 'پروفائل',     icon: '✏️' },
                ].map(a => (
                  <Link key={a.to} to={a.to}
                    className="flex items-center justify-between px-4 py-3 bg-[#FEFCF8] border border-[#E8E0D2] rounded-xl hover:border-forest-400 hover:bg-forest-50 transition-all group">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{a.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-ink-800 group-hover:text-forest-800">{a.label}</div>
                        <div className="font-urdu text-[10px] text-forest-600" dir="rtl">{a.urdu}</div>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-ink-300 group-hover:text-forest-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {myProducts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-display font-semibold text-ink-900 text-base">My Products</h2>
                  <span className="font-urdu text-forest-700 text-[11px]" dir="rtl">مصنوعات</span>
                </div>
                <div className="space-y-2">
                  {myProducts.map(p => (
                    <div key={p._id} className="flex items-center justify-between px-4 py-2.5 bg-[#FEFCF8] border border-[#E8E0D2] rounded-xl text-sm">
                      <span className="text-ink-700 truncate max-w-[130px]">{p.name}</span>
                      <span className="font-semibold text-ink-950 shrink-0 ml-2">₨{Number(p.price).toLocaleString()}/{p.unit}</span>
                    </div>
                  ))}
                  <Link to="/supplier/products" className="block text-center text-xs text-forest-700 font-semibold pt-1 hover:underline">
                    View all →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
