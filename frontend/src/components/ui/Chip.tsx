"use client";

import React, { forwardRef } from "react";
import { m, HTMLMotionProps } from "framer-motion";
import { X } from "lucide-react";

export type ChipVariant =
  | "default"
  | "selected"
  | "primary"
  | "secondary"
  | "green"
  | "highlight";

export interface ChipProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ChipVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onRemove?: () => void;
  interactive?: boolean;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      variant = "default",
      children,
      icon,
      onRemove,
      interactive = true,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    let variantStyles = "";

    switch (variant) {
      case "selected":
        variantStyles =
          "bg-[#D9381E] text-white border-[#D9381E] shadow-sm";
        break;
      case "primary":
        // Dark text for WCAG AA compliance (no red text under 18px on cream or pink)
        variantStyles =
          "bg-[#FDF0EE] dark:bg-[#381A15] text-[#2B1810] dark:text-[#FBF5EE] border-[#F8C3BB] dark:border-[#63251A]";
        break;
      case "secondary":
        // Dark text for WCAG AA (6.79:1 contrast)
        variantStyles =
          "bg-[#FEF4E8] dark:bg-[#3B230E] text-[#2B1810] dark:text-[#FBF5EE] border-[#FCD9B0] dark:border-[#6B3C11]";
        break;
      case "green":
        variantStyles =
          "bg-[#EDF7F1] dark:bg-[#14281C] text-[#1F6B3B] dark:text-[#86EFAC] border-[#BCE2CB] dark:border-[#1E4D2F]";
        break;
      case "highlight":
        variantStyles =
          "bg-[#FEF8EC] dark:bg-[#3A2E14] text-[#2B1810] dark:text-[#FBF5EE] border-[#FDE8B5] dark:border-[#6B5218]";
        break;
      case "default":
      default:
        variantStyles =
          "bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border-[var(--border-subtle)]";
        break;
    }

    const interactiveClasses = interactive
      ? "cursor-pointer active:scale-95"
      : "cursor-default";

    return (
      <m.button
        ref={ref}
        type="button"
        whileTap={interactive ? { scale: 0.96 } : undefined}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        onClick={onClick}
        className={`min-h-[44px] inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-semibold select-none transition-colors duration-150 ${variantStyles} ${interactiveClasses} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
        {onRemove && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Remove item"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onRemove();
              }
            }}
            className="w-7 h-7 -mr-2 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 shrink-0" />
          </span>
        )}
      </m.button>
    );
  }
);

Chip.displayName = "Chip";
