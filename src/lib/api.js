import { supabase } from './supabase.js'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    headers,
    ...options,
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    const err = new Error(body?.error || `Request failed (${res.status})`)
    err.status = res.status
    err.code = body?.error
    throw err
  }
  return body
}

export { request }

// ── Auth ──

export function getMe() {
  return request('/auth/me')
}

export function logout() {
  return request('/auth/logout', { method: 'POST' })
}

// ── Admin — Users ──

export function listUsers({ search = '', sort = 'created_at', dir = 'desc', page = 1, pageSize = 50, signal } = {}) {
  const qs = new URLSearchParams({ sort, dir, page: String(page), pageSize: String(pageSize) })
  if (search) qs.set('search', search)
  return request(`/admin/users?${qs.toString()}`, { signal })
}

export function getUser(id) {
  return request(`/admin/users/${id}`)
}

// ── Admin — System ──

export function getSystemStats() {
  return request('/admin/stats')
}

export function getSystemLogs({ page = 1, pageSize = 50, signal } = {}) {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  return request(`/admin/logs?${qs.toString()}`, { signal })
}

// ── Admin — Templates ──

export function listTemplates({ search = '', sort = 'updated_at', dir = 'desc', page = 1, pageSize = 50, signal } = {}) {
  const qs = new URLSearchParams({ sort, dir, page: String(page), pageSize: String(pageSize) })
  if (search) qs.set('search', search)
  return request(`/admin/templates?${qs.toString()}`, { signal })
}

// ── Admin — Lists ──

export function listAdminLists({ search = '', sort = 'created_at', dir = 'desc', page = 1, pageSize = 50, signal } = {}) {
  const qs = new URLSearchParams({ sort, dir, page: String(page), pageSize: String(pageSize) })
  if (search) qs.set('search', search)
  return request(`/admin/lists?${qs.toString()}`, { signal })
}

export function getListRecipients(listId, { filter = 'all', search = '', sort = 'row_number', dir = 'asc', page = 1, pageSize = 50, signal } = {}) {
  const qs = new URLSearchParams({ filter, sort, dir, page: String(page), pageSize: String(pageSize) })
  if (search) qs.set('search', search)
  return request(`/admin/lists/${listId}/recipients?${qs.toString()}`, { signal })
}
