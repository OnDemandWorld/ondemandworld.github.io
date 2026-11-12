# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing site for **ODW.ai** (served at `ondemandworld.github.io`, mapped to `https://odw.ai`) — an open-source operational AI suite for SMEs. Vanilla HTML + CSS + JS, no build tooling, no framework, no bundler. Multi-page: a responsive home page, a FAQ library (`faq/`), and company/legal pages ported from the old `ondemandworld.com` WordPress site at their original URLs. See `README.md` for the public overview and `CHANGELOG.md` for history.

## Development

There is no build step, no package manager, no test runner, no linter. Serve the repo root with any static file server and open in a browser:

```bash
# pick any of these
python3 -m http.server 8000
npx serve .
open index.html   # file:// works, but fonts from Google Fonts need http(s)
```

Changes take effect on reload. Deploy is automatic via `.github/workflows/static.yml` on pushes to `main` (GitHub Pages).

## Architecture

**v2 — responsive, semantic HTML.** `index.html` is a fluid, mobile-first page (no scale transform, no fixed canvas). Real `<section>`s with `clamp()` type and CSS grid; `styles.css` holds the design tokens plus all component styles; `app.js` is progressive enhancement only (mobile nav, scroll-spy, copy buttons, sticky CTA, reveal-on-scroll). The site is fully usable without JS.

- Home sections (IDs used for nav anchors + scroll-spy): `cover`, `why-now`, `platform`, `modules`, `open-source`, `sovereign`, `solutions`, `services`, `contact`.
- `.section.dark` = inverted band (contact). Because `--ink`/`--paper` flip under `prefers-color-scheme: dark`, "dark" bands render light in dark mode — `styles.css` has a dark-mode override keeping the footer links readable there.
- **Subpages** live in their own directories and share the root `styles.css`: `faq/` (hub + 11 module documents, with their own `faq/styles.css`) and the ported company pages (below), which share `company.css` + `company.js`.
- **v1 legacy files** (`styles-v1.css`, `app-v1.js`, `v2-wip/`, the `*.zip` dumps, session transcripts) are reference-only and gitignored — not part of the live site. The old slide-based 1920×1080 Genspark export no longer describes the current page; the vestigial `data-object` attributes remain only on the home page.

**Type system** (classes in `styles.css`):
- `.serif` — Instrument Serif (headlines)
- `.mono` — JetBrains Mono (eyebrows, stats, labels)
- `.eyebrow` — mono, uppercase, accent-colored, with `0.18em` letter-spacing
- Default body = Inter

**Color tokens** (`styles.css` `:root`):
- `--paper` / `--paper-2` / `--paper-3` — warm cream backgrounds
- `--ink` / `--ink-2` / `--ink-3` / `--ink-4` — near-black text hierarchy
- `--accent` (`#FF5A1F`, coral-orange) — primary accent, used for eyebrows, active nav, highlights
- `--rule` — section dividers

**Navigation** — desktop (≥1200px): fixed left `.sidebar` (240px, `--ink` background) with scroll-spy via `IntersectionObserver` in `app.js`. Below 1200px: a fixed `.topbar` (logo + GitHub pill + `.nav-toggle`, hamburger → X) opens a `.mobile-nav` sheet; it closes on `.nav-backdrop` click, any nav-link click, or Escape. A `.sticky-cta` bar shows on mobile and hides near the contact section. Subpages (FAQ, company) use breadcrumbs + a dark cross-link footer instead of the sidebar.

## Hosting constraints (GitHub Pages)

This repo (`ondemandworld.github.io`) is the org's one **user/org site** — the special repo name means the site serves at `https://ondemandworld.github.io/`. Any other Pages-enabled repo in the org becomes a project site at `ondemandworld.github.io/<repo-name>`. There can be only one user/org site per account.

**Static only.** No server-side runtime, no databases, no build step on the server. HTML/CSS/JS shipped directly. This constrains what the site can do — no server-rendered pages, no form handlers (use a third-party service), no auth.

