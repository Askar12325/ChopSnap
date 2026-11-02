"use client";

import React from "react";
import { m, useReducedMotion } from "framer-motion";
import { CheckCircle2, RefreshCw, Circle, AlertCircle, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui";

export interface LoadingScreenProps {
  loading: boolean;
  pipelinePhase: "vision" | "recipes";
  statusStep: string;
  progressStage: number;
  error?: string | null;
  onRetry?: () => void;
  onBackToPlan?: () => void;
  onCancel?: () => void;
}

export function LoadingScreen({
  loading,
  statusStep,
  progressStage,
  error,
  onRetry,
  onBackToPlan,
  onCancel,
}: LoadingScreenProps) {
  const prefersReduced = useReducedMotion();

  // If not loading and no error, don't show
  if (!loading && !error) return null;

  const cookingStages = [
    { id: 1, label: "Reading your ingredients" },
    { id: 2, label: "Planning meals" },
    { id: 3, label: "Pricing your meal" },
  ];

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8">
      <div className="chop-card p-6 sm:p-10 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-lg border-2 border-[var(--primary-border)] space-y-6">
        {/* Friendly Animated Cooking Pot Illustration */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full overflow-visible select-none"
            aria-hidden="true"
          >
            {/* Steam Wisps (gentle rising animation) */}
            <m.path
              d="M 65 42 Q 62 30 67 20 Q 72 10 65 0"
              fill="none"
              stroke="#F9A826"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={
                prefersReduced
                  ? {}
                  : { opacity: [0.2, 0.8, 0.2], y: [0, -8, -16] }
              }
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <m.path
              d="M 80 38 Q 85 26 80 16 Q 75 6 82 -4"
              fill="none"
              stroke="#F9A826"
              strokeWidth="3"
              strokeLinecap="round"
              animate={
                prefersReduced
                  ? {}
                  : { opacity: [0.3, 0.9, 0.3], y: [0, -10, -20] }
              }
              transition={{ repeat: Infinity, duration: 2.3, ease: "easeInOut", delay: 0.3 }}
            />
            <m.path
              d="M 95 42 Q 98 30 93 20 Q 88 10 95 0"
              fill="none"
              stroke="#F9A826"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={
                prefersReduced
                  ? {}
                  : { opacity: [0.2, 0.8, 0.2], y: [0, -8, -16] }
              }
              transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut", delay: 0.6 }}
            />

            {/* Pot Body: Indigo */}
            <path
              d="M 30 65 Q 26 122 80 125 Q 134 122 130 65 Z"
              className="fill-[#1D2B64] dark:fill-[#2D3E8C]"
            />

            {/* Pot Body Rim */}
            <ellipse
              cx="80"
              cy="65"
              rx="50"
              ry="9"
              className="fill-[#15204C] dark:fill-[#243477] stroke-[#FFF5E1]/20 stroke-1"
            />

            {/* Pot Loop Handles */}
            <path
              d="M 28 72 C 16 72 16 92 28 92"
              fill="none"
              className="stroke-[#1D2B64] dark:stroke-[#2D3E8C]"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 132 72 C 144 72 144 92 132 92"
              fill="none"
              className="stroke-[#1D2B64] dark:stroke-[#2D3E8C]"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Gently Rattling Lid */}
            <m.g
              animate={
                prefersReduced || error
                  ? {}
                  : {
                      rotate: [-1.2, 1.2, -1.2],
                      y: [-1, 0.5, -1],
                    }
              }
              transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
              style={{ originX: "80px", originY: "58px" }}
            >
              {/* Lid dome */}
              <path
                d="M 36 63 Q 80 44 124 63 Z"
                className="fill-[#2D3E8C] dark:fill-[#3D52A8] stroke-[#FFF5E1]/40 stroke-1"
              />
              {/* Lid rim lip */}
              <ellipse
                cx="80"
                cy="63"
                rx="44"
                ry="5"
                className="fill-[#243477] dark:fill-[#2D3E8C]"
              />
              {/* Golden Saffron Knob */}
              <circle
                cx="80"
                cy="48"
                r="7"
                fill="#F9A826"
                className="stroke-[#1D2B64] stroke-1 shadow-sm"
              />
            </m.g>
          </svg>
        </div>

        {/* Title and Current Status */}
        <div className="space-y-1.5 max-w-md">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)]">
            {error ? "We ran into an issue" : "Cooking up your meal plan"}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
            {error
              ? error
              : statusStep || "Muse Spark Open is formulating authentic Nigerian recipes with zero waste..."}
          </p>
        </div>

        {/* Real Pipeline Stages Checklist (ticks off from actual state) */}
        {!error && (
          <div className="flex flex-col gap-2.5 w-full max-w-sm text-sm text-left">
            {cookingStages.map((stage) => {
              const isDone = stage.id < progressStage;
              const isActive = stage.id === progressStage;
              return (
                <div
                  key={stage.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--bg-surface-subtle)] border-[#1D2B64] dark:border-[#F9A826] shadow-xs"
                      : isDone
                      ? "bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] opacity-90"
                      : "bg-transparent border-[var(--border-subtle)] opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2E8B57] dark:text-[#86EFAC] shrink-0" />
                    ) : isActive ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#F9A826] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                    )}
                    <span
                      className={`truncate text-sm ${
                        isActive
                          ? "text-[var(--text-primary)] font-semibold"
                          : isDone
                          ? "text-[var(--text-primary)] font-medium"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold shrink-0 ${
                      isActive
                        ? "bg-[#FEF6E9] dark:bg-[#362810] text-[#B36B00] dark:text-[#F9A826]"
                        : isDone
                        ? "bg-[#EAF5EE] dark:bg-[#132E22] text-[#20653E] dark:text-[#86EFAC]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {isDone ? "Done" : isActive ? "Active" : "Waiting"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Error State with Real Error Message, Try Again, Back to Plan, Cancel */}
        {error && (
          <div className="w-full max-w-md space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-[#FDEEEC] dark:bg-[#2E1816] border border-[#F5C2BC] dark:border-[#5C2A25] text-left flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#A3173A] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#1A1033] dark:text-[#FCA5A5]">
                  Recipe formulation could not finish
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {error}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {onRetry && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onRetry}
                  className="w-full sm:w-auto min-h-[44px] px-6 cursor-pointer"
                >
                  Try again
                </Button>
              )}

              {onBackToPlan && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onBackToPlan}
                  icon={<ArrowLeft className="w-4 h-4" />}
                  className="w-full sm:w-auto min-h-[44px] px-6 cursor-pointer"
                >
                  Back to Plan
                </Button>
              )}

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[#A3173A] cursor-pointer flex items-center gap-1 py-2 px-3"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
