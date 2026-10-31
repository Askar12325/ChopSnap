"use client";

import React from "react";
import { m } from "framer-motion";

export interface StepHeaderProps {
  stepNumber?: number | string;
  stepTotal?: number | string;
  badgeText?: string;
  badgeVariant?: "primary" | "secondary" | "green" | "highlight";
  title: string;
  description?: string;
  className?: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  stepNumber,
  stepTotal,
  badgeText,
  badgeVariant = "primary",
  title,
  description,
  className = "",
}) => {
  // Dark text on pale tinted pills (no red text under 18px on cream or pink - WCAG AA)
  let badgeStyles = "bg-[#FDF0EE] dark:bg-[#381A15] text-[#2B1810] dark:text-[#FBF5EE] border-[#F8C3BB] dark:border-[#63251A]";
  if (badgeVariant === "secondary") {
    badgeStyles = "bg-[#FEF4E8] dark:bg-[#3B230E] text-[#2B1810] dark:text-[#FBF5EE] border-[#FCD9B0] dark:border-[#6B3C11]";
  } else if (badgeVariant === "green") {
    badgeStyles = "bg-[#EDF7F1] dark:bg-[#14281C] text-[#1F6B3B] dark:text-[#86EFAC] border-[#BCE2CB] dark:border-[#1E4D2F]";
  } else if (badgeVariant === "highlight") {
    badgeStyles = "bg-[#FEF8EC] dark:bg-[#3A2E14] text-[#2B1810] dark:text-[#FDE047] border-[#FDE8B5] dark:border-[#6B5218]";
  }

  return (
    <div className={`space-y-3 mb-6 ${className}`}>
      <div className="flex items-center gap-2.5">
        {stepNumber && (
          <span className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-sm font-bold border tracking-wide uppercase ${badgeStyles}`}>
            Step {stepNumber} {stepTotal ? `of ${stepTotal}` : ""}
          </span>
        )}
        {badgeText && !stepNumber && (
          <span className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-sm font-bold border tracking-wide ${badgeStyles}`}>
            {badgeText}
          </span>
        )}
      </div>

      <m.h2
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-semibold leading-tight tracking-tight"
      >
        {title}
      </m.h2>

      {description && (
        <p className="text-base sm:text-lg text-[var(--text-secondary)] font-normal leading-relaxed max-w-2xl font-sans">
          {description}
        </p>
      )}
    </div>
  );
};
