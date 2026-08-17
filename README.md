# Nelfar Zulkifli — professional site

Static personal site for **Nelfar Zulkifli**, a property and strata management professional
based in Johor Bahru, Malaysia.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About — career, statistics, experience, education |
| `projects.html` | Projects — case studies, developments, full lists |
| `contact.html` | Contact — enquiry form |
| `work-southkey-mosaic.html` | Case study — utilities billing recovery |
| `work-pipe-leakage.html` | Case study — underground pipe leakage |

## Stack

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies.

- `assets/css/site.css` — all styling, design tokens as CSS custom properties
- `assets/js/site.js` — scroll reveals, mobile drawer, marquees, count-up statistics, mail form
- `assets/img/` — images

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

All content is drawn from Nelfar's CV. The build deliberately contains no invented
statistics, testimonials, awards, certifications or client endorsements.
`CONTENT_MAPPING.md` records every content decision and its source;
`FRAMER_RECREATION_PLAN.md` records the design specification.

## Notes

- Two items are flagged for confirmation in `CONTENT_MAPPING.md` — see "Open items".
- Photographs illustrate the type of work described and are not necessarily images of
  the specific development named on a card.
