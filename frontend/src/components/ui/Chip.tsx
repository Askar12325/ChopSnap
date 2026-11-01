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
  | "highlight"
  | "zobo";

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
          "bg-[#1D2B64] dark:bg-[#2D3E8C] text-white border-[#1D2B64] dark:border-[#2D3E8C] shadow-sm";
        break;
      case "primary":
        // Soft indigo pill
        variantStyles =
          "bg-[#EEF1FC] dark:bg-[#1C2758] text-[#1D2B64] dark:text-[#C8D1F5] border-[#C8D1F5] dark:border-[#3D52A8]";
        break;
      case "secondary":
      case "highlight":
        // Accent saffron with dark text ink for WCAG AA compliance (9.14:1 contrast)
        variantStyles =
          "bg-[#FEF6E9] dark:bg-[#362810] text-[#1A1033] dark:text-[#FFF5E1] border-[#FCE1AD] dark:border-[#6B4D16]";
        break;
      case "green":
        variantStyles =
          "bg-[#EAF5EE] dark:bg-[#132E22] text-[#20653E] dark:text-[#86EFAC] border-[#B7DFCA] dark:border-[#1E5038]";
        break;
      case "zobo":
        variantStyles =
          "bg-[#FDF0F3] dark:bg-[#3A101C] text-[#A3173A] dark:text-[#F7A6B8] border-[#F7C5D0] dark:border-[#661D32]";
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
        className={`min-h-[44px] inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-semibold select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F9A826] ${variantStyles} ${interactiveClasses} ${className}`}
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
