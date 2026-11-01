"use client";

import React from "react";
import { ChefHat, Sparkles, CheckCircle2, RefreshCw, Circle } from "lucide-react";

export interface LoadingScreenProps {
  loading: boolean;
  pipelinePhase: "vision" | "recipes";
  statusStep: string;
  progressStage: number;
}

export function LoadingScreen({
  loading,
  pipelinePhase,
  statusStep,
  progressStage,
}: LoadingScreenProps) {
  if (!loading) return null;

  return (
    <div className="chop-card p-7 sm:p-10 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-md">
      <div className="w-16 h-16 rounded-2xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary-text)] mb-4 shadow-sm">
        <ChefHat className="w-8 h-8 animate-bounce text-[#1D2B64] dark:text-[#C8D1F5]" />
      </div>

      <div className="chop-pill chop-pill-primary mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
        <span>{pipelinePhase === "vision" ? "Scanning Kitchen Provisions" : "Crafting Authentic Recipes"}</span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-normal text-[var(--text-primary)] mb-2">
        {pipelinePhase === "vision" ? "Spotting Your Ingredients" : "Formulating Dishes for You"}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed font-sans px-2">
        {statusStep || "Processing..."}
      </p>

      <div className="flex flex-col gap-2.5 w-full max-w-sm text-sm text-left">
        {(pipelinePhase === "vision"
          ? [
              { id: 1, label: "Optimizing photo resolution (768px)" },
              { id: 2, label: "Scanning provisions with Vision Model" },
              { id: 3, label: "Classifying clarity & one-tap alternatives" },
            ]
          : [
              { id: 1, label: "Confirmed kitchen ingredients verified" },
              { id: 2, label: "Formulating authentic recipes (Classic first)" },
              { id: 3, label: "Calculating zero-waste pantry value locally" },
            ]
        ).map((stage) => {
          const isDone = stage.id < progressStage;
          const isActive = stage.id === progressStage;
          return (
            <div
              key={stage.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                isActive
                  ? "bg-[var(--bg-surface-subtle)] border-[var(--primary-border)] shadow-sm"
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
                  <Circle className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                )}
                <span
                  className={`truncate ${
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
                className={`chop-pill text-sm shrink-0 ${
                  isActive
                    ? "chop-pill-accent"
                    : isDone
                    ? "chop-pill-primary"
                    : ""
                }`}
              >
                {isDone ? "Done" : isActive ? "Active" : "Waiting"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
