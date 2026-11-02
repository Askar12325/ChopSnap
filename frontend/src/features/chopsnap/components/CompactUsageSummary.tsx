"use client";

import React, { useState } from "react";
import { Wallet, ChevronDown, MapPin, Info } from "lucide-react";
import { SupportedCity, SUPPORTED_CITIES, DetectedItem } from "../types";

export interface CompactUsageSummaryProps {
  ingredientsUsedPercent: number;
  usedUserIngredients: DetectedItem[];
  notUsedUserIngredients: DetectedItem[];
  totalUserIngredients: number;
  ingredientValueNaira: number;
  hasSavingsData: boolean;
  somePricesUnavailable: boolean;
  selectedCity: SupportedCity;
  setSelectedCity: (city: SupportedCity) => void;
}

export function CompactUsageSummary({
  ingredientsUsedPercent,
  usedUserIngredients,
  notUsedUserIngredients,
  totalUserIngredients,
  ingredientValueNaira,
  hasSavingsData,
  somePricesUnavailable,
  selectedCity,
  setSelectedCity,
}: CompactUsageSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  return (
    <div className="chop-card p-4 sm:p-5 shadow-xs border border-[var(--border-subtle)] space-y-3 transition-all">
      {/* Collapsed One-Line Bar (Tappable header) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between gap-3 cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label="Toggle ingredients and value summary"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-wrap text-sm">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary-subtle)] text-[#1D2B64] dark:text-[#C8D1F5] flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4" />
          </div>

          <span className="font-semibold text-[var(--text-primary)]">
            Kitchen ingredients:{" "}
            <span className="text-[#2E8B57] dark:text-[#86EFAC]">
              {ingredientsUsedPercent}% used
            </span>{" "}
            ({usedUserIngredients.length}/{totalUserIngredients})
          </span>

          <span className="text-[var(--text-muted)] hidden sm:inline">•</span>

          {hasSavingsData && (
            <span className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
              Value of what you&apos;re using:{" "}
              <strong className="text-[#1D2B64] dark:text-[#F9A826]">
                ~₦{ingredientValueNaira.toLocaleString()}
              </strong>{" "}
              <span className="text-[var(--text-muted)] text-xs">(estimate)</span>
            </span>
          )}

          {somePricesUnavailable && (
            <span className="text-[11px] text-[var(--text-muted)] italic hidden md:inline">
              (some prices unavailable)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition-all cursor-pointer"
          aria-label={isExpanded ? "Collapse summary" : "Expand summary"}
        >
          <span className="text-xs font-semibold mr-1 hidden sm:inline">
            {isExpanded ? "Less" : "Details"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="pt-3 border-t border-[var(--border-subtle)] space-y-4 text-sm animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-[var(--text-secondary)]">
              Calculated from your confirmed kitchen list and current local market pricing tables.
            </p>

            {/* City Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#A3173A]" />
                <span>Market:</span>
              </span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as SupportedCity)}
                className="min-h-[38px] text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-lg px-2.5 py-1.5 outline-none cursor-pointer focus:border-[#F9A826] font-semibold"
                aria-label="Select market city for pricing estimates"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c} Market
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Utilization Rate</span>
                <span className="text-[#2E8B57] dark:text-[#86EFAC]">
                  {ingredientsUsedPercent}%
                </span>
              </div>
              <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2E8B57] dark:bg-[#86EFAC] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(ingredientsUsedPercent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {usedUserIngredients.length} of {totalUserIngredients} provisions used in current meal plans.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Pantry Value Utilized</span>
                {hasSavingsData && (
                  <span className="text-[#1D2B64] dark:text-[#F9A826]">
                    ~₦{ingredientValueNaira.toLocaleString()} (estimate)
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Approximate value of food you already own put to work in these meals.
              </p>
              {somePricesUnavailable && (
                <p className="text-[11px] text-[var(--text-muted)] italic">
                  Note: some ingredients lack local retail price estimates.
                </p>
              )}
            </div>
          </div>

          {/* Not Used Yet Section */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              {notUsedUserIngredients.length > 0
                ? `Not used yet (${notUsedUserIngredients.length} provisions remaining)`
                : "All confirmed provisions utilized in these recipes"}
            </span>

            {notUsedUserIngredients.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {notUsedUserIngredients.map((item, idx) => (
                  <span
                    key={idx}
                    className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#F9A826]" />
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* "How we calculate this" Plain-English breakdown */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setShowFormulaInfo(!showFormulaInfo)}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 font-medium cursor-pointer py-1"
            >
              <Info className="w-3.5 h-3.5 text-[#F9A826]" />
              <span>How we calculate this</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showFormulaInfo ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFormulaInfo && (
              <div className="mt-2 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1.5 leading-relaxed">
                <p>
                  • <strong>Ingredients used %:</strong> The number of confirmed items utilized in the recipes divided by your total confirmed ingredients.
                </p>
                <p>
                  • <strong>Value of ingredients you&apos;re using:</strong> Calculated by matching each used ingredient against retail market purchasing prices in {selectedCity} from our pricing reference table.
                </p>
                <p>
                  • <strong>Estimates only:</strong> Market prices vary by neighborhood stall, season, and time of day. Assumed staples like salt and water are excluded from cost calculations.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
