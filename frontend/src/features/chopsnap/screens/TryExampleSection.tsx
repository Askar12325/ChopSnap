"use client";

import React from "react";
import { Zap, Store, ArrowRight, Layers, Salad } from "lucide-react";

export interface TryExampleSectionProps {
  handleLoadSample: (sampleType: "market" | "pantry" | "native") => void;
}

export function TryExampleSection({ handleLoadSample }: TryExampleSectionProps) {
  return (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 border-b border-[var(--border-subtle)] pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A3173A] uppercase tracking-wider mb-0.5">
                <Zap className="w-4 h-4" />
                <span>Instant Demo Mode</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[var(--text-primary)]">
                Try an example
              </h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              No photo ready right now? Tap any verified kitchen to test immediately:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
              onClick={() => handleLoadSample("market")}
              type="button"
              className="chop-card p-4 sm:p-5 text-left hover:border-[#1D2B64] dark:hover:border-[#287A4D] transition-all group shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary-text)] flex items-center justify-center border border-[var(--primary-border)] group-hover:scale-105 transition-transform">
                  <Store className="w-4 h-4 text-[#A3173A]" />
                </div>
                <span className="chop-pill chop-pill-primary text-sm">Fridge & Counter</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] group-hover:text-[#1D2B64] dark:group-hover:text-[#86EFAC] transition-colors flex items-center justify-between">
                <span>Lagos Market Haul</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 line-clamp-2">
                Fresh eggs, smoked Titus fish, sweet ripe plantains, plum tomatoes, ata rodo, and sliced ugwu.
              </p>
            </button>

            <button
              onClick={() => handleLoadSample("pantry")}
              type="button"
              className="chop-card p-4 sm:p-5 text-left hover:border-[#F9A826] transition-all group shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent-text)] flex items-center justify-center border border-[var(--accent-border)] group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4 text-[#F9A826]" />
                </div>
                <span className="chop-pill chop-pill-accent text-sm">Pantry Shelf</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] group-hover:text-[#F9A826] transition-colors flex items-center justify-between">
                <span>Honey Beans Station</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 line-clamp-2">
                Cooked Oloyin honey beans, fresh scent leaves (efirin), dodo plantains, eggs, and smoked fish flakes.
              </p>
            </button>

            <button
              onClick={() => handleLoadSample("native")}
              type="button"
              className="chop-card p-4 sm:p-5 text-left hover:border-[#1D2B64] dark:hover:border-[#287A4D] transition-all group shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary-text)] flex items-center justify-center border border-[var(--primary-border)] group-hover:scale-105 transition-transform">
                  <Salad className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC]" />
                </div>
                <span className="chop-pill chop-pill-primary text-sm">Native Crisper</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] group-hover:text-[#1D2B64] dark:group-hover:text-[#86EFAC] transition-colors flex items-center justify-between">
                <span>Native Greens Crisper</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 line-clamp-2">
                Fresh pumpkin ugwu leaves, smoked catfish mangala, stockfish bits (okporoko), and pure red palm oil.
              </p>
            </button>
          </div>
        </section>
  );
}
