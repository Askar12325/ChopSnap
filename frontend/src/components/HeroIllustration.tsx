import React, { useId } from "react";

interface HeroIllustrationProps {
  className?: string;
  isMobile?: boolean;
}

export function HeroIllustration({
  className = "",
  isMobile = false,
}: HeroIllustrationProps) {
  const rawId = useId();
  const idSafe = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `heroPotLidClip_${idSafe}`;
  const potGradLightId = `potBodyGradLight_${idSafe}`;
  const potGradDarkId = `potBodyGradDark_${idSafe}`;

  return (
    <div
      className={`relative w-full ${
        isMobile ? "max-w-[280px] h-[190px]" : "max-w-[460px] h-[340px]"
      } flex items-center justify-center p-3 sm:p-5 select-none ${className}`}
      aria-label="ChopSnap Hero Cooking Pot Focal Illustration"
    >
      {/* Background Frame / Viewfinder Container */}
      <div className="absolute inset-0 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-md overflow-hidden transition-colors">
        {/* Subtle camera sensor coordinate grid */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] bg-[radial-gradient(#1D2B64_1px,transparent_1px)] dark:bg-[radial-gradient(#FFF5E1_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Viewfinder Camera Brackets (4 corners) suggesting "SNAP" */}
      <div
        className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-[#F9A826] rounded-tl-sm pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-[#F9A826] rounded-tr-sm pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-[#F9A826] rounded-bl-sm pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-[#F9A826] rounded-br-sm pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Center Reticle (+) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-30"
        aria-hidden="true"
      >
        <div className="w-5 h-px bg-[#F9A826]" />
        <div className="h-5 w-px bg-[#F9A826] -ml-2.5" />
      </div>

      {/* Viewfinder Status Tag */}
      <div className="absolute top-2.5 right-3 sm:top-3.5 sm:right-4 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1D2B64]/6 dark:bg-[#FFF5E1]/10 border border-[#1D2B64]/10 dark:border-[#FFF5E1]/20 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-[#1D2B64] dark:text-[#FFF5E1]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A3173A] animate-pulse" />
        <span>SNAP</span>
      </div>

      {/* ONE Focal Illustration: Large Nigerian Cooking Pot */}
      <svg
        viewBox="0 0 360 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full max-h-[92%] object-contain drop-shadow-sm"
      >
        <defs>
          {/* Pot Body Gradient - Light Mode */}
          <linearGradient id={potGradLightId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#253578" />
            <stop offset="55%" stopColor="#1D2B64" />
            <stop offset="100%" stopColor="#121C42" />
          </linearGradient>

          {/* Pot Body Gradient - Dark Mode */}
          <linearGradient id={potGradDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#283875" />
            <stop offset="60%" stopColor="#1A2554" />
            <stop offset="100%" stopColor="#101738" />
          </linearGradient>

          {/* Domed Lid Clip Path */}
          <clipPath id={clipId}>
            <path d="M74 122 C84 56 276 56 286 122 Z" />
          </clipPath>
        </defs>

        {/* Soft Ground Shadow */}
        <ellipse
          cx="180"
          cy="234"
          rx="105"
          ry="12"
          fill="currentColor"
          className="text-black/10 dark:text-black/35"
        />

        {/* Pot Side Handles */}
        {/* Left Handle */}
        <path
          d="M66 142 C38 142 35 174 66 174"
          className="stroke-[#1D2B64] dark:stroke-[#FFF5E1]"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M66 145 C44 145 42 171 66 171"
          stroke="#F9A826"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Handle */}
        <path
          d="M294 142 C322 142 325 174 294 174"
          className="stroke-[#1D2B64] dark:stroke-[#FFF5E1]"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M294 145 C316 145 318 171 294 171"
          stroke="#F9A826"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Pot Body */}
        <path
          d="M82 124 L94 186 C102 216 134 228 180 228 C226 228 258 216 266 186 L278 124 Z"
          fill={`url(#${potGradLightId})`}
          className="dark:hidden"
        />
        <path
          d="M82 124 L94 186 C102 216 134 228 180 228 C226 228 258 216 266 186 L278 124 Z"
          fill={`url(#${potGradDarkId})`}
          stroke="#FFF5E1"
          strokeWidth="1.5"
          className="hidden dark:block"
        />

        {/* Pot Belly Sheen Highlight */}
        <path
          d="M106 182 C120 206 150 216 180 216 C210 216 240 206 254 182"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.15"
          fill="none"
        />

        {/* Pot Rim Collar */}
        <rect
          x="72"
          y="118"
          width="216"
          height="12"
          rx="6"
          className="fill-[#15204C] dark:fill-[#202D68] stroke-[#F9A826]"
          strokeWidth="1.5"
        />

        {/* Domed Lid Carrying the Ankara Pattern */}
        <g clipPath={`url(#${clipId})`}>
          {/* Light Mode Pattern Rect with Slow Drift */}
          <rect
            x="50"
            y="40"
            width="260"
            height="100"
            fill="url(#ankara-pattern-light)"
            className="animate-ankara-drift dark:hidden"
          />

          {/* Dark Mode Pattern Rect with Slow Drift */}
          <rect
            x="50"
            y="40"
            width="260"
            height="100"
            fill="url(#ankara-pattern-dark)"
            className="animate-ankara-drift hidden dark:block"
          />
        </g>

        {/* Domed Lid Rim & Highlight Outline */}
        <path
          d="M74 122 C84 56 276 56 286 122 Z"
          fill="none"
          className="stroke-[#1D2B64] dark:stroke-[#FFF5E1]"
          strokeWidth="2.5"
        />

        {/* Lid Knob Base Collar */}
        <ellipse
          cx="180"
          cy="74"
          rx="15"
          ry="5.5"
          className="fill-[#1D2B64] dark:fill-[#FFF5E1]"
        />

        {/* Lid Knob (Saffron with Zobo Red Center Pip) */}
        <circle
          cx="180"
          cy="62"
          r="13"
          fill="#F9A826"
          className="stroke-[#1D2B64] dark:stroke-[#FFF5E1]"
          strokeWidth="2"
        />
        {/* Tiny Zobo Red Center Dot */}
        <circle cx="180" cy="62" r="4.5" fill="#A3173A" />
        <circle cx="180" cy="62" r="1.5" fill="#FFF5E1" />
      </svg>
    </div>
  );
}
