import { useState } from 'react'
import { MapPin, Store, FileText, Check } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'
import Stars from '../../components/ui/Stars'
import { SUPPLIERS } from '../../data/dummy'
import { useAuth } from '../../context/AuthContext'

export default function BusinessProfilePage() {
  const { user } = useAuth()
  const supplier = SUPPLIERS.find(s => s.user.username === user?.username) || SUPPLIERS[0]
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    businessName: supplier.businessName,
    market: supplier.market,
    address: supplier.address,
    bio: supplier.bio,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-earth-900">Business Profile</h1>
          <p className="text-earth-500 text-sm">How buyers see your business on the marketplace</p>
        </div>

        {saved && (
          <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-mgreen-50 border border-mgreen-200 rounded-xl text-sm text-mgreen-700">
            <Check size={16} /> Profile updated successfully
          </div>
        )}

        {/* Public preview card */}
        <div className="mb-6 p-4 bg-linen-200 border border-linen-300 rounded-xl text-xs text-earth-500 flex items-center gap-2">
          <Store size={13} /> This is how buyers see your profile
        </div>

        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-saffron-100 border border-saffron-200 flex items-center justify-center text-saffron-600 font-display font-bold text-2xl shrink-0">
              {form.businessName[0]}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-earth-900">{form.businessName}</h2>
              <div className="flex items-center gap-1 text-sm text-earth-500 mt-0.5">
                <MapPin size={12} /> {form.address}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Stars rating={supplier.averageRating} size={13} />
                <span className="text-sm font-semibold text-earth-700">{supplier.averageRating}</span>
                <span className="text-xs text-earth-400">({supplier.totalReviews} reviews)</span>
              </div>
              {form.bio && <p className="text-sm text-earth-600 mt-2 leading-relaxed">{form.bio}</p>}
            </div>
          </div>
        </Card>

        {/* Edit form */}
        {editing ? (
          <Card>
            <h3 className="font-display font-semibold text-earth-800 text-base mb-5">Edit Business Information</h3>
            <div className="space-y-4">
              <Input label="Business Name" value={form.businessName} onChange={set('businessName')} icon={<Store size={14} />} />
              <Input label="Market / Area" placeholder="e.g. Bolton Market" value={form.market} onChange={set('market')} icon={<MapPin size={14} />} />
              <Input label="Full Address" placeholder="Shop number, street, area" value={form.address} onChange={set('address')} icon={<MapPin size={14} />} />
              <Textarea label="Business Bio" placeholder="Tell buyers about your business, products, and specialties..." value={form.bio} onChange={set('bio')} rows={4} icon={<FileText size={14} />} />
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="secondary" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} loading={saving} className="flex-1">Save Changes</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Business Name', value: form.businessName, icon: <Store size={14} /> },
              { label: 'Market', value: form.market, icon: <MapPin size={14} /> },
              { label: 'Address', value: form.address, icon: <MapPin size={14} /> },
              { label: 'Bio', value: form.bio, icon: <FileText size={14} /> },
            ].map(field => (
              <Card key={field.label} className="!py-3 !px-4">
                <div className="flex items-center gap-2 text-xs font-medium text-earth-500 mb-0.5">
                  {field.icon} {field.label}
                </div>
                <div className="text-sm text-earth-800">{field.value || '—'}</div>
              </Card>
            ))}
            <Button onClick={() => setEditing(true)} fullWidth variant="outline" size="lg">Edit Profile</Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
