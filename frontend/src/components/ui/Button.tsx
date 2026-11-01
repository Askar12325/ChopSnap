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
        // Solid brand indigo #1D2B64 with white text (13.28:1 contrast - WCAG AAA)
        // Disabled: Muted slate/indigo with readable contrast
        variantClasses =
          "bg-[#1D2B64] hover:bg-[#15204C] active:bg-[#0F1736] text-white dark:bg-[#2D3E8C] dark:hover:bg-[#374BA5] dark:active:bg-[#202D68] shadow-md hover:shadow-lg border border-transparent disabled:bg-[#D5D8E8] disabled:text-[#555A75] disabled:border-[#C8D1F5] dark:disabled:bg-[#1C2758] dark:disabled:text-[#7A82A8] dark:disabled:border-[#283777] disabled:shadow-none";
        break;
      case "secondary":
        // Outlined brand indigo with indigo text
        variantClasses =
          "bg-transparent border-2 border-[#1D2B64] text-[#1D2B64] hover:bg-[#1D2B64]/8 active:bg-[#1D2B64]/15 dark:border-[#7B8ED8] dark:text-[#C8D1F5] dark:hover:bg-[#7B8ED8]/15 font-semibold shadow-xs hover:shadow-sm disabled:border-[#C8D1F5] disabled:text-[#7A82A8] dark:disabled:border-[#283777] dark:disabled:text-[#4F5B88] disabled:shadow-none";
        break;
      case "green":
        // Success Green #2E8B57 with crisp white text
        variantClasses =
          "bg-[#2E8B57] hover:bg-[#246E44] active:bg-[#1B5634] text-white dark:bg-[#38A169] dark:hover:bg-[#2F855A] shadow-sm hover:shadow-md border border-transparent disabled:bg-[#D5D8E8] disabled:text-[#555A75] disabled:border-[#C8D1F5] dark:disabled:bg-[#1C2758] dark:disabled:text-[#7A82A8] dark:disabled:border-[#283777] disabled:shadow-none";
        break;
      case "ghost":
      default:
        variantClasses =
          "bg-transparent hover:bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] disabled:bg-transparent disabled:text-[var(--text-muted)] disabled:border-[var(--border-subtle)]";
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
        className={`inline-flex items-center justify-center gap-2.5 rounded-2xl transition-colors duration-150 select-none text-center font-sans tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F9A826] ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
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
