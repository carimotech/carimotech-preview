# CARIMO Technologies — website rebuild

Static multi-page site. No build step, no framework, no dependencies.
Open `index.html` in any browser to view it.

```
carimo-website/
├── index.html        ← Home (hero simulation, trust strip, MATLAB® feature, field highlight)
├── education.html    ← Edu Kits (ML Kit, DC Motor Kit, downloads)
├── matlab.html       ← MATLAB® Ecosystems + brochure form
├── training.html     ← Cari-On Learning
├── labs.html         ← In the Labs (survey, departments, quotes, photos)
├── industry.html     ← CAPMAC AI Suite + Consulting
├── about.html        ← About, Team, Contact, incubation logos
├── css/style.css     ← all styles (colours and type scale at the top)
├── js/main.js        ← all scripts (nav, tabs, lightbox, hero simulation …)
├── images/           ← all assets, web-optimised
├── tools/            ← chrome.py + sync_chrome.py (shared header/footer)
└── README.md
```

No external requests except the Formspree endpoint (once configured). Fonts are bundled in `fonts/`, everything else is local.

---

## 0000000000000. v16–v18 — FINAL COLOUR, PHONE SUPPORT, BROCHURE GATE

**Colour (final: Sea Mist).** The palette is fixed. Light-theme tokens are in `:root` and dark-theme tokens in `html[data-theme="dark"]`, both in the "Final palette: Sea Mist" block near the end of `css/style.css`. The site **opens in dark**; a small round sun/moon button in the **bottom-left corner** (semi-transparent until hovered) switches theme and remembers the choice. Add `?t=light` or `?t=dark` to a URL to force a theme. Text colours always use `--ink`, `--text`, `--text-dim`, `--accent-text`; `--accent` is only for fills. `python3 tools/contrast_audit.py light,dark` checks every text node on all pages (including the DC Motor Kit tab) for WCAG AA — currently 0 failures in both themes.

**Phones.** Tested at 390×844, 360×640 and 844×390 landscape in both themes: no horizontal scrolling, every control is at least 44 px on touch screens, form fields are 16 px (no iOS zoom), safe-area padding for notches, `-webkit-text-size-adjust` set, small labels become 14 px on phones. The hero **video is never downloaded on phones (≤700 px), on data-saver, or with reduced motion** — the still poster frame (`video/hero-poster.jpg`, shown through `.hero-poster`) is used instead; on larger screens the video starts only after the page has loaded. The control-loop simulation works by touch (large slider, buttons). The ecosystem explorers become stacked cards (no dragging) below 920 px. Fonts are bundled, so they behave the same on every phone.

**Brochure gate (ML Kit + DC Motor Kit).** All four brochure buttons on Edu Kits (the two kit buttons and the two Downloads & Resources cards) now open a form asking for **full name, work email, designation and company/institution**; the brochure link is shown only after the form validates and is sent. Everything about it is in `js/config.js`:
- `leadEndpoint` — **set this to receive the leads** (a Formspree form URL such as `https://formspree.io/f/xxxxxxxx`, or a Google Apps Script web-app URL; each submission includes the brochure name, page and timestamp). While it is empty the form works in *testing mode*: details are kept only in the visitor's own browser (`localStorage` key `carimo-leads`) and nothing is sent anywhere.
- `brochures` — the file link for each brochure. If sending fails (offline / endpoint error) the download stays locked and the visitor sees an error.
- Honeypot field for bots, field validation with inline errors, remembered details pre-filled on the next download, focus trap, Esc to close, bottom-sheet on phones; the buttons fall back to an email link if JavaScript is off.
- **Limitation (a static site cannot avoid this):** the real brochure links are in `js/config.js`, so a determined visitor who reads the code can still find them. To make the lock truly enforceable, have the endpoint email the link (or return it) after submission and remove the URLs from `config.js` — ask and this can be added.
- The two links are Google Slides `…/edit` links; make sure their sharing is set to *Viewer* (or switch them to `…/export/pdf` links for a direct PDF download).
- The MATLAB® brochure form on `matlab.html` is a separate, ungated form and still needs its Formspree ID.

## 000000000000. v15 — KIT PHOTOS SHOW THE WHOLE PRODUCT

- In both kit tabs the photo is no longer cropped: it is shown in full (`object-fit: contain`) and its top/bottom edges are feathered into a backdrop coloured from the photo's own top and bottom edge colours (`--ft` / `--fb`, set per image in `education.html`). Frame size and layout are unchanged. If you replace a photo, update those two colours (or delete the two variables to fall back to the theme background). Styles: v15 block of `css/style.css`.

## 00000000000. v14 — KIT PHOTOS FILL THE COLUMN, ORIGINAL-COLOUR LOGOS

