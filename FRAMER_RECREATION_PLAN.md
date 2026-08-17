# FRAMER_RECREATION_PLAN.md

**Phase 6 deliverable — technical specification for rebuilding `danielcross.framer.website` as
Nelfar Zulkifli's professional site.**

All values below were measured from the live reference via `getComputedStyle` and
`getBoundingClientRect` at 1440px, 900px and 375px viewports. Nothing here is estimated by eye.

---

## 1. Page structure

```
SITE (6 HTML pages, static, no build step)
│
├── Sidebar            ← persistent on every page (sticky, 250px)
│   ├── Avatar + Name + Role
│   ├── Nav (Home · About · Projects · Contact)
│   ├── Media tile (200×130)
│   └── "Currently" block
│
├── index.html         HOME
│   ├── Status bar
│   ├── Hero              (bg image, pill, H1 + inline chips, sub, CTA, stat, 3-image row)
│   ├── What I Do         (label, H2, 3×2 card grid, 6th cell = CTA card)
│   ├── About me          (label, paragraph, portrait image)
│   ├── Developments      (heading + infinite text marquee)
│   ├── Selected Work     (label, H2, 2×2 project grid, button)
│   ├── How a takeover works (label, H2, 3 process cards)
│   ├── Track record      (label, H2, infinite card marquee + arrows)
│   └── Footer            (links row, CTA card, copyright)
│
├── about.html         ABOUT
│   ├── Intro             (label, H1, 2 paragraphs)
│   ├── Stats             (4 count-up counters)
│   ├── Experience        (label, H2, 4 rows)
│   └── Footer
│
├── projects.html      PROJECTS
│   ├── Header            (label, H2)
│   ├── Grid              (8 project cards)
│   ├── Full lists        (3 columns: Managed / Stabilised / Selected)
│   └── Footer
│
├── contact.html       CONTACT
│   ├── Header            (label, H1, sub)
│   ├── Form              (Name, Email, Message, Send)
│   ├── Details           (email, location)
│   └── Footer
│
├── work-southkey-mosaic.html   CASE STUDY 1
└── work-pipe-leakage.html      CASE STUDY 2
    ├── Go Back
    ├── H1 + standfirst
    ├── Banner image
    ├── Meta row (3 columns)
    ├── Body / Approach / Outcome
    └── Footer
```

---

## 2. Typography

**Font family: `Inter Display`** — the only family the reference loads (weights 500 and 600).
Self-hosted is not possible without a licence file, so it is loaded from Google Fonts as **`Inter`**
with `font-variation-settings` and an explicit `Inter Display` stack ahead of it. Inter Display is
the display optical size of the same superfamily; where it is unavailable the fallback is Inter at
the same weights and metrics, which is visually near-identical at these sizes.

```css
font-family: "Inter Display", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

**Weight is 500 almost everywhere.** Only the 10px micro-badges use 600. There is no 400, 600 body,
or 700 anywhere in the reference. This is unusual and is a large part of the template's character —
it must not be "corrected" to a conventional 400/700 pairing.

### Measured scale

| Role | Desktop ≥1200 | Tablet 810–1199 | Mobile <810 | Weight | Line height | Letter spacing | Colour |
|---|---|---|---|---|---|---|---|
| H1 hero | 46px | 40px | 34px | 500 | 1.10 | −0.03em | `#000` |
| H2 section | 40px | 34px | 28px | 500 | 1.20 | −0.02em | `#000` |
| H4 project title | 24px | 24px | 20px | 500 | 1.00 | −0.04em | `#fff` |
| Card title | 20px | 20px | 18px | 500 | 1.50 | −0.04em | `#000` |
| Lead paragraph | 18px | 18px | 16px | 500 | 1.50 | −0.04em | `#757575` |
| Body | 16px | 16px | 15px | 500 | 1.60 | −0.02em | `#757575` |
| Small / nav | 14px | 14px | 14px | 500 | 1.50 | −0.04em | `#000` |
| Micro label | 10px | 10px | 10px | 500 | 1.00 | **+0.08em** | `#757575` |
| Badge | 10px | 10px | 10px | **600** | 1.20 | −0.04em | `#fff` |

