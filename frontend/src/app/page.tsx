"use client";

import React from "react";
import {
  AnkaraPatternDefs,
  AnkaraTopRibbon,
  AnkaraSectionDivider,
} from "../components/AnkaraPattern";
import { useChopSnapState } from "../features/chopsnap/hooks/useChopSnapState";
import { Header } from "../features/chopsnap/components/Header";
import { ActiveScanBar } from "../features/chopsnap/components/ActiveScanBar";
import { Footer } from "../features/chopsnap/components/Footer";
import { OpenWeightModal } from "../features/chopsnap/components/OpenWeightModal";
import { HeroSection } from "../features/chopsnap/screens/HeroSection";
import { HowItWorksSection } from "../features/chopsnap/screens/HowItWorksSection";
import { TryExampleSection } from "../features/chopsnap/screens/TryExampleSection";
import { ReviewScreen } from "../features/chopsnap/screens/ReviewScreen";
import { LoadingScreen } from "../features/chopsnap/screens/LoadingScreen";
import { ResultsScreen } from "../features/chopsnap/screens/ResultsScreen";

export default function Home() {
  const state = useChopSnapState();

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
      <main className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 space-y-10 sm:space-y-16">
        {/* SECTION 1: HERO */}
        <HeroSection
          data={state.data}
          statusStep={state.statusStep}
          setPreAnalysisItems={state.setPreAnalysisItems}
          previousVoiceState={state.previousVoiceState}
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
          voiceMessage={state.voiceMessage}
          preAnalysisItems={state.preAnalysisItems}
          handleRemovePreAnalysisItem={state.handleRemovePreAnalysisItem}
          typedIngredient={state.typedIngredient}
          setTypedIngredient={state.setTypedIngredient}
          handleAddPreAnalysisItem={state.handleAddPreAnalysisItem}
          canSubmit={state.canSubmit}
          loading={state.loading}
          handleSubmit={state.handleSubmit}
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

        {/* Ankara Geometric Pattern Section Divider */}
        <AnkaraSectionDivider />

        {/* SECTION 2: HOW IT WORKS */}
        <HowItWorksSection />

        {/* Ankara Geometric Pattern Section Divider */}
        <AnkaraSectionDivider />

        {/* SECTION 3: TRY AN EXAMPLE */}
        <TryExampleSection handleLoadSample={state.handleLoadSample} />

        {/* SECTION 4: RESULTS & DETECTED INGREDIENTS PANEL */}
        <div id="results-section" ref={state.resultsRef} className="pt-2">
          {/* Review Screen */}
          <ReviewScreen
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
        </div>
      </main>

      {/* 4. Polished Footer */}
      <Footer
        data={state.data}
        configuredRecipeModel={state.configuredRecipeModel}
      />

      {/* 5. "Why Open-Weight?" Modal Dialog */}
      <OpenWeightModal
        showOpenWeightModal={state.showOpenWeightModal}
        setShowOpenWeightModal={state.setShowOpenWeightModal}
      />
    </div>
  );
}
