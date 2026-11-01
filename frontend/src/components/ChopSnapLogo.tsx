import React from "react";

interface ChopSnapLogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function ChopSnapLogo({
  className = "h-10 sm:h-11 w-auto",
  showWordmark = true,
}: ChopSnapLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Inline SVG Pot with Saffron Spark/Aperture */}
      <svg
        viewBox="0 0 48 48"
        className="h-full w-auto aspect-square shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Pot Side Handles */}
        <path
          d="M6 24 C3 24 2.5 29 6 29"
          className="stroke-[#1D2B64] dark:stroke-[#FFF5E1]"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M42 24 C45 24 45.5 29 42 29"
          className="stroke-[#1D2B64] dark:stroke-[#FFF5E1]"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Pot Body */}
        <path
          d="M9 21 L10.5 33 C11.5 39 16 42 24 42 C32 42 36.5 39 37.5 33 L39 21 Z"
          className="fill-[#1D2B64] dark:fill-[#FFF5E1]"
        />

        {/* Pot Rim */}
        <rect
          x="7.5"
          y="19"
          width="33"
          height="3.6"
          rx="1.8"
          className="fill-[#1D2B64] dark:fill-[#FFF5E1]"
        />

        {/* Domed Pot Lid */}
        <path
          d="M10 19 C12.5 11.5 35.5 11.5 38 19 Z"
          className="fill-[#15204C] dark:fill-[#EFE2C5]"
          opacity="0.9"
        />

        {/* Lid Knob */}
        <ellipse cx="24" cy="11.5" rx="4.5" ry="2.2" fill="#F9A826" />

        {/* Aperture / Spark Mark on Lid */}
        <circle cx="24" cy="15.8" r="3.2" fill="#F9A826" />
        <circle cx="24" cy="15.8" r="1.4" className="fill-[#1D2B64] dark:fill-[#121A3F]" />
        {/* Spark rays */}
        <line x1="24" y1="11.8" x2="24" y2="13.2" stroke="#F9A826" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="24" y1="18.4" x2="24" y2="19.8" stroke="#F9A826" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="20" y1="15.8" x2="21.4" y2="15.8" stroke="#F9A826" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="26.6" y1="15.8" x2="28" y2="15.8" stroke="#F9A826" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* Wordmark: Chop in indigo/cream, Snap in #B36B00/saffron */}
      {showWordmark && (
        <span className="font-heading font-extrabold text-2xl sm:text-2xl tracking-tight select-none">
          <span className="text-[#1D2B64] dark:text-[#FFF5E1]">Chop</span>
          <span className="text-[#B36B00] dark:text-[#F9A826]">Snap</span>
        </span>
      )}
    </div>
  );
}
