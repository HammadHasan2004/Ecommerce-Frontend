import { useState, useEffect } from 'react'
import { MapPin, Store, FileText, Check } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'
import Stars from '../../components/ui/Stars'
import { PageLoader, PageError } from '../../components/ui/PageState'
import { suppliersApi } from '../../api/suppliers'

export default function BusinessProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ businessName: '', market: '', address: '', bio: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    suppliersApi.me()
      .then(data => {
        setProfile(data)
        setForm({
          businessName: data.businessName || '',
          market: data.market || '',
          address: data.address || '',
          bio: data.bio || '',
        })
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleSave = async () => {
    setSaving(true); setSaveError('')
    try {
      const updated = await suppliersApi.update(form)
      setProfile(prev => ({ ...prev, ...updated }))
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <PageLoader label="Loading profile…" />
      </div>
    </Layout>
  )
  if (error) return <Layout><div className="max-w-2xl mx-auto px-4 py-10"><PageError message={error} /></div></Layout>
  if (!profile) return null

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-widest">Supplier</span>
            <span className="h-px w-8 bg-[#DDD5C4]" />
            <span className="font-urdu text-forest-700 text-xs" dir="rtl">پروفائل</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-950">Business Profile</h1>
          <p className="text-ink-500 text-sm mt-0.5">How buyers see your business on the marketplace</p>
        </div>

        {saved && (
          <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-forest-50 border border-forest-200 rounded-xl text-sm text-forest-700">
            <Check size={16} /> Profile updated — شکریہ
          </div>
        )}

        <div className="mb-5 p-3.5 bg-[#F5EFE4] border border-[#E8E0D2] rounded-xl text-xs text-ink-500 flex items-center gap-2">
          <Store size={13} /> This is how buyers see your profile on the marketplace
        </div>

        {/* Public preview card */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-display font-bold text-2xl shrink-0">
              {form.businessName[0] || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl text-ink-950">{form.businessName}</h2>
              <div className="flex items-center gap-1 text-sm text-ink-500 mt-0.5">
                <MapPin size={12} /> {form.address || form.market}
              </div>
              {(profile.averageRating > 0) && (
                <div className="flex items-center gap-2 mt-2">
                  <Stars rating={profile.averageRating} size={13} />
                  <span className="text-sm font-semibold text-ink-700">{profile.averageRating}</span>
                  <span className="text-xs text-ink-400">({profile.totalReviews} reviews)</span>
                </div>
              )}
              {form.bio && (
                <p className="text-sm text-ink-600 mt-2 leading-relaxed">{form.bio}</p>
              )}
            </div>
          </div>
        </Card>

        {editing ? (
          <Card>
            <h3 className="font-display font-semibold text-ink-800 text-base mb-5">Edit Business Information</h3>
            <div className="space-y-4">
              <Input label="Business Name" value={form.businessName} onChange={set('businessName')} icon={<Store size={14} />} />
              <Input label="Market / Area" placeholder="e.g. Bolton Market" value={form.market} onChange={set('market')} icon={<MapPin size={14} />} />
              <Input label="Full Address" placeholder="Shop number, street, area" value={form.address} onChange={set('address')} icon={<MapPin size={14} />} />
              <Textarea label="Business Bio" placeholder="Tell buyers about your business, products, and specialties..." value={form.bio} onChange={set('bio')} rows={4} icon={<FileText size={14} />} />
            </div>
            {saveError && (
              <div className="mt-3 p-3 bg-rust-50 border border-rust-200 rounded-lg text-xs text-rust-700">{saveError}</div>
            )}
            <div className="flex gap-3 mt-5">
              <Button variant="secondary" onClick={() => { setEditing(false); setSaveError('') }} className="flex-1">Cancel</Button>
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
                <div className="flex items-center gap-2 text-xs font-medium text-ink-500 mb-0.5">
                  {field.icon} {field.label}
                </div>
                <div className="text-sm text-ink-800">{field.value || <span className="text-ink-300">—</span>}</div>
              </Card>
            ))}
            <Button onClick={() => setEditing(true)} fullWidth variant="outline" size="lg">Edit Profile</Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
