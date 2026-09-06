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

*(5173 aur 8000 tumhare purane `2.websiteBuilder` ne le rakhe hain, isliye 5200 aur 8001 fix kiye hain.)*

---

## Demo ka rasta

```
1. http://localhost:5200 → "Create website"
2. Website ka type → Product/Services
3. B2B / B2C
4. Business naam, LOGO FILE choose karo, slogan pe "Suggest one",
   About pe "Write a first draft"
5. Mobile (+WhatsApp tick), email, address, map link, timing
6. Design chuno — 40 templates, tumhare type wale upar,
   har card me tumhara naam aur asli photo
7. Editor:
   • BAYE "Pages"   → Header / Footer (sab page pe) + pages + "+"
   • BAYE "Widgets" → widget ko UTHA KE canvas pe DROP karo
   • Section pe drag handlese upar-neeche khiskao
   • DAYE "Content" → text/photo badlo
   • DAYE "Style"   → chaudai, spacing, rang, font
   • Upar mobile/tablet/desktop view, undo/redo
8. "Publish" → live link
9. Live page pe contact form bharo
10. "Enquiries" me wo message dikhega
```

---

## Notebook ke hisaab se — sab ✅

| Feature | Status |
|---|---|
| Create Website → type poochna | ✅ |
| B2B / B2C | ✅ |
| Company name, **logo upload**, square logo | ✅ |
| Slogan + **Suggest** | ✅ |
| About + **Suggest** | ✅ |
| Product / Services | ✅ |
| Contact: mobile+WhatsApp, alt, email, map, address, timing | ✅ |
| Templates | ✅ **40** |
| Header/Footer FIX (`include header.php` wala) | ✅ |
| Pages + Add Page | ✅ |
| Dynamic menu | ✅ |
| **Drag & drop** — library se canvas pe, aur reorder | ✅ |
| Google Map widget | ✅ |
| WhatsApp button | ✅ |
| **Chart / Graph** widget | ✅ |
| Resize / Style / font | ✅ Style tab |
| Publish → live link | ✅ |
| CRM (Enquiries) | ✅ |

---

## Abhi bhi pending (saaf-saaf)

| Kya | Kyun bacha |
|---|---|
| **Logo cropping** | Upload + resize chalta hai, crop tool nahi bana |
| **Har screen ke liye alag style** | Style ek hi set hai — mobile pe alag padding nahi de sakte |
| **Login / multiple users** | Abhi ek machine, ek user. Google login nahi laga |
| **Payment / credits** | Bilkul nahi |
| **Templates 40 se zyada** | System ready hai, naya template 3 line ka kaam |

---

## Quality

```
88 tests (client) + 6 (server)   sab pass
CI green — har push pe lint + test + build
0 lint errors
```

## Jo asli bugs pakde aur theek kiye

1. **Template chunne ke baad editor khaali khulta tha** — "No project selected". Purane
   "project" system pe atka tha jise naya flow set hi nahi karta tha.
2. **Drag & drop tha hi nahi** — sirf Layers list me tha. Ab widget utha ke canvas pe daal
   sakte ho, aur section ko handle se khiska sakte ho.
3. **Hero me photo nahi tha** — dashed box me "Preview" likha aata tha. Yahi sabse zyada
   sasta dikhata tha. Ab asli photo + naya "photo across the top" layout.
4. **Har feature card pe wahi lightning bolt** — icon map me 12 the, templates 40+ maangte
   the. Ab poora map aur panel me dropdown.
5. **Published page pe icon ki jagah sirf ek letter** — scissors ki jagah "S".
6. **6 widgets publish me ja hi nahi rahe the** — About text, photos, gallery, video,
   divider, banner.
7. **Header/footer publish me missing tha.**
8. **Logo upload hota tha par header me kabhi nahi dikhta tha.**
9. **Contact form kuch karta hi nahi tha** (`onsubmit="return false"`).
10. **Ek hi millisecond me do widget → same ID.**

---

## Templates ka sach

- **40** = 16 dhandhe ke content pack × 10 style set × 5 arrangement
- Asli content — "2,000+ students", "18 saal", asli reviews. **Lorem ipsum nahi** (test rejects)
- Photos maine **ek-ek dekh ke** lagaye — restaurant pe restaurant, gym pe gym
- **Legally saaf** — sab MIT/Unsplash. Colorlib, Wix, OpenTailwind, Cruip license padh ke reject

Detail: `RESEARCH-TEMPLATES-SOURCES.md`

---

## Ek baat

Main apne aap ghanton tak nahi chal sakta — tumhare message pe hi chalta hoon. Par jo bana
hai wo **poora chalta hua aur tested** hai, aur `publish-flow.test.ts` shuru se aakhir tak
ka rasta apne aap check karta hai.
