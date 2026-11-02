"use client";

import React, { useState, useTransition } from "react";
import {
  Zap,
  Utensils,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  Coins,
  Sparkles,
} from "lucide-react";
import {
  ProcessResponse,
  Recipe,
  SupportedCity,
  DetectedItem,
} from "../types";
import { CompactUsageSummary } from "../components/CompactUsageSummary";
import { ShoppingListDrawer } from "../components/ShoppingListDrawer";
import { RecipeCardView } from "../components/RecipeCardView";

export interface ResultsScreenProps {
  data: ProcessResponse | null;
  loading: boolean;
  selectedCity: SupportedCity;
  setSelectedCity: (city: SupportedCity) => void;
  activeTab: "quick" | "proper" | "ingredients" | "shopping";
  setActiveTab: (tab: "quick" | "proper" | "ingredients" | "shopping") => void;
  tierFilter: "all" | "budget" | "comfortable";
  setTierFilter: (filter: "all" | "budget" | "comfortable") => void;
  quickRecipes: Recipe[];
  properRecipes: Recipe[];
  displayedRecipes: Recipe[];
  ingredientValueNaira: number;
  hasSavingsData: boolean;
  somePricesUnavailable: boolean;
  usedUserIngredients: DetectedItem[];
  notUsedUserIngredients: DetectedItem[];
  totalUserIngredients: number;
  ingredientsUsedPercent: number;
  checkedShoppingItems: Set<number>;
  toggleShoppingItem: (idx: number) => void;
  copiedShoppingList: boolean;
  handleCopyShoppingList: () => void;
  budgetNaira?: number | null;
  onStartCooking: (recipeIndex: number) => void;
  onStartOver: () => void;
  onChangePlan: () => void;
  currentRecipeCarouselIndex: number;
  setCurrentRecipeCarouselIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function ResultsScreen({
  data,
  loading,
  selectedCity,
  setSelectedCity,
  activeTab,
  setActiveTab,
  tierFilter,
  setTierFilter,
  quickRecipes,
  properRecipes,
  displayedRecipes,
  ingredientValueNaira,
  hasSavingsData,
  somePricesUnavailable,
  usedUserIngredients,
  notUsedUserIngredients,
  totalUserIngredients,
  ingredientsUsedPercent,
  checkedShoppingItems,
  toggleShoppingItem,
  copiedShoppingList,
  handleCopyShoppingList,
  budgetNaira,
  onStartCooking,
  onStartOver,
  onChangePlan,
  currentRecipeCarouselIndex,
  setCurrentRecipeCarouselIndex,
}: ResultsScreenProps) {
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  if (!data || loading) return null;

  const totalRecipes = displayedRecipes.length;
  const safeIndex =
    totalRecipes > 0 ? Math.min(Math.max(0, currentRecipeCarouselIndex), totalRecipes - 1) : 0;
  const currentRecipe = displayedRecipes[safeIndex];

  const handlePrevRecipe = () => {
    if (safeIndex > 0) {
      startTransition(() => {
        setCurrentRecipeCarouselIndex(safeIndex - 1);
      });
    }
  };

  const handleNextRecipe = () => {
    if (safeIndex < totalRecipes - 1) {
      startTransition(() => {
        setCurrentRecipeCarouselIndex(safeIndex + 1);
      });
    }
  };

  // Touch swipe support on phones
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextRecipe();
      } else {
        handlePrevRecipe();
      }
    }
    setTouchStartX(null);
  };

  return (
    <section className="max-w-4xl mx-auto space-y-6 py-2 sm:py-4">
      {/* Top Bar: Start Over, Change Plan, and Example Data Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onChangePlan}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#F9A826]" />
            <span>Change plan</span>
          </button>

          <button
            type="button"
            onClick={onStartOver}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[#A3173A] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start over</span>
          </button>
        </div>

        {/* Example Data Banner (Item 8) */}
        {data.is_demo ? (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Example data (curated Nigerian provisions)</span>
          </span>
        ) : (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] dark:text-[#86EFAC] border border-[#2E8B57]/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E8B57] dark:bg-[#86EFAC] shrink-0" />
            <span>Live kitchen analysis active</span>
          </span>
        )}
      </div>

      {/* Item 5: Compact Summary Card (collapsed to 1 line, expandable) */}
      <CompactUsageSummary
        ingredientsUsedPercent={ingredientsUsedPercent}
        usedUserIngredients={usedUserIngredients}
        notUsedUserIngredients={notUsedUserIngredients}
        totalUserIngredients={totalUserIngredients}
        ingredientValueNaira={ingredientValueNaira}
        hasSavingsData={hasSavingsData}
        somePricesUnavailable={somePricesUnavailable}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      {/* Item 1: Top Compact Segmented Controls */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Group 1: Meal Type Segmented Control */}
          <div className="inline-flex p-1 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("quick");
                setCurrentRecipeCarouselIndex(0);
              }}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "quick"
                  ? "bg-[#1D2B64] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Quick Meals</span>
              <span className="opacity-75">({quickRecipes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("proper");
                setCurrentRecipeCarouselIndex(0);
              }}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "proper"
                  ? "bg-[#1D2B64] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Proper Cooking</span>
              <span className="opacity-75">({properRecipes.length})</span>
            </button>
          </div>

          {/* Group 2: Economic Tier Segmented Filter */}
          <div className="inline-flex p-1 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
            {(["all", "budget", "comfortable"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => {
                  setTierFilter(tier);
                  setCurrentRecipeCarouselIndex(0);
                }}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  tierFilter === tier
                    ? "bg-[#1D2B64] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tier === "all" && "All Tiers"}
                {tier === "budget" && (
                  <span className="flex items-center gap-1">
                    <Coins className="w-3 h-3" /> Budget
                  </span>
                )}
                {tier === "comfortable" && (
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#F9A826]" /> Comfort
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Shopping List Button (Opens Sheet/Drawer) */}
          <button
            type="button"
            onClick={() => setIsShoppingOpen(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2 cursor-pointer shadow-xs transition-all ml-auto"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#2E8B57] dark:text-[#86EFAC]" />
            <span>Shopping list</span>
            <span className="px-2 py-0.5 rounded-full bg-[#EEF1FC] dark:bg-[#1C2758] text-[#1D2B64] dark:text-[#C8D1F5] text-[11px] font-bold">
              {data.shopping_list.length}
            </span>
          </button>
        </div>
      </div>

      {/* Item 1: ONE Recipe at a time Carousel */}
      {totalRecipes === 0 ? (
        <div className="chop-card p-12 text-center text-sm text-[var(--text-secondary)] space-y-3">
          <p className="font-semibold text-base text-[var(--text-primary)]">
            No recipes matching the current filter.
          </p>
          <button
            type="button"
            onClick={() => setTierFilter("all")}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1D2B64] text-white text-xs font-semibold cursor-pointer"
          >
            Show All Tiers
          </button>
        </div>
      ) : (
        <div
          className="space-y-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Position Bar & Next/Prev Controls */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Recipe {safeIndex + 1} of {totalRecipes}
              </span>

              {/* Position Dots */}
              <div className="flex items-center gap-1.5 ml-2">
                {displayedRecipes.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentRecipeCarouselIndex(dotIdx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      dotIdx === safeIndex
                        ? "w-6 bg-[#1D2B64] dark:bg-[#F9A826]"
                        : "w-2 bg-[var(--border-default)] hover:bg-[var(--text-muted)]"
                    }`}
                    aria-label={`Go to recipe ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Previous & Next Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevRecipe}
                disabled={safeIndex === 0}
                className="min-h-[44px] min-w-[44px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[var(--text-primary)] transition-all cursor-pointer shadow-xs"
                aria-label="Previous recipe"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextRecipe}
                disabled={safeIndex === totalRecipes - 1}
                className="min-h-[44px] min-w-[44px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[var(--text-primary)] transition-all cursor-pointer shadow-xs"
                aria-label="Next recipe"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Focal Recipe Card */}
          {currentRecipe && (
            <RecipeCardView
              recipe={currentRecipe}
              recipeIndex={safeIndex}
              totalRecipes={totalRecipes}
              selectedCity={selectedCity}
              budgetNaira={budgetNaira}
              onStartCooking={onStartCooking}
              totalUserIngredients={totalUserIngredients}
            />
          )}
        </div>
      )}

      {/* Item 6: Shopping List Drawer / Bottom Sheet */}
      <ShoppingListDrawer
        isOpen={isShoppingOpen}
        onClose={() => setIsShoppingOpen(false)}
        shoppingList={data.shopping_list}
        checkedShoppingItems={checkedShoppingItems}
        toggleShoppingItem={toggleShoppingItem}
        copiedShoppingList={copiedShoppingList}
        handleCopyShoppingList={handleCopyShoppingList}
        selectedCity={selectedCity}
      />
    </section>
  );
}
