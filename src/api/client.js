// All requests go through /api (Vite proxies to http://localhost:8000)
const BASE = '/api/v1'

// Vercel's rewrite to the backend fails for trailing-slash URLs (it returns index.html),
// so strip the trailing slash from the path part, before any query string.
//   '/products/' -> '/products'   '/products/?search=x' -> '/products?search=x'
function buildUrl(path) {
  const qIndex = path.indexOf('?')
  const pathname = qIndex === -1 ? path : path.slice(0, qIndex)
  const query = qIndex === -1 ? '' : path.slice(qIndex)
  const cleaned = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return `${BASE}${cleaned}${query}`
}

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
  const res = await fetch(buildUrl('/users/refresh-token'), {
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

  const res = await fetch(buildUrl(path), {
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
    const retry = await fetch(buildUrl(path), {
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
