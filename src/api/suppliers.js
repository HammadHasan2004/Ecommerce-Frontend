import { api } from './client'

export const suppliersApi = {
  me:         ()       => api.get('/suppliers/me'),
  create:     (data)   => api.post('/suppliers/', data),
  update:     (data)   => api.patch('/suppliers/', data),
  getById:    (id)     => api.get(`/suppliers/${id}`),
}
