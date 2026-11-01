"use client";

import React from "react";

export function HowItWorksSection() {
  return (
        <section className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[var(--text-primary)]">
              How ChopSnap Works
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              Three simple steps to waste nothing and eat well every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="chop-card p-5 sm:p-6 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-text)] flex items-center justify-center font-bold text-base shadow-sm">
                  1
                </div>
                <span className="chop-pill chop-pill-primary">Snap</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Snap Your Kitchen
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Take a clear snapshot of your fridge crisper, pantry cupboard, or kitchen counter basket.
              </p>
            </div>

            <div className="chop-card p-5 sm:p-6 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent-text)] flex items-center justify-center font-bold text-base shadow-sm">
                  2
                </div>
                <span className="chop-pill chop-pill-accent">Check</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Check What You Have
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                We spot your fish, meats, produce, and staples. You can add or remove items to customize the list.
              </p>
            </div>

            <div className="chop-card p-5 sm:p-6 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-text)] flex items-center justify-center font-bold text-base shadow-sm">
                  3
                </div>
                <span className="chop-pill chop-pill-primary">Cook</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Cook and Waste Nothing
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Follow simple, step-by-step instructions. If an ingredient is missing, a tiny shopping list is ready.
              </p>
            </div>
          </div>
        </section>
  );
}
