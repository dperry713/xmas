# The Advent Piazza — 24-Day Interactive 3D Advent Calendar

A responsive, high-performance, mobile-first 3D Advent Calendar web experience centered around an interactive 3D European town piazza that progressively awakens and develops across December (Dec 1 – Dec 24).

---

## 🌟 Key Features & Engineering Highlights

1. **Full-Screen 3D European Piazza Scene**:
   - Built with **Three.js** featuring high-fidelity architectural facade textures, wet cobblestones dusted with snow, and a 360° celestial twilight skydome.
   - Smooth 360° orbit controls (mouse drag & touch gestures) with responsive distance clamping and smooth camera fly-to interpolation for all 24 landmarks.
   - Framerate-independent volumetric 3D snow particle simulation.
   - Framerate-independent celestial skydome rotation.

2. **Progressive 3D Awakening (Days 1–24)**:
   - Day 1: North wrought-iron gas street lamp blazes to life with warm 3D dynamic point light.
   - Day 2: Old Town Bakery glows with warm hearth fire.
   - Day 3: Volumetric 3D snow storm settles over rooftops and cobblestones.
   - Day 4: Central Stone Fountain illuminates with icy crystalline light and reflections.
   - Day 5: Spiced Wassail / Cider market stall with striped awning and cauldrons.
   - Day 8: Cathedral Rose Window illuminates from within with stained-glass radiance.
   - Day 11: The Grand 3D Evergreen Christmas Tree is erected in the square, adorned with tiered snow frosting and reflective baubles.
   - Day 19: 48 multi-colored sparkling fairy lights ignite across the entire Christmas tree.
   - Day 23: Overhead canopy of light festoons connects the historic rooftops.
   - Day 24: The blazing 3D Star of Bethlehem crowns the tree on Christmas Eve in triumphant illumination.

3. **Responsive 3D Hotspot Badges**:
   - Screen-space projection anchored to 3D world space coordinates with distance-aware scaling (badges scale naturally as camera zooms in and out).
   - Frustum and margin occlusion culling (hidden when behind camera or out of view).
   - Accessible 44×44px minimum tap targets adhering to WCAG AAA touch guidelines.

4. **Daily Experience Modals**:
   - 24 animated looping motion vignettes (SVG/CSS).
   - Scripture meditation, daily reflection, and practical "Heart & Home" activity.
   - "Complete & Awaken Piazza" button that triggers celebration audio and awakens the 3D scene.
   - "Go Deeper" button linking directly to official Church resources.

5. **Audio Engine**:
   - Procedural Web Audio API additive synthesis for cathedral bell tolls, celebration sparkles, and UI taps (zero external audio file latency).

6. **Studio Review & Publishing Toolbar**:
   - Date simulation slider (`Dec 1` to `Dec 24`).
   - "Studio Mode: Unlock All" instant review toggle.
   - Instant language switcher (English master + Spanish, French, German, Italian, Portuguese, and scalable to 24 languages).
   - Progress reset button and embed mode simulator.

---

## 🛠️ Project Structure

```
xmas/
├── index.html                     # HTML5 shell, Google Fonts, OpenGraph metadata
├── package.json                   # Scripts, Vite, Three.js, Vitest & TypeScript
├── tsconfig.json                  # TypeScript compiler options
├── LICENSE                        # MIT License
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI (typecheck, test, build)
├── scripts/
│   └── compress-textures.js       # KTX2 GPU texture compression pipeline utility
├── tests/
│   └── advent.test.ts             # Vitest test suite (dataset, date gate, i18n, storage, quality)
├── public/
│   └── assets/
│       ├── cobblestones.jpg       # High-fidelity cobblestones texture
│       ├── cathedral_facade.jpg   # Gothic Cathedral architectural facade
│       ├── townhouses_facade.jpg  # Medieval townhouses facade
│       ├── sky_panorama.jpg       # Winter twilight sky panorama
│       └── piazza_master.jpg      # Master illustration concept
└── src/
    ├── main.ts                    # Application coordinator (TypeScript)
    ├── style.css                  # Responsive design system & 3D pin overlays
    ├── types/
    │   └── advent.ts              # Master TypeScript type declarations
    ├── audio/
    │   └── soundManager.ts        # Zero-dependency Web Audio synthesizer
    ├── components/
    │   ├── piazzaScene3D.ts       # Three.js 3D engine (KTX2, adaptive quality, reduced-motion, destroy)
    │   ├── dayModal.ts            # Daily experience dialog with reflections & actions
    │   ├── calendarDrawer.ts      # Accessible 24-day slide-out list drawer
    │   ├── studioBar.ts           # Studio testing toolbar for date simulation & quality
    │   └── vignettes.ts           # 24 looping animated motion vignettes
    ├── data/
    │   ├── adventDays.ts          # Master 24-day dataset with 3D coordinates & church links
    │   └── translations.ts        # i18n localization dictionary (24 languages)
    └── services/
        ├── dateGate.ts            # December date gating & unlock rules
        └── storage.ts             # LocalStorage state management
```

---

## 🌐 Public Demo & Deployment

| Environment | URL / Command | Notes |
| :--- | :--- | :--- |
| **Public Live Demo (GitHub Pages)** | [https://dperry713.github.io/xmas/](https://dperry713.github.io/xmas/) | Auto-deployed via GitHub Actions on push to `main` |
| **Local Development** | `npm run dev` → `http://localhost:5173/` | Hot Module Replacement (HMR) with Vite |
| **Production Preview** | `npm run preview` → `http://localhost:4173/` | Validates compiled static distribution bundle |

---

## 🚀 Quick Start & Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run unit & smoke tests
npm test

# Run TypeScript type check
npm run typecheck

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Optional: Compress textures to KTX2 / Basis Universal
npm run compress-textures
```

---

## 📦 Embedding into Church Webpages

Embed into any Church CMS page using standard responsive iframe:
```html
<iframe 
  src="https://dperry713.github.io/xmas/?embedded=true" 
  title="The Advent Piazza Interactive Experience" 
  width="100%" 
  height="750" 
  style="border: none; border-radius: 12px; overflow: hidden;"
  allow="autoplay"
></iframe>
```
Appending `?embedded=true` automatically streamlines the header padding and layout for embedded environments.

---

## 📄 License

MIT License — see [LICENSE](file:///c:/Users/d/OneDrive/Desktop/xmas/LICENSE) for details.
