# Project ka Status — subah padhne ke liye

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

*(5173 aur 8000 tumhare purane `2.websiteBuilder` ne le rakhe hain, isliye 5200 aur 8001 fix kiye hain — kabhi clash nahi hoga.)*

---

## Demo karne ka rasta (yahi test karo)

```
1. http://localhost:5200 kholo → "Create website" dabao
2. Step 1: website ka type (Education / Business / Technology)
           → Product ya Services
3. Step 2: B2B / B2C / dono
4. Step 3: business ka naam, LOGO FILE choose karo,
           slogan pe "Suggest one" dabao,
           About pe "Write a first draft" dabao
5. Step 4: mobile (+WhatsApp tick), email, address, map link, timing
6. "Choose a design" → 40 design dikhenge, tumhare type wale upar
   (har card me tumhara apna naam already laga hoga)
7. "Use this design" → Editor khulega
8. Editor me:
   - BAYE "Pages" tab → Header / Footer (sab page pe) + pages + "+"
   - BAYE "Widgets" tab → widget add karo
   - Beech me section pe click → DAYE "Content" me text badlo
   - DAYE "Style" me chaudai, spacing, rang, font badlo
   - Upar [🖥 💻 📱] se mobile view, ↶ ↷ undo/redo
9. Upar daye "Publish" dabao → live link milega
   http://localhost:8001/site/<tumhara-naam>
10. Us live page pe contact form bharo
11. Upar "Enquiries" me jao → wo message wahan dikhega
```

---

## Kya-kya ban chuka hai

| Notebook me jo likha tha | Status |
|---|---|
| "Create Website" button → type poochna | ✅ |
| B2B / B2C | ✅ |
| Company name, logo (upload), square logo | ✅ |
| Title/Slogan + **suggest** | ✅ |
| About + **suggest** | ✅ |
| Website type → Product/Services | ✅ |
| Contact: mobile+WhatsApp, alt, email, map, address, timing | ✅ |
| Template chuno | ✅ **40 templates** |
| Header/Footer FIX (include header.php wala) | ✅ |
| Pages + "Add Page" | ✅ |
| Dynamic menu (page banao → menu me aa jaye) | ✅ |
| Widgets add/drag/reorder/delete | ✅ |
| Front slider, About, Reviews, Numbers, Services, Contact, Gallery, Team, Footer | ✅ |
| **Google Map** widget | ✅ |
| **WhatsApp** button | ✅ |
| Resize / Reposition / Style / font | ✅ (Style tab) |
| Publish → live link | ✅ |
| CRM (leads) | ✅ Enquiries page |

**Bacha hua:** logo ka cropping tool (upload ho jaata hai, crop nahi), aur Graph widget.

---

## Quality

```
68 tests pass  (client)
6 tests pass   (server)
CI green       har push pe lint + test + build apne aap chalta hai
0 lint errors
```

**Jo asli bugs test ne pakde aur theek hue:**
1. Ek hi millisecond me do widget → **same ID** ban jaati thi
2. Published page me **header/footer hi nahi ja raha tha**
3. Contact form `onsubmit="return false"` tha — **kuch karta hi nahi tha**
4. Hero me "Hero Image URL" jaisi **jhooti settings** thi jo component padhta hi nahi tha

---

## Templates ka sach (jo tumne poocha tha)

- **40 templates** = 16 dhandhe ke content pack × 10 style set × 5 arrangement
- Har template me **asli content** — "2,000+ students", "18 saal", asli reviews. Koi Lorem ipsum nahi (test isko reject karta hai)
- **Photos maine ek-ek download karke apni aankhon se dekhe** — taaki restaurant ke template pe office ka photo na lag jaye
- **Legally saaf:** sab MIT/Unsplash. Colorlib, Wix, OpenTailwind, Cruip — sab license padh ke **reject** kiye

Detail: [RESEARCH-TEMPLATES-SOURCES.md](RESEARCH-TEMPLATES-SOURCES.md)

---

## Ek zaroori baat

Main **apne aap ghanton tak kaam nahi kar sakta** — mujhe chalne ke liye tumhara message chahiye hota hai. Jab tum message bhejte ho tabhi main chalta hoon. Isliye raat bhar apne aap kaam nahi hua.

**Par jo bana hai wo poora chalta hua hai** — upar wala rasta shuru se aakhir tak kaam karta hai, aur ek test bhi hai jo yahi poora rasta apne aap check karta hai (`publish-flow.test.ts`).

Subah bolo, main aage ka kaam continue kar dunga.
