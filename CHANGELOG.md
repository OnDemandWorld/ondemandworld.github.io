# Changelog

All notable changes to this site are documented here. Dates are YYYY-MM-DD.

## 2026-11-13 — Legacy-site port, documentation, and release

Ported the content pages of the old `ondemandworld.com` WordPress site into the
current v2 theme so the domain can move to ODW.ai without breaking existing links,
then tidied the documentation and released to GitHub Pages.

### Added — ported pages (original WordPress URLs preserved)
- `/privacy-policy/` — full privacy policy, 9 numbered sections + table of contents.
- `/terms-and-conditions/` — full terms of use, 17 sections + table of contents.
- `/house-rules/` — community house rules.
- `/about-us/` — company story merged from the old About page and home-page history,
  presented as a 2009→present timeline.
- `/contact-us/` — contact cards (hello@odw.ai, office@ondemandworld.com, Calendly),
  locations (Shanghai / Hong Kong / Beijing), and HKT office-hours panel.
- `/our-products/` — AssetTech, Niftnack, TechHub Jobs cards + legacy-app/domain portfolio.
- `/2024/01/assettech-…/`, `/2024/01/niftnack-…/`, `/2024/01/techhub-jobs-…/` — the three
  product posts at their exact old permalinks, including the AssetTech open-source
  announcement with its four GitHub repository links.
- `404.html` — GitHub Pages fallback linking to every main/ported page.
- `sitemap.xml` + `robots.txt` — canonical URLs under `https://odw.ai`.
- `assets/products/` — product artwork downloaded from the old CDN so the site no
  longer depends on it surviving.

### Added — shared chrome & behavior
- `company.css` — shared stylesheet for all ported pages, mirroring the FAQ subpage
  design language (dark header band, overlapping container, breadcrumbs, card
  sections, dark cross-link footer). Always-dark chrome uses fixed hex values so it
  stays readable when the `--ink`/`--paper` tokens flip in dark mode; `--accent-ink`
  links swap to bright salmon on dark surfaces. Includes print styles for legal docs
  and a palette-themed scrollbar.
- `company.js` — progressive enhancement only: reading-progress bar, TOC scroll-spy,
  staggered scroll reveals. Every page remains fully usable without JS.

### Changed
- Home + both locale footers now link to the ported pages (`footer-links` and
  `footer-meta`); ZH labels localized and "Last synced" dates bumped to 2026-11-12.
- `styles.css` — footer link styles plus a dark-mode override keeping them readable
  when the `.section.dark` contact band flips to cream.
- `.gitignore` — allowlisted every new directory/file (each parent dir included);
  `!robots.txt` placed after the `*.txt` exclusion; `README.md`, `CHANGELOG.md`,
  `CLAUDE.md` now tracked.

### Fixed
- Dark-mode contrast defects found by screenshotting both color schemes at desktop
  and mobile widths: inverted header/hours/footer bands and unreadable dark-orange
  links on dark surfaces (new pages and the home footer).

### Documentation
- Added `README.md` (public overview, structure, legacy-URL table, deploy notes).
- Added this `CHANGELOG.md`.
- `CLAUDE.md` corrected from the stale v1 slide-layout description to the actual v2
  responsive architecture, and gained a "Company pages (ported)" section.

### Verification
- Crawled 69 URLs: every page returns 200 and every internal link, stylesheet, script,
  and image resolves.
- `node --check company.js` passes.
- Screenshotted light + dark mode, desktop + mobile; confirmed no overflow, clipping,
  or unreadable text; TOC scroll-spy and reading progress observed working.

## 2026-07-10 — v2 release
- Responsive v2 home (English) with FAQ integration, multi-language support
  (zh-CN / zh-HK), and accessibility improvements (skip link, focus states, tap targets).
- FAQ library: hub + 11 module documents with search, expand/collapse, and print.
- Logo light/dark switching fixes; v1 CSS/JS retained for the Chinese pages.

## 2026-07-02 — v1
- Initial slide-based marketing site exported from a Genspark deck, scaled to viewport.