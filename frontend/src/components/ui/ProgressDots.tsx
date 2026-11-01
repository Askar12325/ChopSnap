"use client";

import React from "react";
import { Check } from "lucide-react";

export interface ProgressDotsProps {
  totalSteps?: number;
  currentStep: number; // 1-indexed
  onStepClick?: (step: number) => void;
  labels?: string[];
  className?: string;
}

const DEFAULT_LABELS = ["Snap", "Check", "Plan"];

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  totalSteps = 3,
  currentStep,
  onStepClick,
  labels = DEFAULT_LABELS,
  className = "",
}) => {
  const stepLabels = labels && labels.length >= totalSteps ? labels : DEFAULT_LABELS;
  const count = Math.min(totalSteps, stepLabels.length);

  return (
    <nav
      aria-label="Steps progress"
      className={`flex items-center justify-center gap-1.5 sm:gap-2 select-none ${className}`}
    >
      {Array.from({ length: count }, (_, idx) => {
        const stepNum = idx + 1;
        const isCurrent = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const stepName = stepLabels[idx] || `Step ${stepNum}`;

        return (
          <button
            key={stepNum}
            type="button"
            disabled={!onStepClick}
            onClick={() => onStepClick?.(stepNum)}
            aria-label={`${stepNum} ${stepName} ${
              isCurrent ? "(current step)" : isCompleted ? "(completed)" : "(upcoming)"
            }`}
            aria-current={isCurrent ? "step" : undefined}
            className={`min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              isCurrent
                ? "bg-[#F9A826] text-[#1A1033] shadow-sm ring-2 ring-[#F9A826]/30 font-bold"
                : isCompleted
                ? "bg-[#2E8B57] text-white shadow-xs"
                : "bg-[var(--bg-surface-subtle)]/70 text-[var(--text-muted)] border border-[var(--border-subtle)]"
            } ${onStepClick ? "cursor-pointer hover:opacity-90 active:scale-95" : "cursor-default"}`}
          >
            {isCompleted ? (
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-white stroke-[2.5]" />
              </span>
            ) : (
              <span
                className={`w-4 h-4 rounded-full text-[11px] leading-none flex items-center justify-center shrink-0 font-bold ${
                  isCurrent ? "bg-[#1A1033] text-[#F9A826]" : "bg-[var(--border-strong)] text-[var(--text-primary)]"
                }`}
              >
                {stepNum}
              </span>
            )}
            <span className="truncate">{stepName}</span>
          </button>
        );
      })}
    </nav>
  );
};
