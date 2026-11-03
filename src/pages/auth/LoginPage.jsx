import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/auth'
import { suppliersApi } from '../../api/suppliers'
import { ApiError } from '../../api/client'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const MARQUEE_ITEMS = [
  'فیبرک · Fabric', 'چمڑا · Leather', 'دھاگا · Thread', 'پیکیجنگ · Packaging',
  'رسد · Rasad', 'بولٹن مارکیٹ', 'جوڈیا بازار', 'لیا مارکیٹ',
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identity: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // identity can be email or username — send as both fields, backend accepts either
      const isEmail = form.identity.includes('@')
      const credentials = isEmail
        ? { email: form.identity, password: form.password }
        : { username: form.identity, password: form.password }

      const data = await authApi.login(credentials)
      const user = data.user || data

      login(user)

      if (user.role === 'buyer') {
        navigate('/marketplace', { replace: true })
        return
      }

      // Supplier: check if profile exists
      try {
        await suppliersApi.me()
        navigate('/supplier/dashboard', { replace: true })
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          navigate('/supplier/complete-profile', { replace: true })
        } else {
          navigate('/supplier/dashboard', { replace: true })
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — dark brand panel */}
      <div className="hidden lg:flex flex-col w-[44%] bg-forest-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)' }}
        />

        <div className="relative z-10 p-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg leading-none">ر</span>
          </div>
          <div>
            <div className="font-display font-bold text-white text-xl leading-none">Rasad</div>
            <div className="font-urdu text-amber-400 text-[11px] leading-none mt-1" dir="rtl">رسد</div>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-10">
          <div className="mb-2 text-forest-400 text-xs font-semibold uppercase tracking-widest">
            کراچی کا خام مال بازار
          </div>
          <h2 className="font-display text-white text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Karachi's Raw<br />Material Exchange
          </h2>
          <p className="text-forest-300 text-sm leading-relaxed mb-10 max-w-xs">
            Connecting home-industry manufacturers with verified wholesale suppliers across Bolton Market, Jodia Bazar & Lea Market.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { num: '200+', label: 'Suppliers', urdu: 'فراہم کنندگان' },
              { num: '1,800+', label: 'Products', urdu: 'مصنوعات' },
              { num: '4', label: 'Categories', urdu: 'اقسام' },
              { num: '500+', label: 'Manufacturers', urdu: 'کارخانہ دار' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="font-display text-2xl font-bold text-amber-400">{s.num}</div>
                <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
                <div className="font-urdu text-forest-400 text-[10px] mt-0.5" dir="rtl">{s.urdu}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 py-3 overflow-hidden">
          <div className="marquee-track whitespace-nowrap flex gap-8 text-[11px] text-forest-400 font-medium">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="shrink-0">{item} ·</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F5EFE4]">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center">
              <span className="text-amber-400 font-display font-bold text-base leading-none">ر</span>
            </div>
            <div>
              <div className="font-display font-bold text-ink-950 text-lg leading-none">Rasad</div>
              <div className="font-urdu text-forest-700 text-[10px] leading-none mt-0.5" dir="rtl">رسد — خام مال بازار</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-ink-950 font-bold leading-tight mb-1"
              style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}>
              Welcome back
            </h1>
            <p className="font-urdu text-forest-700 text-sm" dir="rtl">خوش آمدید</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Username"
              placeholder="you@email.com"
              value={form.identity}
              onChange={e => setForm(f => ({ ...f, identity: e.target.value }))}
              icon={<Mail size={14} />}
              required
            />
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              icon={<Lock size={14} />}
              iconRight={
                <button type="button" onClick={() => setShowPw(!showPw)} className="cursor-pointer">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
              required
            />

            {error && (
              <div className="p-3 bg-rust-50 border border-rust-200 rounded-lg text-sm text-rust-700">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} iconRight={<ArrowRight size={15} />}>
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#DDD5C4]" />
            <span className="text-xs text-ink-400">نئے ہیں؟</span>
            <div className="flex-1 h-px bg-[#DDD5C4]" />
          </div>

          <p className="text-center text-sm text-ink-600">
            New to Rasad?{' '}
            <Link to="/register" className="text-forest-700 font-semibold hover:text-forest-900 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
