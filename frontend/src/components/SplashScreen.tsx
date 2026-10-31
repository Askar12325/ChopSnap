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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF4E4] dark:bg-[#1E1511] cursor-pointer select-none overflow-hidden transition-opacity duration-250 ease-out ${
        phase === "exiting" ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center p-6 text-center">
        {/* Central Logo Container with Shutter Flash Ripple */}
        <div className="relative flex items-center justify-center mb-5">
          {/* Camera-shutter flash ripple (expanding ring) */}
          <div className="absolute w-24 h-24 rounded-3xl border-2 border-[#D9381E] dark:border-[#F28A1B] pointer-events-none animate-splash-ripple" />

          {/* Quick subtle camera flash burst */}
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-amber-300/40 via-white/80 to-transparent pointer-events-none blur-xs animate-splash-flash" />

          {/* Icon with Spring Scale Pop-in */}
          <div className="relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#111F15] shadow-xl border border-white/20 flex items-center justify-center overflow-hidden animate-splash-icon">
            <svg
              viewBox="0 0 64 64"
              className="w-full h-full p-2.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="splashPotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D7A50" />
                  <stop offset="100%" stopColor="#1F5C3A" />
                </linearGradient>
              </defs>

              {/* Pot Handles */}
              <path
                d="M7 27 C4 27 3.5 32 7 32"
                stroke="#3DA36E"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M45 27 C48 27 48.5 32 45 32"
                stroke="#3DA36E"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />

              {/* Pot Body */}
              <path
                d="M10 24 L11.5 36 C12.5 42.5 17 46 26 46 C35 46 39.5 42.5 40.5 36 L42 24 Z"
                fill="url(#splashPotGrad)"
                stroke="#3DA36E"
                strokeWidth="1.6"
              />

              {/* Pot Rim */}
              <rect x="8" y="22" width="36" height="4" rx="2" fill="#2E7D52" stroke="#3DA36E" strokeWidth="1" />

              {/* Domed Pot Lid */}
              <path d="M11 22 C13 14 39 14 41 22 Z" fill="#1F5C3A" stroke="#3DA36E" strokeWidth="1.4" />

              {/* Lid Knob */}
              <ellipse cx="26" cy="14" rx="4.5" ry="2.4" fill="#D9381E" />

              {/* Camera Aperture Mark on Lid */}
              <circle cx="26" cy="18.5" r="4.8" fill="#0C1710" stroke="#D9381E" strokeWidth="1.6" />
              <circle cx="26" cy="18.5" r="1.8" fill="#D9381E" />
              <line x1="24" y1="16" x2="25.8" y2="17.2" stroke="#F5B83D" strokeWidth="1" strokeLinecap="round" />
              <line x1="28" y1="16.2" x2="27.4" y2="18" stroke="#F5B83D" strokeWidth="1" strokeLinecap="round" />
              <line x1="28.6" y1="19.3" x2="27" y2="19.9" stroke="#F5B83D" strokeWidth="1" strokeLinecap="round" />
              <line x1="24.8" y1="20.8" x2="24.4" y2="19" stroke="#F5B83D" strokeWidth="1" strokeLinecap="round" />
              <line x1="23.2" y1="18.2" x2="24.8" y2="17.8" stroke="#F5B83D" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Wordmark Fading In */}
        <div className="space-y-1.5 animate-splash-wordmark">
          <h1 className="text-3xl sm:text-4xl font-heading font-semibold tracking-tight text-[#2B1810] dark:text-[#FBF5EE]">
            <span className="text-[#1F6B3B] dark:text-[#86EFAC]">Chop</span>
            <span className="text-[#D9381E] dark:text-[#F28A1B]">Snap</span>
          </h1>
          <p className="text-sm font-sans text-[#695346] dark:text-[#C5B5A9]">
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
