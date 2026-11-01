"use client";

import React, { useEffect, useState, useCallback } from "react";

export function SplashScreen() {
  const [phase, setPhase] = useState<"pending" | "animating" | "exiting" | "hidden">("pending");

  const dismiss = useCallback(() => {
    setPhase((current) => {
      if (current === "hidden" || current === "exiting") return current;
      try {
        sessionStorage.setItem("chopsnap_splash_shown", "true");
        if (typeof document !== "undefined") {
          document.documentElement.classList.add("splash-skip");
        }
      } catch {}
      return "exiting";
    });

    setTimeout(() => {
      setPhase("hidden");
    }, 220);
  }, []);

  useEffect(() => {
    // 1. Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Check if already shown in this session
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem("chopsnap_splash_shown") === "true";
    } catch {}

    if (prefersReducedMotion || alreadyShown) {
      try {
        sessionStorage.setItem("chopsnap_splash_shown", "true");
        document.documentElement.classList.add("splash-skip");
      } catch {}
      setPhase("hidden");
      return;
    }

    // 3. Mark as shown immediately for this session
    try {
      sessionStorage.setItem("chopsnap_splash_shown", "true");
    } catch {}

    setPhase("animating");

    // 4. Timed sequence:
    // 0ms - 250ms: Icon pops in with spring
    // 120ms - 400ms: Camera shutter ripple flashes
    // 280ms - 450ms: Wordmark fades in
    // 450ms - 1200ms: Hold (~750ms - 900ms hold)
    // 1200ms - 1450ms: Fade out into app (total < 1.5s)
    const holdTimer = setTimeout(() => {
      setPhase("exiting");
    }, 1200);

    const completeTimer = setTimeout(() => {
      setPhase("hidden");
      try {
        document.documentElement.classList.add("splash-skip");
      } catch {}
    }, 1450);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      id="chopsnap-splash-overlay"
      role="button"
      tabIndex={0}
      aria-label="ChopSnap Loading — Tap to skip"
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
          dismiss();
        }
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF5E1] dark:bg-[#121A3F] cursor-pointer select-none overflow-hidden transition-opacity duration-250 ease-out ${
        phase === "exiting" ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center p-6 text-center">
        {/* Central Logo Container with Shutter Flash Ripple */}
        <div className="relative flex items-center justify-center mb-5">
          {/* Camera-shutter flash ripple (expanding ring) */}
          <div className="absolute w-24 h-24 rounded-3xl border-2 border-[#1D2B64] dark:border-[#F9A826] pointer-events-none animate-splash-ripple" />

          {/* Quick subtle camera flash burst */}
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-amber-300/40 via-white/80 to-transparent pointer-events-none blur-xs animate-splash-flash" />

          {/* Icon with Spring Scale Pop-in */}
          <div className="relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#FFF5E1] dark:bg-[#121A3F] shadow-xl border-2 border-[#1D2B64]/20 dark:border-[#FFF5E1]/20 flex items-center justify-center overflow-hidden animate-splash-icon">
            <svg
              viewBox="0 0 64 64"
              className="w-full h-full p-2.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pot Handles */}
              <path
                d="M7 27 C4 27 3.5 32 7 32"
                className="stroke-[#1D2B64] dark:stroke-[#FFF5E1]"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M45 27 C48 27 48.5 32 45 32"
                className="stroke-[#1D2B64] dark:stroke-[#FFF5E1]"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />

              {/* Pot Body */}
              <path
                d="M10 24 L11.5 36 C12.5 42.5 17 46 26 46 C35 46 39.5 42.5 40.5 36 L42 24 Z"
                className="fill-[#1D2B64] dark:fill-[#FFF5E1]"
              />

              {/* Pot Rim */}
              <rect x="8" y="22" width="36" height="4" rx="2" className="fill-[#1D2B64] dark:fill-[#FFF5E1]" />

              {/* Domed Pot Lid */}
              <path d="M11 22 C13 14 39 14 41 22 Z" className="fill-[#15204C] dark:fill-[#EFE2C5]" opacity="0.9" />

              {/* Lid Knob */}
              <ellipse cx="26" cy="14" rx="4.5" ry="2.4" fill="#F9A826" />

              {/* Camera Aperture / Spark Mark on Lid */}
              <circle cx="26" cy="18.5" r="4.8" fill="#F9A826" />
              <circle cx="26" cy="18.5" r="2" className="fill-[#1D2B64] dark:fill-[#121A3F]" />
              <line x1="26" y1="13.2" x2="26" y2="15" stroke="#F9A826" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="26" y1="22" x2="26" y2="23.8" stroke="#F9A826" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="20.7" y1="18.5" x2="22.5" y2="18.5" stroke="#F9A826" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="29.5" y1="18.5" x2="31.3" y2="18.5" stroke="#F9A826" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Wordmark Fading In */}
        <div className="space-y-1.5 animate-splash-wordmark">
          <h1 className="text-3xl sm:text-4xl font-heading font-semibold tracking-tight text-[#1A1033] dark:text-[#FFF5E1]">
            <span className="text-[#1D2B64] dark:text-[#FFF5E1]">Chop</span>
            <span className="text-[#B36B00] dark:text-[#F9A826]">Snap</span>
          </h1>
          <p className="text-sm font-sans text-[#453A61] dark:text-[#CEC5B3]">
            Snap your kitchen. Know what to chop.
          </p>
        </div>

        {/* Subtle Accessible Skip Hint */}
        <div className="mt-8 text-xs font-sans text-[var(--text-muted)] tracking-wider uppercase opacity-60">
          Tap to skip
        </div>
      </div>
    </div>
  );
}
