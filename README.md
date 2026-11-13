# Qhelani Moyo — Portfolio

Personal portfolio: projects, skills, and a wildlife & travel photography gallery.
Plain HTML, CSS and JavaScript with no framework and no build step for the site itself.

## Structure

```
index.html          Home: hero, about, projects, photo highlights, contact
photography.html    Full gallery with location tabs + lightbox
styles.css          All styles (light/dark themes via CSS variables)
main.js             Shared behaviour: theme, nav, scroll effects, lightbox, photo cards
photography.js      Gallery page: tabs, masonry grid
content.json        ✏️  Photo content — the file you edit
content.js          ⚙️  Generated from content.json (don't edit by hand)
photos/             Original photos (source files, never modified)
photos/web/         ⚙️  Generated, resized WebP versions used by the site
scripts/optimize_images.py   Builds photos/web/ and content.js
sw.js               Service worker (offline support, always serves fresh pages)
favicon.svg
```

## Updating photos

1. Drop the original photo into `photos/` (or a location folder like `photos/botswana/`).
2. Reference it in `content.json`:
   - **Home page cards:** `throughMyLens[]` with `image`, `title`, `story`, `location`, `date`, plus an optional
     `focus` (CSS `object-position`, e.g. `"center 20%"`) to control the crop.
   - **Gallery page:** `photography.locations[]` with `id`, `title`, `hero` and `images`. Add a new object to add a location; the tabs build themselves.
3. Rebuild (requires Pillow: `pip install pillow`):

   ```bash
   python3 scripts/optimize_images.py
   ```

   This creates 480/960/1600px WebP versions (heroes up to 2400px), strips EXIF/GPS metadata,
   and regenerates `content.js`. Only new or changed photos are processed.

## Running locally

Open `index.html` directly, or serve the folder for the full experience (service worker etc.):

```bash
python3 -m http.server 8080
```

## Notes

- **Theme:** follows the visitor's system setting until they pick one with the toggle (remembered per browser).
- **Performance:** responsive WebP images with explicit sizes (no layout shift), lazy loading, inline SVG icons
  (no icon font), one rAF-batched scroll handler, and no loading screen.
- **Accessibility:** semantic landmarks, skip link, keyboard-operable menu/tabs/lightbox, visible focus styles,
  and `prefers-reduced-motion` support.
- **Deploying an update:** bump `VERSION` in `sw.js` when you change CSS/JS so returning visitors get the new files immediately.
