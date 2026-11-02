"use client";

import React, { useState } from "react";
import {
  Clock,
  Flame,
  Utensils,
  Tag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wallet,
  ShoppingCart,
  ChefHat,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import { Recipe, SupportedCity } from "../types";
import { RecipeHeroImage } from "./RecipeHeroImage";
import { calculateRecipeCostToBuy } from "@/utils/matching";
import cityPricesData from "@/data/prices.json";

export interface RecipeCardViewProps {
  recipe: Recipe;
  recipeIndex: number;
  totalRecipes: number;
  selectedCity: SupportedCity;
  budgetNaira?: number | null;
  onStartCooking: (recipeIndex: number) => void;
  totalUserIngredients: number;
}

export function RecipeCardView({
  recipe,
  recipeIndex,
  selectedCity,
  budgetNaira,
  onStartCooking,
  totalUserIngredients,
}: RecipeCardViewProps) {
  const [copied, setCopied] = useState(false);

  const costAnalysis = calculateRecipeCostToBuy(
    recipe,
    selectedCity,
    cityPricesData,
    budgetNaira ?? null
  );

  const isBudget = recipe.financial_tier === "budget";
  const totalMinutes = recipe.prep_time_minutes + recipe.cook_time_minutes;

  // Generate plain-text summary for Copy & WhatsApp sharing
  const buildShareSummary = () => {
    const buyList =
      costAnalysis.missingItemsToBuy.length > 0
        ? costAnalysis.missingItemsToBuy.map((i) => `- ${i}`).join("\n")
        : "None (everything in kitchen!)";

    const stepsList = recipe.instructions
      .map((step, idx) => `${idx + 1}. ${step}`)
      .join("\n");

    const costLine =
      costAnalysis.costToBuy > 0
        ? `~₦${costAnalysis.costToBuy.toLocaleString()} to buy (estimate)`
        : "₦0 to buy (estimate)";

    return `🍲 ${recipe.title}
Prep & Cook: ${totalMinutes}m | ${recipe.difficulty} | ${recipe.servings} Servings
Estimated Cost: ${costLine}

🛒 Ingredients to Buy:
${buyList}

🍳 Cooking Instructions:
${stepsList}

— Prepared with ChopSnap (Nigerian home cooking assistant)`;
  };

  const handleCopySummary = () => {
    const text = buildShareSummary();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleWhatsAppShare = () => {
    const text = buildShareSummary();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article className="chop-card p-5 sm:p-8 space-y-6 shadow-sm border border-[var(--border-subtle)] relative">
      {/* Recipe Hero Image Area */}
      <RecipeHeroImage recipe={recipe} />

      {/* Header Info */}
      <div className="space-y-3">
        {/* Badges & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chop-pill chop-pill-primary text-xs font-semibold">
              {recipe.meal_type === "quick" ? "Quick (≤20m)" : "Proper Cooking"}
            </span>

            <span
              className={`chop-pill text-xs font-semibold ${
                isBudget ? "chop-pill-primary" : "chop-pill-accent"
              }`}
            >
              {isBudget ? "Everyday Budget" : "Comfortable"}
            </span>

            {recipe.estimated_cost_tier && (
              <span className="chop-pill chop-pill-neutral text-xs font-semibold tabular-nums">
                ~{recipe.estimated_cost_tier.replace(/^~\s*/, "")}
              </span>
            )}
          </div>

          {/* Social Share & Copy Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              title="Share recipe on WhatsApp"
              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:bg-[#25D366]/15 hover:border-[#25D366] text-[#25D366] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              aria-label="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              title="Copy recipe details"
              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              aria-label="Copy recipe details"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E8B57] dark:text-[#86EFAC]" />
                  <span className="text-[#2E8B57] dark:text-[#86EFAC]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recipe Title */}
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] tracking-tight leading-snug">
          {recipe.title}
        </h2>

        {/* Budget Status Indicator Line */}
        {!costAnalysis.noPricesAvailable && (
          <div className="pt-0.5">
            {budgetNaira && budgetNaira > 0 ? (
              costAnalysis.fitsBudget ? (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2E8B57] dark:text-[#86EFAC]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Fits your budget
                    {costAnalysis.costToBuy > 0
                      ? ` (~₦${costAnalysis.costToBuy.toLocaleString()} to buy, estimate)`
                      : " (₦0 to buy, estimate)"}
                  </span>
                  {costAnalysis.somePricesUnavailable && (
                    <span className="text-[var(--text-muted)] font-normal text-xs">
                      • some prices unavailable
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    About ₦{costAnalysis.overage.toLocaleString()} over your budget (estimate)
                  </span>
                  {costAnalysis.somePricesUnavailable && (
                    <span className="text-[var(--text-muted)] font-normal text-xs">
                      • some prices unavailable
                    </span>
                  )}
                </div>
              )
            ) : (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
                <Wallet className="w-4 h-4 shrink-0 text-[#1D2B64] dark:text-[#C8D1F5]" />
                <span>
                  {costAnalysis.costToBuy > 0
                    ? `~₦${costAnalysis.costToBuy.toLocaleString()} to buy (estimate)`
                    : "Everything in your kitchen (₦0 to buy, estimate)"}
                </span>
                {costAnalysis.somePricesUnavailable && (
                  <span className="text-[var(--text-muted)] font-normal text-xs">
                    • some prices unavailable
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Meta Specs Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--text-secondary)] pt-1">
          <span className="min-h-[40px] flex items-center gap-1.5 bg-[var(--bg-surface-subtle)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] font-medium">
            <Clock className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
            <span>{totalMinutes}m total</span>
          </span>
          <span className="min-h-[40px] flex items-center gap-1.5 bg-[var(--bg-surface-subtle)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] font-medium">
            <Flame className="w-4 h-4 text-[#A3173A] shrink-0" />
            <span>{recipe.difficulty}</span>
          </span>
          <span className="min-h-[40px] flex items-center gap-1.5 bg-[var(--bg-surface-subtle)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] font-medium">
            <Utensils className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
            <span>{recipe.servings} Servings</span>
          </span>
          <span className="min-h-[40px] flex items-center gap-1.5 bg-[var(--bg-surface-subtle)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] font-medium">
            <Tag className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
            <span>
              {recipe.fridge_ingredients_used.length} of {totalUserIngredients} on hand
            </span>
          </span>
        </div>

        {/* Short Description */}
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed pt-1">
          {recipe.description}
        </p>
      </div>

      {/* "Why this works" Box in Plain Words (No internal model jargon) */}
      {recipe.why_this_recipe && (
        <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs sm:text-sm flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-[var(--primary-subtle)] text-[#1D2B64] dark:text-[#F9A826] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--primary-border)]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] dark:text-[#86EFAC]">
              Why this works
            </span>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {recipe.why_this_recipe}
            </p>
          </div>
        </div>
      )}

      {/* Ingredients Lists: "You already have" vs "You still need" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* You already have */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] dark:text-[#86EFAC] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              You already have
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--primary-subtle)] text-[var(--text-primary)]">
              {recipe.fridge_ingredients_used.length}
            </span>
          </div>
          <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-1.5">
            {recipe.fridge_ingredients_used.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] dark:bg-[#86EFAC] shrink-0" />
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* You still need (assumed staples excluded) */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F9A826] flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 shrink-0" />
              You still need
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
              {costAnalysis.missingItemsToBuy.length}
            </span>
          </div>
          <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-1.5">
            {costAnalysis.missingItemsToBuy.length > 0 ? (
              costAnalysis.missingItemsToBuy.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F9A826] shrink-0" />
                  <span className="truncate">{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#2E8B57] dark:text-[#86EFAC] italic py-1">
                Nothing needed — you have everything for this dish!
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Large Start Cooking CTA Button (Full steps shown only in Cook mode) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => onStartCooking(recipeIndex)}
          className="w-full min-h-[56px] px-6 py-3.5 rounded-2xl bg-[#1D2B64] hover:bg-[#15204C] text-white font-bold text-base sm:text-lg transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <ChefHat className="w-5 h-5 text-[#F9A826]" />
          <span>Start cooking</span>
        </button>
      </div>
    </article>
  );
}
