const fs = require('fs');
const path = require('path');

const pageContent = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');
const lines = pageContent.split(/\r?\n/);

const hookBody = lines.slice(906, 2077).join('\n');

const hookFileContent = `"use client";

import { useState, useRef, useEffect } from "react";
import cityPricesData from "@/data/prices.json";
import {
  isIngredientUsedInRecipes,
  getIngredientPrice,
} from "@/utils/matching";
import {
  SupportedCity,
  DetectedItem,
  Recipe,
  ShoppingItem,
  ProcessResponse,
  VoiceInterpretation,
  PreviousVoiceState,
} from "../types";
import { CLIENT_DEMO_DATA } from "../data/samples";

export function useChopSnapState() {
${hookBody}

  return {
    // State
    selectedFile,
    setSelectedFile,
    previewUrl,
    setPreviewUrl,
    loading,
    setLoading,
    updatingRecipes,
    setUpdatingRecipes,
    statusStep,
    setStatusStep,
    error,
    setError,
    data,
    setData,
    preAnalysisItems,
    setPreAnalysisItems,
    typedIngredient,
    setTypedIngredient,
    newIngredientName,
    setNewIngredientName,
    newIngredientQty,
    setNewIngredientQty,
    activeTab,
    setActiveTab,
    tierFilter,
    setTierFilter,
    spiceLevel,
    setSpiceLevel,
    cookingFuel,
    setCookingFuel,
    householdSize,
    setHouseholdSize,
    showPreferences,
    setShowPreferences,
    showOpenWeightModal,
    setShowOpenWeightModal,
    selectedCity,
    setSelectedCity,
    showSavingsInfo,
    setShowSavingsInfo,
    isReviewStep,
    setIsReviewStep,
    reviewItems,
    setReviewItems,
    selectedReviewItemIds,
    setSelectedReviewItemIds,
    reviewNewItemName,
    setReviewNewItemName,
    reviewNewItemQty,
    setReviewNewItemQty,
    isDemoReview,
    setIsDemoReview,
    pipelinePhase,
    setPipelinePhase,
    progressStage,
    setProgressStage,
    isBackendHealthy,
    setIsBackendHealthy,
    configuredRecipeModel,
    setConfiguredRecipeModel,
    voiceSupported,
    setVoiceSupported,
    isListening,
    setIsListening,
    voiceLang,
    setVoiceLang,
    voiceTranscript,
    setVoiceTranscript,
    voiceInterpreting,
    setVoiceInterpreting,
    voiceMessage,
    setVoiceMessage,
    voiceAppliedChanges,
    setVoiceAppliedChanges,
    previousVoiceState,
    setPreviousVoiceState,
    recordingSeconds,
    setRecordingSeconds,
    isDark,
    setIsDark,
    completedSteps,
    setCompletedSteps,
    checkedShoppingItems,
    setCheckedShoppingItems,
    copiedRecipeIndex,
    setCopiedRecipeIndex,
    copiedShoppingList,
    setCopiedShoppingList,

    // Refs
    fileInputRef,
    resultsRef,
    reviewRef,
    recognitionRef,
    recordingTimerRef,

    // Handlers
    toggleTheme,
    scrollToReview,
    scrollToResults,
    stopVoiceRecognition,
    startVoiceRecognition,
    handleInterpretVoice,
    handleUndoVoice,
    handleFileChange,
    handleDrop,
    handleDragOver,
    initReviewItems,
    handleChooseAlternative,
    handleToggleReviewItem,
    handleRemoveReviewItem,
    handleAddReviewItem,
    handleToggleAllLooksClear,
    handleConfirmAndCook,
    triggerDemo,
    handleLoadSample,
    handleAddPreAnalysisItem,
    handleRemovePreAnalysisItem,
    handleSubmit,
    handleRemoveIngredient,
    handleAddIngredient,
    handleUpdateRecipes,
    toggleStep,
    toggleShoppingItem,
    handleCopyRecipe,
    handleCopyShoppingList,
    resetAll,

    // Derived values
    looksClearItems,
    pleaseCheckItems,
    NIGERIAN_SUGGESTIONS,
    canSubmit,
    quickRecipes,
    properRecipes,
    displayedRecipes,
    activeDisplayedRecipes,
    userIngredientsList,
    totalUserIngredients,
    usedUserIngredients,
    notUsedUserIngredients,
    ingredientsUsedPercent,
    ingredientValueNaira,
    pricedItemsCount,
    unpricedItemsCount,
    hasSavingsData,
    somePricesUnavailable,
  };
}

export type ChopSnapState = ReturnType<typeof useChopSnapState>;
`;

const outDir = path.join('frontend', 'src', 'features', 'chopsnap', 'hooks');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'useChopSnapState.ts'), hookFileContent, 'utf-8');
console.log('Successfully wrote hooks/useChopSnapState.ts');
