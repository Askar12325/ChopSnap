"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Utensils,
  Plus,
  Minus,
  Volume2,
  Undo2,
  Check,
  Flame,
  Plug,
  Droplet,
  MapPin,
} from "lucide-react";
import { Button, ProgressDots } from "@/components/ui";
import { SupportedCity, SUPPORTED_CITIES, PreviousVoiceState } from "../types";

function CharcoalCoalsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-4 h-4"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="7.5" cy="15.5" rx="4.5" ry="3.5" />
      <ellipse cx="16.5" cy="15.5" rx="4.5" ry="3.5" />
      <ellipse cx="12" cy="10.5" rx="4.5" ry="3.5" />
      <path d="M12 4v2" />
      <path d="M9.5 5.5l1.2 1.5" />
      <path d="M14.5 5.5l-1.2 1.5" />
    </svg>
  );
}

export interface PlanScreenProps {
  onBack: () => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  householdSize: number;
  setHouseholdSize: (size: number) => void;
  spiceLevel: "Mild" | "Authentic Hot" | "Suya Extra";
  setSpiceLevel: (lvl: "Mild" | "Authentic Hot" | "Suya Extra") => void;
  cookingFuel: "gas" | "charcoal" | "electric" | "kerosene";
  setCookingFuel: (fuel: "gas" | "charcoal" | "electric" | "kerosene") => void;
  selectedCity: SupportedCity;
  setSelectedCity: (city: SupportedCity) => void;
  budgetNaira: number | null;
  handleSetBudget: (amount: number | null) => void;
  dietaryPreferences: string[];
  toggleDietaryPreference: (pref: string) => void;
  voiceAppliedChanges: string | null;
  previousVoiceState: PreviousVoiceState | null;
  handleUndoVoice: () => void;
}

