"use client";

import React, { forwardRef } from "react";
import { m, HTMLMotionProps } from "framer-motion";

export type CardVariant = "default" | "subtle" | "interactive";

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", children, className = "", ...props }, ref) => {
    let variantStyles = "";

    switch (variant) {
      case "subtle":
        variantStyles =
          "bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-2xl p-5 sm:p-6";
        break;
      case "interactive":
        variantStyles =
          "bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md cursor-pointer transition-colors duration-200";
        break;
      case "default":
      default:
        variantStyles =
          "bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-sm";
        break;
    }

    if (variant === "interactive") {
      return (
        <m.div
          ref={ref}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`${variantStyles} ${className}`}
          {...props}
        >
          {children}
        </m.div>
      );
    }

    return (
      <div ref={ref} className={`${variantStyles} ${className}`} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
