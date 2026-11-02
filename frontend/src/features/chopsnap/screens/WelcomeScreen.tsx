"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, Camera, CheckSquare, ChefHat, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";
import { HeroIllustration } from "@/components/HeroIllustration";

export interface WelcomeScreenProps {
  onStart: () => void;
  onTryExample: () => void;
}

export function WelcomeScreen({ onStart, onTryExample }: WelcomeScreenProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center py-1 sm:py-4">
      {/* Text Column (Left on Desktop, Top on Mobile) */}
      <div className="lg:col-span-6 space-y-4 sm:space-y-5">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold text-[var(--text-primary)] leading-[1.2] tracking-tight [text-wrap:balance] max-w-xl lg:max-w-none">
            Cook celebratory Nigerian meals from what’s{" "}
            <span className="relative inline-block text-[var(--text-primary)] dark:text-[#F9A826] font-normal dark:italic">
              <span className="absolute left-0 right-0 bottom-1 h-2.5 sm:h-3 bg-[#F9A826]/35 rounded-sm -z-0 dark:hidden" />
              <span className="relative z-10 whitespace-nowrap sm:whitespace-normal">already in your kitchen.</span>
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans max-w-xl">
            ChopSnap helps you cook Nigerian meals with the ingredients you already have, saving money and cutting food waste.
          </p>
        </div>

        {/* Mobile-only illustration (compact below text on phones) */}
        <div className="lg:hidden my-1 flex justify-center">
          <HeroIllustration className="max-w-[220px] sm:max-w-[260px] h-[150px] sm:h-[180px]" isMobile />
        </div>

        {/* Primary CTA & Example Action */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-row items-center gap-3 sm:gap-4 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={onStart}
              iconRight={<ArrowRight className="w-4 h-4 ml-1" />}
              className="text-sm sm:text-base px-7 py-3 shadow-md min-h-[46px] cursor-pointer"
            >
              Start
            </Button>

            <button
              type="button"
              onClick={onTryExample}
              className="text-xs sm:text-sm font-semibold text-[#1D2B64] dark:text-[#F9A826] hover:underline cursor-pointer flex items-center gap-1.5 py-2 px-2.5 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-[#F9A826] shrink-0" />
              <span>Try an example</span>
            </button>
          </div>

          {/* Small 'How it works' text link under the buttons (closed by default) */}
          <div>
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer inline-flex items-center gap-1 py-1"
              aria-expanded={showHowItWorks}
            >
              <span>How it works</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showHowItWorks ? "rotate-180" : ""}`} />
            </button>

            {showHowItWorks && (
              <div className="mt-3 chop-card p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Vertically Centered Pot Illustration (Desktop) */}
      <div className="hidden lg:flex lg:col-span-6 items-center justify-center pl-4 lg:pl-8">
        <HeroIllustration className="w-full max-w-[420px] h-[300px]" />
      </div>
    </section>
  );
}
