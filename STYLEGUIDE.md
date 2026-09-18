# Code & Design Style Guide: Jensen Portfolio

This document defines the architectural conventions, design system tokens, markup patterns, component specifications, and AI Studio prompt standards for the `jensenxyz-portfolio` repository. All new features, pages, components, and modifications must adhere to these guidelines to preserve visual consistency, cross-platform stability, and exceptional performance.

---

## 1. Architectural Principles

1. **Zero-Dependency Frontend**: The client application is written in clean, modern vanilla HTML5, CSS3, and ES6+ JavaScript. Avoid external UI libraries, CSS frameworks, or heavy client-side bundles.
2. **Dual-Hosting & Clean URL Architecture**: The site runs both as a static website (compatible with GitHub Pages) and as an Express Node.js application (`server.js`).
   - **Canonical Master Directories**: All subpages and project deep dives use dedicated directory structures with an `index.html` file (`cv/index.html`, `research/index.html`, `scantrust/index.html`, `funkacoins/index.html`, etc.).
   - **Clean URLs**: Always link to canonical clean URLs without extensions (e.g., `/cv`, `/research`, `/scantrust`). Both GitHub Pages and Express automatically resolve directory `index.html` files natively.
   - **Option A (Lightweight Static Redirects)**: To avoid file duplication and prevent content from drifting out of sync, all legacy routes and flat `.html` endpoints (`/cv.html`, `/download.html`, `/downloads.html`, `/download/index.html`, `/downloads/index.html`, `/research.html`, `/projects/scantrust.html`, etc.) are implemented as instantaneous 0-second HTML meta-refresh redirects pointing to their canonical counterpart:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta http-equiv="refresh" content="0; url=/cv">
         <link rel="canonical" href="/cv">
         <title>Redirecting to /cv</title>
         <script>window.location.replace("/cv");</script>
     </head>
     <body>
         <p>Redirecting to <a href="/cv">/cv</a>...</p>
     </body>
     </html>
     ```
   - **Single Source of Truth**: Always make content and structural edits exclusively to the canonical `<page>/index.html` files. Never create or edit redundant full-page copies.
3. **Performance First**: Minimal DOM overhead, passive event listeners, next-gen image formats (WebP), and an automated lossless image compression pipeline via Tinify.
4. **Mobile & iOS Safari Hardening**: Defensive CSS and JS techniques (such as `overflow-x: clip`, iOS-safe body scroll locks, and calibrated touch-gesture thresholds) are strictly enforced.

---

## 2. Design System & CSS Custom Properties

Global design tokens are declared on `:root` in `style.css`. Always use custom properties instead of hardcoded values.

### Color Palette

| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `--bg-light` | `#F8F4F3` | Warm beige background for hero, expertise, and media sections |
| `--bg-white` | `#FFFFFF` | Card surfaces, modals, and white sections |
| `--bg-dark` | `#070707` | Deep contrast black sections (passion, current work, footer) |
| `--text-dark` | `#000000` | Primary dark typography on beige/white backgrounds |
| `--text-light` | `#FFFFFF` | Primary light typography inside dark sections |
| `--text-grey` | `#666666` | Secondary labels, descriptions, and metadata |
| `--accent-orange` | `#F39C12` | Accent highlights, text underlines, badge highlights |

#### Neutral Border Tokens
- Light Card Borders: `#e2e8f0` / `#dfd7ce` / `#e6e0d9`
- Glass Overlay Borders: `rgba(255, 255, 255, 0.15)`
- Divider lines: `rgba(0, 0, 0, 0.05)`

### Typography System

The repository loads two primary font families from Google Fonts and uses system fonts as a fallback:
- **Page Titles and Main Section Headings**: `'Montserrat', sans-serif`
  - Font weights: `800`, `900`
  - Line height: `1.2`
  - Letter spacing: `-0.5px` on titles
- **All other text (Subtitles, Body, Navigation, Controls, etc.)**: `-apple-system, BlinkMacSystemFont, "Inter", sans-serif`
  - *Rule*: Use `-apple-system` by default for Apple devices; it will fallback to `"Inter"` for non-Apple devices.
  - Font weights: `400` (Regular), `500` (Medium), `600` (Semi-bold), `700` (Bold)
  - Line height: `1.6`

