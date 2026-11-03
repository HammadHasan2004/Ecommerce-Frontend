// All requests go through /api (Vite proxies to http://localhost:8000)
const BASE = '/api/v1'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

// Single in-flight refresh promise so parallel 401s don't trigger multiple refreshes
let refreshPromise = null

async function doRefresh() {
  const res = await fetch(`${BASE}/users/refresh-token`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) {
    // Refresh failed — notify app to log out
    window.dispatchEvent(new CustomEvent('rasad:auth-expired'))
    throw new ApiError('Session expired', 401)
  }
}

async function execute(path, opts = {}) {
  const { body, formData: fd, ...rest } = opts
  const headers = {}
  if (body && !fd) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    credentials: 'include',
    headers,
    body: fd ? fd : body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    // Try one silent refresh
    if (!refreshPromise) refreshPromise = doRefresh().finally(() => { refreshPromise = null })
    try {
      await refreshPromise
    } catch {
      throw new ApiError('Session expired — please log in again', 401)
    }

    // Retry original request
    const retry = await fetch(`${BASE}${path}`, {
      ...rest,
      credentials: 'include',
      headers,
      body: fd ? fd : body ? JSON.stringify(body) : undefined,
    })
    if (!retry.ok) {
      const payload = await retry.json().catch(() => ({}))
      throw new ApiError(payload.message || 'Request failed', retry.status)
    }
    if (retry.status === 204) return null
    const json = await retry.json()
    return json.data ?? json
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}))
    throw new ApiError(payload.message || 'Request failed', res.status)
  }

  if (res.status === 204) return null
  const json = await res.json()
  return json.data ?? json
}

export const api = {
  get:    (path, opts)        => execute(path, { method: 'GET',    ...opts }),
  post:   (path, body, opts)  => execute(path, { method: 'POST',   body, ...opts }),
  patch:  (path, body, opts)  => execute(path, { method: 'PATCH',  body, ...opts }),
  delete: (path, opts)        => execute(path, { method: 'DELETE', ...opts }),
  upload: (path, fd, opts)    => execute(path, { method: 'POST',   formData: fd, ...opts }),
  uploadPatch: (path, fd, opts) => execute(path, { method: 'PATCH', formData: fd, ...opts }),
}
