"use client";

import React from "react";
import {
  Camera,
  Mic,
  Volume2,
  MicOff,
  Undo2,
  AlertCircle,
  Plus,
  X,
  SlidersHorizontal,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Check,
  Salad,
  RefreshCw,
} from "lucide-react";
import { Button, ProgressDots } from "@/components/ui";
import { DetectedItem, PreviousVoiceState } from "../types";
import { NIGERIAN_SUGGESTIONS } from "../data/samples";

export interface SnapScreenProps {
  onBack: () => void;
  onContinue: () => void;
  onTryExample?: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  previewUrl: string | null;
  selectedFile: File | null;
  voiceSupported: boolean;
  isListening: boolean;
  voiceLang: string;
  setVoiceLang: (lang: string) => void;
  startVoiceRecognition: () => void;
  recordingSeconds: number;
  voiceTranscript: string;
  setVoiceTranscript: (transcript: string) => void;
  voiceInterpreting: boolean;
  handleInterpretVoice: (textToInterpret?: string) => Promise<void>;
  voiceAppliedChanges: string | null;
  handleUndoVoice: () => void;
  previousVoiceState: PreviousVoiceState | null;
  voiceMessage: string | null;
  preAnalysisItems: DetectedItem[];
  handleRemovePreAnalysisItem: (idx: number) => void;
  typedIngredient: string;
  setTypedIngredient: (val: string) => void;
  handleAddPreAnalysisItem: (name?: string) => void;
  loading: boolean;
  statusStep: string;
  showPreferences: boolean;
  setShowPreferences: React.Dispatch<React.SetStateAction<boolean>>;
  householdSize: number;
  setHouseholdSize: (size: number) => void;
  spiceLevel: "Mild" | "Authentic Hot" | "Suya Extra";
  setSpiceLevel: (lvl: "Mild" | "Authentic Hot" | "Suya Extra") => void;
  cookingFuel: "gas" | "charcoal" | "electric" | "kerosene";
  setCookingFuel: (fuel: "gas" | "charcoal" | "electric" | "kerosene") => void;
  error: string | null;
}

