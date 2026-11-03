import { api } from './client'

export const authApi = {
  register: (data)       => api.post('/users/register', data),
  login:    (data)       => api.post('/users/login', data),
  logout:   ()           => api.post('/users/logout'),
  refresh:  ()           => api.post('/users/refresh-token'),
}
