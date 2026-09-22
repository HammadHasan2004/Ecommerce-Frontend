import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, LogOut, Menu, X, ChevronDown, BarChart3, Package, ClipboardList, Store, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { clsx } from 'clsx'

function RasadLogo({ size = 'md' }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group select-none">
      {/* Mark */}
      <div className={clsx(
        'rounded-lg bg-forest-800 flex items-center justify-center shrink-0',
        size === 'sm' ? 'w-7 h-7' : 'w-8 h-8',
      )}>
        <span className={clsx(
          'text-amber-400 font-display font-bold leading-none',
          size === 'sm' ? 'text-sm' : 'text-base',
        )}>ر</span>
      </div>
      {/* Wordmark */}
      <div className="leading-none">
        <div className={clsx(
          'font-display font-bold text-ink-950 tracking-tight leading-none',
          size === 'sm' ? 'text-base' : 'text-lg',
        )}>
          Rasad
        </div>
        <div className="font-urdu text-[11px] text-forest-700 leading-none mt-0.5" dir="rtl">
          رسد — خام مال بازار
        </div>
      </div>
    </Link>
  )
}

export { RasadLogo }

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/')

  const buyerLinks = [
    { to: '/marketplace', label: 'Marketplace', urdu: 'بازار', icon: <Store size={14} /> },
    { to: '/orders',      label: 'My Orders',   urdu: 'آرڈر',  icon: <ClipboardList size={14} /> },
  ]
  const supplierLinks = [
    { to: '/supplier/dashboard', label: 'Dashboard', urdu: 'ڈیش بورڈ',  icon: <BarChart3 size={14} /> },
    { to: '/supplier/products',  label: 'Products',  urdu: 'مصنوعات', icon: <Package size={14} /> },
    { to: '/supplier/orders',    label: 'Orders',    urdu: 'آرڈر',    icon: <ClipboardList size={14} /> },
  ]
  const navLinks = !user ? [] : user.role === 'buyer' ? buyerLinks : supplierLinks

  return (
    <nav className="sticky top-0 z-50 bg-[#FEFCF8]/96 backdrop-blur-md border-b border-[#E0D8CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center gap-8">
        <RasadLogo />

        {/* Desktop nav links */}
        {user && (
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-150 rounded-md relative group',
                  isActive(link.to)
                    ? 'text-forest-800 bg-forest-50'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-parch-200',
                )}
              >
                {link.icon}
                <span>{link.label}</span>
                {/* Urdu tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-urdu text-[11px] text-forest-700 bg-forest-50 border border-forest-100 px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {link.urdu}
                </span>
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-forest-700 rounded-full" />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Spacer when logged out */}
        {!user && <div className="flex-1" />}

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-600 hover:text-ink-900 px-3 py-1.5 transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="text-sm font-semibold bg-forest-800 hover:bg-forest-900 text-white px-4 py-1.5 rounded-lg transition-colors">
                Get started
              </Link>
            </>
          ) : (
            <>
              {user.role === 'buyer' && (
                <Link to="/cart" className="relative flex items-center justify-center w-8 h-8 rounded-lg text-ink-600 hover:bg-parch-200 hover:text-ink-900 transition-colors">
                  <ShoppingCart size={17} />
                  {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                      {count}
                    </span>
                  )}
                </Link>
              )}

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-lg text-sm text-ink-700 hover:bg-parch-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-forest-700 flex items-center justify-center text-white font-semibold text-[11px] shrink-0">
                    {(user.fullname || user.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block font-medium max-w-[90px] truncate text-[13px]">
                    {user.fullname || user.username}
                  </span>
                  <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                    {user.role === 'buyer' ? 'خریدار' : 'فروشندہ'}
                  </span>
                  <ChevronDown size={12} className={clsx('text-ink-400 transition-transform shrink-0', profileOpen && 'rotate-180')} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#FEFCF8] rounded-xl border border-[#E0D8CC] shadow-[0_8px_32px_rgba(15,11,7,0.12)] z-50 overflow-hidden">
                      <div className="px-3 py-3 border-b border-[#EDE5D8]">
                        <div className="text-sm font-semibold text-ink-900">{user.fullname}</div>
                        <div className="text-xs text-ink-500">@{user.username}</div>
                        <div className="font-urdu text-[11px] text-forest-700 mt-0.5" dir="rtl">
                          {user.role === 'buyer' ? 'خریدار' : 'فروشندہ'}
                        </div>
                      </div>
                      {user.role === 'supplier' && (
                        <Link to="/supplier/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink-700 hover:bg-parch-200 transition-colors">
                          <User size={13} /> Business Profile
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-rust-600 hover:bg-rust-50 transition-colors border-t border-[#EDE5D8]">
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile toggle */}
              <button
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-ink-600 hover:bg-parch-200 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E0D8CC] bg-[#FEFCF8] px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(link.to) ? 'bg-forest-50 text-forest-800' : 'text-ink-700 hover:bg-parch-200',
              )}
            >
              <span className="flex items-center gap-2">{link.icon}{link.label}</span>
              <span className="font-urdu text-xs text-forest-600" dir="rtl">{link.urdu}</span>
            </Link>
          ))}
          {user?.role === 'buyer' && (
            <Link to="/cart" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-parch-200">
              <span className="flex items-center gap-2"><ShoppingCart size={14} /> Cart</span>
              {count > 0 && <span className="bg-amber-500 text-white text-xs px-1.5 rounded-full">{count}</span>}
            </Link>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-rust-600 hover:bg-rust-50">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </nav>
  )
}
