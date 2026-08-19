# Nelfar Zulkifli — professional site

Static personal site for **Nelfar Zulkifli**, a property and strata management professional
based in Johor Bahru, Malaysia.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About — career, statistics, experience, education |
| `projects.html` | Projects — case studies, developments, full lists |
| `gallery.html` | From the field — photographs and clips from live sites |
| `contact.html` | Contact — enquiry form |
| `work-southkey-mosaic.html` | Case study — utilities billing recovery |
| `work-pipe-leakage.html` | Case study — underground pipe leakage |
| `work-*.html` (six more) | One page per development, chained by a "Next" button |

## Stack

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies.

- `assets/css/site.css` — all styling, design tokens as CSS custom properties
- `assets/js/site.js` — scroll reveals, mobile drawer, marquees, count-up statistics, mail form,
  gallery lightbox, in-view clip playback, highlight reel, image parallax
- `assets/img/` — images; `assets/img/field/` is the working photography used by the gallery
- `assets/video/` — two short clips, each with a poster frame, no audio track

`site.css` and `site.js` are referenced with a `?v=` query. **Bump it whenever either file
changes**, or returning visitors keep the cached copy and the page half-works.

Interactions use IntersectionObserver and CSS transitions, and degrade gracefully:
with JavaScript disabled all content remains visible and navigable. `prefers-reduced-motion`
is respected throughout.

## Running locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Contact form

The form composes a pre-filled email via `mailto:` so it works without a backend.
To use a real endpoint instead, add an `action` to the `<form>` in `contact.html`
and remove its `data-mailto` attribute.

## Content

All content is drawn from Nelfar's CV and from the career statement she wrote in August 2026,
which is reproduced essentially verbatim on the Home and About pages and now takes precedence
over the CV where the two differ. The build deliberately contains no invented statistics,
testimonials, awards, certifications or client endorsements.
`CONTENT_MAPPING.md` records every content decision and its source;
`CREDITS.md` records image provenance and the identifiable-people position;
`FRAMER_RECREATION_PLAN.md` records the design specification.

## Notes

- Nine items are flagged for confirmation in `CONTENT_MAPPING.md` — see "Open items". Two of
  them matter before the site is promoted: the 2021 role date, and whether the townhall
  photographs of owners are cleared to publish.
- Photographs illustrate the type of work described and are not necessarily images of
  the specific development named on a card.