- **ML Kit tab** now uses the same image + info layout as the DC Motor Kit tab, with the new photo (`images/mlk-photo.jpg`) on the **right** (DC Motor Kit keeps its photo on the left). To put the ML photo on the left, remove the `kit-hero-rev` class on that block in `education.html`.
- **No blank space**: in both tabs the photo stretches to the full height of the text column (crop-to-fill; the focal point is set by `object-position` in the v14 block of `css/style.css` — `#panel-mlk .kit-img img` and `.kit-hero .kit-img img`). On phones the photo sits above the text at a fixed height.
- **Home page**: the ML Kit card uses the same photo as the ML Kit tab (the cut-out `images/mlk-kit.webp` is still used by the animated ecosystem explorer).
- **Incubation logos** always show their real colours — the grey/colour hover transition is removed.

## 0000000000. v13 — DC MOTOR KIT EXPLORER, PLACEMENT, NAV COLOUR

- **DC Motor Kit ecosystem explorer** (Edu Kits → DC Motor Kit): same animated, draggable design as the ML Kit one, built from your DC Motor Kit diagram — Dual Software Platform (Python & MATLAB®), PID, MPC, Fuzzy Control and Complete Learning Kit around the kit. The MPC card carries an **"Add-on"** badge to match the page's statement that MPC is a separate add-on (remove `<em class="eco-badge">` in `education.html` if you don't want it). No MathWorks logo is used; MATLAB® carries the ® mark. The kit picture is cut out of your diagram (`images/dcmk-kit.webp`, ~1100 px, upscaled) — **swap in a real photo when you have one** (same file name).
- **Placement**: in both kit tabs the explorer now sits at the end of the tab, directly before Downloads & Resources.
- **Nav colour**: the page's brand name and every nav link are the same colour on all pages (previously the brand and the active link turned teal on the current page). The current page is marked only by the underline and bolder weight.
- `images/dcmk-ecosystem.jpg` (your diagram) is the no-JavaScript fallback.

## 000000000. v12 — CENTRED KIT TABS, FOOTER LOGO, SERIF NAV LINKS

- The ML Kit / DC Motor Kit tab switcher on Edu Kits is centred (full width on phones).
- Footer: the company logo (`images/carimo-logo-hd.png`, cut out of the supplied black-background image) sits above the company name.
- Nav links (Home, About, Edu Kits, …) use Fraunces 500 (active link 700), matching the serif brand name; the Contact button stays Inter. To change: `.nav-links a:not(.btn)` in the v12 block of `css/style.css`.

## 00000000. v11 — NAV, ICONS, LOGO GRID, ML KIT ECOSYSTEM EXPLORER

- **Nav**: translucent glass bar (blur + saturation, more opaque once scrolled), Fraunces brand name and italic tagline, Inter sentence-case links.
- **Icon tiles** (About pillars, resources, DC Motor Kit highlights): the glyph is white in both themes (a dark-mode stroke rule had made it invisible).
- **Small card titles** (h5) use Inter; Fraunces stays for h1–h4 headings and stat numbers.
- **Incubation logos**: an even grid — one line of six on desktop, 3×2 on tablet, 2×3 on phones.
- **ML Kit ecosystem explorer** (Edu Kits → ML Kit): replaces the still diagram. The kit photo (`images/mlk-kit.webp`, background removed from your photo) sits in the centre with a slow float and pointer tilt; five cards (AIMX Standard, AIMX Advanced, CARI Notebooks, Flexibridge, DAQ Master) float around it, connected by animated dashed lines with travelling dots. **Cards can be dragged** (mouse/touch on desktop, arrow keys when focused); "Reset layout" restores them. Below 920px it becomes a stacked layout. Reduced-motion visitors get it static. Content is the text from the original diagram; **it says "AIMX Advanced"** (the old image said "Advance") so it now matches the rest of the page copy. The old `images/ai-ecosystem.jpg` stays in the folder and is shown only if JavaScript is off.
- The home-page ML Kit card now shows the same kit photo (floating) instead of the diagram.
- Code: `eco_html()` in `tools`-independent build source is not shipped; to edit the card text, edit the ML Kit block in `education.html` directly (`.eco-node` articles). Styles: `v11` block in `css/style.css`; behaviour: last block in `js/main.js`.
- Contrast re-checked with `tools/contrast_audit.py`: no text below 4.5:1 in any palette × theme.

## 0000000. v10 — TEXT CONTRAST (light + dark, all palettes)

