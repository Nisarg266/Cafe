# Sip & Chill Café — Website

A premium, mobile-first single-page website for **Sip & Chill Café** (“Every Sip Has A Story”).
Built with plain HTML, CSS and vanilla JavaScript plus GSAP (ScrollTrigger) for scroll animations.
No build tools, no backend — it runs anywhere as static files, including GitHub Pages.

## Preview locally

From this folder (`sip-and-chill-cafe/`), run any one of:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then open <http://localhost:8000>. (Opening `index.html` directly also works for a quick look,
but a local server matches how the site behaves once deployed.)

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `sip-and-chill-cafe`).
2. Push the **contents of this folder** to the `main` branch (so `index.html` sits at the repo root).
3. In the repo: **Settings → Pages → Source: Deploy from a branch** → `main` / `/ (root)` → Save.
4. Your site goes live at `https://<username>.github.io/sip-and-chill-cafe/`.

All asset paths are relative (`./assets/...`, `./js/...`), so no configuration is needed.

## Project structure

```
sip-and-chill-cafe/
├── index.html          # Master showcase page (all sections, interactive previews, GSAP motion)
├── menu.html           # Dedicated Menu page (live search, category filters, item counter, lightbox)
├── story.html          # Dedicated Story page (interior photo essays, brand philosophy, ambiance)
├── gallery.html        # Dedicated Gallery page (scene filter tabs, responsive masonry, lightbox)
├── visit.html          # Dedicated Visit page (Google Maps card, daily vibe rhythms, amenities, FAQs)
├── css/style.css       # Design system + tokens + mobile-first layouts + animations
├── js/menu-data.js     # ⭐ Every menu item, price, category, and feature showcase lives here
├── js/main.js          # Lenis smooth scroll, GSAP ScrollTrigger parallax, cursor, drawer, lightbox
├── assets/images/      # Optimised photos of the café (JPEG)
├── assets/icons/       # favicon.svg + grain texture
└── README.md
```

## Updating the menu

Open `js/menu-data.js` — the entire menu is one array:

```js
{ n: 'Masala Tea', c: 'tea', p: '30', d: 'The classic spiced chai, brewed strong.' }
//  n = name · c = category key · p = price(s) in ₹ · d = short description
```

- Category keys: `tea, coffee, cold, shakes, sandwiches, grilled, fries, maggie, chaat`.
- Grilled sandwiches carry two sizes, e.g. `p: '100 / 150'` with `u: '2-layer / 3-layer'`.
- The showcase rows in the “Something Good Is Brewing.” section come from `MENU_FEATURED`
  at the bottom of the same file.

### ⚠️ Two names to confirm with the owner

These are transcribed **exactly as printed on the café’s menu board** and may be typos:

- **“Baaskon Shake”** (₹140) — possibly “Baskin” or another name
- **“Borenvita”** (hot/cold) — possibly “Bournvita”

Fix the spellings in `js/menu-data.js` once confirmed.

## Swapping / adding photos

Replace files in `assets/images/` (keep the same file names), or add new ones and reference
them in `js/main.js` (`GALLERY` array) or `index.html`. The storefront photo is the hero image;
`menu-board.jpg` powers the “View Full Menu Board” lightbox.

## Notes & principles

- **No invented business data** — no address, phone number, opening hours, ratings or social
  links are shown, because none were supplied. The only external link is the Google Maps
  directions URL provided by the owner.
- All gallery/interior photos are genuine photographs of the café. One AI-generated render
  supplied in the source folder was intentionally **not** used.
- No fake food photography: menu items are presented with designed typographic tiles.
  When real dish photos exist, they can be dropped into `assets/images/` and wired into
  `MENU_FEATURED`.
- Accessibility: semantic HTML, keyboard-navigable drawer & lightbox (Escape / arrow keys),
  focus-visible states, skip link, `prefers-reduced-motion` support, and everything remains
  visible even if GSAP or JavaScript fails to load.
