"use client";

import React, { useEffect } from "react";
import { X, Check, Copy, ShoppingCart, AlertCircle } from "lucide-react";
import { ShoppingItem, SupportedCity } from "../types";
import { getIngredientPrice, isAssumedStaple } from "@/utils/matching";
import cityPricesData from "@/data/prices.json";

export interface ShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingList: ShoppingItem[];
  checkedShoppingItems: Set<number>;
  toggleShoppingItem: (idx: number) => void;
  copiedShoppingList: boolean;
  handleCopyShoppingList: () => void;
  selectedCity: SupportedCity;
}

export function ShoppingListDrawer({
  isOpen,
  onClose,
  shoppingList,
  checkedShoppingItems,
  toggleShoppingItem,
  copiedShoppingList,
  handleCopyShoppingList,
  selectedCity,
}: ShoppingListDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter out assumed staples (salt, water, oil, cubes)
  const validItems = shoppingList.filter((item) => !isAssumedStaple(item.item));

  // Compute estimated total cost for non-staple shopping items
  let totalEstimatedNaira = 0;
  let unpricedCount = 0;
  validItems.forEach((item) => {
    const price = getIngredientPrice(item.item, selectedCity, cityPricesData);
    if (price !== null && price > 0) {
      totalEstimatedNaira += price;
    } else {
      unpricedCount++;
    }
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shopping-drawer-title"
    >
      <div
        className="w-full sm:max-w-xl max-h-[85vh] sm:max-h-[80vh] flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 bg-[var(--bg-surface-subtle)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] dark:text-[#86EFAC] flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 id="shopping-drawer-title" className="text-base font-bold text-[var(--text-primary)]">
                Minimal Shopping List
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Essential additions for your selected meals (staples excluded)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyShoppingList}
              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
              aria-label="Copy shopping list to clipboard"
            >
              {copiedShoppingList ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E8B57] dark:text-[#86EFAC]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-all cursor-pointer"
              aria-label="Close shopping list"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Estimated Total Bar */}
        <div className="px-4 py-2.5 bg-[#EEF1FC] dark:bg-[#1C2758] border-b border-[#C8D1F5] dark:border-[#3D52A8] flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1D2B64] dark:text-[#C8D1F5]">
            Estimated Shopping Total ({selectedCity} market):
          </span>
          <span className="font-bold text-[#1D2B64] dark:text-[#F9A826]">
            ~₦{totalEstimatedNaira.toLocaleString()}{" "}
            <span className="text-[10px] font-normal opacity-80">(estimate)</span>
          </span>
        </div>

        {/* Scrollable Items List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1 divide-y divide-[var(--border-subtle)]">
          {validItems.length === 0 ? (
            <div className="text-center py-8 text-sm text-[var(--text-secondary)]">
              No extra grocery items needed! Your kitchen provisions cover these recipes.
            </div>
          ) : (
            validItems.map((item, idx) => {
              const isChecked = checkedShoppingItems.has(idx);
              const price = getIngredientPrice(item.item, selectedCity, cityPricesData);

              return (
                <div
                  key={idx}
                  onClick={() => toggleShoppingItem(idx)}
                  className={`pt-2.5 first:pt-0 min-h-[48px] flex items-center justify-between gap-3 cursor-pointer select-none transition-opacity ${
                    isChecked ? "opacity-50 line-through" : "hover:opacity-90"
                  }`}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggleShoppingItem(idx);
                    }
                  }}
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
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {item.item}
                      </p>
                      {item.for_recipes && item.for_recipes.length > 0 && (
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          For: {item.for_recipes.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[var(--text-secondary)] shrink-0">
                    {price ? `~₦${price.toLocaleString()}` : item.estimated_cost || "Market price"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        {unpricedCount > 0 && (
          <div className="p-3 bg-[var(--bg-surface-subtle)] border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Some local market items lack fixed price tables and are estimates.</span>
          </div>
        )}
      </div>
    </div>
  );
}