#### Scale Reference
- **Hero Title (`.hero-title`)**: `3.5rem` (Desktop) / `2.2rem` (Mobile)
- **Section Titles (`.section-title`)**: `2.5rem` (Desktop) / `1.9rem` (Mobile)
- **Card Titles (`h3`, `h4`)**: `1.2rem` – `1.5rem`
- **Large Body Text (`.text-large`)**: `1.1rem` – `1.2rem`
- **Standard Body (`p`)**: `1.0rem`
- **Micro-copy & Tags**: `0.75rem` – `0.85rem`

### Geometry & Border Radii

- **Standard Outer Radius (`--border-radius`)**: `30px` (Applied to project cards, study cards, and container boxes).
- **Inner Image Radius**: Images placed at the top of cards must use `border-top-left-radius: 29px; border-top-right-radius: 29px;` to avoid corner bleed against the 1px card border.
- **Button Radius (`--btn-radius`)**: `30px` (Pill-shaped buttons).
- **Hero Avatar Blob**: Use the signature organic asymmetrical blob radius:
  ```css
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  ```

### Depth & Glassmorphism

- **Header Blur**:
  ```css
  background-color: rgba(248, 244, 243, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  ```
- **Card Hover Elevation**:
  ```css
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  ```
  On hover:
  ```css
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.09);
  ```

---

## 3. Button & Link Component Catalog

All interactive buttons in this repository follow strict styling rules based on their hierarchy. When building or modifying pages, use the exact markup patterns below.

### 1. Primary Button (`btn-black`)
Used for primary call-to-actions (e.g., "CONTACT ME", "VIEW CV", "LINKEDIN").
- **Visuals**: Solid black background, white text, uppercase bold text, 30px pill border radius. On hover: transparent background with black text. (Inside `.bg-black` sections: white border, turns solid white on hover).
- **HTML**:
  ```html
  <a href="#contact" class="btn btn-black">CONTACT ME</a>
  ```

### 2. Small Primary Button (`btn-small btn-black`)
Used inside project cards, research cards, and presentation decks.
- **Visuals**: Compact padding (`10px 20px`), `0.8rem` font size, pill radius.
- **HTML**:
  ```html
  <a href="https://example.com" class="btn btn-small btn-black" target="_blank" rel="noopener noreferrer">READ MORE</a>
  ```

### 3. Secondary / Outline Button (`btn-outline`)
Used alongside primary buttons for secondary actions.
- **Visuals**: Transparent background, 2px solid `#000000` border, dark text. Inverts on hover to solid black background.
- **HTML**:
  ```html
  <a href="/cv" class="btn btn-outline">EXPLORE WORK</a>
  ```
- **CSS**:
  ```css
  .btn-outline {
      background-color: transparent;
      color: var(--text-dark);
      border: 2px solid var(--text-dark);
  }
  .btn-outline:hover {
      background-color: var(--text-dark);
      color: var(--text-light);
  }
  ```

### 4. PDF / Action Button with Icon (`btn-pdf`)
Used in academic study cards and CV downloads for file access.
- **Visuals**: Pill button with inline SVG icon, flex alignment, gap of 8px.
- **HTML**:
  ```html
  <a href="/research/paper.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-black btn-pdf">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      READ PAPER (PDF)
  </a>
  ```

### 5. Category Filter Pill Button (`filter-pill`)
Used in category filtering bars (e.g., Research page).
- **Visuals**: Capsule shape, 1px solid border `#dfd7ce`, subtle hover background. When `.active`: solid black background with white text.
- **HTML**:
  ```html
  <button type="button" class="filter-pill active" data-filter="all">All (7)</button>
  <button type="button" class="filter-pill" data-filter="ecology">Ecology (2)</button>
  ```

### 6. Text Link Button (`link-underline`)
Used for inline or secondary navigation without heavy button weight.
- **Standard Underline Link**:
  ```html
  <a href="/research" class="link-underline">Visit My Research Page &gt;</a>
  ```
- **Back Navigation Link with Left Arrow Icon**:
  ```html
  <a href="/" class="link-underline" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.95rem;">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back to Home
  </a>
  ```

---

## 4. Standard Icon System

The site uses two icon patterns:

