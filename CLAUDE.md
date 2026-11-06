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
- Pages converted so far: home, CV, research, 404, happyhour, vibesapp, metro. funkacoins and scantrust still need their inline colours tokenised before they load `theme.js`.
- Check every visual change in both themes (Playwright `colorScheme: 'dark'`).

## Publishing hygiene

- GitHub Pages publishes **every file in the repo** except those listed under `exclude` in `_config.yml`. When adding helper scripts, notes or data that should not be public, add them to that list.
- The CV folder deliberately contains both full-resolution and `-compressed` PDFs. Keep both.
- Image compression needs the `TINIFY_API_KEY` repository secret, which is already configured.

## Local preview

```bash
npm install && npm run dev   # http://localhost:3000
```
