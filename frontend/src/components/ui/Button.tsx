"use client";

import React, { forwardRef } from "react";
import { m, HTMLMotionProps } from "framer-motion";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "green";
export type ButtonSize = "md" | "lg";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "lg",
      children,
      icon,
      iconRight,
      isLoading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    // Large touch-friendly minimum 44px height
    const sizeClasses =
      size === "lg"
        ? "min-h-[48px] px-6 py-3.5 text-base font-semibold"
        : "min-h-[44px] px-4 py-2.5 text-sm font-medium";

    let variantClasses = "";
    switch (variant) {
      case "primary":
        // Pepper red #D9381E with crisp White text (4.63:1 contrast - WCAG AA)
        // Disabled: Muted warm brown-grey with readable text instead of faded red
        variantClasses =
          "bg-[#D9381E] hover:bg-[#BC2C14] text-white shadow-md hover:shadow-lg active:bg-[#A3230E] border border-transparent disabled:bg-[#E2D8CF] disabled:text-[#695346] disabled:border-[#D4C4B6] dark:disabled:bg-[#382E27] dark:disabled:text-[#C5B5A9] dark:disabled:border-[#4E3F36] disabled:shadow-none";
        break;
      case "secondary":
        // Palm-oil orange #F28A1B with Dark text #2B1810 for WCAG AA (6.79:1 contrast)
        variantClasses =
          "bg-[#F28A1B] hover:bg-[#D77610] text-[#2B1810] dark:text-[#1E1511] font-semibold shadow-sm hover:shadow-md border border-[#E0790F]/40 disabled:bg-[#E2D8CF] disabled:text-[#695346] disabled:border-[#D4C4B6] dark:disabled:bg-[#382E27] dark:disabled:text-[#C5B5A9] dark:disabled:border-[#4E3F36] disabled:shadow-none";
        break;
      case "green":
        // Nigerian Forest Green #1F6B3B with White text (6.51:1 contrast - WCAG AA)
        variantClasses =
          "bg-[#1F6B3B] hover:bg-[#18552E] text-white shadow-sm hover:shadow-md border border-transparent disabled:bg-[#E2D8CF] disabled:text-[#695346] disabled:border-[#D4C4B6] dark:disabled:bg-[#382E27] dark:disabled:text-[#C5B5A9] dark:disabled:border-[#4E3F36] disabled:shadow-none";
        break;
      case "ghost":
      default:
        variantClasses =
          "bg-transparent hover:bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] disabled:bg-transparent disabled:text-[#8C7667] disabled:border-[var(--border-subtle)]";
        break;
    }

    const disabledClasses =
      disabled || isLoading
        ? "cursor-not-allowed pointer-events-none select-none"
        : "cursor-pointer";

    return (
      <m.button
        ref={ref}
        whileHover={disabled || isLoading ? undefined : { scale: 1.015 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.985 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2.5 rounded-2xl transition-colors duration-150 select-none text-center font-sans tracking-tight ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {!isLoading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </m.button>
    );
  }
);

Button.displayName = "Button";
