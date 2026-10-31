"use client";

import React from "react";
import { m } from "framer-motion";

export interface ProgressDotsProps {
  totalSteps: number;
  currentStep: number; // 1-indexed
  onStepClick?: (step: number) => void;
  labels?: string[];
  className?: string;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  totalSteps,
  currentStep,
  onStepClick,
  labels,
  className = "",
}) => {
  return (
    <nav
      aria-label="Progress"
      className={`flex items-center justify-center gap-3 sm:gap-4 py-2 ${className}`}
    >
      {Array.from({ length: totalSteps }, (_, idx) => {
        const step = idx + 1;
        const isCurrent = step === currentStep;
        const isCompleted = step < currentStep;
        const label = labels?.[idx] || `Step ${step}`;

        return (
          <button
            key={step}
            type="button"
            disabled={!onStepClick}
            onClick={() => onStepClick?.(step)}
            aria-label={`${label} ${isCurrent ? "(current)" : isCompleted ? "(completed)" : ""}`}
            aria-current={isCurrent ? "step" : undefined}
            className={`min-h-[44px] min-w-[44px] group flex items-center justify-center gap-2 p-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9381E] ${
              onStepClick ? "cursor-pointer" : "cursor-default pointer-events-none"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <m.div
                layout
                animate={{
                  width: isCurrent ? 28 : 10,
                  backgroundColor: isCurrent
                    ? "#D9381E"
                    : isCompleted
                    ? "#1F6B3B"
                    : "var(--border-strong)",
                }}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
                className="h-2.5 rounded-full"
              />
            </div>
            {labels && isCurrent && (
              <span className="text-sm font-semibold text-[var(--text-primary)] hidden sm:inline-block">
                {label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
