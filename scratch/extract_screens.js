const fs = require('fs');
const path = require('path');

const pageContent = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');
const lines = pageContent.split(/\r?\n/);
const screenDir = path.join('frontend', 'src', 'features', 'chopsnap', 'screens');

// 1. HeroSection.tsx (lines 2218 to 2786)
const heroBody = lines.slice(2217, 2786).join('\n');
const heroContent = `"use client";

import React from "react";
import {
  Camera,
  Sparkles,
  Mic,
  Volume2,
  MicOff,
  RotateCcw,
  Undo2,
  AlertCircle,
  ChefHat,
  Plus,
  X,
  SlidersHorizontal,
  ChevronDown,
  Flame,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui";
import { HeroIllustration } from "@/components/HeroIllustration";
import { DetectedItem } from "../types";
import { NIGERIAN_SUGGESTIONS } from "../data/samples";

export interface HeroSectionProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  previewUrl: string | null;
  selectedFile: File | null;
  resetAll: () => void;
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
  fileInputRef,
  handleFileChange,
  handleDrop,
  handleDragOver,
  previewUrl,
  selectedFile,
  resetAll,
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
${heroBody}
  );
}
`;
fs.writeFileSync(path.join(screenDir, 'HeroSection.tsx'), heroContent, 'utf-8');
console.log('Wrote HeroSection.tsx');

// 2. ReviewScreen.tsx (lines 2944 to 3217)
const reviewInner = lines.slice(2944, 3216).join('\n');
const reviewContent = `"use client";

import React from "react";
import { Check, AlertCircle, Plus, Utensils, ChefHat, Sparkles } from "lucide-react";
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
${reviewInner}
  );
}
`;
fs.writeFileSync(path.join(screenDir, 'ReviewScreen.tsx'), reviewContent, 'utf-8');
console.log('Wrote ReviewScreen.tsx');

// 3. ResultsScreen.tsx (lines 3303 to 4198)
const resultsInner = lines.slice(3303, 4197).join('\n');
const resultsContent = `"use client";

import React from "react";
import {
  Sparkles,
  Utensils,
  ShoppingCart,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Copy,
  Flame,
  RotateCcw,
  Wallet,
  Info,
  Plus,
  X,
  Tag,
  AlertCircle,
  ChefHat,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui";
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
  resultsRef: React.RefObject<HTMLDivElement | null>;
  configuredRecipeModel: string;
  selectedCity: SupportedCity;
  setSelectedCity: (city: SupportedCity) => void;
  activeTab: "quick" | "proper" | "ingredients" | "shopping";
  setActiveTab: (tab: "quick" | "proper" | "ingredients" | "shopping") => void;
  tierFilter: "all" | "budget" | "comfortable";
  setTierFilter: (filter: "all" | "budget" | "comfortable") => void;
  showPreferences: boolean;
  setShowPreferences: React.Dispatch<React.SetStateAction<boolean>>;
  householdSize: number;
  setHouseholdSize: (size: number) => void;
  spiceLevel: "Mild" | "Authentic Hot" | "Suya Extra";
  setSpiceLevel: (lvl: "Mild" | "Authentic Hot" | "Suya Extra") => void;
  cookingFuel: "gas" | "charcoal" | "electric" | "kerosene";
  setCookingFuel: (fuel: "gas" | "charcoal" | "electric" | "kerosene") => void;
  handleUpdateRecipes: () => Promise<void>;
  updatingRecipes: boolean;
  quickRecipes: Recipe[];
  properRecipes: Recipe[];
  displayedRecipes: Recipe[];
  activeDisplayedRecipes: Recipe[];
  completedSteps: Record<string, number[]>;
  toggleStep: (recipeTitle: string, stepIndex: number) => void;
  copiedRecipeIndex: number | null;
  handleCopyRecipe: (recipe: Recipe, index: number) => void;
  ingredientValueNaira: number;
  pricedItemsCount: number;
  unpricedItemsCount: number;
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
  handleRemoveIngredient: (ingredientName: string) => void;
  checkedShoppingItems: Record<string, boolean>;
  toggleShoppingItem: (itemKey: string) => void;
  copiedShoppingList: boolean;
  handleCopyShoppingList: () => void;
}

export function ResultsScreen({
  data,
  loading,
  resultsRef,
  configuredRecipeModel,
  selectedCity,
  setSelectedCity,
  activeTab,
  setActiveTab,
  tierFilter,
  setTierFilter,
  showPreferences,
  setShowPreferences,
  householdSize,
  setHouseholdSize,
  spiceLevel,
  setSpiceLevel,
  cookingFuel,
  setCookingFuel,
  handleUpdateRecipes,
  updatingRecipes,
  quickRecipes,
  properRecipes,
  displayedRecipes,
  activeDisplayedRecipes,
  completedSteps,
  toggleStep,
  copiedRecipeIndex,
  handleCopyRecipe,
  ingredientValueNaira,
  pricedItemsCount,
  unpricedItemsCount,
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
${resultsInner}
  );
}
`;
fs.writeFileSync(path.join(screenDir, 'ResultsScreen.tsx'), resultsContent, 'utf-8');
console.log('Wrote ResultsScreen.tsx');
