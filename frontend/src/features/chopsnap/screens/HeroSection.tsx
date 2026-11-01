"use client";

import React from "react";
import {
  Camera,
  Sparkles,
  Mic,
  Volume2,
  MicOff,
  Undo2,
  AlertCircle,
  Plus,
  X,
  SlidersHorizontal,
  ChevronDown,
  Utensils,
  RefreshCw,
  CheckCircle2,
  Check,
  Salad,
} from "lucide-react";
import { Button, ProgressDots } from "@/components/ui";
import { HeroIllustration } from "@/components/HeroIllustration";
import { DetectedItem, ProcessResponse, PreviousVoiceState } from "../types";
import { NIGERIAN_SUGGESTIONS } from "../data/samples";

export interface HeroSectionProps {
  data: ProcessResponse | null;
  statusStep: string;
  setPreAnalysisItems: React.Dispatch<React.SetStateAction<DetectedItem[]>>;
  previousVoiceState: PreviousVoiceState | null;
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
  voiceMessage: string | null;
  preAnalysisItems: DetectedItem[];
  handleRemovePreAnalysisItem: (name: string) => void;
  typedIngredient: string;
  setTypedIngredient: (val: string) => void;
  handleAddPreAnalysisItem: (name: string) => void;
  canSubmit: boolean;
  loading: boolean;
  handleSubmit: () => Promise<void>;
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

export function HeroSection({
  data,
  statusStep,
  setPreAnalysisItems,
  previousVoiceState,
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
  voiceMessage,
  preAnalysisItems,
  handleRemovePreAnalysisItem,
  typedIngredient,
  setTypedIngredient,
  handleAddPreAnalysisItem,
  canSubmit,
  loading,
  handleSubmit,
  showPreferences,
  setShowPreferences,
  householdSize,
  setHouseholdSize,
  spiceLevel,
  setSpiceLevel,
  cookingFuel,
  setCookingFuel,
  error,
}: HeroSectionProps) {
  return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Primary Action */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-semibold text-[var(--text-primary)] leading-[1.15] tracking-tight animate-hero-headline [text-wrap:balance] max-w-xl lg:max-w-none">
              Cook celebratory Nigerian meals from what’s{" "}
              <span className="relative inline-block text-[var(--text-primary)] dark:text-[#F9A826] font-normal dark:italic">
                <span className="absolute left-0 right-0 bottom-1 h-3 sm:h-3.5 bg-[#F9A826]/35 rounded-sm -z-0 dark:hidden" />
                <span className="relative z-10 whitespace-nowrap sm:whitespace-normal">already in your kitchen.</span>
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-snug font-sans animate-hero-subtext">
              ChopSnap helps you cook Nigerian meals with the ingredients you already have, within your budget.
            </p>

            {/* Mobile-only Focal Illustration (shrinks below headline on 360px phones) */}
            <div className="lg:hidden my-2 flex justify-center animate-hero-illustration">
              <HeroIllustration className="max-w-[270px] sm:max-w-[320px]" isMobile />
            </div>

            {/* Streamlined Upload Card */}
            <div className="chop-card p-4 sm:p-6 relative overflow-hidden shadow-md animate-hero-card">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[var(--border-subtle)]">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Step 1 of 3: Snap
                </span>
                <ProgressDots totalSteps={3} currentStep={1} labels={["Snap", "Check", "Plan"]} />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="kitchen-upload-input"
              />

              {!previewUrl ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    {/* Snap Button / Area (3 cols) */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current?.click()}
                      className="sm:col-span-3 group border-2 border-dashed border-[#1D2B64]/30 hover:border-[#1D2B64] dark:border-[#FFF5E1]/50 bg-white hover:bg-[#FAF9F5] dark:bg-[#1E2B60] dark:hover:bg-[#253678] rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[140px]"
                    >
                      <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-[var(--primary-subtle)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary-text)] group-hover:scale-105 transition-transform duration-200 shadow-sm">
                        <Camera className="w-5 h-5 text-[#1D2B64] dark:text-[#C8D1F5]" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
                        Snap fridge, shelf, or counter
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Tap photo or drag & drop here
                      </p>
                    </div>

                    {/* Speak Mic Action Box (1 col) */}
                    <div className="sm:col-span-1 rounded-2xl border-2 border-dashed border-[#1D2B64]/30 hover:border-[#1D2B64] dark:border-[#FFF5E1]/40 bg-white dark:bg-[#1E2B60] p-3 flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[140px] transition-colors">
                      <div className="w-full flex items-center justify-between">
                        <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          Speak
                        </span>
                        {isListening && (
                          <span className="flex items-center gap-1 text-sm font-semibold text-rose-500 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {recordingSeconds}s
                          </span>
                        )}
                      </div>

                      {voiceSupported ? (
                        <button
                          type="button"
                          onClick={startVoiceRecognition}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer active:scale-90 ${
                            isListening
                              ? "bg-rose-600 hover:bg-rose-700 text-white animate-bounce shadow-rose-600/30 ring-4 ring-rose-500/20"
                              : "bg-[#1D2B64] hover:bg-[#15204C] text-white dark:bg-[#F9A826] dark:hover:bg-[#E59518] shadow-[#1D2B64]/25 hover:scale-105"
                          }`}
                          title={isListening ? "Press to stop recording" : "Press to start speaking instructions"}
                          aria-label={isListening ? "Stop listening" : "Start voice input"}
                        >
                          {isListening ? (
                            <MicOff className="w-5 h-5" />
                          ) : (
                            <Mic className="w-5 h-5 text-white dark:text-[#1A1033]" />
                          )}
                        </button>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                          <Volume2 className="w-5 h-5" />
                        </div>
                      )}

                      <p className="text-sm font-medium text-[var(--text-secondary)] leading-tight">
                        {isListening ? "Listening (tap stop)" : voiceSupported ? "Tap to speak" : "Type below"}
                      </p>
                    </div>
                  </div>

                  {/* Language Selector + Voice Guidance */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">Voice Language:</span>
                      <select
                        value={voiceLang}
                        onChange={(e) => setVoiceLang(e.target.value)}
                        disabled={isListening}
                        className="min-h-[44px] text-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-[#F9A826]"
                      >
                        <option value="en-NG">English (en-NG)</option>
                        <option value="en-NG">Nigerian Pidgin (en-NG)</option>
                        <option value="yo-NG">Yorùbá (yo-NG) [Beta]</option>
                        <option value="ha-NG">Hausa (ha-NG) [Beta]</option>
                        <option value="ig-NG">Igbo (ig-NG) [Beta]</option>
                      </select>
                      {(voiceLang === "yo-NG" || voiceLang === "ha-NG" || voiceLang === "ig-NG") && (
                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-[#F9A826]/15 text-[#1A1033] dark:text-[#FFF5E1] border border-[#F9A826]/30">
                          BETA
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">
                      30s max • Editable before send
                    </span>
                  </div>

                  {/* Editable Transcript Text Box */}
                  {(voiceTranscript || !voiceSupported || isListening) && (
                    <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC]" />
                          Spoken / Typed Instructions
                        </label>
                        {voiceTranscript && (
                          <button
                            type="button"
                            onClick={() => setVoiceTranscript("")}
                            className="min-h-[44px] px-3 py-1 text-sm text-[var(--text-secondary)] hover:text-rose-500 cursor-pointer flex items-center"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <textarea
                        value={voiceTranscript}
                        onChange={(e) => setVoiceTranscript(e.target.value)}
                        placeholder="e.g. 'Abeg make food for 4 people no put pork, budget na 3000 naira, mild pepper'"
                        rows={2}
                        className="w-full text-sm p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#F9A826] resize-none"
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                        <span className="text-sm text-[var(--text-secondary)]">
                          Edit text freely, then apply to settings.
                        </span>
                        <button
                          type="button"
                          onClick={handleInterpretVoice}
                          disabled={voiceInterpreting || !voiceTranscript.trim()}
                          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            voiceInterpreting || !voiceTranscript.trim()
                              ? "bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]"
                              : "bg-[#1D2B64] hover:bg-[#15204C] text-white shadow-sm active:scale-95"
                          }`}
                        >
                          {voiceInterpreting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Interpreting...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-[#F9A826]" />
                              <span>Apply to Plan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Feedback / Error / Changes Banner */}
                  {voiceMessage && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#1A1033] dark:text-amber-200 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{voiceMessage}</span>
                    </div>
                  )}

                  {voiceAppliedChanges && (
                    <div className="p-3 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[#1A1033] dark:text-[#FBF5EE] text-sm flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
                        <span className="truncate font-medium">{voiceAppliedChanges}</span>
                      </div>
                      {previousVoiceState && (
                        <button
                          type="button"
                          onClick={handleUndoVoice}
                          className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#1D2B64] text-[var(--text-primary)] hover:text-[#1D2B64] font-semibold text-sm shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Undo2 className="w-4 h-4" />
                          <span>Undo</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] group aspect-[16/9] max-h-48 flex items-center justify-center shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Kitchen Snapshot"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-sm text-white gap-2">
                      <span className="truncate max-w-[190px] font-medium opacity-95">
                        {selectedFile?.name || "kitchen_snapshot.jpg"}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {voiceSupported && (
                          <button
                            onClick={startVoiceRecognition}
                            type="button"
                            className={`min-h-[44px] px-3.5 py-1.5 rounded-xl border text-sm text-white backdrop-blur-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                              isListening
                                ? "bg-rose-600 border-rose-400 animate-pulse ring-2 ring-rose-400/40"
                                : "bg-black/60 hover:bg-black/80 border-white/20"
                            }`}
                            title="Speak instruction"
                          >
                            <Mic className="w-4 h-4" />
                            <span className="hidden sm:inline">{isListening ? `${recordingSeconds}s` : "Speak"}</span>
                          </button>
                        )}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                          className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-sm text-white backdrop-blur-sm transition-colors active:scale-95 cursor-pointer flex items-center"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transcript box when photo preview is present */}
                  {(voiceTranscript || isListening) && (
                    <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC]" />
                          Spoken Instructions
                        </label>
                        <button
                          type="button"
                          onClick={() => setVoiceTranscript("")}
                          className="min-h-[44px] px-3 py-1 text-sm text-[var(--text-secondary)] hover:text-rose-500 cursor-pointer flex items-center"
                        >
                          Clear
                        </button>
                      </div>
                      <textarea
                        value={voiceTranscript}
                        onChange={(e) => setVoiceTranscript(e.target.value)}
                        placeholder="e.g. 'Make food for 4 people no put pork, budget na 3000 naira'"
                        rows={2}
                        className="w-full text-sm p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#F9A826] resize-none"
                      />
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={handleInterpretVoice}
                          disabled={voiceInterpreting || !voiceTranscript.trim()}
                          className="min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold bg-[#1D2B64] hover:bg-[#15204C] text-white flex items-center gap-2 active:scale-95 cursor-pointer"
                        >
                          {voiceInterpreting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#F9A826]" />}
                          <span>Apply to Plan</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {voiceAppliedChanges && (
                    <div className="p-3 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[#1A1033] dark:text-[#FBF5EE] text-sm flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
                        <span className="truncate font-medium">{voiceAppliedChanges}</span>
                      </div>
                      {previousVoiceState && (
                        <button
                          type="button"
                          onClick={handleUndoVoice}
                          className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#1D2B64] text-[var(--text-primary)] hover:text-[#1D2B64] font-semibold text-sm shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Undo2 className="w-4 h-4" />
                          <span>Undo</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Visible "Add ingredient" box + Quick Nigerian Suggestions */}
              <div className="mt-3.5 pt-3 border-t border-[var(--border-subtle)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Salad className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC]" />
                    <span>Kitchen Ingredients</span>
                    {(data ? data.detected_items.length : preAnalysisItems.length) > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#2E8B57]/15 text-[#2E8B57] dark:text-[#86EFAC] font-bold">
                        {data ? data.detected_items.length : preAnalysisItems.length}
                      </span>
                    )}
                  </label>
                  {preAnalysisItems.length > 0 && !data && (
                    <button
                      type="button"
                      onClick={() => setPreAnalysisItems([])}
                      className="min-h-[44px] px-2 text-sm text-[var(--text-secondary)] hover:text-rose-500 cursor-pointer font-medium flex items-center"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Active Chips (Before photo analysis) */}
                {preAnalysisItems.length > 0 && !data && (
                  <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                    {preAnalysisItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#2E8B57]/10 text-[#2E8B57] dark:bg-[#2E8B57]/25 dark:text-[#86EFAC] border border-[#2E8B57]/20"
                      >
                        <span>{item.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePreAnalysisItem(idx)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] cursor-pointer"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Text input with Add button */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={typedIngredient}
                    onChange={(e) => setTypedIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && typedIngredient.trim()) {
                        e.preventDefault();
                        handleAddPreAnalysisItem(typedIngredient);
                        setTypedIngredient("");
                      }
                    }}
                    placeholder="Type ingredient (e.g. Ugwu, Smoked Fish, Beans)..."
                    className="flex-1 min-h-[44px] text-sm px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#F9A826]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (typedIngredient.trim()) {
                        handleAddPreAnalysisItem(typedIngredient);
                        setTypedIngredient("");
                      }
                    }}
                    disabled={!typedIngredient.trim()}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                      typedIngredient.trim()
                        ? "bg-[#1D2B64] hover:bg-[#15204C] text-white shadow-sm active:scale-95 cursor-pointer"
                        : "bg-[#EAEFFC] text-[#3D4566] dark:bg-[#1C2550] dark:text-[#CBD3EE] border border-[#D0D7EE] dark:border-[#2C3870] cursor-not-allowed select-none"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Suggestions for common Nigerian items */}
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-2 font-medium">Quick Nigerian staples (tap to add):</p>
                  <div className="flex flex-wrap gap-2">
                    {NIGERIAN_SUGGESTIONS.map((sug) => {
                      const isAdded = data
                        ? data.detected_items.some((it) => it.name.toLowerCase() === sug.toLowerCase())
                        : preAnalysisItems.some((it) => it.name.toLowerCase() === sug.toLowerCase());
                      return (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleAddPreAnalysisItem(sug)}
                          className={`min-h-[44px] text-sm px-3.5 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                            isAdded
                              ? "bg-[#2E8B57]/15 text-[#2E8B57] dark:text-[#86EFAC] border-[#2E8B57]/30 font-semibold"
                              : "bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                          }`}
                        >
                          {isAdded ? (
                            <Check className="w-3.5 h-3.5 text-[#2E8B57] dark:text-[#86EFAC]" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-[#1D2B64] dark:text-[#F9A826]" />
                          )}
                          <span>{sug}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Preferences Knob */}
              <div className="mt-3.5 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="w-full min-h-[44px] flex items-center justify-between text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <SlidersHorizontal className="w-4 h-4 text-[#A3173A] shrink-0" />
                    Spice, Servings & Fuel ({householdSize} {householdSize === 1 ? "person" : "people"}, {spiceLevel}, {cookingFuel.toUpperCase()})
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                      showPreferences ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showPreferences && (
                  <div className="mt-2.5 space-y-4 p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-sm">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[var(--text-primary)] font-semibold">Spice Level</label>
                        <span className="text-[var(--text-secondary)] text-sm">
                          {spiceLevel === "Mild" ? "1 Ata Rodo / 2 Servings" : spiceLevel === "Authentic Hot" ? "3 Ata Rodo / 2 Servings" : "5+ Ata Rodo / 2 Servings"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(["Mild", "Authentic Hot", "Suya Extra"] as const).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setSpiceLevel(level)}
                            className={`min-h-[44px] py-2 px-3 rounded-xl text-center text-sm transition-all active:scale-95 font-semibold cursor-pointer ${
                              spiceLevel === level
                                ? "bg-[#1D2B64] text-white shadow-sm"
                                : "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[var(--text-primary)] font-semibold">Cooking Fuel</label>
                        <span className="text-[var(--text-primary)] font-semibold text-sm capitalize">{cookingFuel}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(["gas", "charcoal", "electric", "kerosene"] as const).map((fuel) => (
                          <button
                            key={fuel}
                            type="button"
                            onClick={() => setCookingFuel(fuel)}
                            className={`min-h-[44px] py-2 px-2.5 rounded-xl text-center text-sm transition-all active:scale-95 font-semibold cursor-pointer capitalize ${
                              cookingFuel === fuel
                                ? "bg-[#1D2B64] text-white shadow-sm"
                                : "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                            }`}
                          >
                            {fuel === "gas" && "⚡ Gas"}
                            {fuel === "charcoal" && "🔥 Charcoal"}
                            {fuel === "electric" && "🔌 Electric"}
                            {fuel === "kerosene" && "⏱️ Kerosene"}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-2 italic">
                        {cookingFuel === "gas" && "Gas: Instant controllable heat, standard cook times."}
                        {cookingFuel === "charcoal" && "Charcoal: +10m prep for hot glowing coals, rich smoky flavor."}
                        {cookingFuel === "electric" && "Electric: +3m coil preheat, steady uniform heat."}
                        {cookingFuel === "kerosene" && "Kerosene: +2m wick stabilization, gentle steady simmer."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[var(--text-secondary)] font-medium text-sm">Household Servings</label>
                        <span className="text-[var(--text-primary)] font-semibold text-sm">{householdSize} Servings</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={6}
                        step={1}
                        value={householdSize}
                        onChange={(e) => setHouseholdSize(Number(e.target.value))}
                        className="w-full accent-[#2E8B57] dark:accent-[#86EFAC] cursor-pointer h-5"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                  isLoading={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={!loading ? <Utensils className="w-4 h-4 text-white shrink-0" /> : undefined}
                >
                  {loading ? (statusStep || "Finding what to chop...") : "Show me what to chop"}
                </Button>
                {!canSubmit && !loading && (
                  <p className="text-sm text-[var(--text-secondary)] text-center mt-2.5 font-normal">
                    Add a photo or tell us your ingredients to get started.
                  </p>
                )}
              </div>

              {error && (
                <div className="mt-3.5 p-3.5 rounded-xl bg-[#FDEEEC] dark:bg-[#2E1816] border border-[#F5C2BC] dark:border-[#5C2A25] text-[#1A1033] dark:text-[#FCA5A5] text-sm flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#A3173A] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-semibold">Notice</p>
                      <p className="leading-relaxed">{error}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1D2B64] hover:bg-[#BC2C14] text-white font-semibold text-sm shrink-0 cursor-pointer active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try again</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: ONE Focal Illustration for Desktop Hero */}
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center pl-2 lg:pl-6 animate-hero-illustration">
            <HeroIllustration className="w-full max-w-[460px]" />
          </div>
        </section>
  );
}
