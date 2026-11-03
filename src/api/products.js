import { api } from './client'

export const productsApi = {
  list:   (params = {}) => {
    const qs = new URLSearchParams()
    if (params.category) qs.set('category', params.category)
    if (params.search)   qs.set('search',   params.search)
    const q = qs.toString()
    return api.get(`/products/${q ? '?' + q : ''}`)
  },
  get:    (id)    => api.get(`/products/${id}`),
  create: (fd)    => api.upload('/products/', fd),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id)    => api.delete(`/products/${id}`),
}
