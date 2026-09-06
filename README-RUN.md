# Running SiteBuilder

Two processes. Open two terminals.

## 1. API (saves sites, publishes them, collects enquiries)

```bash
cd server
npm install
npm run dev            # http://localhost:8001
```

Data is written to `server/data/*.json`. Nothing else to install.

## 2. Editor

```bash
cd client
npm install
npm run dev            # http://localhost:5200
```

## What to click

1. **http://localhost:5200** — press *Create website*
2. Answer the four steps: type of site, who you sell to, business details, contact details
3. Pick a design from the forty in the gallery
4. Edit in the builder — drag sections, change wording in **Content**, adjust size and
   colour in **Style**, add pages from the toolbar
5. Press **Publish** — you get a live address like
   `http://localhost:8001/site/sharma-coaching-classes`
6. Fill in the contact form on that published page
7. Open **Enquiries** in the editor — the message is there

## Ports

| What | Port | Why not the usual one |
|---|---|---|
| Editor | 5200 | 5173 is taken by another project on this machine |
| API | 8001 | 8000 is taken by `2.websiteBuilder` |

Set `VITE_API_URL` in `client/.env` if the API runs anywhere else.
