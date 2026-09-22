import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, TrendingUp } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { ANALYTICS, SUPPLIER_ORDERS, PRODUCTS } from '../../data/dummy'
import { useAuth } from '../../context/AuthContext'

function StatCard({ label, urdu, value, sub, accent = false }) {
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-3 ${
      accent
        ? 'bg-forest-800 border-forest-700 text-white'
        : 'bg-[#FEFCF8] border-[#E8E0D2]'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-xs font-semibold uppercase tracking-widest ${accent ? 'text-forest-300' : 'text-ink-500'}`}>
            {label}
          </div>
          <div className={`font-urdu text-[11px] mt-0.5 ${accent ? 'text-forest-400' : 'text-forest-700'}`} dir="rtl">
            {urdu}
          </div>
        </div>
        <ArrowUpRight size={14} className={accent ? 'text-forest-400' : 'text-ink-400'} />
      </div>

      <div className={`font-display font-bold leading-none ${accent ? 'text-white' : 'text-ink-950'}`}
        style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', letterSpacing: '-0.02em' }}>
        {value}
      </div>

      {sub && (
        <div className={`text-xs ${accent ? 'text-forest-300' : 'text-ink-500'}`}>{sub}</div>
      )}
    </div>
  )
}

export default function SupplierDashboardPage() {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ─────────────────────────────────────── */}
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

        {/* ── Thin rule ──────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-8 mt-4">
          <div className="flex-1 h-px bg-[#DDD5C4]" />
          <TrendingUp size={13} className="text-ink-400" />
          <div className="flex-1 h-px bg-[#DDD5C4]" />
        </div>

        {/* ── Stats grid ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <StatCard
            label="Revenue"
            urdu="محصول"
            value={`₨ ${(ANALYTICS.revenue / 1000).toFixed(0)}K`}
            sub="All time"
            accent
          />
          <StatCard
            label="Avg. Order Value"
            urdu="اوسط آرڈر"
            value={`₨ ${(ANALYTICS.averageOrderValue / 1000).toFixed(1)}K`}
            sub="Per order"
          />
          <StatCard
            label="Customers"
            urdu="گاہک"
            value={ANALYTICS.totalCustomers}
            sub="Unique buyers"
          />
          <StatCard
            label="Delivered"
            urdu="فراہم شدہ"
            value={ANALYTICS.totalDeliveredOrders}
            sub="Orders delivered"
          />
        </div>

        {/* ── Body ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent orders */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-semibold text-ink-900 text-lg">Recent Orders</h2>
                <span className="font-urdu text-forest-700 text-xs" dir="rtl">حالیہ آرڈر</span>
              </div>
              <Link to="/supplier/orders" className="text-xs text-forest-700 font-semibold hover:text-forest-900 flex items-center gap-1 transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="bg-[#FEFCF8] rounded-xl border border-[#E8E0D2] overflow-hidden divide-y divide-[#EDE5D8]">
              {SUPPLIER_ORDERS.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center justify-between px-5 py-4 hover:bg-[#F5EFE4] transition-colors gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-ink-900 text-sm">{order.buyer.fullname}</div>
                    <div className="text-xs text-ink-400 mt-0.5 truncate">
                      {order.items.map(i => i.product.name).join(', ').substring(0, 44)}…
                    </div>
                    <div className="text-[11px] text-ink-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display font-bold text-ink-950 text-base">
                      ₨ {order.total.toLocaleString()}
                    </div>
                    <div className="mt-1">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Quick actions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="font-display font-semibold text-ink-900 text-base">Quick Actions</h2>
                <span className="font-urdu text-forest-700 text-[11px]" dir="rtl">فوری اقدام</span>
              </div>
              <div className="space-y-2">
                {[
                  { to: '/supplier/products', label: 'Add New Product',  urdu: 'نئی مصنوعات', icon: '＋' },
                  { to: '/supplier/orders',   label: 'Manage Orders',    urdu: 'آرڈر',        icon: '📦' },
                  { to: '/supplier/profile',  label: 'Update Profile',   urdu: 'پروفائل',     icon: '✏️' },
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

            {/* My products */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="font-display font-semibold text-ink-900 text-base">My Products</h2>
                <span className="font-urdu text-forest-700 text-[11px]" dir="rtl">مصنوعات</span>
              </div>
              <div className="space-y-2">
                {PRODUCTS.filter(p => p.supplier._id === 'sup1').slice(0, 3).map(p => (
                  <div key={p._id} className="flex items-center justify-between px-4 py-2.5 bg-[#FEFCF8] border border-[#E8E0D2] rounded-xl text-sm">
                    <span className="text-ink-700 truncate max-w-[130px]">{p.name}</span>
                    <span className="font-semibold text-ink-950 shrink-0 ml-2 font-body">
                      ₨{p.price.toLocaleString()}/{p.unit}
                    </span>
                  </div>
                ))}
                <Link to="/supplier/products"
                  className="block text-center text-xs text-forest-700 font-semibold pt-1 hover:underline">
                  View all →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
