import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', fullname: '', email: '', password: '', role: 'buyer' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.username.trim() || form.username.length < 3) e.username = 'Min. 3 characters'
    if (!form.fullname.trim()) e.fullname = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Min. 6 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setDone(true)
  }

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  if (done) {
    return (
      <div className="min-h-screen bg-[#F5EFE4] flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <CheckCircle2 size={52} className="text-forest-600 mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="font-display text-3xl font-bold text-ink-950 mb-2">Account created</h2>
          <p className="font-urdu text-forest-700 text-sm mb-1" dir="rtl">کھاتہ بن گیا</p>
          <p className="text-ink-500 text-sm mt-3 mb-8">
            Welcome, <strong className="text-ink-900">{form.fullname}</strong>. Please sign in to continue.
          </p>
          <Button onClick={() => navigate('/login')} size="lg" fullWidth iconRight={<ArrowRight size={15} />}>
            Go to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4] flex flex-col lg:flex-row">
      {/* Left panel */}
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
          <h2 className="font-display text-white text-4xl font-bold leading-tight mb-6">
            Join the marketplace
          </h2>

          <div className="space-y-4">
            {[
              {
                role: 'Buyer', urdu: 'خریدار',
                desc: 'Browse wholesale fabric, leather, thread & packaging from verified Karachi suppliers.',
              },
              {
                role: 'Supplier', urdu: 'فروشندہ',
                desc: 'List your products and reach hundreds of tailors, bag makers, and home manufacturers.',
              },
            ].map(item => (
              <div key={item.role} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-white text-sm">{item.role}</span>
                  <span className="font-urdu text-forest-400 text-xs" dir="rtl">{item.urdu}</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center">
              <span className="text-amber-400 font-display font-bold text-base leading-none">ر</span>
            </div>
            <div className="font-display font-bold text-ink-950 text-lg leading-none">Rasad</div>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-ink-950 font-bold leading-tight mb-1" style={{fontSize: 'clamp(2rem, 5vw, 2.75rem)'}}>
              Create account
            </h1>
            <p className="font-urdu text-forest-700 text-sm" dir="rtl">کھاتہ بنائیں</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="text-[13px] font-semibold text-ink-700 tracking-wide uppercase block mb-2">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: 'buyer',    label: 'Buy Materials',  urdu: 'خریدار', sub: 'Manufacturers & makers' },
                  { value: 'supplier', label: 'Sell Materials', urdu: 'فروشندہ', sub: 'Wholesalers & traders' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: opt.value }))}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all duration-150 ${
                      form.role === opt.value
                        ? 'border-forest-700 bg-forest-50'
                        : 'border-[#DDD5C4] bg-[#FEFCF8] hover:border-ink-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${form.role === opt.value ? 'text-forest-800' : 'text-ink-800'}`}>
                        {opt.label}
                      </span>
                      <span className="font-urdu text-[11px] text-forest-600" dir="rtl">{opt.urdu}</span>
                    </div>
                    <span className="text-xs text-ink-500">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Thin rule */}
            <div className="h-px bg-[#DDD5C4]" />

            <div className="grid grid-cols-2 gap-3">
              <Input label="Username" placeholder="your_handle" value={form.username} onChange={set('username')} icon={<User size={13} />} error={errors.username} />
              <Input label="Full Name" placeholder="Full Name" value={form.fullname} onChange={set('fullname')} error={errors.fullname} />
            </div>
            <Input label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} icon={<Mail size={13} />} error={errors.email} />
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set('password')}
              icon={<Lock size={13} />}
              error={errors.password}
              iconRight={
                <button type="button" onClick={() => setShowPw(!showPw)} className="cursor-pointer">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              }
            />

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} iconRight={<ArrowRight size={15} />}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-ink-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-forest-700 font-semibold hover:text-forest-900 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
