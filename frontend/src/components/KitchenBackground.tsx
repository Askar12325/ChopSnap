"use client";

import React, { useEffect, useState } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";

// ============================================================================
// 10 FLAT-STYLE INLINE SVG ILLUSTRATIONS
// Consistent geometric vector style, rounded caps, 64x64 viewBox
// Palette: Pepper red (#D9381E), Palm orange (#F28A1B), Forest green (#1F6B3B),
//          Turmeric yellow (#F5B83D), Carved timber brown (#8C5835 / #5C3A21)
// ============================================================================

export function PotSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Handles */}
      <path d="M8 28 C4 28 4 34 8 34" stroke="#1F6B3B" strokeWidth="3" strokeLinecap="round" className="dark:stroke-[#4ADE80]" />
      <path d="M56 28 C60 28 60 34 56 34" stroke="#1F6B3B" strokeWidth="3" strokeLinecap="round" className="dark:stroke-[#4ADE80]" />
      {/* Pot Body */}
      <path d="M12 25 L14 43 C15 50 20 54 32 54 C44 54 49 50 50 43 L52 25 Z" fill="#1F6B3B" className="dark:fill-[#268047]" />
      {/* Rim */}
      <rect x="10" y="23" width="44" height="4" rx="2" fill="#18552E" className="dark:fill-[#1F6B3B]" />
      {/* Domed Lid */}
      <path d="M14 23 C17 14 47 14 50 23 Z" fill="#268047" className="dark:fill-[#34A863]" />
      {/* Lid Knob */}
      <ellipse cx="32" cy="14" rx="5" ry="3" fill="#D9381E" className="dark:fill-[#F28A1B]" />
      {/* Aperture Accent */}
      <circle cx="32" cy="19" r="3.2" fill="#F28A1B" className="dark:fill-[#F5B83D]" />
      <circle cx="32" cy="19" r="1.4" fill="#18552E" />
    </svg>
  );
}

export function SpoonSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Spoon Bowl */}
      <ellipse cx="44" cy="19" rx="13" ry="8" transform="rotate(-35 44 19)" fill="#8C5835" className="dark:fill-[#B37950]" />
      {/* Shading */}
      <ellipse cx="43.5" cy="18.5" rx="10" ry="5.5" transform="rotate(-35 43.5 18.5)" fill="#734424" className="dark:fill-[#8C5835]" />
      {/* Handle */}
      <path d="M35 25 L12 48 C10 50 8 52 10 54 C12 56 14 54 16 52 L39 29 Z" fill="#8C5835" className="dark:fill-[#B37950]" />
      <circle cx="11.5" cy="52.5" r="1.5" fill="#5C3A21" />
    </svg>
  );
}

export function ScotchBonnetSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Pepper stem */}
      <path d="M32 18 C32 12 36 9 40 8 C40 11 37 13 35 18" stroke="#1F6B3B" strokeWidth="2.8" strokeLinecap="round" className="dark:stroke-[#4ADE80]" />
      {/* Calyx cap */}
      <path d="M26 19 C29 18 35 18 38 19 L36 22 C34 21 30 21 28 22 Z" fill="#18552E" className="dark:fill-[#1F6B3B]" />
      {/* Ruffled Bonnet Body */}
      <path
        d="M23 21 C15 23 14 31 18 36 C19 38 21 41 24 45 C28 50 31 53 33 53 C35 53 38 49 41 45 C44 40 47 38 48 35 C52 30 50 23 43 21 C39 20 37 22 33 22 C29 22 27 20 23 21 Z"
        fill="#D9381E"
        className="dark:fill-[#EF4444]"
      />
      {/* Lobe Highlights */}
      <path d="M24 25 C22 29 23 35 26 38" stroke="#F28A1B" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M33 24 C33 30 33 38 34 45" stroke="#F28A1B" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function PlantainSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Crescent Plantain Body */}
      <path
        d="M10 46 C16 52 38 56 49 42 C56 33 58 20 54 12 C52 14 47 25 39 33 C30 42 18 45 10 46 Z"
        fill="#F5B83D"
        className="dark:fill-[#FACC15]"
      />
      {/* Stem tip */}
      <path d="M54 12 L57 8 C57 9 55 12 53 14 Z" fill="#5C3A21" />
      {/* Blossom end */}
      <path d="M10 46 L7 49 C8 49 9 47 11 45 Z" fill="#5C3A21" />
      {/* Peel marks */}
      <path d="M38 34 C43 28 47 21 49 16" stroke="#F28A1B" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 42 C33 38 38 32 41 27" stroke="#8C5835" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="34" cy="37" r="1.2" fill="#5C3A21" opacity="0.7" />
      <circle cx="26" cy="43" r="1.2" fill="#5C3A21" opacity="0.7" />
    </svg>
  );
}

