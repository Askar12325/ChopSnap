"use client";

import React from "react";
import { m } from "framer-motion";

export interface StepHeaderProps {
  stepNumber?: number | string;
  stepTotal?: number | string;
  badgeText?: string;
  badgeVariant?: "primary" | "secondary" | "green" | "highlight" | "zobo";
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
  // Brand indigo, saffron, green, and zobo badges with strict WCAG AA contrast
  let badgeStyles = "bg-[#EEF1FC] dark:bg-[#1C2758] text-[#1D2B64] dark:text-[#C8D1F5] border-[#C8D1F5] dark:border-[#3D52A8]";
  if (badgeVariant === "secondary" || badgeVariant === "highlight") {
    // Saffron with dark text ink
    badgeStyles = "bg-[#FEF6E9] dark:bg-[#362810] text-[#1A1033] dark:text-[#FFF5E1] border-[#FCE1AD] dark:border-[#6B4D16]";
  } else if (badgeVariant === "green") {
    // Success green
    badgeStyles = "bg-[#EAF5EE] dark:bg-[#132E22] text-[#20653E] dark:text-[#86EFAC] border-[#B7DFCA] dark:border-[#1E5038]";
  } else if (badgeVariant === "zobo") {
    // Zobo red accent
    badgeStyles = "bg-[#FDF0F3] dark:bg-[#3A101C] text-[#A3173A] dark:text-[#F7A6B8] border-[#F7C5D0] dark:border-[#661D32]";
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
