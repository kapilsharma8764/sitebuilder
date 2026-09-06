import { useState } from 'react'
import { toast } from 'sonner'
import { exportSiteToHTML } from '@/lib/export-html'
import { api, ApiError, leadsEndpoint } from '@/lib/api'
import { useConfigStore } from '@/store/configStore'
import { useBusinessStore } from '@/store/businessStore'
import { usePublishStore } from '@/store/publishStore'

/**
 * Putting the site online.
 *
 * The HTML is rendered here, in the browser, by the same code that draws the
 * editor canvas — so what gets published is what the user was looking at. The
 * server only stores the finished file and hands back an address.
 */
export function usePublish() {
  const [busy, setBusy] = useState(false)
  const config = useConfigStore((s) => s.config)
  const profile = useBusinessStore((s) => s.profile)
  const { siteId, setSite, setPublished, url, slug, publishedAt } = usePublishStore()

  async function publish() {
    setBusy(true)
    try {
      const name = profile.name.trim() || config.name || 'My Website'

      // First publish creates the site record; later ones update it, which is
      // what keeps the public address stable across republishes.
      let id = siteId
      if (id) {
        await api.saveSite(id, { name, config, profile })
      } else {
        const created = await api.createSite({ name, config, profile })
        id = created.id
        setSite(id)
      }

      const html = exportSiteToHTML(config, { leadsEndpoint, siteId: id })
      const result = await api.publish(id, html)
      setPublished(result)

      toast.success('Your site is live')
      return result
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Could not publish. Please try again.'
      toast.error(message)
      return null
    } finally {
      setBusy(false)
    }
  }

  return { publish, busy, url, slug, publishedAt }
}
