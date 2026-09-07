# Project ka Status

**Repo:** https://github.com/kapilsharma8764/sitebuilder (private)
**Folder:** `D:\David task\5-09-2026\elementor-builder`

---

## Chalane ka tarika (2 terminal)

**Terminal 1 — server**
```
cd "D:\David task\5-09-2026\elementor-builder\server"
npm install
npm run dev
```
→ http://localhost:8001

**Terminal 2 — editor**
```
cd "D:\David task\5-09-2026\elementor-builder\client"
npm install
npm run dev
```
→ **http://localhost:5200**

*(5173 aur 8000 tumhare purane `2.websiteBuilder` ne le rakhe hain, isliye 5200 aur 8001.)*

---

## Sabse pehle: account banao

Ab app **login ke peeche** hai. Pehli baar:

```
http://localhost:5200 → "Create one" → apna email + password (8+ letters)
```

**Tumhari purani publish ki hui site (`sharma chogin classess`)** abhi kisi account se
judi nahi hai. Login karte hi **"Your sites"** page pe ek line dikhegi —
*"1 site on this computer is not attached to any account yet"* — uspe
**"Add it to my account"** dabao, wo tumhare account me aa jayegi.

*(Maine jaanbujh ke wo apne aap nahi jodi — kisi aur ka kaam pehle sign-up karne wale
ko de dena galat ho sakta hai.)*

---

## Demo ka rasta

```
1. Sign in
2. "Create website"  (ya "Describe it instead" — ek line likho, design aa jayega)
3. Website ka type → Product/Services
4. B2B / B2C
5. Business naam, LOGO FILE choose karo → "Trim edges" / "Make square"
   slogan pe "Suggest one", About pe "Write a first draft"
6. Mobile (+WhatsApp tick), email, address, map link, timing
7. Design chuno — 40 templates, tumhare type wale upar,
   har card me tumhara naam aur asli photo
8. Editor:
   • BAYE "Pages"   → Header / Footer (sab page pe) + pages + "+"
   • BAYE "Widgets" → widget ko UTHA KE canvas pe DROP karo
   • Section ko drag handle se upar-neeche khiskao
   • DAYE "Content" → text / photo badlo
   • DAYE "Style"   → Desktop / Tablet / Phone — teeno ke liye alag styling
   • Upar mobile/tablet/desktop view, undo/redo, version history
9. "Publish" → live link
10. Live page pe contact form bharo
11. "Enquiries" me wo message dikhega
```

---

## Notebook + plan ke hisaab se

| Feature | Status |
|---|---|
| Login / account | ✅ |
| Create Website → type poochna | ✅ |
| B2B / B2C | ✅ |
| Company name, **logo upload + crop** (trim / square) | ✅ |
| Slogan + **Suggest** | ✅ |
| About + **Suggest** | ✅ |
| Product / Services | ✅ |
| Contact: mobile+WhatsApp, alt, email, map, address, timing | ✅ |
| "Describe it" wala doosra rasta | ✅ |
| Templates | ✅ **40** |
| Header/Footer FIX (`include header.php` wala) | ✅ |
| Pages + Add Page | ✅ |
| Dynamic menu | ✅ |
| **Drag & drop** — library se canvas pe, aur reorder | ✅ |
| Google Map widget | ✅ |
| WhatsApp button | ✅ |
| **Chart / Graph** widget | ✅ |
| **Opening hours** widget | ✅ |
| Resize / Style / font | ✅ |
| **Har screen ke liye alag style** (desktop/tablet/phone) | ✅ |
| Version history | ✅ |
| Publish → live link | ✅ |
| CRM (Enquiries) | ✅ |

### Abhi bhi pending

| Kya | Kyun |
|---|---|
| **Payment / credits** | Bilkul nahi bana |
| **Custom domain** | Abhi `/site/naam` par milta hai, apna domain nahi |
| **Team — ek site pe kai log** | Account ban gaye, par site sirf banane wale ki hai |
| **AI se poori site likhwana** | "Describe it" design match karta hai; asli AI ke liye key chahiye |

---

## Quality

```
110 tests (client) + 15 (server)   sab pass
CI green — har push pe lint + test + build
0 lint errors
```

## Jo asli bugs pakde aur theek kiye

1. **Template chunne ke baad editor khaali khulta tha** — "No project selected".
2. **Drag & drop tha hi nahi** — sirf Layers list me tha.
3. **Hero me photo nahi tha** — dashed box me "Preview" likha aata tha.
4. **Har feature card pe wahi lightning bolt** — icon map me 12, templates 40+ maangte the.
5. **Published page pe icon ki jagah sirf ek letter** — scissors ki jagah "S".
6. **6 widgets publish me ja hi nahi rahe the** — About, photos, gallery, video, divider, banner.
7. **Header/footer publish me missing tha.**
8. **Contact form kuch karta hi nahi tha** (`onsubmit="return false"`).
9. **Ek hi millisecond me do widget → same ID.**
10. **Opening hours me galat din highlight hota** — hafta Monday se, `getDay()` Sunday se.

---

## Templates ka sach

- **40** = 16 dhandhe ke content pack × 10 style set × 5 arrangement
- Asli content — "2,000+ students", "18 saal", asli reviews. **Lorem ipsum nahi** (test rejects)
- Photos maine **ek-ek dekh ke** lagaye — restaurant pe restaurant, gym pe gym
- **Legally saaf** — sab MIT/Unsplash. Colorlib, Wix, OpenTailwind, Cruip license padh ke reject

Detail: `RESEARCH-TEMPLATES-SOURCES.md`
