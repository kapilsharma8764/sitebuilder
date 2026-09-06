# SiteBuilder

Visual website builder — a person with no coding knowledge fills a short form, picks a
template, and edits the result by dragging widgets around. Publish gives them a live link.

Built as an Elementor-style editor: a page is a **list of widgets**, and one renderer draws
that list in the editor canvas, in preview, and on the published site — so what you build is
exactly what ships.

---

## Structure

```
client/          React 19 + Vite + Tailwind v4 editor
  src/
    blocks/      widget components + registry
    editor/      builder shell — canvas, panels, toolbar
    store/       Zustand state (site config, editor UI)
    lib/         theme tokens, templates, HTML export
server/          (coming) Express + MongoDB — auth, sites, publish, leads
```

## Running it

```bash
cd client
npm install
npm run dev      # http://localhost:5173
```

Other scripts: `npm run build`, `npm run lint`, `npm test`.

---

## Design

The interface uses a dark glass theme — near-black ground, translucent white surfaces,
hairline borders, white primary buttons, and an indigo→purple gradient reserved for
publish-level actions. Tokens live in `client/src/index.css`.

## Third-party code

See [NOTICE.md](NOTICE.md) for the open-source projects this builds on and their licenses.

## License

MIT — see [LICENSE](LICENSE).
