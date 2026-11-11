import { api } from './client'

export const ordersApi = {
  create:         (items, deliveryAddress) => api.post('/orders/', { items, deliveryAddress }),
  myOrders:       ()             => api.get('/orders/my-orders'),
  supplierOrders: ()             => api.get('/orders/supplier-orders'),
  get:            (id)           => api.get(`/orders/${id}`),
  updateStatus:   (id, status, extra = {}) => api.patch(`/orders/${id}/status`, { status, ...extra }),
  cancel:         (id)           => api.patch(`/orders/${id}/cancel`),
}