**Alignment changes at breakpoint:** the H1 and hero block are **centred on desktop** and
**left-aligned on tablet and mobile** (`text-align: start`). This is a real measured change, not an
assumption.

The 10px micro label is the only uppercase, positively-tracked style in the system, and it is used
exactly twice (sidebar role line, and section eyebrows).

---

## 3. Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#E9E6E2` | Page background |
| `--surface` | `#EDEAE7` | Cards, marquee cards, footer CTA card |
| `--surface-2` | `#F5F2F0` | Active nav item background |
| `--white` | `#FFFFFF` | Project cards, form fields, buttons on dark |
| `--ink` | `#000000` | Primary text |
| `--muted` | `#757575` | Body copy, secondary text |
| `--accent` | `#4A3429` | Dark brown — primary buttons, CTA card, badges |
| `--line` | `rgba(0,0,0,0.08)` | Hairlines |

The palette is a warm neutral system with a single dark-brown accent. There is no second accent
colour and no gradient anywhere except the hero's background photograph.

**No brand colours were supplied for Nelfar, so the template palette is retained unchanged**, per the
brief's colour rule.

### Radii

| Value | Applied to |
|---|---|
| `999px` | Avatar, status dot, pills |
| `16px` | Footer CTA card, marquee testimonial cards |
| `12px` | Hero images, project cards, portrait image |
| `10px` | Service cards |
| `6px` | Buttons, inline hero chips, sidebar media tile |
| `4px` | Nav items |

No shadows are used anywhere in the reference. Depth comes entirely from the surface/background
value difference.

---

## 4. Layout and spacing

### Desktop (≥1200px)

| Property | Value |
|---|---|
| Sidebar width | `250px`, `position: sticky`, full viewport height |
| Content column | `calc(100% - 250px)` — 1190px at 1440 |
| Inner content width | `1140px` (25px gutter each side of the content column) |
| Grid gutter (services) | `25px` column, `21px` row |
| Grid gutter (projects) | `16px` both axes |
| Hero image row gap | `10px` |
| Marquee card gap | `12px` |

### Section rhythm (measured y-offsets at 1440px)

| Section | Top | Height |
|---|---:|---:|
| Hero | 0 | 867 |
| What I Do | 867 | 833 |
| About me | 1700 | 508 |
| Developments marquee | ~2118 | ~90 |
| Selected Work | 2208 | 1103 |
| How a takeover works | 3310 | 516 |
| Track record | 3826 | 553 |
| Footer | 4379 | 366 |

Section vertical padding is approximately **64px top / 64px bottom** on the outer wrapper, with the
inner content block inset a further 25px. Section header (eyebrow + H2) to first content row is
**~64px**.

### Component dimensions

| Component | Desktop | Notes |
|---|---|---|
| Service card | `358 × 249`, radius 10, padding 18 | 3 columns |
| Project card | `562 × 350`, radius 12, padding 16 | 2 columns, image full-bleed inside |
| Hero image | `373 × 300` (ar 1.24), radius 12 | 3 across |
| Hero inline chip | `45 × 45`, radius 6 | 3 overlapping, centre one raised 10px |
| Portrait image | `373 × 380`, radius 12 | |
| Marquee card | `334 × 225`, radius 16, padding 20 | |
| Primary button | height `42`, padding `8px 22px`, radius 6 | |
| Nav item | `200 × 37`, radius 4, padding 8 | 47px vertical pitch |
| Sidebar media tile | `200 × 130`, radius 6 | |
| Footer CTA card | `1140 × 242`, radius 16, padding `64px 40px` | |

### Responsive

