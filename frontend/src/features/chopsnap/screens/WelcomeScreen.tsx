"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, X, Camera, CheckSquare, ChefHat } from "lucide-react";
import { Button } from "@/components/ui";
import { HeroIllustration } from "@/components/HeroIllustration";

export interface WelcomeScreenProps {
  onStart: () => void;
  onTryExample: () => void;
}

export function WelcomeScreen({ onStart, onTryExample }: WelcomeScreenProps) {
  const [showIntroCard, setShowIntroCard] = useState(true);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-2 sm:py-6">
      {/* Text Column (Left on Desktop, Top on Mobile) */}
      <div className="lg:col-span-6 space-y-6 sm:space-y-7">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-[var(--text-primary)] leading-[1.18] tracking-tight [text-wrap:balance] max-w-xl lg:max-w-none">
            Cook celebratory Nigerian meals from what’s{" "}
            <span className="relative inline-block text-[var(--text-primary)] dark:text-[#F9A826] font-normal dark:italic">
              <span className="absolute left-0 right-0 bottom-1 h-3 sm:h-3.5 bg-[#F9A826]/35 rounded-sm -z-0 dark:hidden" />
              <span className="relative z-10 whitespace-nowrap sm:whitespace-normal">already in your kitchen.</span>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-sans max-w-xl">
            ChopSnap helps you cook Nigerian meals with the ingredients you already have, saving money and cutting food waste.
          </p>
        </div>

        {/* Mobile-only illustration (stacked under text on phones) */}
        <div className="lg:hidden my-2 flex justify-center">
          <HeroIllustration className="max-w-[280px] sm:max-w-[320px]" isMobile />
        </div>

        {/* Dismissible 3-Step Intro Card (How ChopSnap Works) */}
        {showIntroCard && (
          <div className="chop-card p-4 sm:p-5 relative border border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F9A826]" />
                How ChopSnap Works
              </span>
              <button
                type="button"
                onClick={() => setShowIntroCard(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
                aria-label="Dismiss 3-step intro"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EEF1FC] dark:bg-[#1C2758] text-[#1D2B64] dark:text-[#C8D1F5] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">1. Snap</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-snug">
                    Photo or voice what you have in your kitchen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FEF6E9] dark:bg-[#362810] text-[#B36B00] dark:text-[#F9A826] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">2. Check</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-snug">
                    Review and confirm your detected items.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EAF5EE] dark:bg-[#132E22] text-[#20653E] dark:text-[#86EFAC] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <ChefHat className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">3. Cook</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-snug">
                    Get authentic recipes and waste nothing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary CTA & Example Action */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onStart}
              iconRight={<ArrowRight className="w-4 h-4 ml-1" />}
              className="text-base px-8 py-4 shadow-lg min-h-[50px] cursor-pointer"
            >
              Start
            </Button>

            <button
              type="button"
              onClick={onTryExample}
              className="text-sm font-semibold text-[#1D2B64] dark:text-[#F9A826] hover:underline cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 py-2.5 px-3 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-[#F9A826] shrink-0" />
              <span>Try an example</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Vertically Centered Pot Illustration (Desktop) */}
      <div className="hidden lg:flex lg:col-span-6 items-center justify-center pl-4 lg:pl-8">
        <HeroIllustration className="w-full max-w-[460px]" />
      </div>
    </section>
  );
}
