"use client";

import React from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  AnkaraPatternDefs,
  AnkaraTopRibbon,
} from "../components/AnkaraPattern";
import { useChopSnapState } from "../features/chopsnap/hooks/useChopSnapState";
import { Header } from "../features/chopsnap/components/Header";
import { ActiveScanBar } from "../features/chopsnap/components/ActiveScanBar";
import { Footer } from "../features/chopsnap/components/Footer";
import { OpenWeightModal } from "../features/chopsnap/components/OpenWeightModal";
import { WelcomeScreen } from "../features/chopsnap/screens/WelcomeScreen";
import { SnapScreen } from "../features/chopsnap/screens/SnapScreen";
import { ReviewScreen } from "../features/chopsnap/screens/ReviewScreen";
import { LoadingScreen } from "../features/chopsnap/screens/LoadingScreen";
import { ResultsScreen } from "../features/chopsnap/screens/ResultsScreen";

export default function Home() {
  const state = useChopSnapState();
  const prefersReduced = useReducedMotion();

  // 250ms slide and fade transition, disabled when prefers-reduced-motion is active
  const screenVariants = {
    initial: prefersReduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    exit: prefersReduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 },
  };

  const screenTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#1D2B64] selection:text-white overflow-x-hidden">
      {/* SVG Ankara Pattern Definitions */}
      <AnkaraPatternDefs />

      {/* Thin Ankara-inspired geometric band along top of the page */}
      <AnkaraTopRibbon />

      {/* 1. Global Navigation Bar */}
      <Header
        resetAll={state.resetAll}
        data={state.data}
        isBackendHealthy={state.isBackendHealthy}
        isDark={state.isDark}
        toggleTheme={state.toggleTheme}
        setShowOpenWeightModal={state.setShowOpenWeightModal}
      />

      {/* Sticky Compact Active Scan Bar */}
      <ActiveScanBar
        data={state.data}
        selectedFile={state.selectedFile}
        fileInputRef={state.fileInputRef}
        resetAll={state.resetAll}
      />

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {state.step === "welcome" && (
            <m.div
              key="welcome"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={screenTransition}
              className="w-full"
            >
              <WelcomeScreen
                onStart={() => state.goTo("snap")}
                onTryExample={() => state.handleLoadSample("market")}
              />
            </m.div>
          )}

          {state.step === "snap" && (
            <m.div
              key="snap"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={screenTransition}
              className="w-full"
            >
              <SnapScreen
                onBack={state.goBack}
                onContinue={state.handleSubmit}
                fileInputRef={state.fileInputRef}
                handleFileChange={state.handleFileChange}
                handleDrop={state.handleDrop}
                handleDragOver={state.handleDragOver}
                previewUrl={state.previewUrl}
                selectedFile={state.selectedFile}
                voiceSupported={state.voiceSupported}
                isListening={state.isListening}
                voiceLang={state.voiceLang}
                setVoiceLang={state.setVoiceLang}
                startVoiceRecognition={state.startVoiceRecognition}
                recordingSeconds={state.recordingSeconds}
                voiceTranscript={state.voiceTranscript}
                setVoiceTranscript={state.setVoiceTranscript}
                voiceInterpreting={state.voiceInterpreting}
                handleInterpretVoice={state.handleInterpretVoice}
                voiceAppliedChanges={state.voiceAppliedChanges}
                handleUndoVoice={state.handleUndoVoice}
                previousVoiceState={state.previousVoiceState}
                voiceMessage={state.voiceMessage}
                preAnalysisItems={state.preAnalysisItems}
                handleRemovePreAnalysisItem={state.handleRemovePreAnalysisItem}
                typedIngredient={state.typedIngredient}
                setTypedIngredient={state.setTypedIngredient}
                handleAddPreAnalysisItem={state.handleAddPreAnalysisItem}
                loading={state.loading}
                statusStep={state.statusStep}
                showPreferences={state.showPreferences}
                setShowPreferences={state.setShowPreferences}
                householdSize={state.householdSize}
                setHouseholdSize={state.setHouseholdSize}
                spiceLevel={state.spiceLevel}
                setSpiceLevel={state.setSpiceLevel}
                cookingFuel={state.cookingFuel}
                setCookingFuel={state.setCookingFuel}
                error={state.error}
              />
            </m.div>
          )}

          {state.step === "check" && (
            <m.div
              key="check"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={screenTransition}
              className="w-full"
            >
              <ReviewScreen
                onBack={state.goBack}
                isReviewStep={state.isReviewStep}
                data={state.data}
                loading={state.loading}
                reviewRef={state.reviewRef}
                selectedReviewItemIds={state.selectedReviewItemIds}
                reviewItems={state.reviewItems}
                looksClearItems={state.looksClearItems}
                handleToggleAllLooksClear={state.handleToggleAllLooksClear}
                handleToggleReviewItem={state.handleToggleReviewItem}
                handleRemoveReviewItem={state.handleRemoveReviewItem}
                pleaseCheckItems={state.pleaseCheckItems}
                handleChooseAlternative={state.handleChooseAlternative}
                reviewNewItemName={state.reviewNewItemName}
                setReviewNewItemName={state.setReviewNewItemName}
                reviewNewItemQty={state.reviewNewItemQty}
                setReviewNewItemQty={state.setReviewNewItemQty}
                handleAddReviewItem={state.handleAddReviewItem}
                resetAll={state.resetAll}
                handleConfirmAndCook={state.handleConfirmAndCook}
              />
            </m.div>
          )}

          {(state.step === "plan" || state.step === "cooking" || state.step === "results") && (
            <m.div
              key="results"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={screenTransition}
              className="w-full space-y-8"
            >
              {/* Loading Screen */}
              <LoadingScreen
                loading={state.loading}
                pipelinePhase={state.pipelinePhase}
                statusStep={state.statusStep}
                progressStage={state.progressStage}
              />

              {/* Results Screen */}
              <ResultsScreen
                data={state.data}
                loading={state.loading}
                selectedFile={state.selectedFile}
                previewUrl={state.previewUrl}
                fileInputRef={state.fileInputRef}
                selectedCity={state.selectedCity}
                setSelectedCity={state.setSelectedCity}
                activeTab={state.activeTab}
                setActiveTab={state.setActiveTab}
                tierFilter={state.tierFilter}
                setTierFilter={state.setTierFilter}
                handleUpdateRecipes={state.handleUpdateRecipes}
                updatingRecipes={state.updatingRecipes}
                quickRecipes={state.quickRecipes}
                properRecipes={state.properRecipes}
                displayedRecipes={state.displayedRecipes}
                completedSteps={state.completedSteps}
                toggleStep={state.toggleStep}
                copiedRecipeIndex={state.copiedRecipeIndex}
                handleCopyRecipe={state.handleCopyRecipe}
                ingredientValueNaira={state.ingredientValueNaira}
                hasSavingsData={state.hasSavingsData}
                somePricesUnavailable={state.somePricesUnavailable}
                showSavingsInfo={state.showSavingsInfo}
                setShowSavingsInfo={state.setShowSavingsInfo}
                usedUserIngredients={state.usedUserIngredients}
                notUsedUserIngredients={state.notUsedUserIngredients}
                totalUserIngredients={state.totalUserIngredients}
                ingredientsUsedPercent={state.ingredientsUsedPercent}
                newIngredientName={state.newIngredientName}
                setNewIngredientName={state.setNewIngredientName}
                newIngredientQty={state.newIngredientQty}
                setNewIngredientQty={state.setNewIngredientQty}
                handleAddIngredient={state.handleAddIngredient}
                handleRemoveIngredient={state.handleRemoveIngredient}
                checkedShoppingItems={state.checkedShoppingItems}
                toggleShoppingItem={state.toggleShoppingItem}
                copiedShoppingList={state.copiedShoppingList}
                handleCopyShoppingList={state.handleCopyShoppingList}
              />
            </m.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Open-Weight Dialog Modal */}
      <OpenWeightModal
        showOpenWeightModal={state.showOpenWeightModal}
        setShowOpenWeightModal={state.setShowOpenWeightModal}
        configuredRecipeModel={state.configuredRecipeModel}
      />
    </div>
  );
}
