import React from "react";

/**
 * Ankara-inspired geometric pattern definitions.
 * Original geometric shapes: concentric circles, diamonds, fan shapes.
 * Palette: Indigo #1D2B64, Saffron #F9A826, Zobo Red #A3173A, Cream #FFF5E1.
 * Seamless 80x80 repeating tile.
 */
export function AnkaraPatternDefs() {
  return (
    <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true" focusable="false">
      <defs>
        {/* Light Mode Pattern Tile for Pot Lid */}
        <pattern
          id="ankara-pattern-light"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <rect width="80" height="80" fill="#FFF5E1" />

          {/* Corner Concentric Circles (seamless 4-corner tiling) */}
          <circle cx="0" cy="0" r="26" fill="none" stroke="#F9A826" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#1D2B64" strokeWidth="2" />
          <circle cx="0" cy="0" r="10" fill="#A3173A" />
          <circle cx="0" cy="0" r="4" fill="#FFF5E1" />

          <circle cx="80" cy="0" r="26" fill="none" stroke="#F9A826" strokeWidth="2.5" />
          <circle cx="80" cy="0" r="18" fill="none" stroke="#1D2B64" strokeWidth="2" />
          <circle cx="80" cy="0" r="10" fill="#A3173A" />
          <circle cx="80" cy="0" r="4" fill="#FFF5E1" />

          <circle cx="0" cy="80" r="26" fill="none" stroke="#F9A826" strokeWidth="2.5" />
          <circle cx="0" cy="80" r="18" fill="none" stroke="#1D2B64" strokeWidth="2" />
          <circle cx="0" cy="80" r="10" fill="#A3173A" />
          <circle cx="0" cy="80" r="4" fill="#FFF5E1" />

          <circle cx="80" cy="80" r="26" fill="none" stroke="#F9A826" strokeWidth="2.5" />
          <circle cx="80" cy="80" r="18" fill="none" stroke="#1D2B64" strokeWidth="2" />
          <circle cx="80" cy="80" r="10" fill="#A3173A" />
          <circle cx="80" cy="80" r="4" fill="#FFF5E1" />

          {/* Central Concentric Circles */}
          <circle cx="40" cy="40" r="24" fill="none" stroke="#1D2B64" strokeWidth="2" />
          <circle cx="40" cy="40" r="16" fill="none" stroke="#F9A826" strokeWidth="2.5" strokeDasharray="4 2" />
          <circle cx="40" cy="40" r="8" fill="#A3173A" />
          <circle cx="40" cy="40" r="3" fill="#FFF5E1" />

          {/* 4 Connecting Diamonds */}
          <polygon points="40,2 48,15 40,27 32,15" fill="#1D2B64" />
          <polygon points="40,6 44,15 40,23 36,15" fill="#F9A826" />

          <polygon points="40,53 48,65 40,78 32,65" fill="#1D2B64" />
          <polygon points="40,57 44,65 40,73 36,65" fill="#F9A826" />

          <polygon points="2,40 15,32 27,40 15,48" fill="#1D2B64" />
          <polygon points="6,40 15,36 23,40 15,44" fill="#F9A826" />

          <polygon points="53,40 65,32 78,40 65,48" fill="#1D2B64" />
          <polygon points="57,40 65,36 73,40 65,44" fill="#F9A826" />

          {/* Radiating Fan Shapes in 4 Quadrants */}
          <path d="M12,2 C18,8 24,14 26,20" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M2,12 C8,18 14,24 20,26" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="21" cy="21" r="2.5" fill="#A3173A" />

          <path d="M68,2 C62,8 56,14 54,20" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M78,12 C72,18 66,24 60,26" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="59" cy="21" r="2.5" fill="#A3173A" />

          <path d="M12,78 C18,72 24,66 26,60" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M2,68 C8,62 14,56 20,54" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="21" cy="59" r="2.5" fill="#A3173A" />

          <path d="M68,78 C62,72 56,66 54,60" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M78,68 C72,62 66,56 60,54" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="59" cy="59" r="2.5" fill="#A3173A" />
        </pattern>

        {/* Dark Mode Pattern Tile for Pot Lid */}
        <pattern
          id="ankara-pattern-dark"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <rect width="80" height="80" fill="#121A3F" />

          {/* Corner Concentric Circles */}
          <circle cx="0" cy="0" r="26" fill="none" stroke="#F9A826" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#FFF5E1" strokeWidth="2" />
          <circle cx="0" cy="0" r="10" fill="#A3173A" />
          <circle cx="0" cy="0" r="4" fill="#F9A826" />

          <circle cx="80" cy="0" r="26" fill="none" stroke="#F9A826" strokeWidth="2.5" />
          <circle cx="80" cy="0" r="18" fill="none" stroke="#FFF5E1" strokeWidth="2" />
          <circle cx="80" cy="0" r="10" fill="#A3173A" />
          <circle cx="80" cy="0" r="4" fill="#F9A826" />

          <circle cx="0" cy="80" r="26" fill="none" stroke="#F9A826" strokeWidth="2.5" />
          <circle cx="0" cy="80" r="18" fill="none" stroke="#FFF5E1" strokeWidth="2" />
          <circle cx="0" cy="80" r="10" fill="#A3173A" />
          <circle cx="0" cy="80" r="4" fill="#F9A826" />

          <circle cx="80" cy="80" r="26" fill="none" stroke="#F9A826" strokeWidth="2.5" />
          <circle cx="80" cy="80" r="18" fill="none" stroke="#FFF5E1" strokeWidth="2" />
          <circle cx="80" cy="80" r="10" fill="#A3173A" />
          <circle cx="80" cy="80" r="4" fill="#F9A826" />

          {/* Central Concentric Circles */}
          <circle cx="40" cy="40" r="24" fill="none" stroke="#FFF5E1" strokeWidth="2" />
          <circle cx="40" cy="40" r="16" fill="none" stroke="#F9A826" strokeWidth="2.5" strokeDasharray="4 2" />
          <circle cx="40" cy="40" r="8" fill="#A3173A" />
          <circle cx="40" cy="40" r="3" fill="#F9A826" />

          {/* 4 Connecting Diamonds */}
          <polygon points="40,2 48,15 40,27 32,15" fill="#FFF5E1" />
          <polygon points="40,6 44,15 40,23 36,15" fill="#1D2B64" />

          <polygon points="40,53 48,65 40,78 32,65" fill="#FFF5E1" />
          <polygon points="40,57 44,65 40,73 36,65" fill="#1D2B64" />

          <polygon points="2,40 15,32 27,40 15,48" fill="#FFF5E1" />
          <polygon points="6,40 15,36 23,40 15,44" fill="#1D2B64" />

          <polygon points="53,40 65,32 78,40 65,48" fill="#FFF5E1" />
          <polygon points="57,40 65,36 73,40 65,44" fill="#1D2B64" />

          {/* Radiating Fan Shapes */}
          <path d="M12,2 C18,8 24,14 26,20" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M2,12 C8,18 14,24 20,26" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="21" cy="21" r="2.5" fill="#A3173A" />

          <path d="M68,2 C62,8 56,14 54,20" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M78,12 C72,18 66,24 60,26" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="59" cy="21" r="2.5" fill="#A3173A" />

          <path d="M12,78 C18,72 24,66 26,60" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M2,68 C8,62 14,56 20,54" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="21" cy="59" r="2.5" fill="#A3173A" />

          <path d="M68,78 C62,72 56,66 54,60" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M78,68 C72,62 66,56 60,54" stroke="#F9A826" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="59" cy="59" r="2.5" fill="#A3173A" />
        </pattern>

        {/* Micro-scale pattern for the 8px top ribbon and section dividers */}
        <pattern
          id="ankara-pattern-ribbon-light"
          width="32"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="32" height="8" fill="#FFF5E1" />
          {/* Concentric Circles at edges (0, 4) and (32, 4) */}
          <circle cx="0" cy="4" r="5" fill="none" stroke="#F9A826" strokeWidth="1" />
          <circle cx="0" cy="4" r="2.5" fill="#A3173A" />
          <circle cx="32" cy="4" r="5" fill="none" stroke="#F9A826" strokeWidth="1" />
          <circle cx="32" cy="4" r="2.5" fill="#A3173A" />
          {/* Central Diamond at (16, 4) */}
          <polygon points="16,0.5 22,4 16,7.5 10,4" fill="#1D2B64" stroke="#F9A826" strokeWidth="0.8" />
          <circle cx="16" cy="4" r="1.2" fill="#F9A826" />
          {/* Fan Rays */}
          <line x1="5" y1="1" x2="8" y2="3" stroke="#F9A826" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="5" y1="7" x2="8" y2="5" stroke="#F9A826" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="27" y1="1" x2="24" y2="3" stroke="#F9A826" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="27" y1="7" x2="24" y2="5" stroke="#F9A826" strokeWidth="0.8" strokeLinecap="round" />
        </pattern>

        <pattern
          id="ankara-pattern-ribbon-dark"
          width="32"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="32" height="8" fill="#121A3F" />
          <circle cx="0" cy="4" r="5" fill="none" stroke="#F9A826" strokeWidth="1" />
          <circle cx="0" cy="4" r="2.5" fill="#A3173A" />
          <circle cx="32" cy="4" r="5" fill="none" stroke="#F9A826" strokeWidth="1" />
          <circle cx="32" cy="4" r="2.5" fill="#A3173A" />
          <polygon points="16,0.5 22,4 16,7.5 10,4" fill="#FFF5E1" stroke="#F9A826" strokeWidth="0.8" />
          <circle cx="16" cy="4" r="1.2" fill="#1D2B64" />
          <line x1="5" y1="1" x2="8" y2="3" stroke="#F9A826" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="5" y1="7" x2="8" y2="5" stroke="#F9A826" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="27" y1="1" x2="24" y2="3" stroke="#F9A826" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="27" y1="7" x2="24" y2="5" stroke="#F9A826" strokeWidth="0.8" strokeLinecap="round" />
        </pattern>
      </defs>
    </svg>
  );
}

