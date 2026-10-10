/**
 * Animated Vignettes Generator
 * Creates rich, looping animated SVG/CSS scenes for each of the 24 Advent moments.
 */

export function getVignetteMarkup(type: string, accentColor = '#F59E0B'): string {
  switch (type) {
    case 'lantern':
      return `
        <div class="vignette-art vignette-lantern">
          <svg viewBox="0 0 400 240" class="vignette-svg" aria-hidden="true">
            <defs>
              <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.9" />
                <stop offset="40%" stop-color="${accentColor}" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#0F172A" stop-opacity="0" />
              </radialGradient>
            </defs>
            <rect width="400" height="240" fill="#090E1A" />
            <path d="M 80,240 L 80,100 Q 200,40 320,100 L 320,240 Z" fill="#131C31" />
            <path d="M 110,240 L 110,120 Q 200,70 290,120 L 290,240 Z" fill="#0C1222" />
            <circle cx="200" cy="115" r="95" fill="url(#lampGlow)" class="anim-pulse-glow" />
            <path d="M 130,105 L 175,105 L 200,85 L 225,105 L 200,70" stroke="#334155" stroke-width="6" fill="none" stroke-linecap="round" />
            <polygon points="175,90 225,90 215,145 185,145" fill="#1E293B" stroke="#475569" stroke-width="3" />
            <polygon points="180,95 220,95 212,140 188,140" fill="#FEF3C7" opacity="0.85" />
            <path d="M 200,132 Q 194,120 200,108 Q 206,120 200,132 Z" fill="#F59E0B" class="anim-flame" />
            <circle cx="200" cy="120" r="4" fill="#FFFBEB" />
          </svg>
        </div>
      `;

    case 'bakery':
      return `
        <div class="vignette-art vignette-bakery">
          <svg viewBox="0 0 400 240" class="vignette-svg" aria-hidden="true">
            <defs>
              <radialGradient id="ovenGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#F97316" stop-opacity="0.9" />
                <stop offset="60%" stop-color="#B45309" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#0F172A" stop-opacity="0" />
              </radialGradient>
            </defs>
            <rect width="400" height="240" fill="#111827" />
            <rect x="70" y="40" width="260" height="160" rx="12" fill="#1E293B" stroke="#475569" stroke-width="6" />
            <circle cx="200" cy="120" r="80" fill="url(#ovenGlow)" class="anim-pulse-glow" />
            <rect x="90" y="150" width="220" height="15" fill="#78350F" rx="3" />
            <ellipse cx="150" cy="142" rx="35" ry="16" fill="#D97706" stroke="#92400E" stroke-width="2" />
            <path d="M 130,138 Q 150,130 170,138" stroke="#FEF3C7" stroke-width="3" fill="none" stroke-linecap="round" />
            <ellipse cx="230" cy="142" rx="30" ry="15" fill="#B45309" stroke="#78350F" stroke-width="2" />
            <path d="M 150,125 Q 140,105 155,90 T 145,65" stroke="#FDE68A" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round" class="anim-steam-1" />
            <path d="M 230,125 Q 240,105 225,90 T 235,65" stroke="#FDE68A" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round" class="anim-steam-2" />
          </svg>
        </div>
      `;

    case 'fountain':
      return `
        <div class="vignette-art vignette-fountain">
          <svg viewBox="0 0 400 240" class="vignette-svg" aria-hidden="true">
            <defs>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#38BDF8" />
                <stop offset="100%" stop-color="#0284C7" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="#0A1128" />
            <path d="M 100,200 L 120,150 L 280,150 L 300,200 Z" fill="#1E293B" stroke="#334155" stroke-width="4" />
            <ellipse cx="200" cy="150" rx="80" ry="18" fill="url(#waterGrad)" opacity="0.8" />
            <rect x="185" y="80" width="30" height="70" fill="#334155" rx="4" />
            <path d="M 200,75 Q 185,50 170,85" stroke="#BAE6FD" stroke-width="3" fill="none" class="anim-water-spout" />
            <path d="M 200,75 Q 215,50 230,85" stroke="#BAE6FD" stroke-width="3" fill="none" class="anim-water-spout" />
            <ellipse cx="200" cy="150" rx="30" ry="6" stroke="#E0F2FE" stroke-width="2" fill="none" class="anim-ripple" />
          </svg>
        </div>
      `;

    case 'rose-window':
      return `
        <div class="vignette-art vignette-rose">
          <svg viewBox="0 0 400 240" class="vignette-svg" aria-hidden="true">
            <defs>
              <radialGradient id="roseGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#818CF8" stop-opacity="0.9" />
                <stop offset="40%" stop-color="#F43F5E" stop-opacity="0.6" />
                <stop offset="80%" stop-color="#FBBF24" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#0F172A" stop-opacity="0" />
              </radialGradient>
            </defs>
            <rect width="400" height="240" fill="#090D1A" />
            <polygon points="200,120 50,240 350,240" fill="url(#roseGlow)" opacity="0.65" class="anim-pulse-glow" />
            <circle cx="200" cy="110" r="75" fill="#1E1B4B" stroke="#4338CA" stroke-width="8" />
            <g class="anim-rotate-subtle" transform-origin="200 110">
              <circle cx="200" cy="110" r="22" fill="#F59E0B" stroke="#1E1B4B" stroke-width="3" />
              <path d="M 200,88 Q 185,70 200,50 Q 215,70 200,88 Z" fill="#EF4444" stroke="#1E1B4B" stroke-width="2" />
              <path d="M 200,132 Q 185,150 200,170 Q 215,150 200,132 Z" fill="#EF4444" stroke="#1E1B4B" stroke-width="2" />
              <path d="M 178,110 Q 160,95 140,110 Q 160,125 178,110 Z" fill="#3B82F6" stroke="#1E1B4B" stroke-width="2" />
              <path d="M 222,110 Q 240,95 260,110 Q 240,125 222,110 Z" fill="#3B82F6" stroke="#1E1B4B" stroke-width="2" />
            </g>
          </svg>
        </div>
      `;

    case 'radiant-star':
    default:
      return `
        <div class="vignette-art vignette-star">
          <svg viewBox="0 0 400 240" class="vignette-svg" aria-hidden="true">
            <defs>
              <radialGradient id="starBurst" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FEF08A" stop-opacity="1" />
                <stop offset="25%" stop-color="#F59E0B" stop-opacity="0.8" />
                <stop offset="60%" stop-color="#B45309" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0" />
              </radialGradient>
            </defs>
            <rect width="400" height="240" fill="#030712" />
            <circle cx="200" cy="110" r="100" fill="url(#starBurst)" class="anim-pulse-glow" />
            <g class="anim-star-rays" transform-origin="200 110">
              <line x1="200" y1="20" x2="200" y2="200" stroke="#FEF08A" stroke-width="3" opacity="0.8" />
              <line x1="110" y1="110" x2="290" y2="110" stroke="#FEF08A" stroke-width="3" opacity="0.8" />
            </g>
            <polygon points="200,50 207,95 245,85 213,110 245,135 207,125 200,170 193,125 155,135 187,110 155,85 193,95" fill="#FFFBEB" stroke="#FDE047" stroke-width="2" class="anim-star-sparkle" />
            <circle cx="200" cy="110" r="8" fill="#FFFFFF" />
          </svg>
        </div>
      `;
  }
}