- Light-mode text was fading. Fixed at the token level: `--text` and `--text-dim` are darker (body ≥ 11:1, secondary ≥ 6.8:1 on the darkest light background), and a separate `--accent-text` (≥ 6.2:1) is used for accent-coloured text, while `--accent` stays the button/fill colour. Gradient headings use dark stops in light mode. The dark section backgrounds (`--navy`) are darkened where a palette's navy was too light for small light text (Teal, Deep Sea). Small white text on dark and gradient panels is at least ~72–94% white.
- Verified with `tools/contrast_audit.py` (needs `pip install playwright` + `playwright install chromium`; run `python3 tools/contrast_audit.py teal light,dark`): all ~740 text nodes on the 7 pages have ≥ 4.5:1 in every palette × theme. Decorative numerals (`.capmac-num`) are excluded.
- Rule for new content: use `--ink`, `--text`, `--text-dim`, `--accent-text` for text on surfaces; use `--accent` only for fills (buttons, bars). Don't use `--accent-light` for text on light backgrounds.

## 000000. v8 — TYPOGRAPHY

- **Headings: Fraunces** (serif; 600/700/800). **Body, buttons, nav, labels: Inter** (400–800). Testimonials use Fraunces italic; stat numbers use Fraunces bold. Bundled locally in `fonts/` (Latin subset, SIL Open Font License — licence files included) and declared in `css/fonts.css`, so there is **no Google Fonts request** and the site renders the same offline.
- To change: edit `--font-head` / `--font-body` at the top of `css/style.css` and the `@font-face` list in `css/fonts.css`. The v8 block at the end of `css/style.css` has the typography tweaks (weights, tracking, serif numbers).
- The four-size type scale (`--fs-1`…`--fs-4`) is unchanged.
- Characters outside the bundled Latin subset (for example the → arrow) fall back to the system font.

## 0000. v5 CHANGES (order, home button, card language)

- **Order**: CAPMAC / Industry comes before In the Labs everywhere (home previews, nav, footer, dot navigator and the "Next page" chain: Training → Industry → In the Labs → About). Change it in `tools/chrome.py` (`PAGES`) and run `python3 tools/sync_chrome.py`.
- **Home button** at the left of the nav (before About).
- **Light-card style**: floating cards with an accent bar that grows on hover, a faint waveform motif, filled gradient icon tiles, cursor spotlight and a gentle 3D tilt (pointer devices only). Team cards are photo-first, home kit cards are dark poster cards, dark cards get a rotating light-edge on hover. All in the `v5` block of `css/style.css`; tilt and video handling are in `js/main.js`.

## 000. v4 CHANGES (home glimpses, About, cards)

- **Home is a guided preview** of every page: About + team, Edu Kits, MATLAB® ecosystems, Cari-On Learning, CAPMAC + consulting, field results — each with a "View … page" button. A dot navigator on the right (wide screens) jumps between them.
- Every inner page has a **Back to homepage** button and breadcrumb at the top, and again at the bottom next to the "Next page" link.
- **About page** redesigned: intro + "At a glance" card, three pillars, "Where the expertise comes from" panel, four ways to work with us, team, offices/contact, recognitions. All facts are the original site copy.
- Home previews repeat the required trademark and survey-caveat wording next to the MATLAB® and field-results blocks — keep those lines.

## 00. EDITING SHARED HEADER / FOOTER (v3, multi-page)

The nav, mobile menu and footer are repeated in every page between
`<!-- CHROME:… START/END -->` markers. To change them, edit `tools/chrome.py`
and run `python3 tools/sync_chrome.py` — it rewrites all pages and marks the
current page in the nav. Everything else is edited directly in each page.
Contact lives at `about.html#contact` (nav button, footer, home CTA).
Anchors other pages link to: `industry.html#capmac`, `#consulting`,
`about.html#team`, `#contact`, `matlab.html#brochure`, `education.html#downloads`.
`education.html#dcmk` opens the DC Motor Kit tab.

## 0. WHAT CHANGED IN v2 (UI upgrade)

Content, figures and the trademark / competitive-exposure rules are unchanged. Added:

- **Hero simulation** — an interactive P / PI / PID motor-speed loop (gain slider, apply-load, change-setpoint). It is an *illustrative model*, labelled as such on the card; it is not live kit data. Code: `HERO SIMULATION` block at the bottom of `js/main.js`; model constants (`TAU`, `K`, `DELAY`, `LOAD`) are at its top.
- Split hero layout, dot-grid background, scroll-progress bar, current-page highlight in the nav (nav collapses to the hamburger below 1080px).
- Animated count-up on the trust strip, founder figures and MATLAB number row (final text is always the original figure).
- Sliding tab indicator with keyboard support (arrow keys) and ARIA roles on the Edu Kits tabs.
- Click-to-enlarge lightbox for the ecosystem diagrams (Esc / click to close; still falls back to a normal link if the image is missing).
- CAPMAC card spotlight, quote-mark styling, "Copy email" button with toast.
- Accessibility: skip link, visible focus rings, `prefers-reduced-motion` respected (simulation renders static, animations off).
- Head: favicon, theme-color, Organization JSON-LD. Fonts: see the v8 note.

