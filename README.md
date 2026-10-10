# The Advent Piazza — 24-Day Interactive Advent Calendar

A responsive, high-performance, mobile-first Advent Calendar web experience centered around an illustrated European town piazza that gradually awakens and warms up across December (Dec 1 – Dec 24).

---

## 🌟 Key Features

1. **Interactive European Piazza Scene**:
   - Master illustrated backdrop with multi-layered progressive illumination (cathedral rose window, clock tower, street gas lamps, market stalls, tree lights, Star of Bethlehem).
   - Dynamic canvas falling snow particle simulation.
   - Smooth pan & drag exploration with touch gesture support (mobile/tablet/desktop) and on-screen zoom controls.

2. **24 Date-Gated Moments**:
   - Automatic unlocking based on December calendar dates (`Dec 1` through `Dec 24`).
   - Hotspot states: `Locked` (future), `Available` (unlocked, pulsing halo), `Completed` (radiant star badge).
   - Revisit previously unlocked days anytime.

3. **Daily Experience Modal Dialog**:
   - Looping animated motion vignettes (SVG/CSS animations: flickering flame, baker's oven steam, cathedral rose window, swinging bells, star of Bethlehem, etc.).
   - Scripture meditation, Daily Reflection, and practical Heart & Home activity.
   - **"Complete & Awaken Piazza"** button: triggers celebration chimes and progressively awakens visual elements on the main piazza!
   - **"Go Deeper"** link: direct link to existing Church resources, liturgies, and music.

4. **Web Audio Generative Soundscape**:
   - Built-in zero-dependency Web Audio API synthesizer for cathedral bell tolls, celebration sparkles, and UI taps.
   - Instant response, zero latency, no external audio files required (with toggleable sound preference).

5. **Localisation Architecture (i18n)**:
   - English master (`en`) + translations included for Spanish (`es`), French (`fr`), German (`de`), Italian (`it`), and Portuguese (`pt`).
   - Modular dictionary ready for all 24 Church language versions in `src/data/translations.js`.

6. **Accessible Calendar Drawer**:
   - Dedicated slide-out drawer accessible via the header for keyboard and screen-reader users or visitors who prefer structured list navigation.

7. **Creative Studio Review Toolbar**:
   - Docked expandable toolbar designed specifically for art directors, motion designers, and Church publishing teams:
     - **Date Simulation Slider** (`Dec 1` to `Dec 24`).
     - **"Studio Mode: Unlock All"** toggle.
     - **Instant Language Switcher**.
     - **Progress Reset** button.
     - **Embed Mode Simulator**.

---

## 🛠️ Project Structure

```
xmas/
├── index.html                     # HTML5 shell, Google Fonts, OpenGraph metadata
├── package.json                   # Vite configuration
├── public/
│   └── assets/
│       └── piazza_master.jpg      # Master illustrated European Piazza artwork
└── src/
    ├── main.js                    # Application coordinator & routing
    ├── style.css                  # Master CSS design system & responsive layout
    ├── audio/
    │   └── soundManager.js        # Web Audio API sound generator
    ├── components/
    │   ├── piazzaScene.js         # Interactive scene, hotspots, snow canvas & pan/zoom
    │   ├── dayModal.js            # Daily experience dialog with reflections & actions
    │   ├── calendarDrawer.js      # Accessible 24-day slide-out list drawer
    │   ├── studioBar.js           # Studio testing toolbar for date simulation
    │   └── vignettes.js           # 24 looping animated motion vignettes
    ├── data/
    │   ├── adventDays.js          # Master 24-day content, coordinates & church links
    │   └── translations.js        # i18n localization dictionary (24 languages)
    └── services/
        ├── dateGate.js            # December date gating & unlock rules
        └── storage.js             # LocalStorage state management
```

---

## 🚀 Quick Start & Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

Production build generates lightweight static assets in `dist/` ready to be hosted on any static hosting environment (AWS S3, Netlify, Cloudflare Pages, Azure, or Church CMS servers).

---

## 📦 Deployment & Embedding Options

### Option A: Standalone Hosting
Host the contents of `dist/` directly at a URL (e.g. `https://advent.church.org/`).

### Option B: iFrame Embedding into Existing Church Webpages
Embed into an existing CMS page using standard responsive iframe:
```html
<iframe 
  src="https://advent.church.org/?embedded=true" 
  title="The Advent Piazza Interactive Experience" 
  width="100%" 
  height="750" 
  style="border: none; border-radius: 12px; overflow: hidden;"
  allow="autoplay"
></iframe>
```
Appending `?embedded=true` automatically streamlines the header padding for embedded environments.

---

## 🎨 Asset Replacement Guide for the Studio

1. **Replacing the Master Illustration**:
   - Replace `public/assets/piazza_master.jpg` with the studio's final illustration (recommended dimensions: 2560x1440 or 1920x1080).
2. **Fine-Tuning Hotspot Coordinates**:
   - In `src/data/adventDays.js`, adjust the `coordinates: { x: X%, y: Y% }` values to align badges precisely with illustrated landmarks.
3. **Supplying Custom Animation / Lottie / Video**:
   - In `src/components/vignettes.js`, replace or wrap the SVG functions with Lottie player containers or `<video autoplay loop muted playsinline>` elements as motion assets are delivered.
4. **Updating Church Content & "Go Deeper" Links**:
   - In `src/data/adventDays.js`, update `goDeeperUrl` and `goDeeperLabel` for each day.