export function PlanScreen({
  onBack,
  onSubmit,
  loading,
  householdSize,
  setHouseholdSize,
  spiceLevel,
  setSpiceLevel,
  cookingFuel,
  setCookingFuel,
  selectedCity,
  setSelectedCity,
  budgetNaira,
  handleSetBudget,
  dietaryPreferences,
  toggleDietaryPreference,
  voiceAppliedChanges,
  previousVoiceState,
  handleUndoVoice,
}: PlanScreenProps) {
  const [customBudgetInput, setCustomBudgetInput] = useState<string>(
    budgetNaira ? String(budgetNaira) : ""
  );

  const budgetPresets = [1000, 2000, 3000, 5000];
  const dietaryOptions = ["No pork", "Halal", "No fish"];

  const handleCustomBudgetChange = (val: string) => {
    setCustomBudgetInput(val);
    const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num) && num > 0) {
      handleSetBudget(num);
    } else if (!val) {
      handleSetBudget(null);
    }
  };

  return (
    <section className="max-w-4xl mx-auto space-y-6 py-2 sm:py-4">
      {/* Top Bar: Stepper & Navigation Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <ProgressDots totalSteps={3} currentStep={3} labels={["Snap", "Check", "Plan"]} />
        </div>
      </div>

      {/* Main Plan Card */}
      <div className="chop-card p-5 sm:p-8 relative shadow-md space-y-6 sm:space-y-8">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1D2B64] dark:text-[#F9A826] bg-[#EEF1FC] dark:bg-[#1C2758] px-3 py-1 rounded-full mb-2 border border-[#C8D1F5] dark:border-[#3D52A8]">
            Step 3: Plan
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)]">
            How would you like to plan your cooking?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Tell us who you&apos;re cooking for and how much you can spend.
          </p>
        </div>

        {/* 'What we understood' Voice Summary Banner */}
        {(voiceAppliedChanges || previousVoiceState) && (
          <div className="p-4 rounded-2xl bg-[#FEF6E9] dark:bg-[#2A1F0D] border border-[#FCE1AD] dark:border-[#6B4D16] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B36B00] dark:text-[#F9A826] flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#F9A826]" />
                What we understood from your voice instructions
              </span>
              <button
                type="button"
                onClick={handleUndoVoice}
                className="min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#FCE1AD] dark:border-[#6B4D16] text-[#B36B00] dark:text-[#F9A826] hover:bg-[#F9A826]/10 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo voice</span>
              </button>
            </div>
            {voiceAppliedChanges && (
              <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">
                {voiceAppliedChanges}
              </p>
            )}
          </div>
        )}

        {/* Control 1: Number of People (Minus/Plus Stepper - 44px touch targets) */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
            Number of people
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
              disabled={householdSize <= 1}
              className="min-w-[48px] min-h-[48px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-40 flex items-center justify-center font-bold text-lg cursor-pointer transition-colors"
              aria-label="Decrease number of people"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="min-w-[130px] min-h-[48px] px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-center font-semibold text-base text-[var(--text-primary)]">
              {householdSize} {householdSize === 1 ? "Person" : "People"}
            </div>

            <button
              type="button"
              onClick={() => setHouseholdSize(Math.min(10, householdSize + 1))}
              disabled={householdSize >= 10}
              className="min-w-[48px] min-h-[48px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-40 flex items-center justify-center font-bold text-lg cursor-pointer transition-colors"
              aria-label="Increase number of people"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Control 2: Budget Preset Chips + Custom Amount */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                Budget target
              </label>
              <span className="text-xs font-normal text-[var(--text-muted)]">(Optional)</span>
            </div>
            {budgetNaira && (
              <button
                type="button"
                onClick={() => {
                  handleSetBudget(null);
                  setCustomBudgetInput("");
                }}
                className="text-xs text-[var(--text-secondary)] hover:text-[#A3173A] underline cursor-pointer"
              >
                Clear budget
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {budgetPresets.map((preset) => {
              const isSelected = budgetNaira === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    handleSetBudget(preset);
                    setCustomBudgetInput(String(preset));
                  }}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#1D2B64] text-white dark:bg-[#2D3E8C] dark:text-white border-2 border-[#1D2B64] dark:border-[#F9A826] shadow-sm ring-2 ring-[#1D2B64]/30 dark:ring-[#F9A826]/40"
                      : "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#F9A826]" />}
                  <span>₦{preset.toLocaleString()}</span>
                </button>
              );
            })}

            {/* Custom Amount Field */}
            <div className="relative flex items-center min-w-[160px] flex-1 max-w-xs">
              <span className="absolute left-3 text-sm font-semibold text-[var(--text-muted)] pointer-events-none">
                ₦
              </span>
              <input
                type="text"
                value={customBudgetInput}
                onChange={(e) => handleCustomBudgetChange(e.target.value)}
                placeholder="Custom amount"
                className="w-full min-h-[44px] pl-8 pr-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#F9A826]"
              />
            </div>
          </div>
        </div>

        {/* Control 3: Spice Level (Three Segmented Buttons - 44px min) */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
            Spice level
          </label>
          <div className="grid grid-cols-3 gap-2 max-w-md">
            {[
              { label: "Mild", val: "Mild" },
              { label: "Hot", val: "Authentic Hot" },
              { label: "Extra hot", val: "Suya Extra" },
            ].map(({ label, val }) => {
              const isSelected = spiceLevel === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSpiceLevel(val as "Mild" | "Authentic Hot" | "Suya Extra")}
                  className={`min-h-[44px] py-2 px-3 rounded-xl text-center text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-[#1D2B64] text-white dark:bg-[#2D3E8C] dark:text-white border-2 border-[#1D2B64] dark:border-[#F9A826] shadow-sm ring-2 ring-[#1D2B64]/30 dark:ring-[#F9A826]/40"
                      : "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#F9A826]" />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 4: Cooking Fuel (Four Selectable Cards - 44px min) */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
            Cooking fuel
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "gas", label: "Gas", icon: <Flame className="w-4 h-4 text-[#F9A826]" />, sub: "Instant heat" },
              { id: "charcoal", label: "Charcoal", icon: <CharcoalCoalsIcon className="w-4 h-4 text-[#A3173A] dark:text-[#F87171]" />, sub: "Smoky flavor" },
              { id: "electric", label: "Electric", icon: <Plug className="w-4 h-4 text-[#1D2B64] dark:text-[#C8D1F5]" />, sub: "Steady heat" },
              { id: "kerosene", label: "Kerosene", icon: <Droplet className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC]" />, sub: "Gentle simmer" },
            ].map((f) => {
              const isSelected = cookingFuel === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCookingFuel(f.id as "gas" | "charcoal" | "electric" | "kerosene")}
                  className={`min-h-[56px] p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#EEF1FC] dark:bg-[#1C2758] border-[#1D2B64] dark:border-[#F9A826] shadow-sm ring-2 ring-[#1D2B64]/20 dark:ring-[#F9A826]/40"
                      : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1D2B64] dark:text-[#F9A826]" />}
                      <span className="font-semibold text-sm text-[var(--text-primary)]">{f.label}</span>
                    </div>
                    {f.icon}
                  </div>
                  <span className="text-xs text-[var(--text-muted)] mt-1">{f.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 5: Dietary Preferences (Toggle Chips - 44px min) */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
            Dietary preferences
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((opt) => {
              const isSelected = dietaryPreferences.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleDietaryPreference(opt)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-[#20653E] text-white dark:bg-[#132E22] dark:text-[#86EFAC] border-2 border-[#20653E] dark:border-[#86EFAC] shadow-sm"
                      : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white dark:text-[#86EFAC]" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 6: City Select */}
        <div className="space-y-2 max-w-sm">
          <label className="block text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#A3173A]" />
            <span>Market city (for local market pricing)</span>
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value as SupportedCity)}
            className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[#F9A826] cursor-pointer"
            aria-label="Select city for market pricing"
          >
            {SUPPORTED_CITIES.map((c) => (
              <option key={c} value={c}>
                {c} Market
              </option>
            ))}
          </select>
        </div>

        {/* Action Footer: Back & Primary 'Show me what to chop' CTA */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onBack}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="w-full sm:w-auto min-h-[48px] px-6 cursor-pointer"
          >
            Back to Check
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={onSubmit}
            disabled={loading}
            isLoading={loading}
            icon={!loading ? <Utensils className="w-4 h-4 text-white" /> : undefined}
            className="w-full sm:w-auto min-h-[48px] px-8 cursor-pointer shadow-md text-base"
          >
            {loading ? "Planning meals..." : "Show me what to chop"}
          </Button>
        </div>
      </div>
    </section>
  );
}