The four-size type scale is unchanged. New CSS lives in the `UPGRADE v2` and `MULTI-PAGE v3` blocks of `css/style.css`.

---

## 1. BEFORE GOING LIVE — required

### Formspree form ID
The brochure request form in the MATLAB Ecosystems section is not connected yet.

In `matlab.html`, find:

```html
<form class="mx-form" id="brochure-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Create a free form at formspree.io using contact@carimo.tech and replace
`YOUR_FORM_ID` with the ID it gives you. Nothing else needs changing — the
JavaScript detects the placeholder and falls back to a normal form POST
until it is replaced.

Free tier is 50 submissions/month. Set the auto-reply in the Formspree
dashboard to include the brochure link.

### Test the form
Submit it once after configuring. On success the form is replaced in place
by a confirmation line; it should not navigate away from the page.

---

## 2. WAITING ON CONTENT

### DCMK ecosystem diagram
Done: `images/dcmk-ecosystem.jpg` now exists and is used as the no-JavaScript fallback of the animated DC Motor Kit explorer (Edu Kits → DC Motor Kit). The kit picture in the explorer is `images/dcmk-kit.webp`, cut out of that diagram; **replace it with a proper photo of the kit (transparent background, ~1100 px wide) for a sharper result.**

---

## 3. KNOWN CONTENT INCONSISTENCIES

These are content decisions, not code bugs. Someone at CARIMO should resolve them.

| Issue | Where |
|---|---|
| The AI Ecosystem diagram shows **five** components (adds Flexibridge and DAQ Master); the ecosystem card text below it lists **three** | Edu Kits tab vs MATLAB Ecosystems section |
| Diagram says **"AIMX Advance"**, all page copy says **"AIMX Advanced"** | same screen, both visible |
| Third testimonial is attributed only to "Electrical Engineering Department" — the institution was deliberately not named | In the Labs |

## 4. FIGURES USED

Current as of the July 2026 customer survey:

- 75+ units nationwide
- 20+ institutions
- 101 guided experiments (68 AI ecosystem + 33 control ecosystem)
- 15 years in classroom use
- 1 in 4 institutions has placed a repeat order
- 100% of institutions surveyed would recommend

If any of these change, they appear in the trust strip (under the hero),
the In the Labs headline, and the MATLAB Ecosystems number row. Search for
the figure to find every instance.

The survey caveat under the rating bars is deliberate and should stay: the
figures cover CARIMO hardware only, and the MATLAB/Simulink editions
launched August 2026 so are not reflected in them.

---

## 5. STRUCTURE

Pages are ordered by audience, not by product. Inner pages end with a "Next"
strip pointing to the following page; reword those links if pages are reordered.

```
Home            hero + simulation · trust strip · What We Offer · MATLAB® feature ·
                field highlight · incubation logos · contact CTA
Edu Kits → MATLAB® Ecosystems → Training → In the Labs → Industry (CAPMAC + Consulting) → About (Team + Contact)
```

The MATLAB® feature and the field highlight on Home repeat the required
trademark and survey-caveat wording — keep those lines if you edit them.

---

## 6. NOTES FOR WHOEVER EDITS THIS

**Type scale** — four sizes only, set as CSS variables at the top
(`--fs-1` through `--fs-4`). Headings differ from body text by weight, not
size. Please don't introduce a fifth size.

**Colour** — all colours are variables on `:root`. Accent is `--accent`
(#007E7A), navy is `--navy` (#0D1F3C). Change them in one place.

**Mobile** — three breakpoints: 1100px, 920px, 600px. The page has been
checked at 375px. Buttons go full-width below 600px, the nav collapses to
a hamburger below 920px, and the AIMX comparison table scrolls sideways
with a visible hint.

**Images** — every `<img>` has an `onerror` handler that hides its own
container. This means a missing or renamed file degrades silently instead
of showing a broken-image icon. Keep this pattern when adding images.

**Trademarks** — MATLAB® and Simulink® carry the ® symbol at every mention,
and there are three required statements (MATLAB section, survey caveat,
footer) including a non-affiliation line. The MathWorks logo must not be
used anywhere, and photos containing MathWorks branding were deliberately
excluded. Do not "improve" this by adding their logo.

**Competitive exposure** — the AIMX comparison was deliberately cut back to
three rows. An earlier version listed 82 model names, which handed
competitors a full feature spec. Detailed model lists belong in the
brochure, behind an email request. Please don't restore them to the page.