### A. Inline SVG Icons (Feather-Style)
All UI controls (navigation arrows, close buttons, zoom controls, back buttons) use clean inline SVGs with standard 24x24 viewBox and stroke-based geometry (`stroke="currentColor"`, `stroke-width="2.2"` to `2.5"`).

- **Left Arrow (Back/Prev)**:
  ```html
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
  ```
- **Right Arrow (Next/Forward)**:
  ```html
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
  ```
- **Close (X)**:
  ```html
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
  ```
- **External Link Arrow**:
  ```html
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
  ```

### B. Illustrated Social & Contact Icons
In the contact section, branded outline illustrations in WebP format (`assets/linkedin_logo_outline.webp`, `assets/email_outline.webp`) are stacked vertically above full-width primary buttons within `.contact-item`:
```html
<div class="contact-item">
    <img src="assets/linkedin_logo_outline.webp" alt="LinkedIn Logo" class="icon-outline">
    <a href="https://www.linkedin.com/in/jensenearth/" target="_blank" rel="noopener noreferrer" class="btn btn-black">LINKEDIN</a>
</div>
```

---

## 5. HTML Markup & Layout Standards

### Document Structure & Metadata
Every HTML page must provide:
- UTF-8 charset and standard viewport declaration.
- Consistent Open Graph meta tags (`og:title`, `og:description`, `og:image`, `og:type`).
- Standard preconnect links to Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`).
- Standard set of multi-resolution favicons and web application manifest (`/assets/site.webmanifest`).

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title | JENSEN</title>
    <meta name="description" content="...">
    <meta property="og:title" content="...">
    <meta property="og:description" content="...">
    <meta property="og:image" content="/assets/hero-portrait.jpg">
    <meta property="og:type" content="website">

    <!-- Favicons -->
    <link rel="icon" type="image/png" href="/assets/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
    <link rel="shortcut icon" href="/assets/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
    <link rel="manifest" href="/assets/site.webmanifest">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Montserrat:wght@800;900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/style.css">
</head>
```

### Alternating Section Rhythm
Pages alternate between three background classes:
1. `.bg-beige`
2. `.bg-black`
3. `.bg-white`

When placing components inside `.bg-black`, text colors invert automatically via utility selectors (`.bg-black h1, .bg-black p { color: var(--text-light); }`), while nested cards remain white with dark text (`.bg-black .project-card { color: var(--text-dark); }`).

### Layout Utility Classes
- `.container`: Sets `max-width: 1200px; margin: 0 auto; padding: 0 20px;`.
- Spacing classes:
  - `.pt-large` / `.pb-large`: `100px` padding (reduced to `60px` or `70px` on mobile).
  - `.mt-spacer` / `.mb-spacer`: `40px` vertical margins.
  - `.mx-auto`: Centered horizontal margins.
  - `.text-center` / `.text-left`: Text alignment utilities.

---

## 6. CSS Guidelines & Architecture

### Global Reset & Horizontal Safety
To eliminate mobile Safari bouncing and horizontal micro-scrollbars caused by 100vw calculations or absolute elements, `overflow-x: clip` is set on both `html` and `body`:
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    overflow-x: clip;
    width: 100%;
}
```

### Responsive Breakpoints
1. **Desktop / Default**: > 1024px
2. **Tablet & Small Laptops**: `<= 1024px`
3. **Tablets & Phablets**: `<= 768px` (Primary mobile breakpoint)
   - Multi-column grids (`grid-template-columns: repeat(2, 1fr)`) transition to single columns (`1fr`).
   - Scale down `.hero-title` to `2.2rem` and `.section-title` to `1.9rem`.
   - Reorder grid areas to place portrait images above text.
4. **Mobile Phones**: `<= 480px`
   - Adjust padding (`pt-large` -> `60px`).
   - Compact button sizing and single-column full-width layouts.

---

## 7. JavaScript Coding Standards

### Server-Side (Node.js & Express)
- **Module Format**: Pure ES Modules (`import`/`export`). Set `"type": "module"` in `package.json`.
- **File Paths**: Use `fileURLToPath` and `path.dirname` for ESM path resolution:
  ```javascript
  import path from 'path';
  import { fileURLToPath } from 'url';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  ```

### Client-Side (Vanilla JS)
- Wrap all page initialization code inside `document.addEventListener("DOMContentLoaded", () => { ... })`.
- Use `const` by default, `let` when reassignment is needed; never use `var`.
- Expose global callback functions explicitly on `window` when required by inline markup event handlers (`window.openOverlay = openOverlay;`).

### Safe iOS Body Scroll Locking
```javascript
let savedScrollY = 0;
let isScrollLocked = false;