**Deploy pipeline.** `.github/workflows/static.yml` runs on push to `main`, uploads the repo as a Pages artifact, and deploys. Because the repo is public, this costs nothing — public-repo Actions minutes are free. If the repo ever goes private, it burns from the org's Actions minutes (2,000/mo on Free; Team/Enterprise required to publish Pages from a private repo).

**Soft limits** (GitHub may suspend or throttle if breached):
- 100 GB bandwidth/month
- 10 builds/hour
- 1 GB recommended source-repo size

**Jekyll.** Not used here — the site is plain static HTML. If Jekyll is ever introduced, only GitHub's whitelisted "safe" themes and plugins run server-side. Anything else must be built locally and the generated output committed.

**Theme variants.** The current pattern is CSS custom properties in `:root` + `.slide-dark` for the dark section. Adding light/dark/accent/high-contrast variants is just more tokens and a class-swap — no platform constraint against it. Multi-theme support is purely a front-end concern.

## Localization

The site ships in three locales as **separate HTML files** (one per locale), chosen over JS-driven i18n because the repo is pure static and SEO matters for a marketing site. Each locale is a complete, standalone HTML file with identical structure but translated text.

**Folder structure & URLs**

```
/
├── index.html           English            → ondemandworld.github.io/
├── styles.css           (shared)
├── app.js               (shared; includes initLangSwitcher)
├── zh-cn/
│   └── index.html       简体中文 (mainland) → ondemandworld.github.io/zh-cn/
└── zh-hk/
    └── index.html       繁體中文 (HK)       → ondemandworld.github.io/zh-hk/
```

**BCP 47 codes**: `en`, `zh-CN` (Simplified, mainland), `zh-HK` (Traditional, Hong Kong). Set on `<html lang="...">` per file.

**hreflang**: every locale file has identical `<link rel="alternate" hreflang="...">` tags for all three locales plus `x-default` pointing at the English root. These must be bidirectional — Google ignores them otherwise.

**Product names stay English** (`ODW Desk`, `ODW Vault`, `ODW Loop`, `ODW Recap`, `Voice`, `Pulse`, `Hunt`, `Books`, `People`, `Shield`). Optionally paired with a Chinese descriptor alongside (e.g., `Vault 知識庫`), but the English name is always primary. `ODW.ai` (the brand) is never translated.

**Translation workflow**

- English is the source of truth.
- ZH-CN and ZH-HK files are AI-drafted and marked `<!-- Translation status: DRAFT — needs native-speaker review before publish -->` at the top. Do NOT remove this marker until a native speaker approves.
- `<!-- Last synced with English source: YYYY-MM-DD -->` on the line below — update when propagating English changes to the translations.
- When English content changes, propagate to both ZH files and update the sync date. Drift is a real risk since there's no automated sync.

**CJK typography**

`styles.css` uses system fonts for CJK (no web fonts — CJK web fonts are 5–15 MB each). The `body` stack includes PingFang SC/TC, Microsoft YaHei/JhengHei, Noto Sans CJK; `.serif` includes Songti, SimSun, PMingLiU, Noto Serif CJK. The browser picks the right CJK glyph per character.

Locale-scoped rules tighten eyebrow letter-spacing (Chinese uses minimal spacing) and bump serif line-height (CJK glyphs sit taller):
```css
:root:lang(zh-CN) .eyebrow, :root:lang(zh-HK) .eyebrow { letter-spacing: 0.04em; }
:root:lang(zh-CN) .serif,  :root:lang(zh-HK) .serif  { line-height: 1.15; }
```

**zh-CN vs zh-HK** — not just a character conversion. Key differences the translator must honor:

| English | zh-CN | zh-HK |
|---|---|---|
| software | 软件 | 軟件 |
| information | 信息 | 資訊 |
| modules | 模块 | 模組 |
| privacy | 隐私 | 私隱 (not 隱私) |
| desk (furniture) | 台 | 枱 |
| video | 视频 | 視頻 (HK prefers 影片 in some contexts) |
| digital (marketing) | 数字 | 數碼 |

**Language switcher**

A `.nav-lang` block sits at the bottom of the nav sidebar on every locale file, with three links (`data-lang="en|zh-CN|zh-HK"`). `app.js`'s `initLangSwitcher()`:
- Detects current locale from `window.location.pathname`.
- Adds `.active` to the matching link.
- Rewrites each link's `href` to preserve the current section hash — so switching languages from `#modules` lands on `/zh-cn/#modules`, not `/zh-cn/`.

