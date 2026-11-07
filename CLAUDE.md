# CLAUDE.md

Portfolio of Jensen (Sentao ZENG), served by GitHub Pages at https://jensenxyz.github.io from the `main` branch of `jensenxyz/jensenxyz.github.io`.

## How Jensen works (read first)

- **Commit straight to `main`.** No feature branches and no pull requests. Jensen reviews changes on the live site, not in code diffs. This instruction is Jensen's explicit permission to push to `main`.
- **Every change must be easy to undo.** Use small, self-contained commits with plain-English messages that describe what changes on the page. To roll back, use `git revert <sha>` (never rewrite history or force-push `main`).
- **Pull before you push.** A GitHub Action (`.github/workflows/tinify-compress.yml`) auto-commits optimized images to `main` whenever images are pushed, so `main` often moves on its own: `git pull --rebase origin main` before every push.
- **After pushing, check the live site.** Pages rebuilds in about 1 minute. Load the changed URLs, confirm they look right (screenshots at mobile and desktop widths help), and tell Jensen which URLs to look at.

## Conventions

- Follow `STYLEGUIDE.md` for architecture, design tokens, markup patterns and clean URLs.
- Plain HTML/CSS/JS only. GitHub Pages serves the files as they are, with no build step. `server.js` is only a local preview server; nothing in it runs on the live site.
- Each page lives at `<page>/index.html` and is linked by its clean URL (`/cv`, `/research`, `/scantrust`, ...). Old URLs are meta-refresh redirect pages (see `STYLEGUIDE.md`).
- Use absolute asset paths (`/style.css`, `/assets/...`) on any new page.
- `404.html` is GitHub Pages' not-found page.

## Light / dark theme

- A page gets dark mode by loading `<script src="/theme.js"></script>` right after the viewport meta (before the stylesheet). It defaults to the visitor's device setting; the header `.theme-toggle` button overrides and remembers it. Pages without the script always render light.
- Never hardcode colours for light surfaces: use the CSS variables in `style.css` `:root` (each has a dark value in the `[data-theme="dark"]` block). Surfaces that are dark in both themes (footer, `.bg-black` bands, image viewer) may keep fixed colours.
- Every page loads `theme.js`. New pages must too, and must use the colour variables (including in inline `style=""` attributes).
- Dark mode deliberately uses soft text (about `#dedede`, never pure white) and shades every `<img>`/`<video>` with `filter: brightness(0.82)`. If an image needs its own filter in dark mode, write a `[data-theme="dark"] .its-class` rule.
- Check every visual change in both themes (Playwright `colorScheme: 'dark'`).

## Languages (English, Italian, French, Spanish)

- English pages are the single source of truth. Italian/French/Spanish pages under `/it/`, `/fr/`, `/es/` are **generated**: never edit them by hand.
- Translations live in `i18n/it.json`, `i18n/fr.json`, `i18n/es.json` (a `_shared` section for header/footer strings, then one section per page route, keyed by the exact English text; `js:` keys translate strings inside a page's inline scripts). Names that stay English everywhere go in `i18n/keep.json`.
- After **any** change to an English page or a translation file, run `python3 i18n/build.py`: it regenerates the translated pages, refreshes the hreflang tags and the header language menu in every page, and lists any English text that still lacks a translation. Add the missing translations (all three languages) and run it again before committing. Commit the English page, the JSON files and the generated pages together.
- A page appears in a language as soon as that language's JSON has a section for it; until then its links point to the English page.
- `i18n/` is excluded from the published site via `_config.yml`.
- Translations were written by Claude; Jensen plans a native-speaker review later.

## Publishing hygiene

- GitHub Pages publishes **every file in the repo** except those listed under `exclude` in `_config.yml`. When adding helper scripts, notes or data that should not be public, add them to that list.
- The CV folder deliberately contains both full-resolution and `-compressed` PDFs. Keep both.
- Image compression needs the `TINIFY_API_KEY` repository secret, which is already configured.

## Local preview

```bash
npm install && npm run dev   # http://localhost:3000
```