function lockBodyScroll() {
    if (isScrollLocked) return;
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    
    isScrollLocked = true;
}

function unlockBodyScroll() {
    if (!isScrollLocked) return;
    
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    
    window.scrollTo(0, savedScrollY);
    isScrollLocked = false;
}
```

---

## 8. Media & Asset Standards

1. **Format Hierarchy**:
   - **Mockups, Screenshots, & Presentations**: Modern WebP (`.webp`).
   - **Photographs & Portraits**: Compressed JPEG (`.jpg`).
   - **Diagrams & Vector Icons**: Clean SVG (`.svg`).
   - **Video Demos**: MP4 with H.264 encoding. Required attributes:
     ```html
     <video controls playsinline muted loop autoplay preload="metadata">
     ```
2. **Automated Asset Optimization Pipeline**:
   - All newly added images are tracked and optimized using `scripts/compress-images.js`.
   - The script hashes image files (SHA-256) and stores state in `compressed-images.json` to prevent consuming Tinify API quota on untouched assets.
   - Run optimization manually via:
     ```bash
     TINIFY_API_KEY=your_key node scripts/compress-images.js
     ```
   - Automated in CI via `.github/workflows/tinify-compress.yml`.
3. **Directory & Subfolder Organization**:
   - **Global & Shared Assets**: Placed directly in `/assets/` (favicons, manifest, global brand outlines, personal portrait).
   - **Module & Project Subfolders**: Grouped into dedicated subfolders under `/assets/<section>/`:
     - `/assets/scantrust/`: All banners, diagrams, mockups, and client logos for Scantrust.
     - `/assets/research/`: All scientific study preview graphics (`science-*.png`).
   - **Downloadable Deliverables**: Standalone documents and manuscripts (such as printable CV PDFs and research study PDFs) reside within their route directories (`/cv/*.pdf`, `/research/*.pdf`).

---

## 9. AI Studio Prompting Cheatsheet

When instructing Google AI Studio or an AI web assistant to build or modify elements, use these standardized phrases:

- **Add a project card**: *"Create a project card for [Name] inside the carousel with title, description, and a small primary button (`btn-small btn-black`) labeled 'READ MORE'."*
- **Add a study paper**: *"Add a study card with an image preview and a PDF action button (`btn-pdf`) labeled 'READ PAPER (PDF)' with download SVG icon."*
- **Add a secondary action**: *"Add a secondary outline button (`btn-outline`) next to the primary button with text '[Text]'."*
- **Add a back navigation link**: *"Add a text link button (`link-underline`) with an inline left arrow SVG pointing to '/back'."*
- **Add a dark section**: *"Add a `.bg-black` section with `.container.pt-large.pb-large` containing white headings and white-bordered inverted primary buttons."*

## 10. Subpage Global Layout Standards

### Header (Back to Home)
Subpages should reuse the same sticky header as the homepage, but additionally include a "Back to Home" button using the `.header-flex` and `.back-to-home` utility classes:
```html
<header class="site-header">
    <div class="container header-flex">
        <a href="/" class="logo">JENSEN ✨</a>
        <a href="/" class="link-underline back-to-home">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
        </a>
    </div>
</header>
```

### Breadcrumbs
For nested content like case studies, standardize breadcrumbs using the `.breadcrumb` class:
```html
<div class="breadcrumb">
    <a href="/">Home</a> > Scantrust: Product QR Codes & SaaS
</div>
```

### Footer
All subpages throughout the site must reuse the exact same black footer as the homepage:
```html
<footer class="site-footer bg-black">
    <div class="container footer-content">
        <div class="footer-links">
            <a href="/">Home</a>
            <a href="/research">Research</a>
            <a href="https://www.linkedin.com/in/jensenearth/" target="_blank">LinkedIn</a>
        </div>
        <div class="footer-copy">
            Made with ♥️ & AI on Earth © JENSEN S.Z. ✨
        </div>
    </div>
</footer>
```
