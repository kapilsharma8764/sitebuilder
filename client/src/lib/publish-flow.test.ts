import { describe, it, expect, beforeAll } from 'vitest'
import { API_URL, api, leadsEndpoint } from './api'
import { exportSiteToHTML } from './export-html'
import { buildFromDefinition } from '@/templates/build'
import { templateCards } from '@/templates/catalogue'
import { splitHeaderFooter, syncMenu } from '@/store/site-shape'
import { applyProfile } from '@/onboarding/apply-profile'
import { emptyProfile } from '@/onboarding/profile'

/**
 * The whole publish loop against a running API: save a site, publish it, fetch
 * the public page, submit its contact form, and find the enquiry in the inbox.
 *
 * Skipped when the API is not running, so `npm test` still passes on a machine
 * with only the editor started, and in CI where the server is a separate job.
 */

let serverUp = false

beforeAll(async () => {
  try {
    await api.health()
    serverUp = true
  } catch {
    serverUp = false
  }
})

describe('publish flow', () => {
  it('takes a template from the gallery to a live page with a working form', async ({ skip }) => {
    if (!serverUp) skip(`No API at ${API_URL} — start the server to run this`)

    const profile = {
      ...emptyProfile,
      category: 'business' as const,
      audience: 'b2c' as const,
      name: `Test Business ${Date.now()}`,
      slogan: 'Testing the publish loop',
      contact: { ...emptyProfile.contact, mobile: '98765 43210', whatsapp: true },
    }

    const card = templateCards.find((c) => c.id === 'blade')!
    const config = syncMenu(splitHeaderFooter(applyProfile(buildFromDefinition(card), profile)))

    // 1. Save
    const site = await api.createSite({ name: profile.name, config, profile })
    expect(site.id).toBeTruthy()

    try {
      // 2. Publish the HTML the editor would render
      const html = exportSiteToHTML(config, { leadsEndpoint, siteId: site.id })
      const published = await api.publish(site.id, html)
      expect(published.url).toContain('/site/')

      // 3. The public page is really there, and carries the business's name
      const page = await fetch(published.url).then((response) => response.text())
      expect(page).toContain(profile.name)
      expect(page).toContain('data-enquiry-form')

      // 4. An enquiry from that page reaches the inbox
      const message = `Enquiry ${Date.now()}`
      const sent = await fetch(leadsEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          slug: published.slug,
          name: 'Ramesh',
          phone: '98765 43210',
          message,
        }),
      })
      expect(sent.ok).toBe(true)

      const leads = await api.listLeads(site.id)
      expect(leads.some((lead) => lead.message === message)).toBe(true)

      // 5. Republishing keeps the address the business already handed out
      const again = await api.publish(site.id, html)
      expect(again.slug).toBe(published.slug)
    } finally {
      await api.deleteSite(site.id)
    }
  })
})
