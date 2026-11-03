"use client";

import React from "react";
import { ChopSnapLogo } from "@/components/ChopSnapLogo";
import { ProcessResponse } from "../types";

export interface FooterProps {
  data?: ProcessResponse | null;
  configuredRecipeModel?: string;
}

export function Footer({ data, configuredRecipeModel }: FooterProps) {
  const modelName = (
    data?.model_metadata?.recipe_model ||
    configuredRecipeModel ||
    "Muse Spark Open"
  )
    .replace(/meta\/|:.*|\b30b\b/gi, "")
    .replace(/-/g, " ")
    .trim()
    .toLowerCase()
    .includes("muse")
    ? "Muse Spark Open"
    : (
        data?.model_metadata?.recipe_model ||
        configuredRecipeModel ||
        "Muse Spark Open"
      )
        .replace(/meta\/|:.*|\b30b\b/gi, "")
        .replace(/-/g, " ")
        .trim() || "Muse Spark Open";

  return (
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-page)]/80 backdrop-blur-sm py-8 text-sm text-[var(--text-secondary)] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 shadow-sm flex items-center justify-center p-0.5">
              <ChopSnapLogo showWordmark={false} className="w-full h-full" />
            </div>
            <span className="text-[var(--text-primary)] font-semibold">ChopSnap</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="hidden md:inline">ChopSnap helps you cook Nigerian meals with the ingredients you already have, within your budget.</span>
            <span className="text-[var(--text-muted)] hidden md:inline">•</span>
            <span>Meta Global AI Hackathon (Indie Track)</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-1.5 sm:gap-2.5 text-sm">
            <span className="font-bold text-[var(--text-primary)] tracking-tight">
              Built with Muse Spark Open
            </span>
            <span className="text-[var(--text-muted)] hidden sm:inline">•</span>
            <span className="text-xs text-[var(--text-secondary)]">
              Model: {modelName} (open-weight)
            </span>
          </div>
        </div>
      </footer>
  );
}
