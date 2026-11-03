import { api } from './client'

export const ordersApi = {
  create:         (items)        => api.post('/orders/', { items }),
  myOrders:       ()             => api.get('/orders/my-orders'),
  supplierOrders: ()             => api.get('/orders/supplier-orders'),
  get:            (id)           => api.get(`/orders/${id}`),
  updateStatus:   (id, status)   => api.patch(`/orders/${id}/status`, { status }),
  cancel:         (id)           => api.patch(`/orders/${id}/cancel`),
}
