"use client";

import React from "react";
import { Check, AlertCircle, Plus, Utensils, ChefHat, X } from "lucide-react";
import { Button, StepHeader, ProgressDots } from "@/components/ui";
import { DetectedItem, ProcessResponse } from "../types";

export interface ReviewScreenProps {
  isReviewStep: boolean;
  data: ProcessResponse | null;
  loading: boolean;
  reviewRef: React.RefObject<HTMLDivElement | null>;
  selectedReviewItemIds: Set<string>;
  reviewItems: DetectedItem[];
  looksClearItems: DetectedItem[];
  handleToggleAllLooksClear: (ids: string[]) => void;
  handleToggleReviewItem: (id: string) => void;
  handleRemoveReviewItem: (id: string) => void;
  pleaseCheckItems: DetectedItem[];
  handleChooseAlternative: (itemId: string, chosenName: string) => void;
  reviewNewItemName: string;
  setReviewNewItemName: (name: string) => void;
  reviewNewItemQty: string;
  setReviewNewItemQty: (qty: string) => void;
  handleAddReviewItem: () => void;
  resetAll: () => void;
  handleConfirmAndCook: () => Promise<void>;
}

export function ReviewScreen({
  isReviewStep,
  data,
  loading,
  reviewRef,
  selectedReviewItemIds,
  reviewItems,
  looksClearItems,
  handleToggleAllLooksClear,
  handleToggleReviewItem,
  handleRemoveReviewItem,
  pleaseCheckItems,
  handleChooseAlternative,
  reviewNewItemName,
  setReviewNewItemName,
  reviewNewItemQty,
  setReviewNewItemQty,
  handleAddReviewItem,
  resetAll,
  handleConfirmAndCook,
}: ReviewScreenProps) {
  if (!isReviewStep || data || loading) return null;

  return (
            <div id="review-section" ref={reviewRef} className="chop-card p-5 sm:p-8 shadow-lg border-2 border-[var(--primary-border)] space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                <StepHeader
                  stepNumber={2}
                  stepTotal={3}
                  title="Confirm your kitchen ingredients"
                  description="Muse Spark Open will formulate recipes using only confirmed items. Please check unsure items and tap one-tap choices to confirm."
                  className="mb-0"
                />

                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                  <ProgressDots totalSteps={3} currentStep={2} labels={["Snap", "Check", "Plan"]} />
                  <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                    {selectedReviewItemIds.size} of {reviewItems.length} selected
                  </span>
                </div>
              </div>

              {/* Group 1: "Looks clear" (Preselected) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] dark:text-[#86EFAC] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                      Looks clear ({looksClearItems.length})
                    </h4>
                    <span className="text-sm text-[var(--text-secondary)] font-normal hidden sm:inline">
                      • Preselected (tap to toggle or remove)
                    </span>
                  </div>

                  {looksClearItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleToggleAllLooksClear(looksClearItems.map((i) => i.id!))}
                      className="min-h-[44px] px-3 py-1 text-sm text-[#2E8B57] dark:text-[#86EFAC] hover:underline font-semibold cursor-pointer flex items-center"
                    >
                      {looksClearItems.every((i) => selectedReviewItemIds.has(i.id!))
                        ? "Deselect all"
                        : "Select all"}
                    </button>
                  )}
                </div>

                {looksClearItems.length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)] italic p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                    No clear items spotted. Review unsure items below or add ingredients manually.
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                    {looksClearItems.map((item) => {
                      const isSelected = selectedReviewItemIds.has(item.id!);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleToggleReviewItem(item.id!)}
                          className={`min-h-[44px] inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer shadow-xs border ${
                            isSelected
                              ? "bg-[#2E8B57]/15 dark:bg-[#2E8B57]/30 border-[#2E8B57] text-[#2E8B57] dark:text-[#86EFAC]"
                              : "bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-default)] opacity-60"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                              isSelected
                                ? "bg-[#2E8B57] border-[#2E8B57] text-white"
                                : "border-[var(--border-default)] bg-[var(--bg-surface)]"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] line-through"}>
                            {item.name}
                          </span>
                          {item.estimated_quantity && (
                            <span className="text-sm px-2 py-0.5 rounded-md bg-[var(--border-subtle)] text-[var(--text-secondary)] font-normal">
                              {item.estimated_quantity}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveReviewItem(item.id!);
                            }}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[#1D2B64] hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                            title={`Remove ${item.name}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Group 2: "Please check" (Unsure items, not preselected, one-tap choices) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                    Please check ({pleaseCheckItems.length})
                  </h4>
                  <span className="text-sm text-[var(--text-secondary)] font-normal hidden sm:inline">
                    • Unsure items (not preselected). Tap a one-tap choice to confirm.
                  </span>
                </div>

                {pleaseCheckItems.length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)] italic p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                    No ambiguous items detected. All visible ingredients looked clear!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pleaseCheckItems.map((item) => {
                      const isSelected = selectedReviewItemIds.has(item.id!);
                      const hasAlternatives = item.alternatives && item.alternatives.length > 0;

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-xl border transition-all space-y-3 ${
                            isSelected
                              ? "bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/60"
                              : "bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div
                              onClick={() => handleToggleReviewItem(item.id!)}
                              className="flex items-center gap-2.5 cursor-pointer min-w-0"
                            >
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                                  isSelected
                                    ? "bg-amber-600 border-amber-600 text-white"
                                    : "border-[var(--border-default)] bg-[var(--bg-surface)]"
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                              <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                                {item.name}
                              </span>
                              {item.estimated_quantity && (
                                <span className="text-sm px-2 py-0.5 rounded-md bg-[var(--border-subtle)] text-[var(--text-secondary)] font-normal shrink-0">
                                  {item.estimated_quantity}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveReviewItem(item.id!)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[#1D2B64] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                              title={`Remove ${item.name}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Alternatives: One-Tap Choices */}
                          {hasAlternatives && (
                            <div className="pt-2 border-t border-[var(--border-subtle)]">
                              <p className="text-sm text-[var(--text-secondary)] mb-2 font-medium">
                                Tap one-tap choice to confirm:
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {item.alternatives!.map((alt, aIdx) => (
                                  <button
                                    key={aIdx}
                                    type="button"
                                    onClick={() => handleChooseAlternative(item.id!, alt)}
                                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[#2E8B57] hover:text-white border border-[var(--border-default)] text-sm font-semibold text-[var(--text-primary)] transition-all active:scale-95 cursor-pointer shadow-xs"
                                  >
                                    + {alt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add Missing Item Row */}
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  Add another ingredient from your pantry:
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={reviewNewItemName}
                    onChange={(e) => setReviewNewItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddReviewItem();
                      }
                    }}
                    placeholder="e.g. Crayfish, Yam, Stockfish, Palm Oil..."
                    className="w-full sm:flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#F9A826]"
                  />
                  <input
                    type="text"
                    value={reviewNewItemQty}
                    onChange={(e) => setReviewNewItemQty(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddReviewItem();
                      }
                    }}
                    placeholder="Qty (e.g. 1 cup)"
                    className="w-full sm:w-36 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#F9A826]"
                  />
                  <button
                    type="button"
                    onClick={handleAddReviewItem}
                    disabled={!reviewNewItemName.trim()}
                    className={`w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      reviewNewItemName.trim()
                        ? "bg-[#1D2B64] hover:bg-[#15204C] text-white shadow-sm active:scale-95 cursor-pointer"
                        : "bg-[#EAEFFC] text-[#3D4566] dark:bg-[#1C2550] dark:text-[#CBD3EE] border border-[#D0D7EE] dark:border-[#2C3870] cursor-not-allowed select-none"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Confirm & Cook Action CTA */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <ChefHat className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
                  <span>
                    <strong>{selectedReviewItemIds.size} ingredients</strong> confirmed for recipe generation.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={resetAll}
                  >
                    New scan
                  </Button>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleConfirmAndCook}
                    disabled={loading || selectedReviewItemIds.size === 0}
                    icon={<Utensils className="w-4 h-4 text-white" />}
                  >
                    Confirm and cook
                  </Button>
                </div>
              </div>
            </div>
  );
}
