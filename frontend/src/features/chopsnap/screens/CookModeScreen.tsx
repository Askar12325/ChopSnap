"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  List,
  X,
  Sparkles,
  ChefHat,
  Bell,
} from "lucide-react";
import { Recipe } from "../types";

export interface CookModeScreenProps {
  recipe: Recipe;
  onBackToResults: () => void;
  completedSteps: Set<number>;
  onToggleStep: (stepIndex: number) => void;
}

function parseDurationMinutes(text: string): number | null {
  if (!text) return null;
  const match = text.match(
    /(?:for\s+)?(?:about\s+)?(\d+)(?:\s*-\s*\d+)?\s*(?:minutes|minute|mins|min)\b/i
  );
  if (match && match[1]) {
    const val = parseInt(match[1], 10);
    return !isNaN(val) && val > 0 ? val : null;
  }
  return null;
}

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.15); // D6
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // Ignore audio errors silently
  }
}

export function CookModeScreen({
  recipe,
  onBackToResults,
  completedSteps,
  onToggleStep,
}: CookModeScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isDoneScreen, setIsDoneScreen] = useState(false);
  const [showStepsDrawer, setShowStepsDrawer] = useState(false);

  // Timer states
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerAlert, setTimerAlert] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = recipe?.instructions?.length || 0;
  const currentInstruction = recipe?.instructions?.[currentStepIndex] || "";
  const stepDurationMinutes = parseDurationMinutes(currentInstruction);

  // Screen Wake Lock API (keeps screen awake while cooking)
  useEffect(() => {
    let wakeLockSentinel: unknown = null;
    const requestWakeLock = async () => {
      if ("wakeLock" in navigator && typeof (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock?.request === "function") {
        try {
          wakeLockSentinel = await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock.request("screen");
        } catch {
          // Unsupported or denied: silent no-op
        }
      }
    };
    requestWakeLock();
    return () => {
      if (wakeLockSentinel && typeof (wakeLockSentinel as { release: () => Promise<void> }).release === "function") {
        (wakeLockSentinel as { release: () => Promise<void> }).release().catch(() => {});
      }
    };
  }, []);

  // Keyboard navigation: Left/Right arrows and Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showStepsDrawer) return;

      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (isDoneScreen) {
          onBackToResults();
        } else if (currentStepIndex < totalSteps - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsDoneScreen(true);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isDoneScreen) {
          setIsDoneScreen(false);
        } else if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        } else {
          onBackToResults();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStepIndex, totalSteps, isDoneScreen, showStepsDrawer, onBackToResults]);

  // Reset timer whenever moving between steps
  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerSecondsLeft(stepDurationMinutes ? stepDurationMinutes * 60 : null);
    setIsTimerRunning(false);
    setTimerAlert(false);
  }, [currentStepIndex, stepDurationMinutes]);

  // Timer countdown handler
  useEffect(() => {
    if (isTimerRunning && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            setTimerAlert(true);
            if (soundEnabled) {
              playBeep();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, timerSecondsLeft, soundEnabled]);

  const handleStartTimer = () => {
    if (!timerSecondsLeft && stepDurationMinutes) {
      setTimerSecondsLeft(stepDurationMinutes * 60);
    }
    setIsTimerRunning(true);
    setTimerAlert(false);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(stepDurationMinutes ? stepDurationMinutes * 60 : null);
    setTimerAlert(false);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent =
    totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;

  if (!recipe) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 max-w-xl mx-auto space-y-4 text-center">
        <p className="text-[var(--text-secondary)]">No recipe selected.</p>
        <button
          type="button"
          onClick={onBackToResults}
          className="min-h-[48px] px-6 py-2.5 rounded-xl bg-[#1D2B64] text-white font-semibold cursor-pointer active:scale-95 transition-transform"
        >
          Return to recipes
        </button>
      </main>
    );
  }

  // Celebratory Done Screen
  if (isDoneScreen) {
    return (
      <main className="min-h-screen flex flex-col justify-between p-4 sm:p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
        <div className="pt-8 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#2E8B57]/15 text-[#2E8B57] dark:text-[#86EFAC] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">
            Meal Ready!
          </h1>
          <p className="text-base text-[var(--text-secondary)] max-w-md mx-auto">
            You&apos;ve completed all steps for <strong>{recipe.title}</strong>. Serve hot and enjoy!
          </p>
        </div>

        {recipe.chef_tips && (
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F9A826]">
              <Sparkles className="w-4 h-4" />
              <span>Chef&apos;s Pro Tip</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {recipe.chef_tips}
            </p>
          </div>
        )}

        <div className="space-y-3 pb-8">
          <button
            type="button"
            onClick={onBackToResults}
            className="w-full min-h-[56px] px-8 rounded-2xl bg-[#1D2B64] hover:bg-[#15204C] text-white font-bold text-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChefHat className="w-5 h-5 text-[#F9A826]" />
            <span>Back to recipes</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsDoneScreen(false);
              setCurrentStepIndex(totalSteps - 1);
            }}
            className="w-full min-h-[48px] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer"
          >
            Review previous steps
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-between p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Bar: Back to Results, Recipe Title, All Steps Drawer trigger */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <button
          type="button"
          onClick={onBackToResults}
          className="min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to recipe</span>
        </button>

        <div className="text-center truncate px-2 hidden sm:block">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)] block">
            Cook Mode
          </span>
          <span className="text-sm font-semibold text-[var(--text-primary)] truncate block max-w-xs">
            {recipe.title}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowStepsDrawer(true)}
          className="min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-all cursor-pointer"
          aria-label="View all steps"
        >
          <List className="w-4 h-4" />
          <span>All steps</span>
        </button>
      </div>

      {/* Progress Bar & Step Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[var(--text-secondary)]">
          <span className="uppercase tracking-wider text-[#1D2B64] dark:text-[#F9A826]">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#2E8B57] dark:bg-[#86EFAC] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Focus Card: One Large Readable Instruction */}
      <div className="flex-1 flex flex-col justify-center py-4 sm:py-8 space-y-6">
        <div className="chop-card p-6 sm:p-10 shadow-md border-2 border-[var(--primary-border)] space-y-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#EEF1FC] dark:bg-[#1C2758] text-[#1D2B64] dark:text-[#F9A826] font-extrabold text-base border border-[#C8D1F5] dark:border-[#3D52A8]">
              {currentStepIndex + 1}
            </span>

            {/* Tap-to-complete toggle checkbox */}
            <button
              type="button"
              onClick={() => onToggleStep(currentStepIndex)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                completedSteps.has(currentStepIndex)
                  ? "bg-[#2E8B57]/15 border-[#2E8B57] text-[#2E8B57] dark:text-[#86EFAC]"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-default)]"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedSteps.has(currentStepIndex) ? "Completed" : "Mark step done"}</span>
            </button>
          </div>

          {/* Large Instruction Text (≥22px on phones) */}
          <p className="text-[22px] sm:text-3xl font-sans font-medium text-[var(--text-primary)] leading-relaxed sm:leading-snug select-text">
            {currentInstruction}
          </p>

          {/* Timer Section (shown ONLY if step contains duration) */}
          {stepDurationMinutes !== null && (
            <div className="p-4 rounded-2xl bg-[#FEF6E9] dark:bg-[#2A1F0D] border border-[#FCE1AD] dark:border-[#6B4D16] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B36B00] dark:text-[#F9A826] flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Step Timer ({stepDurationMinutes} mins detected)</span>
                </span>

                {/* Sound Toggle (Chime only if enabled) */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                    soundEnabled
                      ? "bg-[#F9A826] text-[#1D2B64] border-[#F9A826]"
                      : "border-[#FCE1AD] text-[#B36B00] dark:text-[#F9A826]"
                  }`}
                  aria-label="Toggle sound alert"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{soundEnabled ? "Sound ON" : "Sound OFF"}</span>
                </button>
              </div>

              {/* Timer Display & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#1D2B64] dark:text-[#F9A826]">
                  {timerSecondsLeft !== null ? formatTimer(timerSecondsLeft) : `${stepDurationMinutes}:00`}
                </span>

                <div className="flex items-center gap-2">
                  {!isTimerRunning ? (
                    <button
                      type="button"
                      onClick={handleStartTimer}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1D2B64] hover:bg-[#15204C] text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                    >
                      <Play className="w-4 h-4" />
                      <span>{timerSecondsLeft && timerSecondsLeft < stepDurationMinutes * 60 ? "Resume" : "Start timer"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePauseTimer}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleResetTimer}
                    className="min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Alert Banner when finished */}
              {timerAlert && (
                <div className="p-3 rounded-xl bg-[#2E8B57] text-white text-sm font-bold flex items-center gap-2 animate-bounce">
                  <Bell className="w-4 h-4 shrink-0" />
                  <span>Time&apos;s up! Check your food and move to the next step.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer: Large Buttons (≥56px tall) */}
      <div className="pt-2 pb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (currentStepIndex > 0) {
              setCurrentStepIndex((prev) => prev - 1);
            } else {
              onBackToResults();
            }
          }}
          className="flex-1 sm:flex-none min-h-[56px] px-6 rounded-2xl border-2 border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{currentStepIndex === 0 ? "Exit" : "Previous"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (currentStepIndex < totalSteps - 1) {
              setCurrentStepIndex((prev) => prev + 1);
            } else {
              setIsDoneScreen(true);
            }
          }}
          className="flex-1 sm:flex-none min-h-[56px] px-8 rounded-2xl bg-[#1D2B64] hover:bg-[#15204C] text-white font-bold text-base sm:text-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{currentStepIndex === totalSteps - 1 ? "Finish Cooking" : "Next Step"}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* AI Accuracy & Food Safety Notice */}
      <div className="pb-3 text-center">
        <p className="text-xs text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
          AI-generated suggestions can contain mistakes. Check ingredients, allergies and food safety yourself.
        </p>
      </div>

      {/* All Steps Drawer */}
      {showStepsDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setShowStepsDrawer(false)}
        >
          <div
            className="w-full sm:max-w-xl max-h-[85vh] flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-subtle)]">
              <span className="font-bold text-base text-[var(--text-primary)]">
                All Cooking Steps ({totalSteps})
              </span>
              <button
                type="button"
                onClick={() => setShowStepsDrawer(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-[var(--border-subtle)]">
              {recipe.instructions.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setShowStepsDrawer(false);
                  }}
                  className={`pt-3 first:pt-0 min-h-[52px] flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                    idx === currentStepIndex
                      ? "bg-[#EEF1FC] dark:bg-[#1C2758] border border-[#1D2B64] dark:border-[#F9A826]"
                      : "hover:bg-[var(--bg-surface-hover)]"
                  }`}
                >
                  <span className="w-7 h-7 rounded-lg bg-[var(--bg-surface-subtle)] flex items-center justify-center font-bold text-xs shrink-0 text-[var(--text-primary)]">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] line-clamp-2">
                      {step}
                    </p>
                  </div>
                  {completedSteps.has(idx) && (
                    <CheckCircle2 className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