export function TomatoSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Plump Tomato Body */}
      <ellipse cx="32" cy="35" rx="19" ry="17" fill="#D9381E" className="dark:fill-[#EF4444]" />
      {/* Shine */}
      <path d="M22 27 C25 24 30 24 34 24" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Star Calyx */}
      <path d="M32 19 L30 13 L32 17 L36 12 L34 18 L40 17 L35 20 L38 23 L33 21 L31 25 L31 20 L26 23 L29 19 L24 16 L30 18 Z" fill="#1F6B3B" className="dark:fill-[#4ADE80]" />
      {/* Stem */}
      <path d="M32 16 C32 12 34 10 37 9" stroke="#18552E" strokeWidth="2.2" strokeLinecap="round" className="dark:stroke-[#1F6B3B]" />
    </svg>
  );
}

export function OnionSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sprout Tip */}
      <path d="M32 10 L32 17 M34 11 C35 13 34 16 33 18" stroke="#1F6B3B" strokeWidth="2" strokeLinecap="round" className="dark:stroke-[#4ADE80]" />
      {/* Bulb */}
      <path
        d="M32 17 C22 17 15 25 15 36 C15 46 22 52 32 52 C42 52 49 46 49 36 C49 25 42 17 32 17 Z"
        fill="#B94726"
        className="dark:fill-[#D94F04]"
      />
      {/* Root tuft */}
      <path d="M30 52 L29 56 M32 52 L32 57 M34 52 L35 56" stroke="#8C5835" strokeWidth="1.8" strokeLinecap="round" />
      {/* Ridges */}
      <path d="M25 22 C20 27 20 42 25 48" stroke="#F28A1B" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
      <path d="M39 22 C44 27 44 42 39 48" stroke="#F28A1B" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
      <path d="M32 20 L32 50" stroke="#F28A1B" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

