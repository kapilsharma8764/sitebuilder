import { describe, it, expect } from 'vitest'
import { exportSiteToHTML } from './export-html'
import { buildFromDefinition } from '@/templates/build'
import { templateCards } from '@/templates/catalogue'
import { splitHeaderFooter, syncMenu } from '@/store/site-shape'
import { blockMetadata } from './block-metadata'
import { newId } from './id'
import type { SiteConfig } from '@/blocks/types'

/** A published site, shaped the way the editor shapes it before publishing. */
function publishedHtml(id = 'blackpine', options?: Parameters<typeof exportSiteToHTML>[1]) {
  const card = templateCards.find((c) => c.id === id)
  if (!card) throw new Error(`no template ${id}`)
  const config = syncMenu(splitHeaderFooter(buildFromDefinition(card)))
  return exportSiteToHTML(config, options)
}

describe('exportSiteToHTML', () => {
  it('produces a complete document', () => {
    const html = publishedHtml()
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('</html>')
  })

  it('includes the shared header and footer around the page', () => {
    // The header and footer live outside the page's block list, so publishing
    // has to put them back or every published site loses its navigation.
    const html = publishedHtml()
    const nav = html.indexOf('<nav')
    const footer = html.lastIndexOf('<footer')
    expect(nav, 'no header in the published page').toBeGreaterThan(-1)
    expect(footer, 'no footer in the published page').toBeGreaterThan(nav)
  })

  it('wires the contact form to the enquiry endpoint', () => {
    const html = publishedHtml('blackpine', {
      leadsEndpoint: 'http://localhost:8001/api/leads',
      siteId: 'site-123',
    })
    expect(html).toContain('data-enquiry-form')
    expect(html).toContain('http://localhost:8001/api/leads')
    expect(html).toContain('data-site="site-123"')
    // The old markup swallowed the submit and did nothing.
    expect(html).not.toContain('onsubmit="return false"')
  })

  it('names the form fields the API expects', () => {
    const html = publishedHtml('blackpine', { leadsEndpoint: '/api/leads' })
    for (const field of ['name="name"', 'name="phone"', 'name="email"', 'name="message"']) {
      expect(html, `form is missing ${field}`).toContain(field)
    }
  })

  it('applies a section’s styling to the published markup', () => {
    const card = templateCards[0]
    const config = syncMenu(splitHeaderFooter(buildFromDefinition(card)))
    const [first] = config.blocks
    first.style = { background: '#123456', paddingTop: 88 }

    const html = exportSiteToHTML(config)
    expect(html).toContain('background:#123456')
    expect(html).toContain('padding-top:88px')
  })

  it('leaves out a hidden section', () => {
    const card = templateCards.find((c) => c.id === 'blackpine')!
    const config = syncMenu(splitHeaderFooter(buildFromDefinition(card)))
    const faq = config.blocks.find((b) => b.type === 'faq')
    expect(faq, 'expected this template to have an FAQ').toBeTruthy()

    const before = exportSiteToHTML(config)
    faq!.style = { hidden: true }
    const after = exportSiteToHTML(config)

    expect(after.length).toBeLessThan(before.length)
  })

  it('knows how to publish every widget in the library', () => {
    // The failure this guards against is quiet and nasty: a widget appears in
    // the editor, the owner builds a page around it, and it is simply missing
    // from the published site.
    for (const meta of blockMetadata) {
      const config: SiteConfig = {
        name: 'Coverage',
        blocks: [
          {
            id: newId('block'),
            type: meta.type,
            variant: meta.variants[0],
            props: { ...meta.defaultProps },
          },
        ],
      }
      const html = exportSiteToHTML(config)
      expect(html, `${meta.type} is not rendered when publishing`).not.toContain(
        `Unknown block type: ${meta.type}`,
      )
    }
  })

  it('publishes the hero photograph', () => {
    // The layout that leads with a photo is the one most templates use, and
    // an export that dropped the image would leave a dark empty band.
    const card = templateCards.find((c) => c.id === 'saffron')!
    const config = syncMenu(splitHeaderFooter(buildFromDefinition(card)))
    const hero = config.blocks.find((b) => b.type === 'hero')
    expect(hero?.props.image, 'template hero has no photo').toBeTruthy()

    const html = exportSiteToHTML(config)
    // Compared without the query string: the ampersands in it are escaped in
    // the markup, which is correct and would make a literal match fail.
    const photoPath = String(hero?.props.image).split('?')[0]
    expect(html).toContain(photoPath)
  })

  it('renders every template without throwing', () => {
    for (const card of templateCards) {
      const config = syncMenu(splitHeaderFooter(buildFromDefinition(card)))
      expect(() => exportSiteToHTML(config), `${card.id} failed to export`).not.toThrow()
    }
  })
})
