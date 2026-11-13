# ODW.ai — ondemandworld.github.io

[![Deploy static content to Pages](https://github.com/OnDemandWorld/ondemandworld.github.io/actions/workflows/static.yml/badge.svg)](https://github.com/OnDemandWorld/ondemandworld.github.io/actions/workflows/static.yml)

The marketing site for **[ODW.ai](https://odw.ai)** — an open-source, data-sovereign operational AI suite for small and medium businesses. Ten focused modules (Desk, Vault, Loop, Recap, Pulse, Voice, Hunt, Books, People, Shield) under one identity, one data boundary, one audit trail. Free to self-host.

Pure static site: vanilla HTML + CSS + JS. **No build step, no framework, no bundler, no package manager.**

- **Live:** <https://odw.ai> (also <https://ondemandworld.github.io>)
- **Locales:** English (`/`), 简体中文 (`/zh-cn/`), 繁體中文 HK (`/zh-hk/`)

---

## Quick start

Serve the repo root with any static file server, then open it in a browser:

```bash
python3 -m http.server 8000     # → http://localhost:8000
# or
npx serve .
```

> Use a server rather than opening `index.html` via `file://` — the Google Fonts
> `@import` in `styles.css` needs HTTP(S), otherwise type renders with fallbacks.

Changes take effect on reload. There is nothing to compile.

## Site structure

```
/
├── index.html              English home (responsive, 9 sections)
├── styles.css              Design tokens + all home/component styles
├── app.js                  Home progressive enhancement (nav, scroll-spy, reveals)
├── company.css             Shared chrome for the ported company/legal pages
├── company.js              Their enhancement (reading progress, TOC spy, reveals)
├── 404.html                GitHub Pages fallback → links to every main page
├── sitemap.xml robots.txt  SEO, canonical domain https://odw.ai
├── assets/products/        Product artwork (local, no external CDN dependency)
├── faq/                    FAQ hub + 11 module documents (+ faq/styles.css)
├── zh-cn/  zh-hk/          Locale homes + translated FAQ libraries
│
│   # Ported from ondemandworld.com — original WordPress URLs preserved:
├── about-us/               Company story + timeline
├── contact-us/             Email, Calendly, locations, HKT office hours
├── our-products/           AssetTech · Niftnack · TechHub Jobs + legacy domains
├── privacy-policy/         Privacy policy (verbatim)
├── terms-and-conditions/   Terms of use (verbatim)
├── house-rules/            Community house rules
└── 2024/01/…/              Three product posts at their original permalinks
```

### Legacy URL preservation

The old `ondemandworld.com` WordPress site is being phased out and its domain will
point here. Its content pages were rebuilt in the current theme **at their exact
old permalinks** (directory + `index.html`), so existing links keep working:

| Old URL | Now |
|---|---|
| `/privacy-policy/` | same path, new theme |
| `/terms-and-conditions/` | same path, new theme |
| `/house-rules/` | same path, new theme |
| `/about-us/` | same path, new theme |
| `/contact-us/` | same path, new theme |
| `/our-products/` | same path, new theme |
| `/2024/01/<product-slug>/` | same paths, new theme |

Legal text is carried over verbatim; these pages are English-only. Any URL not
listed above lands on `404.html`, which links to every main page.

## Design system

Tokens live in `styles.css` `:root` (warm paper / near-black ink / coral accent):

- `--paper*` cream backgrounds · `--ink*` text hierarchy · `--rule` dividers
- `--accent` `#FF5A1F` (coral-orange) · `--accent-2` `#FFB199` · `--accent-ink` `#B23A0E`
- Type: **Instrument Serif** (headlines) · **JetBrains Mono** (eyebrows/labels) · **Inter** (body)
- Automatic dark mode via `prefers-color-scheme`. Note the tokens flip, so always-dark
  chrome (company-page header/footer, hours panel) uses fixed hex values instead — see
  the comments in `company.css`.

## Localization

Three standalone HTML locale files (chosen over JS i18n for SEO). English is the source
of truth; ZH files carry a `DRAFT — needs native-speaker review` marker and a
`Last synced with English source` date. When English changes, propagate to both ZH files
and bump the date. `hreflang` alternates are bidirectional across all three. Product
names and the ODW.ai brand stay English. See `CLAUDE.md` for the full workflow.

## Advertising

The site is monetized with Google AdSense (publisher `ca-pub-8132571525903363`):

- `ads.txt` at the root declares the authorized seller line.
- The AdSense head snippet (`adsbygoogle.js`, `async`, `crossorigin="anonymous"`) is
  included on every content page: home + locale homes, all FAQ documents, the
  company/legal pages, and the product posts.
- It is intentionally **omitted** from `404.html` (error pages must not serve ads) and
  from the legacy `about/` app pages, which are preserved as-is.

## Deployment

Pushes to `main` trigger `.github/workflows/static.yml`, which checks out the repo,
uploads it as a Pages artifact, and deploys. **Only git-tracked files are published** —
local notes, transcripts and `v2-wip/` dumps are gitignored and never reach the site.

This is the org's single user/org Pages site. Public repo → free Actions minutes.
Soft limits: 100 GB bandwidth/mo, 10 builds/hr, ~1 GB source. Static only: no server
runtime, no form handlers (use a third-party service), no auth.

## Documentation

- `README.md` — this file (public overview)
- `CHANGELOG.md` — release history, including the legacy-site port
- `CLAUDE.md` — architecture, conventions, and guidance for AI-assisted edits

## License

The ODW.ai software suite is Apache 2.0 / MIT. Site content and branding
© OnDemandWorld Limited. Legacy app source code is released separately on
[GitHub](https://github.com/OnDemandWorld); branding and media assets are retained.