/**
 * Talking to the SiteBuilder API.
 *
 * Every call funnels through `request` so failures surface as a readable
 * sentence rather than "TypeError: fetch failed". The most likely failure by
 * far is that the server simply is not running, and the message says so.
 */

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8001'

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'content-type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiError(`Cannot reach the server at ${API_URL}. Is it running?`)
  }

  if (response.status === 204) return undefined as T

  const text = await response.text()
  const body = text ? (JSON.parse(text) as unknown) : undefined

  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : `Request failed (${response.status})`
    throw new ApiError(message, response.status)
  }

  return body as T
}

export interface SiteSummary {
  id: string
  name: string
  slug: string | null
  published: boolean
  publishedAt?: string
  updatedAt: string
  sectionCount: number
}

export interface SiteRecord extends SiteSummary {
  config: unknown
  profile: unknown
}

export interface Lead {
  id: string
  createdAt: string
  siteId: string | null
  slug: string | null
  name: string
  email: string
  phone: string
  message: string
  status: 'new' | 'contacted' | 'won' | 'lost'
  note?: string
}

export const api = {
  health: () => request<{ ok: boolean }>('/api/health'),

  listSites: () => request<SiteSummary[]>('/api/sites'),
  getSite: (id: string) => request<SiteRecord>(`/api/sites/${id}`),
  createSite: (body: { name: string; config: unknown; profile?: unknown }) =>
    request<SiteRecord>('/api/sites', { method: 'POST', body: JSON.stringify(body) }),
  saveSite: (id: string, body: { name?: string; config?: unknown; profile?: unknown }) =>
    request<SiteRecord>(`/api/sites/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteSite: (id: string) => request<void>(`/api/sites/${id}`, { method: 'DELETE' }),

  publish: (id: string, html: string) =>
    request<{ slug: string; url: string; publishedAt: string }>(`/api/sites/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify({ html }),
    }),
  unpublish: (id: string) =>
    request<{ published: boolean }>(`/api/sites/${id}/unpublish`, { method: 'POST' }),

  listLeads: (siteId?: string) =>
    request<Lead[]>(`/api/leads${siteId ? `?siteId=${encodeURIComponent(siteId)}` : ''}`),
  updateLead: (id: string, changes: { status?: Lead['status']; note?: string }) =>
    request<Lead>(`/api/leads/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteLead: (id: string) => request<void>(`/api/leads/${id}`, { method: 'DELETE' }),
}

/** Where a published page should send its enquiries. */
export const leadsEndpoint = `${API_URL}/api/leads`
