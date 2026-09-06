import express from 'express'
import cors from 'cors'
import { get, insert, list, remove, update } from './store.js'
import { uniqueSlug } from './slug.js'

/**
 * The API behind the builder: saving a site, publishing it to a public
 * address, and collecting the enquiries that come back from it.
 */

const PORT = Number(process.env.PORT ?? 8001)
const app = express()

app.use(cors({ origin: true, credentials: true }))
// Sites carry their whole block tree, which is comfortably larger than the
// default limit once a template with photographs is in it.
app.use(express.json({ limit: '8mb' }))

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// ── Sites ──────────────────────────────────────────────────────────────────

app.get(
  '/api/sites',
  asyncRoute(async (_req, res) => {
    const sites = await list('sites')
    // The block tree is large and the list only needs headings.
    res.json(
      sites.map(({ config, ...rest }) => ({
        ...rest,
        sectionCount: Array.isArray(config?.blocks) ? config.blocks.length : 0,
      })),
    )
  }),
)

app.get(
  '/api/sites/:id',
  asyncRoute(async (req, res) => {
    const site = await get('sites', req.params.id)
    if (!site) return res.status(404).json({ error: 'No such site' })
    res.json(site)
  }),
)

app.post(
  '/api/sites',
  asyncRoute(async (req, res) => {
    const { name, config, profile } = req.body ?? {}
    if (!config) return res.status(400).json({ error: 'A site needs a config' })
    const site = await insert('sites', {
      name: name || config.name || 'My Website',
      config,
      profile: profile ?? null,
      published: false,
      slug: null,
    })
    res.status(201).json(site)
  }),
)

app.put(
  '/api/sites/:id',
  asyncRoute(async (req, res) => {
    const { name, config, profile } = req.body ?? {}
    const site = await update('sites', req.params.id, {
      ...(name === undefined ? {} : { name }),
      ...(config === undefined ? {} : { config }),
      ...(profile === undefined ? {} : { profile }),
    })
    if (!site) return res.status(404).json({ error: 'No such site' })
    res.json(site)
  }),
)

app.delete(
  '/api/sites/:id',
  asyncRoute(async (req, res) => {
    const removed = await remove('sites', req.params.id)
    if (!removed) return res.status(404).json({ error: 'No such site' })
    res.status(204).end()
  }),
)

// ── Publishing ─────────────────────────────────────────────────────────────

/**
 * The client renders the HTML — it owns the one renderer that also draws the
 * canvas — and posts the finished file here. That is what keeps a published
 * page identical to what the user was looking at.
 */
app.post(
  '/api/sites/:id/publish',
  asyncRoute(async (req, res) => {
    const { html } = req.body ?? {}
    if (typeof html !== 'string' || !html.trim()) {
      return res.status(400).json({ error: 'Nothing to publish' })
    }

    const site = await get('sites', req.params.id)
    if (!site) return res.status(404).json({ error: 'No such site' })

    const sites = await list('sites')
    const slug = site.slug ?? uniqueSlug(site.name, sites, site.id)

    const published = await update('sites', site.id, {
      slug,
      html,
      published: true,
      publishedAt: new Date().toISOString(),
    })

    res.json({
      slug,
      url: `${req.protocol}://${req.get('host')}/site/${slug}`,
      publishedAt: published.publishedAt,
    })
  }),
)

app.post(
  '/api/sites/:id/unpublish',
  asyncRoute(async (req, res) => {
    const site = await update('sites', req.params.id, { published: false })
    if (!site) return res.status(404).json({ error: 'No such site' })
    res.json({ published: false })
  }),
)

/** The public page. This is the address a business hands to a customer. */
app.get(
  '/site/:slug',
  asyncRoute(async (req, res) => {
    const sites = await list('sites')
    const site = sites.find((row) => row.slug === req.params.slug && row.published)
    if (!site?.html) {
      return res
        .status(404)
        .type('html')
        .send('<!doctype html><meta charset="utf-8"><title>Not found</title><p>No site here yet.</p>')
    }
    res.type('html').send(site.html)
  }),
)

// ── Enquiries ──────────────────────────────────────────────────────────────

/**
 * Where a published site's contact form posts.
 *
 * Kept deliberately forgiving about which fields arrive: a form the owner
 * edited should still deliver the enquiry rather than reject it.
 */
app.post(
  '/api/leads',
  asyncRoute(async (req, res) => {
    const { siteId, slug, name, email, phone, message, ...rest } = req.body ?? {}

    if (!name && !email && !phone && !message) {
      return res.status(400).json({ error: 'The enquiry was empty' })
    }

    const lead = await insert('leads', {
      siteId: siteId ?? null,
      slug: slug ?? null,
      name: name ?? '',
      email: email ?? '',
      phone: phone ?? '',
      message: message ?? '',
      extra: rest,
      status: 'new',
    })

    res.status(201).json({ id: lead.id, received: true })
  }),
)

app.get(
  '/api/leads',
  asyncRoute(async (req, res) => {
    const filter = req.query.siteId ? { siteId: String(req.query.siteId) } : {}
    const leads = await list('leads', filter)
    // Newest first — an enquiry inbox is read from the top.
    leads.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    res.json(leads)
  }),
)

app.patch(
  '/api/leads/:id',
  asyncRoute(async (req, res) => {
    const { status, note } = req.body ?? {}
    const allowed = ['new', 'contacted', 'won', 'lost']
    if (status !== undefined && !allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of ${allowed.join(', ')}` })
    }
    const lead = await update('leads', req.params.id, {
      ...(status === undefined ? {} : { status }),
      ...(note === undefined ? {} : { note }),
    })
    if (!lead) return res.status(404).json({ error: 'No such enquiry' })
    res.json(lead)
  }),
)

app.delete(
  '/api/leads/:id',
  asyncRoute(async (req, res) => {
    const removed = await remove('leads', req.params.id)
    if (!removed) return res.status(404).json({ error: 'No such enquiry' })
    res.status(204).end()
  }),
)

// ── Errors ─────────────────────────────────────────────────────────────────

app.use((error, _req, res, _next) => {
  console.error('[api]', error)
  res.status(500).json({ error: 'Something went wrong on the server' })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`SiteBuilder API on http://localhost:${PORT}`)
  })
}

export { app }