export function FishSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Tail Fin */}
      <path d="M12 24 L20 32 L12 40 C15 35 15 29 12 24 Z" fill="#D97706" className="dark:fill-[#F59E0B]" />
      {/* Fish Body */}
      <path
        d="M18 32 C22 23 34 21 46 25 C52 27 55 32 55 32 C55 32 52 37 46 39 C34 43 22 41 18 32 Z"
        fill="#F5B83D"
        className="dark:fill-[#FBBF24]"
      />
      {/* Dorsal Fin */}
      <path d="M32 22 C35 18 40 19 44 23 Z" fill="#D97706" className="dark:fill-[#F59E0B]" />
      {/* Eye */}
      <circle cx="48" cy="30" r="2" fill="#5C3A21" />
      <circle cx="48.5" cy="29.5" r="0.6" fill="#FFFFFF" />
      {/* Gill curve */}
      <path d="M42 27 C40 30 40 34 42 37" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
      {/* Texture marks */}
      <path d="M32 28 C30 31 30 33 32 36" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M26 29 C24 31 24 33 26 35" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function WhiskSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Handle */}
      <path d="M14 50 L25 39 C26 38 28 38 29 39 L27 41 C26 42 26 44 25 45 L14 56 C12 58 10 56 12 54 Z" fill="#1F6B3B" className="dark:fill-[#4ADE80]" />
      {/* Collar */}
      <rect x="25" y="36" width="6" height="4" rx="1.5" transform="rotate(-45 25 36)" fill="#8C5835" />
      {/* Wire loops */}
      <ellipse cx="42" cy="22" rx="15" ry="7" transform="rotate(-45 42 22)" stroke="#F28A1B" strokeWidth="1.8" className="dark:stroke-[#FB923C]" />
      <ellipse cx="42" cy="22" rx="15" ry="3.5" transform="rotate(-45 42 22)" stroke="#F5B83D" strokeWidth="1.6" className="dark:stroke-[#FDE047]" />
      <line x1="28" y1="36" x2="52" y2="12" stroke="#D9381E" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function MortarSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Pestle */}
      <path d="M24 10 L44 38 C45 40 43 42 41 42 L21 14 C20 12 22 10 24 10 Z" fill="#5C3A21" className="dark:fill-[#8C5835]" />
      {/* Mortar Body */}
      <path
        d="M14 26 C14 24 50 24 50 26 C50 37 44 44 38 45 L38 48 L44 52 L44 55 L20 55 L20 52 L26 48 L26 45 C20 44 14 37 14 26 Z"
        fill="#8C5835"
        className="dark:fill-[#A76F43]"
      />
      {/* Rim */}
      <ellipse cx="32" cy="26" rx="18" ry="4" fill="#734424" className="dark:fill-[#5C3A21]" />
      <ellipse cx="32" cy="26" rx="15" ry="2.6" fill="#4A2612" className="dark:fill-[#381A0B]" />
      <rect x="18" y="52" width="28" height="3" rx="1" fill="#734424" />
    </svg>
  );
}

export function LadleSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Handle */}
      <path
        d="M12 12 C14 8 18 10 17 14 L28 38 C29 40 31 41 33 41"
        stroke="#1F6B3B"
        strokeWidth="3.2"
        strokeLinecap="round"
        className="dark:stroke-[#4ADE80]"
      />
      <path d="M12 12 C10 14 8 13 8 10" stroke="#18552E" strokeWidth="2.4" strokeLinecap="round" />
      {/* Bowl */}
      <path d="M30 40 C30 50 48 50 48 40 C48 38 30 38 30 40 Z" fill="#D9381E" className="dark:fill-[#EF4444]" />
      <ellipse cx="39" cy="39" rx="9" ry="3.5" fill="#B92D17" className="dark:fill-[#DC2626]" />
    </svg>
  );
}

// ============================================================================
// ITEM SPECIFICATIONS & DEPTH LAYERS
// ============================================================================

interface ItemConfig {
  id: string;
  name: string;
  Component: React.ComponentType<{ className?: string }>;
  layer: 1 | 2 | 3;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  desktopSize: number;
  mobileSize: number;
  initialRotate: number;
  driftX: number;
  driftY: number;
  rotateDelta: number;
  duration: number;
  delay: number;
  isMobile: boolean;
  isCenterOverlap?: boolean;
}

