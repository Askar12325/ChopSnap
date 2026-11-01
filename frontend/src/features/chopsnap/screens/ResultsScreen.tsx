"use client";

import React from "react";
import {
  Sparkles,
  Utensils,
  ShoppingCart,
  ChevronDown,
  Check,
  Copy,
  Flame,
  Wallet,
  Info,
  Plus,
  X,
  Tag,
  ChefHat,
  MapPin,
  Camera,
  RefreshCw,
  CheckCircle2,
  Zap,
  Coins,
  Clock,
} from "lucide-react";
import { ProgressDots } from "@/components/ui";
import { RecipeHeroImage } from "../components/RecipeHeroImage";
import {
  ProcessResponse,
  Recipe,
  SupportedCity,
  SUPPORTED_CITIES,
  DetectedItem,
} from "../types";

export interface ResultsScreenProps {
  data: ProcessResponse | null;
  loading: boolean;
  selectedFile: File | null;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedCity: SupportedCity;
  setSelectedCity: (city: SupportedCity) => void;
  activeTab: "quick" | "proper" | "ingredients" | "shopping";
  setActiveTab: (tab: "quick" | "proper" | "ingredients" | "shopping") => void;
  tierFilter: "all" | "budget" | "comfortable";
  setTierFilter: (filter: "all" | "budget" | "comfortable") => void;
  handleUpdateRecipes: () => Promise<void>;
  updatingRecipes: boolean;
  quickRecipes: Recipe[];
  properRecipes: Recipe[];
  displayedRecipes: Recipe[];
  completedSteps: Record<string, number[]>;
  toggleStep: (recipeTitle: string, stepIndex: number) => void;
  copiedRecipeIndex: number | null;
  handleCopyRecipe: (recipe: Recipe, index: number) => void;
  ingredientValueNaira: number;
  hasSavingsData: boolean;
  somePricesUnavailable: boolean;
  showSavingsInfo: boolean;
  setShowSavingsInfo: React.Dispatch<React.SetStateAction<boolean>>;
  usedUserIngredients: DetectedItem[];
  notUsedUserIngredients: DetectedItem[];
  totalUserIngredients: number;
  ingredientsUsedPercent: number;
  newIngredientName: string;
  setNewIngredientName: (val: string) => void;
  newIngredientQty: string;
  setNewIngredientQty: (val: string) => void;
  handleAddIngredient: () => void;
  handleRemoveIngredient: (idx: number) => void;
  checkedShoppingItems: Set<number>;
  toggleShoppingItem: (idx: number) => void;
  copiedShoppingList: boolean;
  handleCopyShoppingList: () => void;
}

