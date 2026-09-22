import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Store, ArrowRight, SkipForward } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ businessName: '', market: '', address: '', bio: '' })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.businessName.trim()) e.businessName = 'Required'
    if (!form.market.trim()) e.market = 'Required'
    if (!form.address.trim()) e.address = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    navigate('/supplier/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center">
            <span className="text-amber-400 font-display font-bold text-base leading-none">ر</span>
          </div>
          <div>
            <div className="font-display font-bold text-ink-950 text-lg leading-none">Rasad</div>
            <div className="font-urdu text-forest-700 text-[10px]" dir="rtl">رسد</div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-ink-950 font-bold leading-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
            Complete your<br />business profile
          </h1>
          <p className="font-urdu text-forest-700 text-sm mt-1" dir="rtl">اپنا کاروباری پروفائل مکمل کریں</p>
          <p className="text-ink-500 text-sm mt-3 leading-relaxed">
            This appears on your public profile and helps buyers find and trust your business.
          </p>
        </div>

        <div className="bg-[#FEFCF8] border border-[#E8E0D2] rounded-xl p-6 space-y-4">
          <Input label="Business Name *" placeholder="e.g. Tariq Fabrics & Co."
            value={form.businessName} onChange={set('businessName')} icon={<Store size={13} />} error={errors.businessName} />
          <Input label="Market / Area *" placeholder="e.g. Bolton Market, Jodia Bazar"
            value={form.market} onChange={set('market')} icon={<MapPin size={13} />} error={errors.market} />
          <Input label="Full Address *" placeholder="Shop No., Street, Area, Karachi"
            value={form.address} onChange={set('address')} icon={<MapPin size={13} />} error={errors.address} />
          <Textarea label="Business Bio (optional)"
            placeholder="Your products, years in business, specialties..."
            value={form.bio} onChange={set('bio')} rows={3} />
        </div>

        <div className="flex gap-3 mt-5">
          <Button variant="secondary" onClick={() => navigate('/supplier/dashboard')}
            icon={<SkipForward size={14} />} className="flex-1">
            Skip for now
          </Button>
          <Button onClick={handleSave} loading={saving}
            iconRight={<ArrowRight size={14} />} className="flex-1">
            Save Profile
          </Button>
        </div>

        <p className="text-center text-xs text-ink-400 mt-4">
          Skipping will prompt again on your next login until saved.
        </p>
      </div>
    </div>
  )
}