const ITEMS: ItemConfig[] = [
  // LAYER 1: BACK (56-80px desktop, ~70% mobile; blurred blur-[1.2px], slowest drift 28-32s)
  {
    id: "whisk",
    name: "Whisk",
    Component: WhiskSvg,
    layer: 1,
    top: "14%",
    left: "2%",
    desktopSize: 70,
    mobileSize: 49,
    initialRotate: -20,
    driftX: 18,
    driftY: 22,
    rotateDelta: 12,
    duration: 28,
    delay: 0,
    isMobile: false,
  },
  {
    id: "onion",
    name: "Onion",
    Component: OnionSvg,
    layer: 1,
    top: "16%",
    right: "2%",
    desktopSize: 64,
    mobileSize: 45,
    initialRotate: 15,
    driftX: -18,
    driftY: 18,
    rotateDelta: -10,
    duration: 30,
    delay: 2,
    isMobile: false,
  },
  {
    id: "mortar",
    name: "Mortar and Pestle",
    Component: MortarSvg,
    layer: 1,
    bottom: "16%",
    left: "2%",
    desktopSize: 76,
    mobileSize: 53,
    initialRotate: -8,
    driftX: 14,
    driftY: -20,
    rotateDelta: 8,
    duration: 32,
    delay: 4,
    isMobile: false,
  },

  // LAYER 2: MIDDLE (80-110px desktop, ~70% mobile; crisp, steady drift 20-24s)
  {
    id: "pot",
    name: "Pot",
    Component: PotSvg,
    layer: 2,
    top: "1%",
    left: "2%",
    desktopSize: 98,
    mobileSize: 68,
    initialRotate: -6,
    driftX: 16,
    driftY: 18,
    rotateDelta: 8,
    duration: 22,
    delay: 1,
    isMobile: true, // Mobile #1 (top-left margin)
  },
  {
    id: "plantain",
    name: "Plantain",
    Component: PlantainSvg,
    layer: 2,
    top: "42%",
    right: "1.5%",
    desktopSize: 94,
    mobileSize: 66,
    initialRotate: 32,
    driftX: -20,
    driftY: 24,
    rotateDelta: -14,
    duration: 20,
    delay: 3,
    isMobile: true, // Mobile #2 (mid-right margin)
  },
  {
    id: "spoon",
    name: "Wooden Spoon",
    Component: SpoonSvg,
    layer: 2,
    bottom: "4%",
    right: "3%",
    desktopSize: 90,
    mobileSize: 63,
    initialRotate: -35,
    driftX: -16,
    driftY: -18,
    rotateDelta: 12,
    duration: 24,
    delay: 2.5,
    isMobile: true, // Mobile #3 (bottom-right edge)
  },
  {
    id: "ladle",
    name: "Ladle",
    Component: LadleSvg,
    layer: 2,
    top: "54%",
    left: "2%",
    desktopSize: 92,
    mobileSize: 64,
    initialRotate: 25,
    driftX: 18,
    driftY: -16,
    rotateDelta: -12,
    duration: 21,
    delay: 5,
    isMobile: false,
  },

  // LAYER 3: FRONT (110-150px desktop, ~70% mobile; crisp, faster drift 13-16s)
  {
    id: "bonnet",
    name: "Scotch Bonnet",
    Component: ScotchBonnetSvg,
    layer: 3,
    top: "1%",
    right: "2%",
    desktopSize: 130,
    mobileSize: 90,
    initialRotate: 18,
    driftX: -24,
    driftY: 26,
    rotateDelta: 16,
    duration: 15,
    delay: 0.5,
    isMobile: true, // Mobile #4 (top-right margin)
  },
  {
    id: "tomato",
    name: "Tomato",
    Component: TomatoSvg,
    layer: 3,
    bottom: "4%",
    left: "3%",
    desktopSize: 125,
    mobileSize: 88,
    initialRotate: -12,
    driftX: 22,
    driftY: -24,
    rotateDelta: -14,
    duration: 14,
    delay: 1.8,
    isMobile: true, // Mobile #5 (bottom-left margin)
  },
  {
    id: "fish",
    name: "Fish",
    Component: FishSvg,
    layer: 3,
    top: "68%",
    right: "2%",
    desktopSize: 140,
    mobileSize: 98,
    initialRotate: -15,
    driftX: -22,
    driftY: 20,
    rotateDelta: 10,
    duration: 13,
    delay: 3.2,
    isMobile: false,
  },
];

