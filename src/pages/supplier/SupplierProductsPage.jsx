import { useState, useEffect, useRef } from 'react'
import { Plus, Edit2, Trash2, Package, X, ImagePlus } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProductImage from '../../components/ui/ProductImage'
import Input, { Select } from '../../components/ui/Input'
import { PageLoader, PageError } from '../../components/ui/PageState'
import { suppliersApi } from '../../api/suppliers'
import { productsApi } from '../../api/products'
import { categoriesApi } from '../../api/categories'

const UNITS = ['meter', 'kg', 'dozen', 'carton', 'sq.ft', 'gross', 'piece']

function ProductFormModal({ product, categories, onClose, onSave, saving, saveError }) {
  const isEdit = !!product
  const [form, setForm] = useState(
    isEdit
      ? { name: product.name, price: product.price, minOrder: product.minOrder, stock: product.stock }
      : { name: '', category: '', unit: 'meter', price: '', minOrder: '', stock: '' }
  )
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef()

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = () => {
    if (isEdit) {
      onSave({ id: product._id, data: { ...form } })
    } else {
      const fd = new FormData()
      if (form.name)     fd.append('name', form.name)
      if (form.category) fd.append('category', form.category)
      if (form.unit)     fd.append('unit', form.unit)
      if (form.price)    fd.append('price', form.price)
      if (form.minOrder) fd.append('minOrder', form.minOrder)
      if (form.stock)    fd.append('stock', form.stock)
      if (imageFile)     fd.append('image', imageFile)
      onSave({ fd })
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6 overflow-auto">
      <Card className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-semibold text-ink-950 text-lg">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="font-urdu text-forest-700 text-[11px]" dir="rtl">
              {isEdit ? 'مصنوعات میں ترمیم' : 'نئی مصنوعات شامل کریں'}
            </p>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <Input label="Product Name *" placeholder="e.g. Premium Lawn Fabric"
            value={form.name} onChange={set('name')} />

          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <Select label="Category *" value={form.category} onChange={set('category')}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </Select>
              <Select label="Unit *" value={form.unit} onChange={set('unit')}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </Select>
            </div>
          )}

          {isEdit && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[#F5EFE4] border border-[#E8E0D2] rounded-lg px-3 py-2">
                <div className="text-xs text-ink-400 mb-0.5">Category</div>
                <div className="font-medium text-ink-700">
                  {typeof product.category === 'object' ? product.category?.name : product.category || '—'}
                </div>
              </div>
              <div className="bg-[#F5EFE4] border border-[#E8E0D2] rounded-lg px-3 py-2">
                <div className="text-xs text-ink-400 mb-0.5">Unit</div>
                <div className="font-medium text-ink-700">{product.unit || '—'}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <Input label="Price (Rs) *" type="number" placeholder="320"
              value={form.price} onChange={set('price')} min="1" />
            <Input label="Min. Order *" type="number" placeholder="20"
              value={form.minOrder} onChange={set('minOrder')} min="1" />
            <Input label="Stock" type="number" placeholder="500"
              value={form.stock} onChange={set('stock')} min="0" />
          </div>

          {!isEdit && (
            <div>
              <label className="text-sm font-medium text-ink-700 block mb-1.5">
                Product Image <span className="text-ink-400 font-normal">(optional)</span>
              </label>
              <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleFile} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-[#DDD5C4] rounded-xl p-5 text-center hover:border-forest-400 hover:bg-forest-50 transition-colors cursor-pointer group"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="h-28 mx-auto rounded-lg object-cover" />
                ) : (
                  <div className="text-ink-400 group-hover:text-forest-600">
                    <ImagePlus size={24} className="mx-auto mb-1.5" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>

        {saveError && (
          <div className="mt-3 p-3 bg-rust-50 border border-rust-200 rounded-lg text-xs text-rust-700">
            {saveError}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} loading={saving} className="flex-1">
            {isEdit ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function SupplierProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    Promise.all([
      suppliersApi.me(),
      productsApi.list(),
      categoriesApi.list(),
    ]).then(([profile, allProducts, cats]) => {
      const myId = profile._id?.toString()
      const myProds = (Array.isArray(allProducts) ? allProducts : [])
        .filter(p => (p.supplier?._id?.toString() || p.supplier?.toString()) === myId)
      setProducts(myProds)
      setCategories(Array.isArray(cats) ? cats : [])
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async ({ id, data, fd }) => {
    setSaving(true); setSaveError('')
    try {
      if (id) {
        const updated = await productsApi.update(id, data)
        setProducts(prev => prev.map(p => p._id === id ? { ...p, ...updated } : p))
      } else {
        const created = await productsApi.create(fd)
        setProducts(prev => [created, ...prev])
      }
      setShowModal(false)
      setEditProduct(null)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    try {
      await productsApi.delete(id)
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const closeModal = () => { setShowModal(false); setEditProduct(null); setSaveError('') }

  if (loading) return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <PageLoader label="Loading products…" />
      </div>
    </Layout>
  )

  return (
    <Layout>
      {(showModal || editProduct) && (
        <ProductFormModal
          product={editProduct}
          categories={categories}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
          saveError={saveError}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-widest">Supplier</span>
              <span className="h-px w-8 bg-[#DDD5C4]" />
              <span className="font-urdu text-forest-700 text-xs" dir="rtl">مصنوعات</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-ink-950">My Products</h1>
            <p className="text-ink-500 text-sm mt-0.5">{products.length} product{products.length !== 1 ? 's' : ''} listed</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setShowModal(true)}>
            Add Product
          </Button>
        </div>

        {error && <PageError message={error} />}

        {!error && products.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#EDE5D8] flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-ink-400" />
            </div>
            <h3 className="font-display text-xl font-semibold text-ink-700 mb-2">No products yet</h3>
            <p className="font-urdu text-forest-600 text-sm mb-1" dir="rtl">ابھی تک کوئی مصنوعات نہیں</p>
            <p className="text-ink-400 text-sm mb-5">Add your first product to start receiving orders.</p>
            <Button icon={<Plus size={15} />} onClick={() => setShowModal(true)}>
              Add First Product
            </Button>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(p => (
              <Card key={p._id} padding={false} className="overflow-hidden flex flex-col">
                <div className="aspect-[16/9] overflow-hidden">
                  <ProductImage imageUrl={p.imageUrl} category={p.category} iconSize="text-4xl" />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ink-800 text-sm leading-snug line-clamp-2">{p.name}</h3>
                    <Badge variant="default" className="shrink-0 text-[10px]">
                      {typeof p.category === 'object' ? p.category?.name : p.category}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-bold text-lg text-ink-950">
                      Rs {Number(p.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-ink-400">/{p.unit}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-ink-500">
                    <span>Min: <strong className="text-ink-700">{p.minOrder}</strong></span>
                    <span>Stock: <strong className={Number(p.stock) < 50 ? 'text-rust-600' : 'text-forest-600'}>{Number(p.stock).toLocaleString()}</strong></span>
                  </div>
                  <div className="flex gap-2 mt-auto pt-2 border-t border-[#EDE5D8]">
                    <Button variant="secondary" size="sm" icon={<Edit2 size={13} />} className="flex-1"
                      onClick={() => setEditProduct(p)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" icon={<Trash2 size={13} />}
                      className="text-rust-500 hover:bg-rust-50 hover:text-rust-700"
                      onClick={() => handleDelete(p._id)} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