| Breakpoint | Sidebar | H1 | Services | Projects | Hero images | Page margin |
|---|---|---|---|---|---|---|
| **≥1200** | 250px sticky rail | 46px centred | 3 cols | 2 cols | 3 across, 373px | 25px |
| **810–1199** | Hidden → fixed 70px top bar | 40px left | 2 cols | 2 cols | 3 across, 277px | 25px |
| **<810** | Fixed 70px top bar | 34px left | 1 col | 1 col | stacked, full width | 20px |

Top bar (tablet and mobile): 70px tall, fixed, avatar 38×38 at left, hamburger at right, background
`--bg` with a hairline bottom border once scrolled.

---

## 5. Navigation

- **Desktop:** sticky 250px rail, always visible, no scroll transformation. Active page carries
  `--surface-2` background and black text; inactive items are `--muted`.
- **Hover:** background fades to `--surface-2` over 220ms; text goes to `--ink`.
- **Tablet/mobile:** rail is replaced by a fixed 70px top bar. The hamburger opens a full-screen
  overlay panel sliding in from the right (280ms, `cubic-bezier(.22,1,.36,1)`), with nav items
  staggered in at 40ms intervals. Body scroll locks while open. Escape and backdrop click close it.
- Icons beside each nav item are inline SVG (home, user, folder, phone), 14px, `currentColor`.

---

## 6. Animations and interactions

The reference uses Framer Motion. This build reproduces the observable behaviour with
**IntersectionObserver + CSS transitions** and a small amount of vanilla JS. No framework, no GSAP —
the effects are simple enough that a library would add weight without fidelity.

### Entrance (on load, hero only)

| Element | From | To | Duration | Delay | Easing |
|---|---|---|---|---|---|
| Pill | `opacity 0, translateY 12px` | natural | 600ms | 0 | `cubic-bezier(.22,1,.36,1)` |
| H1 (per word) | `opacity 0, translateY 20px` | natural | 700ms | 40ms stagger | same |
| Sub paragraph | `opacity 0, translateY 16px` | natural | 700ms | 320ms | same |
| CTA row | `opacity 0, translateY 16px` | natural | 700ms | 420ms | same |
| Hero images | `opacity 0, translateY 28px` | natural | 800ms | 520ms + 90ms stagger | same |

The word-level stagger on the H1 is a distinctive feature of the reference and is reproduced by
splitting the headline into word spans at build time (in the markup, not at runtime, so it is
crawlable).

### Scroll reveal (all other sections)

- Trigger: IntersectionObserver, `threshold: 0.15`, `rootMargin: 0px 0px -80px 0px`
- From `opacity 0, translateY 24px` → `opacity 1, translateY 0`
- Duration 700ms, easing `cubic-bezier(.22,1,.36,1)`
- Children stagger at **80ms** intervals via `--i` custom property on each child
- Fires **once** (`unobserve` after reveal)
- Fully disabled under `prefers-reduced-motion: reduce`

### Marquees (two, both infinite)

- Track duplicated once; `transform: translateX(0 → -50%)` on a linear infinite loop
- Developments marquee: 45s. Track record marquee: 60s
- `animation-play-state: paused` on hover
- Track record marquee arrows nudge the track by one card width (346px) with a 500ms eased transform,
  pausing the auto-loop for 3s after interaction

### Count-up counters (About page)

- Trigger on first intersection at 40% threshold
- 1600ms, `easeOutExpo`, integer stepping
- `RM1.3m` counts the numeric part and appends the suffix; `40+` and `11` count plain
- Respects `prefers-reduced-motion` by jumping straight to the final value

### Hover states (measured from the reference)

| Element | Behaviour |
|---|---|
| Primary button | Background lightens `#4A3429 → #5C4133`, 220ms |
| White button (on dark card) | `#FFF → #F0EDEA`, 220ms |
| Nav item | Background to `--surface-2`, text to `--ink`, 220ms |
| Service card | `translateY(-3px)`, 300ms `cubic-bezier(.22,1,.36,1)` |
| Project card | Inner image `scale(1.04)` over 600ms; overlay gradient deepens; card itself does not move |
| Hero image | `scale(1.03)`, 600ms |
| Text link | Underline wipes in left→right via `background-size`, 260ms |
| Marquee card | Track pauses; card gets a subtle `--line` border |

