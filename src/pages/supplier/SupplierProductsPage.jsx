import { useState } from 'react'
import { Plus, Edit2, Trash2, Package, X } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProductImage from '../../components/ui/ProductImage'
import Input, { Select } from '../../components/ui/Input'
import { PRODUCTS, CATEGORIES } from '../../data/dummy'

const UNITS = ['meter', 'kg', 'dozen', 'carton', 'sq.ft', 'gross', 'piece']

function ProductFormModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: '', category: '', unit: 'meter', price: '', minOrder: '', stock: '' })
  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6 overflow-auto">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-earth-900 text-lg">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-earth-400 hover:text-earth-600"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <Input label="Product Name" placeholder="e.g. Premium Lawn Fabric" value={form.name} onChange={set('name')} required />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" value={form.category} onChange={set('category')}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Select>
            <Select label="Unit" value={form.unit} onChange={set('unit')}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Price (Rs)" type="number" placeholder="320" value={form.price} onChange={set('price')} min="1" />
            <Input label="Min. Order" type="number" placeholder="20" value={form.minOrder} onChange={set('minOrder')} min="1" />
            <Input label="Stock" type="number" placeholder="500" value={form.stock} onChange={set('stock')} min="0" />
          </div>
          <div>
            <label className="text-sm font-medium text-earth-700 block mb-1.5">Product Image (optional)</label>
            <div className="border-2 border-dashed border-linen-400 rounded-xl p-6 text-center text-earth-400 text-sm hover:border-saffron-300 hover:text-saffron-500 transition-colors cursor-pointer">
              <Package size={24} className="mx-auto mb-1.5 opacity-50" />
              Click to upload image
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={() => { onSave(form); onClose() }} className="flex-1">
            {product ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function SupplierProductsPage() {
  const [products, setProducts] = useState(PRODUCTS.filter(p => p.supplier._id === 'sup1'))
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const handleSave = (form) => {
    if (editProduct) {
      setProducts(prev => prev.map(p => p._id === editProduct._id ? { ...p, ...form } : p))
    } else {
      setProducts(prev => [...prev, { ...form, _id: 'new-' + Date.now(), category: CATEGORIES.find(c => c._id === form.category) || CATEGORIES[0], supplier: { _id: 'sup1', businessName: 'Tariq Fabrics & Co.', market: 'Bolton Market' }, imageUrl: null }])
    }
  }

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) setProducts(prev => prev.filter(p => p._id !== id))
  }

  return (
    <Layout>
      {(showModal || editProduct) && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(null) }}
          onSave={handleSave}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-earth-900">My Products</h1>
            <p className="text-earth-500 text-sm">{products.length} products listed</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setShowModal(true)}>Add Product</Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-linen-200 flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-earth-400" />
            </div>
            <h3 className="font-display text-xl font-semibold text-earth-700 mb-2">No products yet</h3>
            <p className="text-earth-500 text-sm mb-5">Add your first product to start receiving orders.</p>
            <Button icon={<Plus size={15} />} onClick={() => setShowModal(true)}>Add First Product</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(p => (
              <Card key={p._id} padding={false} className="overflow-hidden flex flex-col">
                <div className="aspect-[16/9] overflow-hidden">
                  <ProductImage imageUrl={p.imageUrl} category={p.category} iconSize="text-4xl" />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-earth-800 text-sm leading-snug line-clamp-2">{p.name}</h3>
                    <Badge variant="default" className="shrink-0 text-[10px]">{typeof p.category === 'object' ? p.category.name : p.category}</Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-bold text-lg text-earth-900">Rs {p.price.toLocaleString()}</span>
                    <span className="text-xs text-earth-400">/{p.unit}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-earth-500">
                    <span>Min: <strong className="text-earth-700">{p.minOrder}</strong></span>
                    <span>Stock: <strong className={Number(p.stock) < 50 ? 'text-burgundy-600' : 'text-mgreen-600'}>{Number(p.stock).toLocaleString()}</strong></span>
                  </div>
                  <div className="flex gap-2 mt-auto pt-2 border-t border-linen-200">
                    <Button variant="secondary" size="sm" icon={<Edit2 size={13} />} className="flex-1" onClick={() => setEditProduct(p)}>Edit</Button>
                    <Button variant="ghost" size="sm" icon={<Trash2 size={13} />} className="text-burgundy-500 hover:bg-burgundy-50" onClick={() => handleDelete(p._id)} />
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
