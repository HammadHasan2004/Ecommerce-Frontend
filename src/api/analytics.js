import { api } from './client'

export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),
}
