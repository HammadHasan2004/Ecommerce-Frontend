import { api } from './client'

export const ordersApi = {
  create:         (items, deliveryAddress, paymentMethod = 'cod') => api.post('/orders/', { items, deliveryAddress, paymentMethod }),
  myOrders:       ()             => api.get('/orders/my-orders'),
  supplierOrders: ()             => api.get('/orders/supplier-orders'),
  get:            (id)           => api.get(`/orders/${id}`),
  updateStatus:   (id, status, extra = {}) => api.patch(`/orders/${id}/status`, { status, ...extra }),
  cancel:         (id)           => api.patch(`/orders/${id}/cancel`),
  verifyPayment:  (id, txHash)   => api.post(`/orders/${id}/verify-payment`, { txHash }),
}
