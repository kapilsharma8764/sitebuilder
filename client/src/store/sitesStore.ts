import { create } from 'zustand'
import { api, ApiError, type SiteSummary } from '@/lib/api'

interface SitesState {
  sites: SiteSummary[] | null
  error: string
  busy: boolean
  load: () => Promise<void>
  refresh: () => Promise<void>
  remove: (id: string) => Promise<void>
  setBusy: (busy: boolean) => void
}

/**
 * The list of saved sites.
 *
 * In a store rather than in the page, matching how the enquiry inbox works:
 * components render and call actions, and nothing sets state from inside an
 * effect.
 */
export const useSitesStore = create<SitesState>()((set, get) => ({
  sites: null,
  error: '',
  busy: false,

  load: async () => {
    try {
      const sites = await api.listSites()
      set({ sites, error: '' })
    } catch (caught) {
      set({
        sites: [],
        error: caught instanceof ApiError ? caught.message : 'Could not load your sites',
      })
    }
  },

  refresh: async () => {
    set({ busy: true })
    await get().load()
    set({ busy: false })
  },

  remove: async (id) => {
    const previous = get().sites
    set({ sites: previous?.filter((site) => site.id !== id) ?? null })
    try {
      await api.deleteSite(id)
    } catch {
      set({ sites: previous })
      throw new Error('Could not delete that site')
    }
  },

  setBusy: (busy) => set({ busy }),
}))
