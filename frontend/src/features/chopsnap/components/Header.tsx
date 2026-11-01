"use client";

import React from "react";
import { ChopSnapLogo } from "@/components/ChopSnapLogo";
import { Sun, Moon, Info } from "lucide-react";
import { ProcessResponse } from "../types";

export interface HeaderProps {
  resetAll: () => void;
  data: ProcessResponse | null;
  isBackendHealthy: boolean | null;
  isDark: boolean;
  toggleTheme: () => void;
  setShowOpenWeightModal: (show: boolean) => void;
}

export function Header({
  resetAll,
  data,
  isBackendHealthy,
  isDark,
  toggleTheme,
  setShowOpenWeightModal,
}: HeaderProps) {
  return (
      <header className="sticky top-0 z-40 bg-[var(--bg-page)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2.5">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={resetAll}
              className="flex items-center gap-2 focus:outline-none cursor-pointer"
              aria-label="ChopSnap Home"
            >
              <ChopSnapLogo className="h-9 sm:h-10 w-auto" />
            </button>
            <div className="hidden md:block min-w-0 pl-3 border-l border-[var(--border-subtle)]">
              <p className="text-sm text-[var(--text-secondary)] font-medium truncate">
                Snap your kitchen. Know what to chop.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Real Health Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] shadow-sm min-h-[44px]">
              {data ? (
                data.is_demo ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F9A826]" />
                    <span className="font-semibold text-[var(--text-primary)]">Curated Demo Mode</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B57] dark:bg-[#86EFAC] animate-pulse" />
                    <span className="font-semibold text-[var(--text-primary)]">Live Kitchen Analysis</span>
                  </>
                )
              ) : isBackendHealthy === true ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B57] dark:bg-[#86EFAC]" />
                  <span className="font-semibold text-[var(--text-primary)]">AI Ready</span>
                </>
              ) : isBackendHealthy === false ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1D2B64]" />
                  <span className="font-semibold text-[#A3173A] dark:text-[#F7A6B8]">Offline</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)] animate-pulse" />
                  <span className="text-[var(--text-muted)]">Checking...</span>
                </>
              )}
            </div>

            <button
              onClick={toggleTheme}
              type="button"
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-2 text-sm font-semibold shadow-sm active:scale-95 cursor-pointer"
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-[#F9A826]" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowOpenWeightModal(true)}
              type="button"
              className="min-h-[44px] text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] shadow-sm active:scale-95 cursor-pointer"
              title="Why Open-Weight Models?"
            >
              <Info className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC]" />
              <span className="hidden sm:inline">Why Open-Weight?</span>
            </button>
          </div>
        </div>
      </header>
  );
}
