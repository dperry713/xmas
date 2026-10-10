/**
 * Animated Vignettes Generator
 * Creates rich, looping animated SVG/CSS scenes for each of the 24 Advent moments.
 */

export function getVignetteMarkup(type, accentColor = '#F59E0B') {
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
              <filter id="blurFilter">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <!-- Background night -->
            <rect width="400" height="240" fill="#090E1A" />
            <!-- Archway brick silhouette -->
            <path d="M 80,240 L 80,100 Q 200,40 320,100 L 320,240 Z" fill="#131C31" />
            <path d="M 110,240 L 110,120 Q 200,70 290,120 L 290,240 Z" fill="#0C1222" />
            <!-- Radial glow behind lamp -->
            <circle cx="200" cy="115" r="95" fill="url(#lampGlow)" class="anim-pulse-glow" />
            <!-- Iron bracket -->
            <path d="M 130,105 L 175,105 L 200,85 L 225,105 L 200,70" stroke="#334155" stroke-width="6" fill="none" stroke-linecap="round" />
            <!-- Lantern cage -->
            <polygon points="175,90 225,90 215,145 185,145" fill="#1E293B" stroke="#475569" stroke-width="3" />
            <!-- Glass pane -->
            <polygon points="180,95 220,95 212,140 188,140" fill="#FEF3C7" opacity="0.85" />
            <!-- Candle flame -->
            <path d="M 200,132 Q 194,120 200,108 Q 206,120 200,132 Z" fill="#F59E0B" class="anim-flame" />
            <circle cx="200" cy="120" r="4" fill="#FFFBEB" class="anim-flame-core" />
            <!-- Snow sparkles -->
            <circle cx="160" cy="60" r="2" fill="#E2E8F0" class="anim-snowflake-1" />
            <circle cx="240" cy="75" r="2.5" fill="#E2E8F0" class="anim-snowflake-2" />
            <circle cx="190" cy="40" r="1.5" fill="#E2E8F0" class="anim-snowflake-3" />
            <circle cx="220" cy="170" r="2" fill="#E2E8F0" class="anim-snowflake-4" />
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
            <!-- Window frame -->
            <rect x="70" y="40" width="260" height="160" rx="12" fill="#1E293B" stroke="#475569" stroke-width="6" />
            <circle cx="200" cy="120" r="80" fill="url(#ovenGlow)" class="anim-pulse-glow" />
            <!-- Fresh bread loaves on wooden counter -->
            <rect x="90" y="150" width="220" height="15" fill="#78350F" rx="3" />
            <!-- Braided stollen / loaves -->
            <ellipse cx="150" cy="142" rx="35" ry="16" fill="#D97706" stroke="#92400E" stroke-width="2" />
            <path d="M 130,138 Q 150,130 170,138" stroke="#FEF3C7" stroke-width="3" fill="none" stroke-linecap="round" />
            <ellipse cx="230" cy="142" rx="30" ry="15" fill="#B45309" stroke="#78350F" stroke-width="2" />
            <!-- Rising steam curls -->
            <path d="M 150,125 Q 140,105 155,90 T 145,65" stroke="#FDE68A" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round" class="anim-steam-1" />
            <path d="M 230,125 Q 240,105 225,90 T 235,65" stroke="#FDE68A" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round" class="anim-steam-2" />
            <!-- Festive ribbon & sprig on window -->
            <path d="M 200,40 L 200,200" stroke="#334155" stroke-width="4" />
            <circle cx="200" cy="65" r="10" fill="#DC2626" />
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
            <!-- Stone basin silhouette -->
            <path d="M 100,200 L 120,150 L 280,150 L 300,200 Z" fill="#1E293B" stroke="#334155" stroke-width="4" />
            <ellipse cx="200" cy="150" rx="80" ry="18" fill="url(#waterGrad)" opacity="0.8" />
            <!-- Center pillar -->
            <rect x="185" y="80" width="30" height="70" fill="#334155" rx="4" />
            <ellipse cx="200" cy="80" rx="35" ry="10" fill="#475569" />
            <!-- Spouting water drops -->
            <path d="M 200,75 Q 185,50 170,85" stroke="#BAE6FD" stroke-width="3" fill="none" class="anim-water-spout" />
            <path d="M 200,75 Q 215,50 230,85" stroke="#BAE6FD" stroke-width="3" fill="none" class="anim-water-spout" />
            <!-- Water ripples in basin -->
            <ellipse cx="200" cy="150" rx="30" ry="6" stroke="#E0F2FE" stroke-width="2" fill="none" class="anim-ripple" />
            <!-- Icicles hanging from rim -->
            <polygon points="130,150 135,175 140,150" fill="#E0F2FE" opacity="0.9" />
            <polygon points="170,150 174,180 178,150" fill="#E0F2FE" opacity="0.9" />
            <polygon points="220,150 224,185 228,150" fill="#E0F2FE" opacity="0.9" />
            <polygon points="260,150 264,172 268,150" fill="#E0F2FE" opacity="0.9" />
            <!-- Fairy lights string around basin -->
            <path d="M 115,160 Q 200,180 285,160" stroke="#FDE68A" stroke-width="2" fill="none" stroke-dasharray="2,12" class="anim-fairy-twinkle" />
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
            <!-- Stained glass radiating light beam -->
            <polygon points="200,120 50,240 350,240" fill="url(#roseGlow)" opacity="0.65" class="anim-pulse-glow" />
            <!-- Outer stone rose tracery -->
            <circle cx="200" cy="110" r="75" fill="#1E1B4B" stroke="#4338CA" stroke-width="8" />
            <!-- Multi-petal stained glass segments -->
            <g class="anim-rotate-subtle" transform-origin="200 110">
              <circle cx="200" cy="110" r="22" fill="#F59E0B" stroke="#1E1B4B" stroke-width="3" />
              <!-- 8 radiating petals -->
              <path d="M 200,88 Q 185,70 200,50 Q 215,70 200,88 Z" fill="#EF4444" stroke="#1E1B4B" stroke-width="2" />
              <path d="M 200,132 Q 185,150 200,170 Q 215,150 200,132 Z" fill="#EF4444" stroke="#1E1B4B" stroke-width="2" />
              <path d="M 178,110 Q 160,95 140,110 Q 160,125 178,110 Z" fill="#3B82F6" stroke="#1E1B4B" stroke-width="2" />
              <path d="M 222,110 Q 240,95 260,110 Q 240,125 222,110 Z" fill="#3B82F6" stroke="#1E1B4B" stroke-width="2" />
              <!-- Diagonal petals -->
              <path d="M 184,94 Q 165,80 155,65 Q 175,75 184,94 Z" fill="#10B981" />
              <path d="M 216,94 Q 235,80 245,65 Q 225,75 216,94 Z" fill="#10B981" />
              <path d="M 184,126 Q 165,140 155,155 Q 175,145 184,126 Z" fill="#8B5CF6" />
              <path d="M 216,126 Q 235,140 245,155 Q 225,145 216,126 Z" fill="#8B5CF6" />
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
            <!-- Starburst halo -->
            <circle cx="200" cy="110" r="100" fill="url(#starBurst)" class="anim-pulse-glow" />
            <!-- Radiant rays -->
            <g class="anim-star-rays" transform-origin="200 110">
              <line x1="200" y1="20" x2="200" y2="200" stroke="#FEF08A" stroke-width="3" opacity="0.8" />
              <line x1="110" y1="110" x2="290" y2="110" stroke="#FEF08A" stroke-width="3" opacity="0.8" />
              <line x1="135" y1="45" x2="265" y2="175" stroke="#FDE047" stroke-width="2" opacity="0.6" />
              <line x1="265" y1="45" x2="135" y2="175" stroke="#FDE047" stroke-width="2" opacity="0.6" />
            </g>
            <!-- 8-Pointed Star of Bethlehem -->
            <polygon points="200,50 207,95 245,85 213,110 245,135 207,125 200,170 193,125 155,135 187,110 155,85 193,95" fill="#FFFBEB" stroke="#FDE047" stroke-width="2" class="anim-star-sparkle" />
            <circle cx="200" cy="110" r="8" fill="#FFFFFF" />
            <!-- Floating stardust particles -->
            <circle cx="150" cy="80" r="2" fill="#FEF9C3" class="anim-stardust-1" />
            <circle cx="250" cy="70" r="2.5" fill="#FEF9C3" class="anim-stardust-2" />
            <circle cx="170" cy="150" r="2" fill="#FEF9C3" class="anim-stardust-3" />
            <circle cx="230" cy="140" r="1.5" fill="#FEF9C3" class="anim-stardust-4" />
          </svg>
        </div>
      `;
  }
}
