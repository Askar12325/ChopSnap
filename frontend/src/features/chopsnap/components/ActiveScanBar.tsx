"use client";

import React from "react";
import { Camera, RotateCcw } from "lucide-react";
import { ProcessResponse } from "../types";

export interface ActiveScanBarProps {
  data: ProcessResponse | null;
  selectedFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  resetAll: () => void;
}

export function ActiveScanBar({
  data,
  selectedFile,
  fileInputRef,
  resetAll,
}: ActiveScanBarProps) {
  if (!data) return null;

  return (
    <div className="sticky top-18 sm:top-20 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B57] dark:bg-[#86EFAC] shrink-0 animate-pulse" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {selectedFile?.name || "Kitchen Ingredients Scan"}
            </p>
            <p className="text-sm text-[var(--text-secondary)] truncate hidden sm:block">
              {data.detected_items.length} ingredients active • {data.recipes.length} recipes matched
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--text-primary)] hover:opacity-90 transition-all text-sm font-semibold flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
          >
            <Camera className="w-4 h-4 shrink-0 text-[#A3173A]" />
            <span>Change photo</span>
          </button>

          <button
            type="button"
            onClick={resetAll}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[#1D2B64] transition-all text-sm font-semibold flex items-center gap-2 active:scale-95 cursor-pointer"
            title="Start fresh scan"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">New scan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