/**
 * 1. Thin band along the very top of the page.
 * Height is 6px to 8px (less than 0.8% of screen), positioned at top edge.
 */
export function AnkaraTopRibbon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full h-1.5 sm:h-2 overflow-hidden relative z-50 border-b border-[#F9A826]/30 shadow-2xs ${className}`}
      aria-hidden="true"
    >
      <svg className="w-full h-full block" preserveAspectRatio="none">
        <rect
          width="100%"
          height="100%"
          className="fill-[url(#ankara-pattern-ribbon-light)] dark:fill-[url(#ankara-pattern-ribbon-dark)]"
        />
      </svg>
    </div>
  );
}

/**
 * 2. Section divider: clean, thin band separating sections.
 * Covers < 0.5% of screen and never sits behind text.
 */
export function AnkaraSectionDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`py-6 sm:py-8 flex items-center justify-center gap-3 sm:gap-6 ${className}`}
      aria-hidden="true"
    >
      <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
      <div className="h-2 w-28 sm:w-36 rounded-full overflow-hidden border border-[#F9A826]/30 shadow-xs">
        <svg className="w-full h-full block" preserveAspectRatio="none">
          <rect
            width="100%"
            height="100%"
            className="fill-[url(#ankara-pattern-ribbon-light)] dark:fill-[url(#ankara-pattern-ribbon-dark)]"
          />
        </svg>
      </div>
      <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
    </div>
  );
}
