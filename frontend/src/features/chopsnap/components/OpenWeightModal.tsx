"use client";

import React from "react";
import { ShieldCheck, X, Coins, Lock, Cpu } from "lucide-react";

export interface OpenWeightModalProps {
  showOpenWeightModal: boolean;
  setShowOpenWeightModal: (show: boolean) => void;
}

export function OpenWeightModal({
  showOpenWeightModal,
  setShowOpenWeightModal,
}: OpenWeightModalProps) {
  if (!showOpenWeightModal) return null;

  return (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowOpenWeightModal(false)}
        >
          <div
            className="chop-card max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary-text)] flex items-center justify-center shrink-0 border border-[var(--primary-border)] shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-[#2E8B57]" />
                </div>
                <div>
                  <h3 className="text-xl font-normal text-[var(--text-primary)]">
                    Why Open-Weight Models?
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Why ChopSnap uses open weights instead of closed APIs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOpenWeightModal(false)}
                className="min-h-[44px] min-w-[44px] rounded-xl text-[var(--text-secondary)] hover:text-[#1D2B64] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Concrete Pillars */}
            <div className="space-y-4 text-sm text-[var(--text-secondary)]">
              <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-[#2E8B57] dark:text-[#86EFAC] text-sm">
                  <Coins className="w-4 h-4 shrink-0" />
                  <span>1. Zero Per-Token Tax (Cost)</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Closed commercial APIs charge for every token and uploaded kitchen photo. For Nigerian home cooks and indie apps, API bills can rapidly spiral. Open-weight models run on self-managed servers at fixed, predictable costs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-[#2E8B57] dark:text-[#86EFAC] text-sm">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>2. Household Privacy (Privacy)</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Snapshots of your home kitchen, pantry cupboards, and personal food habits never leak to third-party ad brokers or get ingested to train external commercial models. Your kitchen data stays yours.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-[#A3173A] text-sm">
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>3. True Independence (Can Be Hosted Ourselves)</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Proprietary APIs can change pricing, throttle rate limits, or shut down overnight. With open weights, the software is fully sovereign and can be deployed anywhere—from a cloud GPU to an offline edge machine in Lagos.
                </p>
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowOpenWeightModal(false)}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#1D2B64] hover:bg-[#15204C] text-sm font-semibold text-white transition-colors active:scale-95 shadow-sm cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
  );
}