export function KitchenBackground() {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Smooth pointer parallax springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 28, stiffness: 100 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Top-level Layer Parallax Transforms (Strict compliance with Rules of Hooks)
  const layer1X = useTransform(smoothMouseX, (v) => v * 10);
  const layer1Y = useTransform(smoothMouseY, (v) => v * 10);

  const layer2X = useTransform(smoothMouseX, (v) => v * 20);
  const layer2Y = useTransform(smoothMouseY, (v) => v * 20);

  const layer3X = useTransform(smoothMouseX, (v) => v * 34);
  const layer3Y = useTransform(smoothMouseY, (v) => v * 34);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Reduced motion preference
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleMotionChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleMotionChange);

      // Detect touch/mobile
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

      // 2. Pause when tab is hidden
      const handleVisibilityChange = () => {
        setIsPaused(document.hidden);
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // 3. Desktop pointer parallax
      const handlePointerMove = (e: PointerEvent) => {
        if (document.hidden) return;
        const normX = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
        const normY = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
        mouseX.set(normX);
        mouseY.set(normY);
      };

      // 4. Mobile scroll parallax
      const handleScroll = () => {
        if (document.hidden) return;
        setScrollY(window.scrollY || window.pageYOffset || 0);
      };

      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        mediaQuery.removeEventListener("change", handleMotionChange);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [mouseX, mouseY]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {ITEMS.map((item) => {
        const { Component } = item;

        // Depth Layer Styles: Opacity and Blur
        let layerOpacityClass = "";
        let blurClass = "";
        let layerX = layer2X;
        let layerY = layer2Y;

        if (item.layer === 1) {
          // Back layer: 56-80px, blurred, slowest drift; Opacity 14-18% (Light) / 12-14% (Dark)
          layerOpacityClass = item.isCenterOverlap
            ? "opacity-[0.12] dark:opacity-[0.09]"
            : "opacity-[0.16] dark:opacity-[0.13]";
          blurClass = "blur-[1.2px]";
          layerX = layer1X;
          layerY = layer1Y;
        } else if (item.layer === 2) {
          // Middle layer: 80-110px, crisp; Opacity 18-24% (Light) / 14-18% (Dark)
          layerOpacityClass = item.isCenterOverlap
            ? "opacity-[0.14] dark:opacity-[0.11]"
            : "opacity-[0.21] dark:opacity-[0.16]";
          blurClass = "";
          layerX = layer2X;
          layerY = layer2Y;
        } else {
          // Front layer: 110-150px, crisp; Opacity 22-30% (Light) / 18-22% (Dark)
          layerOpacityClass = item.isCenterOverlap
            ? "opacity-[0.16] dark:opacity-[0.12]"
            : "opacity-[0.26] dark:opacity-[0.20]";
          blurClass = "";
          layerX = layer3X;
          layerY = layer3Y;
        }

        // 10 items on desktop (>=768px), 5 items on mobile (<768px)
        const responsiveDisplayClass = item.isMobile
          ? "block"
          : "hidden md:block";

        // Mobile scroll parallax calculation
        const scrollFactor = item.layer === 1 ? -0.04 : item.layer === 2 ? -0.07 : -0.11;
        const currentScrollOffset = isTouchDevice ? (scrollY * scrollFactor) % 40 : 0;

        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: item.top,
              bottom: item.bottom,
              left: item.left,
              right: item.right,
              transform: `translateY(${currentScrollOffset}px)`,
              transition: isTouchDevice ? "transform 0.15s ease-out" : "none",
              ["--mob-sz" as string]: `${item.mobileSize}px`,
              ["--desk-sz" as string]: `${item.desktopSize}px`,
            }}
            className={`w-[var(--mob-sz)] h-[var(--mob-sz)] md:w-[var(--desk-sz)] md:h-[var(--desk-sz)] ${responsiveDisplayClass} ${layerOpacityClass} ${blurClass}`}
          >
            {/* If reduced motion is requested, render static arrangement */}
            {prefersReducedMotion ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `rotate(${item.initialRotate}deg)`,
                }}
              >
                <Component className="w-full h-full object-contain" />
              </div>
            ) : (
              <m.div
                style={{
                  width: "100%",
                  height: "100%",
                  x: isTouchDevice ? 0 : layerX,
                  y: isTouchDevice ? 0 : layerY,
                }}
                animate={
                  isPaused
                    ? undefined
                    : {
                        x: [0, item.driftX, -item.driftX * 0.7, 0],
                        y: [0, item.driftY, -item.driftY * 0.8, 0],
                        rotate: [
                          item.initialRotate,
                          item.initialRotate + item.rotateDelta,
                          item.initialRotate - item.rotateDelta * 0.6,
                          item.initialRotate,
                        ],
                      }
                }
                transition={{
                  duration: item.duration,
                  delay: item.delay,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              >
                <Component className="w-full h-full object-contain" />
              </m.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