export function SnapScreen({
  onBack,
  onContinue,
  fileInputRef,
  handleFileChange,
  handleDrop,
  handleDragOver,
  previewUrl,
  selectedFile,
  voiceSupported,
  isListening,
  voiceLang,
  setVoiceLang,
  startVoiceRecognition,
  recordingSeconds,
  voiceTranscript,
  setVoiceTranscript,
  voiceInterpreting,
  handleInterpretVoice,
  voiceAppliedChanges,
  handleUndoVoice,
  previousVoiceState,
  voiceMessage,
  preAnalysisItems,
  handleRemovePreAnalysisItem,
  typedIngredient,
  setTypedIngredient,
  handleAddPreAnalysisItem,
  loading,
  statusStep,
  showPreferences,
  setShowPreferences,
  householdSize,
  setHouseholdSize,
  spiceLevel,
  setSpiceLevel,
  cookingFuel,
  setCookingFuel,
  error,
}: SnapScreenProps) {
  const hasIngredients =
    Boolean(selectedFile) ||
    preAnalysisItems.length > 0 ||
    typedIngredient.trim().length > 0 ||
    voiceTranscript.trim().length > 0;

  const handleContinueClick = () => {
    if (typedIngredient.trim().length > 0) {
      handleAddPreAnalysisItem(typedIngredient.trim());
    }
    onContinue();
  };

  return (
    <section className="max-w-4xl mx-auto space-y-6 py-2 sm:py-4 pb-24 sm:pb-4">
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
          <ProgressDots totalSteps={3} currentStep={1} labels={["Snap", "Check", "Plan"]} />
        </div>
      </div>

      {/* Main Snap Card */}
      <div className="chop-card p-5 sm:p-8 relative overflow-hidden shadow-md space-y-6">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1D2B64] dark:text-[#F9A826] bg-[#EEF1FC] dark:bg-[#1C2758] px-3 py-1 rounded-full mb-2 border border-[#C8D1F5] dark:border-[#3D52A8]">
            Step 1: Snap
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)]">
            Snap your kitchen or speak your ingredients
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Take a clear photo of your pantry, crisper, or basket, or speak what you have available.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="kitchen-upload-input"
        />

        {/* Primary Action Area: Photo Upload + Voice Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Photo Dropzone (7 Cols on desktop) */}
          <div className="md:col-span-7">
            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-[#1D2B64]/30 hover:border-[#1D2B64] dark:border-[#FFF5E1]/50 bg-white hover:bg-[#FAF9F5] dark:bg-[#1E2B60] dark:hover:bg-[#253678] rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[170px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#1D2B64]/10 dark:bg-[#FFF5E1]/20 text-[#1D2B64] dark:text-[#FFF5E1] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm sm:text-base text-[var(--text-primary)]">
                  Take or upload photo
                </span>
                <span className="text-xs text-[var(--text-muted)] mt-1">
                  Drag & drop JPEG/PNG, or tap to browse
                </span>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 flex items-center gap-3 min-h-[170px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Uploaded kitchen preview"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-[var(--border-subtle)] shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#2E8B57] dark:text-[#86EFAC] font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Photo ready</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {selectedFile?.name || "Kitchen snapshot"}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
                  >
                    Change photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Voice Panel (5 Cols on desktop) */}
          <div className="md:col-span-5 flex flex-col justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            {/* Header: Label + Styled Language Dropdown matching white card */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#F9A826]" />
                Voice Instructions
              </span>
              <select
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
                className="text-xs bg-white dark:bg-[#1E2B60] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1 font-medium shadow-xs focus:outline-none focus:ring-1 focus:ring-[#F9A826]"
                aria-label="Select voice recognition language"
              >
                <option value="en-NG">English (NG)</option>
                <option value="pcm-NG">Pidgin (NG)</option>
                <option value="yo-NG">Yorùbá</option>
                <option value="ig-NG">Igbo</option>
                <option value="ha-NG">Hausa</option>
              </select>
            </div>

            {/* Centered Large Mic Button with Pulsing Ring while listening */}
            <div className="flex flex-col items-center justify-center text-center py-1">
              <div className="relative flex items-center justify-center">
                {isListening && (
                  <span className="absolute -inset-1.5 rounded-full border-2 border-[#A3173A] animate-ping opacity-60 pointer-events-none" />
                )}
                <button
                  type="button"
                  onClick={startVoiceRecognition}
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md active:scale-95 ${
                    isListening
                      ? "bg-[#A3173A] text-white ring-4 ring-[#A3173A]/30 animate-pulse"
                      : "bg-[#1D2B64] hover:bg-[#15204C] text-white dark:bg-[#F9A826] dark:hover:bg-[#E5981E] dark:text-[#1A1033]"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Start voice recognition"}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
              </div>

              <p className="text-xs font-semibold text-[var(--text-primary)] mt-2">
                {isListening ? `Listening (${recordingSeconds}s)...` : "Tap mic to speak"}
              </p>

              {/* Two Tappable Example Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setVoiceTranscript("I have ugwu, stockfish and onions")}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-[#1E2B60] hover:bg-[#FAF9F5] dark:hover:bg-[#253678] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors shadow-2xs"
                >
                  &ldquo;I have ugwu, stockfish and onions&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceTranscript("₦3,000 for 4 people, no pork")}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-[#1E2B60] hover:bg-[#FAF9F5] dark:hover:bg-[#253678] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors shadow-2xs"
                >
                  &ldquo;₦3,000 for 4 people, no pork&rdquo;
                </button>
              </div>
            </div>

            {/* Editable transcript if voice transcript exists or in fallback typing */}
            {(voiceTranscript || !voiceSupported) && (
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <textarea
                  value={voiceTranscript}
                  onChange={(e) => setVoiceTranscript(e.target.value)}
                  placeholder="Type voice notes, pantry items, or preferences..."
                  rows={2}
                  className="w-full text-xs p-2 rounded-lg bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleInterpretVoice()}
                    disabled={voiceInterpreting || !voiceTranscript.trim()}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#1D2B64] hover:bg-[#15204C] text-white dark:bg-[#F9A826] dark:text-[#1A1033] transition-colors disabled:opacity-50 cursor-pointer min-h-[36px]"
                  >
                    {voiceInterpreting ? "Interpreting..." : "Apply"}
                  </button>
                  {previousVoiceState && (
                    <button
                      type="button"
                      onClick={handleUndoVoice}
                      className="py-1.5 px-3 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] flex items-center gap-1 cursor-pointer min-h-[36px]"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {voiceAppliedChanges && (
              <p className="text-xs text-[#2E8B57] dark:text-[#86EFAC] font-medium leading-tight">
                {voiceAppliedChanges}
              </p>
            )}

            {voiceMessage && (
              <p className="text-xs text-[var(--text-muted)] italic leading-tight">
                {voiceMessage}
              </p>
            )}
          </div>
        </div>

        {/* Secondary Area: Type Ingredients + Staple Chips */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Salad className="w-3.5 h-3.5 text-[#2E8B57]" />
              Type Ingredients or Tap Common Staples
            </span>
            {preAnalysisItems.length > 0 && (
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {preAnalysisItems.length} added
              </span>
            )}
          </div>

          {/* Quick Input Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={typedIngredient}
              onChange={(e) => setTypedIngredient(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPreAnalysisItem();
                }
              }}
              placeholder="e.g. Palm oil, Egusi, Stockfish..."
              className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#F9A826]"
            />
            <button
              type="button"
              onClick={() => handleAddPreAnalysisItem()}
              disabled={!typedIngredient.trim()}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                typedIngredient.trim()
                  ? "bg-[#1D2B64] hover:bg-[#15204C] text-white shadow-sm cursor-pointer"
                  : "bg-[#EAEFFC] text-[#3D4566] dark:bg-[#1C2550] dark:text-[#CBD3EE] border border-[#D0D7EE] dark:border-[#2C3870] cursor-not-allowed select-none"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Popular Staple Chips */}
          <div className="space-y-1.5">
            <p className="text-xs text-[var(--text-muted)] font-medium">Quick-add popular Nigerian staples:</p>
            <div className="flex flex-wrap gap-1.5">
              {NIGERIAN_SUGGESTIONS.slice(0, 10).map((name) => {
                const isSelected = preAnalysisItems.some(
                  (item) => item.name.toLowerCase() === name.toLowerCase()
                );
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleAddPreAnalysisItem(name)}
                    className={`min-h-[36px] text-xs px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#EAF5EE] dark:bg-[#132E22] text-[#20653E] dark:text-[#86EFAC] border border-[#B7DFCA] dark:border-[#1E5038]"
                        : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-[#2E8B57] dark:text-[#86EFAC]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#1D2B64] dark:text-[#F9A826]" />
                    )}
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pre-analysis Items Tags */}
          {preAnalysisItems.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {preAnalysisItems.map((item, idx) => (
                <span
                  key={`${item.name}-${idx}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF1FC] dark:bg-[#1C2758] text-[#1D2B64] dark:text-[#C8D1F5] border border-[#C8D1F5] dark:border-[#3D52A8]"
                >
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePreAnalysisItem(idx)}
                    className="hover:text-[#A3173A] transition-colors cursor-pointer"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Optional Culinary Preferences Drawer */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowPreferences(!showPreferences)}
              className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer py-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F9A826]" />
              <span>Cooking Preferences (Spice, Fuel, Servings)</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showPreferences ? "rotate-180" : ""}`}
              />
            </button>

            {showPreferences && (
              <div className="mt-3 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[var(--text-primary)]">Spice Level</label>
                    <span className="text-xs text-[var(--text-secondary)] font-medium">
                      {spiceLevel === "Mild" ? "1 Ata Rodo / 2 Servings" : spiceLevel === "Authentic Hot" ? "3 Ata Rodo / 2 Servings" : "5+ Ata Rodo / 2 Servings"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Mild", "Authentic Hot", "Suya Extra"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSpiceLevel(level)}
                        className={`min-h-[40px] py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          spiceLevel === level
                            ? "bg-[#1D2B64] text-white shadow-sm"
                            : "bg-[var(--bg-page)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[var(--text-primary)]">Cooking Fuel</label>
                    <span className="text-xs text-[var(--text-secondary)] font-medium capitalize">{cookingFuel}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["gas", "charcoal", "electric", "kerosene"] as const).map((fuel) => (
                      <button
                        key={fuel}
                        type="button"
                        onClick={() => setCookingFuel(fuel)}
                        className={`min-h-[40px] py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize ${
                          cookingFuel === fuel
                            ? "bg-[#1D2B64] text-white shadow-sm"
                            : "bg-[var(--bg-page)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                        }`}
                      >
                        {fuel === "gas" && "🔥 Gas"}
                        {fuel === "charcoal" && "🪵 Charcoal"}
                        {fuel === "electric" && "🔌 Electric"}
                        {fuel === "kerosene" && "💧 Kerosene"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[var(--text-primary)]">Household Servings</label>
                    <span className="text-xs text-[var(--text-primary)] font-semibold">{householdSize} Servings</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(Number(e.target.value))}
                    className="w-full accent-[#2E8B57] dark:accent-[#86EFAC] cursor-pointer h-4"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-[#FDEEEC] dark:bg-[#2E1816] border border-[#F5C2BC] dark:border-[#5C2A25] text-[#1A1033] dark:text-[#FCA5A5] text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#A3173A] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs">Notice</p>
                <p className="text-xs leading-relaxed">{error}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleContinueClick}
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#1D2B64] hover:bg-[#15204C] text-white font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try again</span>
              </button>
              {onTryExample && (
                <button
                  type="button"
                  onClick={onTryExample}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <span>Try an example</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Footer: Back & Continue CTA */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-secondary)] order-2 sm:order-1 text-center sm:text-left">
            {!hasIngredients && !loading
              ? "Add a photo or type ingredients to continue."
              : "Review spotted and added ingredients in Step 2."}
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinueClick}
              disabled={loading || !hasIngredients}
              isLoading={loading}
              className="w-full sm:w-auto min-h-[48px] px-8 cursor-pointer shadow-md"
              iconRight={!loading ? <ArrowRight className="w-4 h-4 ml-1" /> : undefined}
            >
              {loading ? (statusStep || "Scanning photo...") : "Continue"}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-[var(--bg-page)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] z-30 shadow-lg flex items-center justify-between gap-3">
        <div className="text-xs text-[var(--text-secondary)] truncate">
          {hasIngredients ? "Ready to review" : "Add photo or items"}
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleContinueClick}
          disabled={loading || !hasIngredients}
          isLoading={loading}
          className="min-h-[44px] px-6 shrink-0 shadow-md cursor-pointer"
          iconRight={!loading ? <ArrowRight className="w-4 h-4 ml-1" /> : undefined}
        >
          {loading ? (statusStep || "Processing...") : "Continue"}
        </Button>
      </div>
    </section>
  );
}
