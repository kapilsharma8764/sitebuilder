import express from 'express'
import cors from 'cors'
import { find, get, insert, list, remove, update } from './store.js'
import { uniqueSlug } from './slug.js'
import {
  checkCredentials,
  createToken,
  hashPassword,
  normaliseEmail,
  readToken,
  verifyPassword,
} from './auth.js'

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


// ── Accounts ───────────────────────────────────────────────────────────────

/** The signed-in user, or null. Read from the Authorization header. */
async function currentUser(req) {
  const header = req.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const userId = readToken(token)
  return userId ? get('users', userId) : null
}

/**
 * Wraps a route so it only runs for a signed-in user.
 *
 * Everything about a site belongs to whoever made it, so the check lives here
 * rather than being remembered separately in each handler.
 */
function requireUser(handler) {
  return asyncRoute(async (req, res, next) => {
    const user = await currentUser(req)
    if (!user) return res.status(401).json({ error: 'Please sign in' })
    req.user = user
    return handler(req, res, next)
  })
}

function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name ?? '' }
}

app.post(
  '/api/auth/register',
  asyncRoute(async (req, res) => {
    const { email, password, name } = req.body ?? {}

    const problem = checkCredentials(email, password)
    if (problem) return res.status(400).json({ error: problem })

    const address = normaliseEmail(email)
    const existing = await find('users', (row) => row.email === address)
    if (existing) return res.status(409).json({ error: 'That email is already registered' })

    const user = await insert('users', {
      email: address,
      name: String(name ?? '').trim(),
      password: hashPassword(password),
    })

    res.status(201).json({ token: createToken(user.id), user: publicUser(user) })
  }),
)

app.post(
  '/api/auth/login',
  asyncRoute(async (req, res) => {
    const { email, password } = req.body ?? {}
    const user = await find('users', (row) => row.email === normaliseEmail(email))

    // The same message either way, so this cannot be used to find out which
    // addresses have accounts.
    if (!user || !verifyPassword(String(password ?? ''), user.password)) {
      return res.status(401).json({ error: 'Wrong email or password' })
    }

    res.json({ token: createToken(user.id), user: publicUser(user) })
  }),
)

app.get(
  '/api/auth/me',
  asyncRoute(async (req, res) => {
    const user = await currentUser(req)
    if (!user) return res.status(401).json({ error: 'Not signed in' })
    res.json({ user: publicUser(user) })
  }),
)

/** Whether anyone has signed up yet, so the client can offer the right screen. */
app.get(
  '/api/auth/status',
  asyncRoute(async (_req, res) => {
    const users = await list('users')
    res.json({ hasAccounts: users.length > 0 })
  }),
)

// ── Sites ──────────────────────────────────────────────────────────────────

/**
 * Sites saved before accounts existed.
 *
 * Accounts arrived after the builder did, so an install can hold sites with
 * nobody attached. They are offered rather than handed over automatically:
 * claiming somebody's work on their behalf, on the strength of being the first
 * to sign up, is the kind of guess that is wrong exactly when it matters.
 */
app.get(
  '/api/sites/unowned',
  requireUser(async (_req, res) => {
    const unowned = (await list('sites')).filter((site) => !site.userId)
    res.json({ count: unowned.length, names: unowned.map((site) => site.name) })
  }),
)

app.post(
  '/api/sites/claim',
  requireUser(async (req, res) => {
    const unowned = (await list('sites')).filter((site) => !site.userId)
    for (const site of unowned) {
      await update('sites', site.id, { userId: req.user.id })
    }
    res.json({ claimed: unowned.length })
  }),
)

app.get(
  '/api/sites',
  requireUser(async (req, res) => {
    const sites = await list('sites', { userId: req.user.id })
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
  requireUser(async (req, res) => {
    const site = await get('sites', req.params.id)
    // A site belonging to someone else is reported as missing rather than as
    // forbidden, which would confirm it exists.
    if (!site || site.userId !== req.user.id) return res.status(404).json({ error: 'No such site' })
    res.json(site)
  }),
)

app.post(
  '/api/sites',
  requireUser(async (req, res) => {
    const { name, config, profile } = req.body ?? {}
    if (!config) return res.status(400).json({ error: 'A site needs a config' })
    const site = await insert('sites', {
      userId: req.user.id,
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
  requireUser(async (req, res) => {
    const { name, config, profile } = req.body ?? {}
    const owned = await get('sites', req.params.id)
    if (!owned || owned.userId !== req.user.id) {
      return res.status(404).json({ error: 'No such site' })
    }
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
  requireUser(async (req, res) => {
    const owned = await get('sites', req.params.id)
    if (!owned || owned.userId !== req.user.id) {
      return res.status(404).json({ error: 'No such site' })
    }
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
  requireUser(async (req, res) => {
    const { html } = req.body ?? {}
    if (typeof html !== 'string' || !html.trim()) {
      return res.status(400).json({ error: 'Nothing to publish' })
    }

    const site = await get('sites', req.params.id)
    if (!site || site.userId !== req.user.id) {
      return res.status(404).json({ error: 'No such site' })
    }

    // Slugs are unique across the whole server, not per user, because they are
    // public addresses.
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
  requireUser(async (req, res) => {
    const owned = await get('sites', req.params.id)
    if (!owned || owned.userId !== req.user.id) {
      return res.status(404).json({ error: 'No such site' })
    }
    const site = await update('sites', req.params.id, { published: false })
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
  requireUser(async (req, res) => {
    // Only enquiries for this user's own sites. A visitor can send one without
    // an account; reading them is another matter.
    const own = new Set((await list('sites', { userId: req.user.id })).map((site) => site.id))
    const requested = req.query.siteId ? String(req.query.siteId) : null
    if (requested && !own.has(requested)) return res.json([])

    const all = await list('leads')
    const leads = all.filter((lead) =>
      requested ? lead.siteId === requested : lead.siteId && own.has(lead.siteId),
    )
    // Newest first — an enquiry inbox is read from the top.
    leads.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    res.json(leads)
  }),
)

app.patch(
  '/api/leads/:id',
  requireUser(async (req, res) => {
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
  requireUser(async (req, res) => {
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