**CSS/JS paths**: locale files live one level deeper, so they reference `../styles.css` and `../app.js` (not `./`).

**Adding a 4th locale** (e.g., Japanese):

1. Create `ja/` directory, copy `index.html`, set `<html lang="ja">`.
2. Translate all visible text; keep section IDs, product names, hreflang structure.
3. Add the new `hreflang="ja"` tag to **all four** HTML files (including the existing three).
4. Add a new link to `.nav-lang` in all four files.
5. Update `.gitignore` to allow `!ja/` and `!ja/index.html`.
6. Update this section.

## Company pages (ported from ondemandworld.com)

The old WordPress site at `ondemandworld.com` is being phased out and its domain will point here. To keep old links alive, its content pages were ported into the v2 theme **at their exact WordPress permalinks** (directory + `index.html`, so `/privacy-policy/` etc. resolve unchanged on GitHub Pages):

```
/about-us/  /contact-us/  /our-products/
/privacy-policy/  /terms-and-conditions/  /house-rules/
/2024/01/assettech-a-tokenization-solution-based-on-the-erc-1400-sto-security-token-offering-standard/
/2024/01/niftnack-nft-platform-for-collecting-digital-assets-memberships-and-loyalty-points/
/2024/01/techhub-jobs-recruitment-platform-with-tokenomics/
```

- **Shared chrome:** `company.css` + `company.js` at the repo root (one level up from each page; three up from the `/2024/01/` posts). They reuse the tokens in `styles.css` and mirror the FAQ subpage design language (dark header band, overlapping container, breadcrumbs, card sections, dark cross-link footer). `company.js` is progressive enhancement only: reading-progress bar, TOC scroll-spy, staggered reveals — every page is fully usable without JS.
- **Always-dark chrome:** the header band, hours panel, and footer use *fixed* hex colors (`#14110F` / `#F6F2EC` / `#FFB199`), **not** `--ink`/`--paper`. Those tokens flip in dark mode and would invert the bands to cream, stranding light-on-dark text at unreadable contrast. Likewise `--accent-ink` (a light-background color) is swapped to `--accent-2` on dark surfaces via a `prefers-color-scheme: dark` block. Keep this in mind when editing.
- **Legal text is verbatim** from the old site (only obvious typos/list-flattening fixed). These pages are **English-only** — do not machine-translate legal documents; the ZH footers link to the English pages.
- **Footer wiring:** the contact-section footer in all three locale `index.html` files links to these pages (`footer-links` + `footer-meta`). `styles.css` has a dark-mode override so those links stay readable when the `.section.dark` band flips to cream.
- **`.gitignore` is an allowlist** — every new directory/file must be explicitly un-ignored (each parent dir too). `robots.txt` needs its `!` rule *after* the `*.txt` exclusion. `sitemap.xml` + `robots.txt` list the preserved URLs under `https://odw.ai`.
- **`404.html`** is the GitHub Pages fallback and links to every ported page, so any missed old URL lands somewhere useful.
- Product images live in `assets/products/` (downloaded from the old CDN so the site doesn't depend on it surviving).

## Conventions worth knowing

- Fonts load via Google Fonts `@import` at the top of `styles.css` — they require HTTP(S) to load, so `file://` preview will render with fallbacks.
- The `data-object="true"` attributes scattered through `index.html` are vestigial (from the Genspark slide export). Leave them — they're harmless, and removing them is a pointless diff.
- The nav links in `index.html` must match the section IDs for scroll-spy to work. If you rename an `id`, update the corresponding `<a href="#...">` in the nav.
- The entire site is ~60KB per locale file (`index.html`, `zh-cn/index.html`, `zh-hk/index.html`). Keep each file self-contained — no reason to split into components or introduce a templating system.
- When editing English content, propagate the change to both ZH files and bump the "Last synced" date at the top. Nothing enforces this automatically.
- The language-switcher links in the nav must be identical across all three locale files; `app.js` handles active-state and hash preservation at runtime.