All transitions use `cubic-bezier(.22,1,.36,1)` unless stated. Nothing uses `ease` or `linear` except
the marquee loops.

---

## 7. Images

22 derived assets in `assets/img/`, 1.3MB total. All generated from two sources: her CV headshot and
the 16 cleared photographs from the Phase 1 audit. Originals were not modified.

| Asset | Size | Source | Slot |
|---|---|---|---|
| `avatar.jpg` / `avatar-lg.jpg` | 240² / 480² | CV headshot | Sidebar, top bar |
| `portrait.jpg` | 760×780 | CV headshot | About sections |
| `hero-1/2/3.jpg` | 746×600 | Rope access · pillar · building | Hero image row |
| `chip-1/2/3.jpg` | 135² | Rope access · extinguisher · genset | Inline H1 chips |
| `proj-*.jpg` ×8 | 900×560 | Various cleared | Project cards |
| `case-billing.jpg`, `case-pipe.jpg` | 1400×780 | Genset · excavation | Case study banners |
| `sidebar.jpg` | 600×390 | Rope access | Sidebar media tile |
| `work-pool.jpg` | 600×760 | Pool inspection, **children cropped out** | Reserve |
| `texture.jpg` | 1200×700 | Ceiling | Hero background wash |

**Resolution ceiling:** the source archive tops out at 1280px and the headshot at 368px wide. Assets
are upscaled with Lanczos where needed. Nothing is served above ~1.6× its display size, and the
headshot is effectively 1× at its 373px slot — acceptable at standard density, soft on retina. This
is a source limitation, documented in the Phase 1 audit, not a build decision.

All images use `loading="lazy"` (except the hero trio and avatar), `decoding="async"`, and explicit
`width`/`height` to prevent layout shift.

---

## 8. Implementation approach

**Static HTML + CSS + vanilla JS.** No build step, no dependencies, no framework.

Rationale: the reference is a marketing site with no application state. Six pages sharing one
stylesheet and one script reproduces it exactly, loads faster than the original, and stays editable
by anyone. A React or Next build would add tooling with no fidelity gain — and the machine has no
Node.js installed.

```
Nelfar Website/
├── index.html
├── about.html
├── projects.html
├── contact.html
├── work-southkey-mosaic.html
├── work-pipe-leakage.html
├── assets/
│   ├── css/site.css
│   ├── js/site.js
│   └── img/            (22 files)
├── RESUME_ANALYSIS.md
├── CONTENT_MAPPING.md
└── FRAMER_RECREATION_PLAN.md
```

- **Shared chrome** (sidebar, top bar, footer) is duplicated across the six pages rather than injected
  by JS, so every page is complete without scripting and remains crawlable.
- **CSS custom properties** for every token, so a brand palette can be swapped in one block if she
  later supplies one.
- **Progressive enhancement:** with JS disabled, all content is visible (reveal classes only apply
  once JS adds a `js` class to `<html>`), the marquees fall back to static rows, and the mobile menu
  falls back to a visible nav.
- **Accessibility:** semantic landmarks, one `<h1>` per page, visible focus rings, `aria-current` on
  the active nav item, `aria-expanded` on the menu button, labelled form fields, alt text on every
  image that describes what the photograph actually shows.
- **Contact form** posts via `mailto:` with a pre-filled subject and body, so it works with no
  backend and loses nothing. Ready to swap for a real endpoint.

---

## 9. Verification plan

Visual QA against the reference at **1440, 1280, 1024, 768 and 390px**, checking: type scale and
alignment switch, sidebar → top bar transition, grid column counts, card dimensions and radii,
button sizing, section rhythm, marquee behaviour, hover states, scroll-reveal timing, and reduced-motion.

Content QA against `RESUME_ANALYSIS.md` §12: no invented statistic, testimonial, award, price,
rating, follower count, client logo, certification or availability claim; no third-party personal
data; RM1.3 million described precisely as credit notes.