export function ResultsScreen({
  data,
  loading,
  selectedFile,
  previewUrl,
  fileInputRef,
  selectedCity,
  setSelectedCity,
  activeTab,
  setActiveTab,
  tierFilter,
  setTierFilter,
  handleUpdateRecipes,
  updatingRecipes,
  quickRecipes,
  properRecipes,
  displayedRecipes,
  completedSteps,
  toggleStep,
  copiedRecipeIndex,
  handleCopyRecipe,
  ingredientValueNaira,
  hasSavingsData,
  somePricesUnavailable,
  showSavingsInfo,
  setShowSavingsInfo,
  usedUserIngredients,
  notUsedUserIngredients,
  totalUserIngredients,
  ingredientsUsedPercent,
  newIngredientName,
  setNewIngredientName,
  newIngredientQty,
  setNewIngredientQty,
  handleAddIngredient,
  handleRemoveIngredient,
  checkedShoppingItems,
  toggleShoppingItem,
  copiedShoppingList,
  handleCopyShoppingList,
}: ResultsScreenProps) {
  if (!data || loading) return null;

  return (
            <div className="space-y-6">
              {/* Status Indicator Bar */}
              <div className="chop-card p-4 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    {data.is_demo ? (
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F9A826]" />
                    ) : (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E8B57] dark:bg-[#86EFAC] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E8B57] dark:bg-[#86EFAC]" />
                      </>
                    )}
                  </span>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {data.is_demo ? "Using Curated Demo Data" : "Live Kitchen Analysis Active"}
                    </span>
                    <span className="text-[var(--text-muted)] hidden sm:inline">•</span>
                    <span className="text-sm text-[var(--text-secondary)] hidden sm:inline truncate max-w-xs">
                      {data.is_demo
                        ? (data.model_metadata?.demo_scenario || "Curated Nigerian Household Scenario")
                        : "Real-time AI analysis of your ingredients"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <ProgressDots totalSteps={3} currentStep={3} labels={["Snap", "Check", "Plan"]} />
                  <span className={`chop-pill ${data.is_demo ? "chop-pill-accent" : "chop-pill-primary"}`}>
                    {data.is_demo ? "Demo Mode" : "Real Model Output"}
                  </span>
                </div>
              </div>

              {/* ==========================================================
                  FEATURE B: DETECTED INGREDIENTS PANEL (Next to Photo)
                  Editable Chips + Add Item Input + "Update Recipes" Button
                 ========================================================== */}
              <div className="chop-card p-5 sm:p-7 shadow-md border-2 border-[var(--primary-border)] relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Photo Thumbnail (Beside Panel) */}
                  <div className="lg:col-span-4 space-y-2.5">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] shadow-inner flex items-center justify-center group">
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt="Scanned Kitchen Photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-4 text-center">
                          <Camera className="w-8 h-8 mx-auto text-[#2E8B57] dark:text-[#86EFAC] mb-2" />
                          <p className="text-sm text-[var(--text-secondary)]">Verified Kitchen Scan</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-sm text-white">
                        <span className="font-semibold truncate max-w-[150px]">
                          {selectedFile?.name || "Kitchen Photo"}
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-sm text-white backdrop-blur-sm cursor-pointer flex items-center"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] text-center">
                      Ingredients detected directly from this kitchen photo
                    </p>
                  </div>

                  {/* Editable Chips & Regeneration Area */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC]" />
                          <span>Detected Ingredients ({data.detected_items.length})</span>
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          Remove wrong items with <strong>(×)</strong>, or type extra items below. Tap <strong>Update recipes</strong> to re-cook.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleUpdateRecipes}
                        disabled={updatingRecipes || data.detected_items.length === 0}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1D2B64] hover:bg-[#15204C] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {updatingRecipes ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Updating recipes...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span>Update recipes</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Removable Chips */}
                    <div className="flex flex-wrap items-center gap-2 min-h-[48px] p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                      {data.detected_items.length === 0 ? (
                        <p className="text-sm text-[var(--text-secondary)] italic">
                          No ingredients in list. Type an ingredient below to add!
                        </p>
                      ) : (
                        data.detected_items.map((item, idx) => {
                          const isProduce = item.category === "Produce";
                          const isProtein = item.category === "Protein";

                          return (
                            <div
                              key={idx}
                              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--primary-border)] shadow-xs text-sm font-semibold text-[var(--text-primary)] transition-all group"
                            >
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isProduce
                                    ? "bg-[#2E8B57] dark:bg-[#86EFAC]"
                                    : isProtein
                                    ? "bg-[#1D2B64]"
                                    : "bg-[#F9A826]"
                                }`}
                              />
                              <span>{item.name}</span>
                              {item.estimated_quantity && (
                                <span className="text-sm px-2 py-0.5 rounded-md bg-[var(--border-subtle)] text-[var(--text-secondary)] font-normal">
                                  {item.estimated_quantity}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveIngredient(idx)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[#1D2B64] hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                                title={`Remove ${item.name}`}
                                aria-label={`Remove ${item.name}`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Add Missing Item Input Row */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <div className="relative flex-1 w-full">
                        <input
                          type="text"
                          value={newIngredientName}
                          onChange={(e) => setNewIngredientName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddIngredient();
                            }
                          }}
                          placeholder="Add ingredient (e.g. Crayfish, Yam, Stockfish)..."
                          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#F9A826]"
                        />
                      </div>

                      <div className="w-full sm:w-44">
                        <input
                          type="text"
                          value={newIngredientQty}
                          onChange={(e) => setNewIngredientQty(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddIngredient();
                            }
                          }}
                          placeholder="Qty (e.g. 1 bunch, 2 bulbs)"
                          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#F9A826]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddIngredient}
                        disabled={!newIngredientName.trim()}
                        className={`w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                          newIngredientName.trim()
                            ? "bg-[#1D2B64] hover:bg-[#15204C] text-white shadow-sm active:scale-95 cursor-pointer"
                            : "bg-[#EAEFFC] text-[#3D4566] dark:bg-[#1C2550] dark:text-[#CBD3EE] border border-[#D0D7EE] dark:border-[#2C3870] cursor-not-allowed select-none"
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==========================================================
                  REAL "INGREDIENTS USED" & "VALUE OF INGREDIENTS YOU'RE USING" SUMMARY
                  - Real % computed in code from user's confirmed list vs displayed recipes
                  - Value of ingredients you're using from prices.json for selected city
                  - "some prices unavailable" if unpriced, or hidden if not enough data
                  - "Not used yet" list of leftovers
                  - "How we calculate this" plain-English formula breakdown
                  - Purely ingredients and money (no nutrition/health/calories)
                 ========================================================== */}
              <div className="chop-card p-5 sm:p-6 shadow-sm border border-[var(--border-subtle)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-[#1D2B64] dark:text-[#C8D1F5]" />
                      <span>Ingredients Used &amp; Value of Ingredients You&apos;re Using</span>
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Calculated from your confirmed kitchen list and the recipes currently displayed.
                    </p>
                  </div>

                  {/* City Selector */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1 font-medium">
                      <MapPin className="w-4 h-4 text-[#A3173A]" />
                      <span>Market City:</span>
                    </span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value as SupportedCity)}
                      className="min-h-[44px] text-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-[#F9A826] font-semibold"
                    >
                      {SUPPORTED_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Metric 1: Ingredients Used % */}
                  <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)] font-medium">Ingredients Used</span>
                      <span className="font-bold text-[#2E8B57] dark:text-[#86EFAC] text-sm sm:text-base">
                        {ingredientsUsedPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2E8B57] dark:bg-[#86EFAC] h-full transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(ingredientsUsedPercent, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {usedUserIngredients.length} of {totalUserIngredients} unique ingredients from your kitchen used in these recipes.
                    </p>
                  </div>

                  {/* Metric 2: Value of ingredients you're using */}
                  <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)] font-medium">Value of ingredients you&apos;re using</span>
                      {hasSavingsData && (
                        <span className="font-bold text-[#A3173A] dark:text-[#F7A6B8] text-sm sm:text-base">
                          ~₦{ingredientValueNaira.toLocaleString()} (estimate)
                        </span>
                      )}
                    </div>
                    {hasSavingsData ? (
                      <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                        <span>Based on {selectedCity} prices</span>
                        {somePricesUnavailable && (
                          <span className="text-sm text-[#1A1033] dark:text-[#FFF5E1] font-medium">
                            some prices unavailable
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--text-secondary)] italic">
                        Price estimates unavailable for these specific items.
                      </p>
                    )}
                    <p className="text-sm text-[var(--text-secondary)]">
                      Approximate market value of what you already have that is used in these recipes (estimate).
                    </p>
                  </div>
                </div>

                {/* "Not used yet" Section */}
                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {notUsedUserIngredients.length > 0
                        ? `Not used yet (${notUsedUserIngredients.length})`
                        : "All ingredients used"}
                    </span>
                    {notUsedUserIngredients.length > 0 && (
                      <span className="text-sm text-[var(--text-secondary)]">
                        Remaining in your kitchen for other meals
                      </span>
                    )}
                  </div>

                  {notUsedUserIngredients.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {notUsedUserIngredients.map((item, idx) => (
                        <span
                          key={idx}
                          className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#F9A826] shrink-0" />
                          <span>{item.name}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#2E8B57] dark:text-[#86EFAC] font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Every single ingredient from your confirmed kitchen list is used in this meal plan!</span>
                    </p>
                  )}
                </div>

                {/* "How we calculate this" Disclosure */}
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setShowSavingsInfo(!showSavingsInfo)}
                    className="min-h-[44px] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
                    <span className="underline decoration-dotted underline-offset-2 font-medium">
                      How we calculate this
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                        showSavingsInfo ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showSavingsInfo && (
                    <div className="mt-2.5 p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-3 text-sm text-[var(--text-secondary)]">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] mb-1">
                          1. Ingredients used % formula
                        </p>
                        <p className="text-sm leading-relaxed">
                          <code>(Unique kitchen ingredients used in displayed recipes ÷ Total confirmed kitchen ingredients) × 100</code>.
                          We examine every ingredient in your confirmed kitchen list and check whether it appears in the ingredient lines, missing items, or preparation steps of any recipe currently displayed.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] mb-1">
                          2. Value of ingredients you&apos;re using formula
                        </p>
                        <p className="text-sm leading-relaxed">
                          <code>Sum of approximate local market prices for all used ingredients in {selectedCity}</code>.
                          This is the approximate market value of what you already have, not a comparison against a specific purchase.
                          Prices are rough estimates and have not been formally reviewed. They will be updated and verified regularly. If an ingredient has no price in our table, it is left out of the sum and marked &quot;some prices unavailable&quot;. If there is not enough price data, the value figure is hidden rather than guessed.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Category Navigation Tabs */}
              <div className="border-b border-[var(--border-subtle)] pb-1">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                  <button
                    onClick={() => setActiveTab("quick")}
                    className={`min-h-[44px] px-4 py-2 flex items-center justify-center gap-2 rounded-xl transition-all whitespace-nowrap text-sm font-semibold cursor-pointer ${
                      activeTab === "quick"
                        ? "bg-[#2E8B57] text-white shadow-sm dark:bg-[#287A4D]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]"
                    }`}
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>Quick Meals (≤20m)</span>
                    <span className={`text-sm px-2.5 py-0.5 rounded-full ${activeTab === "quick" ? "bg-white/20 text-white" : "bg-[var(--border-subtle)] text-[var(--text-secondary)]"}`}>
                      {quickRecipes.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("proper")}
                    className={`min-h-[44px] px-4 py-2 flex items-center justify-center gap-2 rounded-xl transition-all whitespace-nowrap text-sm font-semibold cursor-pointer ${
                      activeTab === "proper"
                        ? "bg-[#2E8B57] text-white shadow-sm dark:bg-[#287A4D]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]"
                    }`}
                  >
                    <Utensils className="w-4 h-4 shrink-0" />
                    <span>Proper Cooking</span>
                    <span className={`text-sm px-2.5 py-0.5 rounded-full ${activeTab === "proper" ? "bg-white/20 text-white" : "bg-[var(--border-subtle)] text-[var(--text-secondary)]"}`}>
                      {properRecipes.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("ingredients")}
                    className={`min-h-[44px] px-4 py-2 flex items-center justify-center gap-2 rounded-xl transition-all whitespace-nowrap text-sm font-semibold cursor-pointer ${
                      activeTab === "ingredients"
                        ? "bg-[#2E8B57] text-white shadow-sm dark:bg-[#287A4D]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Ingredients</span>
                    <span className={`text-sm px-2.5 py-0.5 rounded-full ${activeTab === "ingredients" ? "bg-white/20 text-white" : "bg-[var(--border-subtle)] text-[var(--text-secondary)]"}`}>
                      {data.detected_items.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("shopping")}
                    className={`min-h-[44px] px-4 py-2 flex items-center justify-center gap-2 rounded-xl transition-all whitespace-nowrap text-sm font-semibold cursor-pointer ${
                      activeTab === "shopping"
                        ? "bg-[#2E8B57] text-white shadow-sm dark:bg-[#287A4D]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    <span>Shopping</span>
                    <span className={`text-sm px-2.5 py-0.5 rounded-full ${activeTab === "shopping" ? "bg-white/20 text-white" : "bg-[var(--border-subtle)] text-[var(--text-secondary)]"}`}>
                      {data.shopping_list.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Economic Tier Filter Bar */}
              {(activeTab === "quick" || activeTab === "proper") && (
                <div className="chop-card p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Wallet className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
                    <span className="font-semibold text-sm">Economic Tier:</span>
                  </div>

                  <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setTierFilter("all")}
                      className={`min-h-[44px] px-4 py-2 rounded-xl transition-all font-semibold text-sm text-center flex items-center justify-center active:scale-95 cursor-pointer ${
                        tierFilter === "all"
                          ? "bg-[#1D2B64] text-white shadow-sm"
                          : "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <span>All</span>
                      <span className="ml-1 opacity-80">
                        ({activeTab === "quick" ? quickRecipes.length : properRecipes.length})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTierFilter("budget")}
                      className={`min-h-[44px] px-4 py-2 rounded-xl transition-all font-semibold text-sm text-center flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                        tierFilter === "budget"
                          ? "bg-[#1D2B64] text-white shadow-sm"
                          : "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Coins className="w-4 h-4 shrink-0" />
                      <span>Budget</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTierFilter("comfortable")}
                      className={`min-h-[44px] px-4 py-2 rounded-xl transition-all font-semibold text-sm text-center flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                        tierFilter === "comfortable"
                          ? "bg-[#1D2B64] text-white shadow-sm"
                          : "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-[#F9A826] shrink-0" />
                      <span>Comfortable</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Recipe Cards Feed (Feature A: Hero Image on each Recipe Card) */}
              {(activeTab === "quick" || activeTab === "proper") && (
                <div className="space-y-6">
                  {displayedRecipes.length === 0 ? (
                    <div className="chop-card p-8 text-center text-sm text-[var(--text-secondary)]">
                      No recipes found matching the selected financial filter. Try choosing &quot;All&quot;.
                    </div>
                  ) : (
                    displayedRecipes.map((recipe, idx) => {
                      const completedCount = completedSteps[idx]?.size || 0;
                      const totalSteps = recipe.instructions.length;
                      const isBudget = recipe.financial_tier === "budget";

                      return (
                        <article
                          key={idx}
                          className="chop-card p-5 sm:p-8 space-y-5 shadow-sm"
                        >
                          {/* Feature A: Recipe Card Hero Image Area */}
                          <RecipeHeroImage recipe={recipe} />

                          {/* Recipe Header */}
                          <div className="space-y-2.5">
                            {/* Badges & Copy button */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="chop-pill chop-pill-primary">
                                  {recipe.meal_type === "quick" ? (
                                    <>
                                      <Zap className="w-3.5 h-3.5 shrink-0" /> Quick (≤20m)
                                    </>
                                  ) : (
                                    <>
                                      <Utensils className="w-3.5 h-3.5 shrink-0" /> Proper Cooking
                                    </>
                                  )}
                                </span>

                                <span className={`chop-pill ${isBudget ? "chop-pill-primary" : "chop-pill-accent"}`}>
                                  {isBudget ? (
                                    <>
                                      <Coins className="w-3.5 h-3.5 shrink-0" />
                                      <span>Budget Tier</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                      <span>Comfortable</span>
                                    </>
                                  )}
                                </span>

                                {recipe.estimated_cost_tier && (
                                  <span className="chop-pill chop-pill-neutral tabular-nums">
                                    <span>~</span>
                                    <span className="font-semibold tabular-nums">
                                      {recipe.estimated_cost_tier.replace(/^~\s*/, "")}
                                    </span>
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleCopyRecipe(recipe, idx)}
                                title="Copy recipe details"
                                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm flex items-center gap-2 active:scale-95 shrink-0 cursor-pointer"
                              >
                                {copiedRecipeIndex === idx ? (
                                  <>
                                    <Check className="w-4 h-4 text-[#1D2B64] dark:text-[#C8D1F5]" />
                                    <span className="text-[var(--primary-text)] font-medium">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span className="hidden sm:inline font-medium">Copy</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-normal text-[var(--text-primary)] tracking-tight leading-snug">
                              {recipe.title}
                            </h3>
                          </div>

                          {/* Meta Specs Bar */}
                          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 text-sm text-[var(--text-secondary)]">
                            <span className="flex items-center justify-center sm:justify-start gap-1.5 bg-[var(--bg-surface-subtle)] p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                              <Clock className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
                              <span className="truncate">{recipe.prep_time_minutes + recipe.cook_time_minutes}m total</span>
                            </span>
                            <span className="flex items-center justify-center sm:justify-start gap-1.5 bg-[var(--bg-surface-subtle)] p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                              <Flame className="w-4 h-4 text-[#A3173A] shrink-0" />
                              <span className="truncate">{recipe.difficulty}</span>
                            </span>
                            <span className="flex items-center justify-center sm:justify-start gap-1.5 bg-[var(--bg-surface-subtle)] p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                              <Utensils className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
                              <span className="truncate">{recipe.servings} Servings</span>
                            </span>
                            <span className="flex items-center justify-center sm:justify-start gap-1.5 bg-[var(--bg-surface-subtle)] p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                              <Tag className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
                              <span className="truncate">
                                {recipe.fridge_ingredients_used.length} of {data?.detected_items?.length || recipe.fridge_ingredients_used.length} used
                              </span>
                            </span>
                          </div>

                          {/* Story & Description */}
                          <p className="text-base text-[var(--text-secondary)] leading-relaxed font-sans">
                            {recipe.description}
                          </p>

                          {/* Assumption Line (Requirement 3) */}
                          {recipe.assumes && (
                            <div className="min-h-[44px] flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-[#1A1033] dark:text-amber-200 text-sm font-medium">
                              <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                              <span>{recipe.assumes.startsWith("Assumes:") ? recipe.assumes : `Assumes: ${recipe.assumes}`}</span>
                            </div>
                          )}

                          {/* Reasoning Box */}
                          {recipe.why_this_recipe && (
                            <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-sm flex items-start gap-3 shadow-sm">
                              <div className="w-6 h-6 rounded-lg bg-[var(--primary-subtle)] text-[var(--primary-text)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--primary-border)]">
                                <Sparkles className="w-3.5 h-3.5 text-[#F9A826]" />
                              </div>
                              <div className="space-y-1 min-w-0">
                                <span className="text-sm font-semibold uppercase tracking-wider text-[#2E8B57] dark:text-[#86EFAC] flex items-center gap-1">
                                  Why this works
                                </span>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                                  {recipe.why_this_recipe}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Ingredients Breakdown Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            {/* Used from Kitchen */}
                            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--primary-border)]">
                              <div className="flex items-center justify-between mb-2.5">
                                <p className="text-sm font-semibold text-[#2E8B57] dark:text-[#86EFAC] flex items-center gap-2 uppercase tracking-wider">
                                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                                  Used from Your Kitchen:
                                </p>
                                <span className="text-sm font-semibold px-2.5 py-1 rounded-full bg-[var(--primary-subtle)] text-[var(--text-primary)] border border-[var(--primary-border)]">
                                  {recipe.fridge_ingredients_used.length} of {data?.detected_items?.length || recipe.fridge_ingredients_used.length} used
                                </span>
                              </div>
                              <ul className="text-sm text-[var(--text-secondary)] space-y-2 font-sans">
                                {recipe.fridge_ingredients_used.length > 0 ? (
                                  recipe.fridge_ingredients_used.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="w-2 h-2 rounded-full bg-[#2E8B57] dark:bg-[#86EFAC] mt-1.5 shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-[var(--text-secondary)] italic text-sm">Custom staples selected</li>
                                )}
                              </ul>
                            </div>

                            {/* Extra Items Needed */}
                            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--accent-border)]">
                              <p className="text-sm font-semibold text-[#F9A826] mb-2.5 flex items-center gap-2 uppercase tracking-wider">
                                <ShoppingCart className="w-4 h-4 shrink-0" />
                                Extra Items Needed:
                              </p>
                              <ul className="text-sm text-[var(--text-secondary)] space-y-2 font-sans">
                                {recipe.missing_ingredients_needed.length > 0 ? (
                                  recipe.missing_ingredients_needed.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="w-2 h-2 rounded-full bg-[#F9A826] mt-1.5 shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-[var(--text-secondary)] italic text-sm">100% ready with what you already have!</li>
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* Step-by-Step Instructions */}
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                                Preparation Steps
                              </h4>
                              <span className="text-sm text-[var(--text-secondary)] font-medium">
                                {completedCount} of {totalSteps} done
                              </span>
                            </div>

                            <ol className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                              {recipe.instructions.map((step, sIdx) => {
                                const isChecked = completedSteps[idx]?.has(sIdx) || false;

                                return (
                                  <li
                                    key={sIdx}
                                    onClick={() => toggleStep(idx, sIdx)}
                                    className={`min-h-[48px] flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl cursor-pointer transition-colors active:scale-[0.99] ${
                                      isChecked
                                        ? "bg-[var(--bg-surface-subtle)]/60 text-[var(--text-muted)] line-through"
                                        : "bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)]"
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-colors mt-0.5 cursor-pointer ${
                                        isChecked
                                          ? "bg-[#2E8B57] border-[#2E8B57] text-white"
                                          : "border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[#1D2B64]"
                                      }`}
                                    >
                                      {isChecked ? (
                                        <Check className="w-3.5 h-3.5" />
                                      ) : (
                                        <span className="text-sm font-semibold text-[var(--text-secondary)]">
                                          {sIdx + 1}
                                        </span>
                                      )}
                                    </button>
                                    <span className="leading-relaxed select-none text-sm">{step}</span>
                                  </li>
                                );
                              })}
                            </ol>
                          </div>

                          {/* Chef's Pro Tip */}
                          {recipe.chef_tips && (
                            <div className="p-4 sm:p-5 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-sm text-[#1A1033] dark:text-[#FBF5EE] flex items-start gap-3 shadow-sm">
                              <div className="w-7 h-7 rounded-lg bg-[#1D2B64] text-white flex items-center justify-center shrink-0 mt-0.5">
                                <ChefHat className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <span className="font-semibold uppercase tracking-wider text-sm block text-[#1A1033] dark:text-[#FBF5EE]">
                                  Chef’s Secret Technique
                                </span>
                                <p className="leading-relaxed text-sm font-sans">{recipe.chef_tips}</p>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              )}

              {/* Tab 3: Detected Ingredients */}
              {activeTab === "ingredients" && (
                <div className="chop-card p-5 sm:p-8 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                        Your Kitchen Ingredients
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Spotted from your kitchen photo (fridge, pantry, or counter)
                      </p>
                    </div>
                    <span className="chop-pill chop-pill-primary self-start sm:self-auto">
                      {data.detected_items.length} items logged
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.detected_items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] hover:border-[var(--primary-border)] transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</p>
                            {item.certainty && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                item.certainty === "clear"
                                  ? "bg-emerald-500/15 text-[#2E8B57] dark:text-[#86EFAC]"
                                  : item.certainty === "likely"
                                  ? "bg-amber-500/15 text-[#1A1033] dark:text-[#FFF5E1]"
                                  : "bg-red-500/15 text-[#A3173A] dark:text-[#F7A6B8]"
                              }`}>
                                {item.certainty}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2 flex-wrap">
                            <span>Category: <span className="text-[#2E8B57] dark:text-[#86EFAC] font-medium">{item.category}</span></span>
                            {item.form && <span>• Form: <span className="font-medium text-[var(--text-secondary)]">{item.form}</span></span>}
                            {item.container_state && item.container_state !== "unknown" && <span>• Container: <span className="font-medium text-[var(--text-secondary)]">{item.container_state}</span></span>}
                          </p>
                          {item.alternatives && item.alternatives.length > 0 && (
                            <p className="text-sm text-[var(--text-secondary)] italic">
                              Alternatives: {item.alternatives.join(", ")}
                            </p>
                          )}
                        </div>
                        {item.estimated_quantity && (
                          <span className="chop-pill chop-pill-neutral text-sm">
                            {item.estimated_quantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Minimal Shopping List */}
              {activeTab === "shopping" && (
                <div className="chop-card p-5 sm:p-8 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                        Smart Minimal Shopping List
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Only indispensable staples required to unlock all recipes
                      </p>
                    </div>
                    <button
                      onClick={handleCopyShoppingList}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1D2B64] hover:bg-[#15204C] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 self-start sm:self-auto shadow-sm cursor-pointer"
                    >
                      {copiedShoppingList ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Copied List</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy List</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.shopping_list.map((item, idx) => {
                      const isChecked = checkedShoppingItems.has(idx);

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleShoppingItem(idx)}
                          className={`min-h-[50px] p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] ${
                            isChecked
                              ? "bg-[var(--bg-surface-subtle)]/60 border-[var(--border-subtle)] text-[var(--text-muted)]"
                              : "bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--primary-border)] text-[var(--text-primary)]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                                isChecked
                                  ? "bg-[#2E8B57] border-[#2E8B57] text-white"
                                  : "border-[var(--border-default)] bg-[var(--bg-surface)]"
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p
                                className={`text-sm font-semibold truncate ${
                                  isChecked ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"
                                }`}
                              >
                                {item.item}
                              </p>
                              {item.for_recipes.length > 0 && (
                                <p className="text-sm text-[var(--text-secondary)] truncate">
                                  Required for: {item.for_recipes.join(", ")}
                                </p>
                              )}
                            </div>
                          </div>

                          {item.estimated_cost && (
                            <span className="chop-pill chop-pill-accent tabular-nums shrink-0 text-sm">
                              {item.estimated_cost}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
  );
}
