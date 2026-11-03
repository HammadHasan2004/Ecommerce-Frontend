import { api } from './client'

export const reviewsApi = {
  list:   (supplierId)           => api.get(`/reviews/${supplierId}`),
  create: (supplierId, data)     => api.post(`/reviews/${supplierId}`, data),
}
