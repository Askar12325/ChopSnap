"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import cityPricesData from "@/data/prices.json";
import {
  isIngredientUsedInRecipes,
  getIngredientPrice,
} from "@/utils/matching";
import {
  FlowStep,
  SupportedCity,
  DetectedItem,
  Recipe,
  ProcessResponse,
  VoiceInterpretation,
  PreviousVoiceState,
} from "../types";
import { CLIENT_DEMO_DATA } from "../data/samples";

export function useChopSnapState() {
  // =========================================================================
  // Guided Step Flow State (#snap, #check, #plan, #cooking, #results)
  // =========================================================================
  const [step, setStep] = useState<FlowStep>("welcome");

  const goTo = useCallback((newStep: FlowStep) => {
    setStep(newStep);
    if (typeof window !== "undefined") {
      const targetHash = newStep === "welcome" ? "" : `#${newStep}`;
      if (window.location.hash !== targetHash) {
        if (!targetHash) {
          if (window.location.hash) {
            history.pushState(null, "", window.location.pathname + window.location.search);
          }
        } else {
          window.location.hash = targetHash;
        }
      }
    }
  }, []);

  const goNext = useCallback(() => {
    setStep((currentStep) => {
      let nextStep: FlowStep = currentStep;
      if (currentStep === "welcome") nextStep = "snap";
      else if (currentStep === "snap") nextStep = "check";
      else if (currentStep === "check") nextStep = "plan";
      else if (currentStep === "plan") nextStep = "cooking";
      else if (currentStep === "cooking") nextStep = "results";

      if (typeof window !== "undefined") {
        const targetHash = nextStep === "welcome" ? "" : `#${nextStep}`;
        if (window.location.hash !== targetHash) {
          if (!targetHash) {
            history.pushState(null, "", window.location.pathname + window.location.search);
          } else {
            window.location.hash = targetHash;
          }
        }
      }
      return nextStep;
    });
  }, []);

  const goBack = useCallback(() => {
    setStep((currentStep) => {
      let prevStep: FlowStep = currentStep;
      if (currentStep === "results") prevStep = "cooking";
      else if (currentStep === "cooking") prevStep = "plan";
      else if (currentStep === "plan") prevStep = "check";
      else if (currentStep === "check") prevStep = "snap";
      else if (currentStep === "snap") prevStep = "welcome";

      if (typeof window !== "undefined") {
        const targetHash = prevStep === "welcome" ? "" : `#${prevStep}`;
        if (window.location.hash !== targetHash) {
          if (!targetHash) {
            history.pushState(null, "", window.location.pathname + window.location.search);
          } else {
            window.location.hash = targetHash;
          }
        }
      }
      return prevStep;
    });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace("#", "").toLowerCase() as FlowStep;
      if (["snap", "check", "plan", "cooking", "results"].includes(rawHash)) {
        setStep(rawHash);
      } else {
        setStep("welcome");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingRecipes, setUpdatingRecipes] = useState(false);
  const [statusStep, setStatusStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProcessResponse | null>(null);

  // Manual ingredient items before photo/analysis (Source: typed, suggested chips, or voice)
  const [preAnalysisItems, setPreAnalysisItems] = useState<DetectedItem[]>([]);
  const [typedIngredient, setTypedIngredient] = useState<string>("");

  // New ingredient input states for Feature B
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientQty, setNewIngredientQty] = useState("");

  // Active view tab: quick meals, proper cooking, ingredients, shopping
  const [activeTab, setActiveTab] = useState<"quick" | "proper" | "ingredients" | "shopping">("quick");
  // Financial tier filter: all, budget, comfortable
  const [tierFilter, setTierFilter] = useState<"all" | "budget" | "comfortable">("all");

  // User culinary adjustments
  const [spiceLevel, setSpiceLevel] = useState<"Mild" | "Authentic Hot" | "Suya Extra">("Mild");
  const [cookingFuel, setCookingFuel] = useState<"gas" | "charcoal" | "electric" | "kerosene">("gas");
  const [householdSize, setHouseholdSize] = useState<number>(2);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showOpenWeightModal, setShowOpenWeightModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<SupportedCity>("Lagos");
  const [showSavingsInfo, setShowSavingsInfo] = useState<boolean>(false);

  // Ingredient Review & Confirmation State
  const [isReviewStep, setIsReviewStep] = useState<boolean>(false);
  const [reviewItems, setReviewItems] = useState<DetectedItem[]>([]);
  const [selectedReviewItemIds, setSelectedReviewItemIds] = useState<Set<string>>(new Set());
  const [reviewNewItemName, setReviewNewItemName] = useState<string>("");
  const [reviewNewItemQty, setReviewNewItemQty] = useState<string>("");
  const [isDemoReview, setIsDemoReview] = useState<boolean>(false);

  // Real Progress Stages (Vision vs Recipe Pipeline)
  const [pipelinePhase, setPipelinePhase] = useState<"vision" | "recipes">("vision");
  const [progressStage, setProgressStage] = useState<number>(1);

  // Real Backend Health Check (/api/health) & Configured Model
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [configuredRecipeModel, setConfiguredRecipeModel] = useState<string>("Muse Spark Open");

  useEffect(() => {
    let isMounted = true;
    const checkBackendHealth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/health`, { method: "GET", cache: "no-store" });
        if (isMounted) {
          setIsBackendHealthy(res.ok);
          if (res.ok) {
            const healthData = await res.json();
            const rawModel =
              healthData?.configured_models?.recipe_reasoning?.model ||
              healthData?.configured_models?.recipe_reasoning?.architecture;
            if (rawModel) {
              const cleaned = rawModel.replace(/meta\/|:.*|\b30b\b/gi, "").replace(/-/g, " ").trim();
              setConfiguredRecipeModel(cleaned.toLowerCase().includes("muse") ? "Muse Spark Open" : (cleaned || "Muse Spark Open"));
            }
          }
        }
      } catch {
        if (isMounted) {
          setIsBackendHealthy(false);
        }
      }
    };
    checkBackendHealth();
    const timer = setInterval(checkBackendHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // =========================================================================
  // Snap + Speak Voice Intelligence State
  // =========================================================================
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceLang, setVoiceLang] = useState<string>("en-NG");
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");
  const [voiceInterpreting, setVoiceInterpreting] = useState<boolean>(false);
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const [voiceAppliedChanges, setVoiceAppliedChanges] = useState<string | null>(null);
  const [previousVoiceState, setPreviousVoiceState] = useState<PreviousVoiceState | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Theme state: defaults to light (#FFF8EF)
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);

      // Check SpeechRecognition / webkitSpeechRecognition support
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setVoiceSupported(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("chopsnap_theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("chopsnap_theme", "light");
      } catch {}
    }
  };

  // Interactive checklists
  const [completedSteps, setCompletedSteps] = useState<Record<number, Set<number>>>({});
  const [checkedShoppingItems, setCheckedShoppingItems] = useState<Set<number>>(new Set());

  // Copy toast states
  const [copiedRecipeIndex, setCopiedRecipeIndex] = useState<number | null>(null);
  const [copiedShoppingList, setCopiedShoppingList] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);

  const scrollToReview = () => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        const elem = document.getElementById("review-section") || reviewRef.current;
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  const scrollToResults = () => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        const elem = document.getElementById("results-section") || resultsRef.current;
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  // =========================================================================
  // Snap + Speak Voice Intelligence Handlers
  // =========================================================================
  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsListening(false);
    setRecordingSeconds(0);
  };

  const startVoiceRecognition = () => {
    if (isListening) {
      stopVoiceRecognition();
      return;
    }

    setVoiceMessage(null);
    setVoiceAppliedChanges(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      setVoiceMessage("Speech recognition is not supported in this browser. Please type your instructions below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLang;
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      let finalSoFar = voiceTranscript ? voiceTranscript + " " : "";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalSoFar += event.results[i][0].transcript + " ";
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const full = (finalSoFar + interim).trim();
        setVoiceTranscript(full);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        stopVoiceRecognition();
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setVoiceMessage("Microphone permission was denied. Please allow microphone access in your browser or type below.");
        } else if (event.error === "no-speech") {
          setVoiceMessage("No speech was detected. Please tap the mic and speak clearly.");
        } else if (event.error === "network") {
          setVoiceMessage("Network error during speech recognition. Check your connection or type below.");
        } else {
          setVoiceMessage(`Voice recognition error: ${event.error}. You can edit or type instructions directly.`);
        }
      };

      recognition.onend = () => {
        stopVoiceRecognition();
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      setRecordingSeconds(0);

      // Enforce 30-second maximum
      const startTime = Date.now();
      recordingTimerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingSeconds(elapsed);
        if (elapsed >= 30) {
          stopVoiceRecognition();
        }
      }, 500);

    } catch (e: unknown) {
      stopVoiceRecognition();
      setVoiceMessage(`Could not initialize microphone: ${e instanceof Error ? e.message : "Permission issue"}. Type below.`);
    }
  };

  const handleInterpretVoice = async () => {
    if (!voiceTranscript.trim()) {
      setVoiceMessage("Please say or type what you would like to cook, portions, or dietary needs first.");
      return;
    }

    setVoiceInterpreting(true);
    setVoiceMessage(null);

    // Save previous state to allow 1-click Undo
    setPreviousVoiceState({
      householdSize,
      spiceLevel,
      cookingFuel,
      tierFilter,
      detectedItems: data?.detected_items ? [...data.detected_items] : [],
      preAnalysisItems: [...preAnalysisItems],
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/voice/interpret`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: voiceTranscript.trim(),
          language: voiceLang,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const interp: VoiceInterpretation = await res.json();
      const changeSummaries: string[] = [];

      // 1. Budget
      if (interp.budget_naira) {
        if (interp.budget_naira <= 1500) {
          setTierFilter("budget");
          changeSummaries.push(`Budget ₦${interp.budget_naira.toLocaleString()} (Everyday Budget)`);
        } else {
          setTierFilter("comfortable");
          changeSummaries.push(`Budget ₦${interp.budget_naira.toLocaleString()} (Comfortable)`);
        }
      }

      // 2. Servings
      if (interp.servings && interp.servings >= 1 && interp.servings <= 6) {
        setHouseholdSize(interp.servings);
        changeSummaries.push(`${interp.servings} ${interp.servings === 1 ? "person" : "people"}`);
      }

      // 3. Dietary
      if (interp.dietary && interp.dietary.length > 0) {
        changeSummaries.push(interp.dietary.join(", "));
      }

      // 4. Spice Level
      if (interp.spice_level) {
        setSpiceLevel(interp.spice_level);
        changeSummaries.push(`${interp.spice_level} spice`);
      }

      // 5. Fuel
      if (interp.cooking_fuel) {
        setCookingFuel(interp.cooking_fuel);
        changeSummaries.push(`${interp.cooking_fuel} stove`);
      }

      // 6. Ingredients additions/removals
      if (data) {
        let currentItems = [...data.detected_items];

        if (interp.remove_ingredients && interp.remove_ingredients.length > 0) {
          const toRemove = interp.remove_ingredients.map((r) => r.toLowerCase());
          currentItems = currentItems.filter(
            (item) => !toRemove.some((rem) => item.name.toLowerCase().includes(rem) || rem.includes(item.name.toLowerCase()))
          );
          changeSummaries.push(`Excluded: ${interp.remove_ingredients.join(", ")}`);
        }

        if (interp.add_ingredients && interp.add_ingredients.length > 0) {
          for (const addName of interp.add_ingredients) {
            if (!currentItems.some((ci) => ci.name.toLowerCase() === addName.toLowerCase())) {
              currentItems.push({
                name: addName.trim(),
                category: "Produce",
                confidence: 1.0,
                estimated_quantity: "Added via voice",
              });
            }
          }
          changeSummaries.push(`Added: ${interp.add_ingredients.join(", ")}`);
        }

        setData({
          ...data,
          detected_items: currentItems,
        });
      } else {
        // No photo uploaded yet: apply added/removed ingredients directly to preAnalysisItems
        let currentPre = [...preAnalysisItems];
        if (interp.remove_ingredients && interp.remove_ingredients.length > 0) {
          const toRemove = interp.remove_ingredients.map((r) => r.toLowerCase());
          currentPre = currentPre.filter(
            (item) => !toRemove.some((rem) => item.name.toLowerCase().includes(rem) || rem.includes(item.name.toLowerCase()))
          );
          changeSummaries.push(`Excluded: ${interp.remove_ingredients.join(", ")}`);
        }

        if (interp.add_ingredients && interp.add_ingredients.length > 0) {
          for (const addName of interp.add_ingredients) {
            if (!currentPre.some((ci) => ci.name.toLowerCase() === addName.toLowerCase())) {
              currentPre.push({
                name: addName.trim(),
                category: "Produce",
                confidence: 1.0,
                estimated_quantity: "Added via voice",
              });
            }
          }
          changeSummaries.push(`Added: ${interp.add_ingredients.join(", ")}`);
        }
        setPreAnalysisItems(currentPre);
      }

      // Handle unclear interpretation: ask user to clarify rather than guessing
      if (interp.confidence === "unclear" && changeSummaries.length === 0) {
        setVoiceMessage("We could not clearly understand your instructions. Please edit or rephrase them in the text box.");
        setVoiceAppliedChanges(null);
        return;
      }

      if (changeSummaries.length > 0) {
        let summaryText = changeSummaries.join(" • ");
        if (interp.source === "fallback") {
          summaryText = `Basic understanding used • ${summaryText}`;
        }
        setVoiceAppliedChanges(summaryText);
      } else {
        setVoiceAppliedChanges(
          interp.source === "fallback"
            ? "Basic understanding used • Preferences ready to cook."
            : "Preferences understood, ready to cook."
        );
      }
    } catch {
      setVoiceMessage("Could not connect to the voice interpreter. You can still set preferences and ingredients manually.");
    } finally {
      setVoiceInterpreting(false);
    }
  };

  const handleUndoVoice = () => {
    if (!previousVoiceState) return;
    setHouseholdSize(previousVoiceState.householdSize);
    setSpiceLevel(previousVoiceState.spiceLevel);
    setCookingFuel(previousVoiceState.cookingFuel);
    setTierFilter(previousVoiceState.tierFilter);

    if (data && previousVoiceState.detectedItems) {
      setData({
        ...data,
        detected_items: previousVoiceState.detectedItems,
      });
    }

    if (previousVoiceState.preAnalysisItems) {
      setPreAnalysisItems(previousVoiceState.preAnalysisItems);
    }

    setPreviousVoiceState(null);
    setVoiceAppliedChanges(null);
    setVoiceMessage("Voice changes undone.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // =========================================================================
  // Ingredient Review & Confirmation Handlers (Step 2 before cooking)
  // =========================================================================
  const initReviewItems = (items: DetectedItem[], isDemo: boolean = false) => {
    const itemsWithIds: (DetectedItem & { id: string })[] = items.map((it, idx) => ({
      ...it,
      id: it.id || `item-${Date.now()}-${idx}-${it.name.replace(/[^a-zA-Z0-9]/g, "_")}`,
    }));

    setReviewItems(itemsWithIds);
    setIsDemoReview(isDemo);

    // Grouping rule:
    // "Looks clear": certainty === "clear" || (!certainty && (!alternatives || alternatives.length === 0))
    // "Please check": certainty === "unsure" || (alternatives && alternatives.length > 0)
    // Preselect ONLY "Looks clear" items! Unsure items are NOT preselected!
    const initialSelected = new Set<string>();
    itemsWithIds.forEach((it) => {
      const isUnsure = it.certainty === "unsure" || (it.alternatives && it.alternatives.length > 0);
      if (!isUnsure) {
        initialSelected.add(it.id);
      }
    });

    setSelectedReviewItemIds(initialSelected);
    setIsReviewStep(true);
    setData(null);
    goTo("check");
    scrollToReview();
  };

  const handleChooseAlternative = (itemId: string, alternativeName: string) => {
    setReviewItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          return {
            ...it,
            name: alternativeName,
            certainty: "clear",
            alternatives: [],
          };
        }
        return it;
      })
    );
    setSelectedReviewItemIds((prev) => {
      const next = new Set(prev);
      next.add(itemId);
      return next;
    });
  };

  const handleToggleReviewItem = (itemId: string) => {
    setSelectedReviewItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleRemoveReviewItem = (itemId: string) => {
    setReviewItems((prev) => prev.filter((it) => it.id !== itemId));
    setSelectedReviewItemIds((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleAddReviewItem = () => {
    if (!reviewNewItemName.trim()) return;
    const newItem: DetectedItem & { id: string } = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: reviewNewItemName.trim(),
      category: "Pantry",
      certainty: "clear",
      alternatives: [],
      form: "raw",
      container_state: "full",
      estimated_quantity: reviewNewItemQty.trim() || undefined,
    };
    setReviewItems((prev) => [...prev, newItem]);
    setSelectedReviewItemIds((prev) => {
      const next = new Set(prev);
      next.add(newItem.id);
      return next;
    });
    setReviewNewItemName("");
    setReviewNewItemQty("");
  };

  const handleToggleAllLooksClear = (clearItemIds: string[]) => {
    setSelectedReviewItemIds((prev) => {
      const next = new Set(prev);
      const allSelected = clearItemIds.every((id) => next.has(id));
      if (allSelected) {
        clearItemIds.forEach((id) => next.delete(id));
      } else {
        clearItemIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleConfirmAndCook = async () => {
    const selectedItems = reviewItems.filter((it) => selectedReviewItemIds.has(it.id!));
    if (selectedItems.length === 0) {
      setError("Please select at least one ingredient to cook with.");
      return;
    }

    setLoading(true);
    setError(null);
    setPipelinePhase("recipes");
    setProgressStage(1);
    setStatusStep("Confirmed ingredients verified…");

    const tStage2 = setTimeout(() => {
      setProgressStage(2);
      setStatusStep("Muse Spark Open formulating authentic recipes…");
    }, 400);

    const tStage3 = setTimeout(() => {
      setProgressStage(3);
      setStatusStep("Calculating zero-waste pantry value locally…");
    }, 3800);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/recipes/update?count=3`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detected_items: selectedItems,
          sample_type: null,
          is_demo: isDemoReview,
          spice_level: spiceLevel,
          cooking_fuel: cookingFuel,
        }),
      });

      clearTimeout(tStage2);
      clearTimeout(tStage3);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with HTTP ${res.status}`);
      }

      const result: ProcessResponse = await res.json();
      result.detected_items = selectedItems;
      setData(result);
      setIsReviewStep(false);
      setActiveTab("quick");
      setCompletedSteps({});
      setCheckedShoppingItems(new Set());
      goTo("plan");
      scrollToResults();

      // Non-blocking background fetch for 2 additional variation recipes
      fetch(`${apiUrl}/api/recipes/expand?count=2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detected_items: selectedItems,
          sample_type: null,
          is_demo: isDemoReview,
          spice_level: spiceLevel,
          cooking_fuel: cookingFuel,
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((expandData: ProcessResponse | null) => {
          if (expandData?.recipes?.length) {
            setData((prev) => {
              if (!prev) return prev;
              const existingTitles = new Set(prev.recipes.map((r) => r.title.toLowerCase()));
              const uniqueNew = expandData.recipes.filter(
                (r) => !existingTitles.has(r.title.toLowerCase())
              );
              if (uniqueNew.length > 0) {
                return {
                  ...prev,
                  recipes: [...prev.recipes, ...uniqueNew],
                };
              }
              return prev;
            });
          }
        })
        .catch(() => {});
    } catch (err: unknown) {
      clearTimeout(tStage2);
      clearTimeout(tStage3);
      const message = err instanceof Error ? err.message : "Failed to generate recipes.";
      setError(message);
    } finally {
      setLoading(false);
      setStatusStep("");
    }
  };

  // Instant Demo Trigger (Fetches detected items for review first)
  const triggerDemo = async (sampleType: "market" | "pantry" | "native" = "market") => {
    setLoading(true);
    setError(null);
    setStatusStep(`Scanning ${sampleType === "market" ? "Lagos Market" : sampleType === "pantry" ? "Pantry & Beans" : "Native Greens"} provisions...`);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/demo/${sampleType}?detect_only=true&spice_level=${encodeURIComponent(spiceLevel)}&cooking_fuel=${encodeURIComponent(cookingFuel)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const result: ProcessResponse = await res.json();
        initReviewItems(result.detected_items, true);
        return;
      }
      throw new Error(`Server returned ${res.status}`);
    } catch {
      const fallbackResult = CLIENT_DEMO_DATA[sampleType] || CLIENT_DEMO_DATA.market;
      initReviewItems(fallbackResult.detected_items, true);
    } finally {
      setLoading(false);
      setStatusStep("");
    }
  };

  // Sample photo generator with warm culinary slate
  const handleLoadSample = (sampleType: "market" | "pantry" | "native" = "market") => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgGrad = ctx.createLinearGradient(0, 0, 900, 600);
    bgGrad.addColorStop(0, "#2B1B12");
    bgGrad.addColorStop(0.5, "#1D2B64");
    bgGrad.addColorStop(1, "#181513");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 900, 600);

    const glow = ctx.createRadialGradient(450, 60, 20, 450, 250, 480);
    glow.addColorStop(0, "rgba(255, 248, 239, 0.28)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 900, 600);

    const drawShelf = (y: number) => {
      ctx.fillStyle = "rgba(255, 248, 239, 0.14)";
      ctx.fillRect(40, y, 820, 10);
      ctx.fillStyle = "rgba(232, 89, 12, 0.4)";
      ctx.fillRect(40, y + 8, 820, 3);
    };
    drawShelf(190);
    drawShelf(370);

    ctx.textAlign = "center";
    ctx.font = "bold 24px Georgia, serif";
    ctx.fillStyle = "#FFF8EF";

    let title = "Lagos Market Ingredients (Fridge & Counter)";
    let line1 = "Plum Tomatoes (5)  •  Ata Rodo (4)  •  Tatashe (2)  •  Red Onions (2)";
    let line2 = "Fresh Eggs (6 Pack)  •  Smoked Titus Mackerel  •  Pure Vegetable Oil";
    let line3 = "Ripe Sweet Plantains (3)  •  Cooked White Rice  •  Fresh Ugwu Leaves";

    if (sampleType === "pantry") {
      title = "Pantry Shelf & Counter Basket Ingredients";
      line1 = "Cooked Honey Beans (Oloyin)  •  Plum Tomatoes (4)  •  Tatashe (2)";
      line2 = "Fresh Eggs (4 Pack)  •  Smoked Fish Flakes  •  Pure Vegetable Oil";
      line3 = "Ripe Sweet Plantains (2)  •  Fresh Scent Leaves  •  Red Onions (3)  •  Ata Rodo";
    } else if (sampleType === "native") {
      title = "Native Greens & Pantry Stockfish Spread";
      line1 = "Fresh Ugwu Leaves (Pumpkin)  •  Smoked Catfish  •  Ata Rodo (5)";
      line2 = "Stockfish Bits (Okporoko)  •  Pure Red Palm Oil  •  Red Onions (2)";
      line3 = "Ripe Plantains (2)  •  Leftover White Rice  •  Fresh Eggs (3)  •  Ginger & Garlic";
    }

    ctx.fillText(title, 450, 75);
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "#FAF3EA";
    ctx.fillText("KITCHEN INGREDIENTS SCAN • READY FOR NIGERIAN RECIPES", 450, 105);

    const drawSection = (y: number, text: string) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.beginPath();
      ctx.roundRect(70, y, 760, 52, 10);
      ctx.fill();
      ctx.fillStyle = "#FFF8EF";
      ctx.font = "500 16px system-ui, sans-serif";
      ctx.fillText(text, 450, y + 33);
    };

    drawSection(130, line1);
    drawSection(310, line2);
    drawSection(490, line3);

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleFile = new File([blob], `provisions_${sampleType}.jpg`, { type: "image/jpeg" });
        setSelectedFile(sampleFile);
        setPreviewUrl(canvas.toDataURL("image/jpeg"));
        setError(null);
      }
    }, "image/jpeg");

    triggerDemo(sampleType);
  };

  // Handlers for manual ingredients before photo upload or when editing
  const handleAddPreAnalysisItem = (nameToAdd?: string) => {
    const targetName = (nameToAdd || typedIngredient).trim();
    if (!targetName) return;

    let category = "Produce";
    const lower = targetName.toLowerCase();
    if (lower.includes("fish") || lower.includes("meat") || lower.includes("egg") || lower.includes("chicken") || lower.includes("bean") || lower.includes("catfish") || lower.includes("stockfish")) {
      category = "Protein";
    } else if (lower.includes("oil") || lower.includes("rice") || lower.includes("crayfish") || lower.includes("salt") || lower.includes("flour") || lower.includes("iru")) {
      category = "Pantry";
    }

    const newItem: DetectedItem = {
      name: targetName,
      category,
      confidence: 1.0,
      estimated_quantity: "Added manually",
    };

    if (data) {
      if (!data.detected_items.some((item) => item.name.toLowerCase() === targetName.toLowerCase())) {
        setData({
          ...data,
          detected_items: [...data.detected_items, newItem],
        });
      }
    } else {
      if (!preAnalysisItems.some((item) => item.name.toLowerCase() === targetName.toLowerCase())) {
        setPreAnalysisItems([...preAnalysisItems, newItem]);
      }
    }

    setTypedIngredient("");
    setError(null);
  };

  const handleRemovePreAnalysisItem = (indexToRemove: number) => {
    setPreAnalysisItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    // Check if we have items from ANY source
    const effectiveItems = selectedFile ? [] : (data?.detected_items || preAnalysisItems);

    if (!selectedFile && effectiveItems.length === 0) {
      setError("Please add a photo or tell us your ingredients to get started.");
      return;
    }

    setLoading(true);
    setError(null);

    // If demo sample selected
    if (selectedFile?.name.startsWith("provisions_")) {
      const type = selectedFile.name.includes("pantry")
        ? "pantry"
        : selectedFile.name.includes("native")
        ? "native"
        : "market";
      triggerDemo(type);
      return;
    }

    // Source A: Real Photo Upload - Detect ingredients first for confirmation
    if (selectedFile) {
      setPipelinePhase("vision");
      setProgressStage(1);
      setStatusStep("Optimizing photo resolution (768px)…");
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const timer1 = setTimeout(() => {
          setProgressStage(2);
          setStatusStep("Scanning provisions with Vision Model…");
        }, 600);

        const timer2 = setTimeout(() => {
          setProgressStage(3);
          setStatusStep("Classifying clarity & one-tap alternatives…");
        }, 3500);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(
          `${apiUrl}/api/process?detect_only=true&spice_level=${encodeURIComponent(spiceLevel)}&cooking_fuel=${encodeURIComponent(cookingFuel)}`,
          {
            method: "POST",
            body: formData,
          }
        );

        clearTimeout(timer1);
        clearTimeout(timer2);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Server responded with HTTP ${res.status}`);
        }

        const result: ProcessResponse = await res.json();
        // If user already typed extra items before upload, merge them
        const merged = [...result.detected_items];
        if (preAnalysisItems.length > 0) {
          for (const extra of preAnalysisItems) {
            if (!merged.some((m) => m.name.toLowerCase() === extra.name.toLowerCase())) {
              merged.push(extra);
            }
          }
        }

        initReviewItems(merged, result.is_demo || false);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected network error occurred.";
        setError(
          message.includes("Failed to fetch")
            ? "FastAPI server unreachable at http://localhost:8000. Start backend with: uvicorn app.main:app --reload --port 8000"
            : message
        );
      } finally {
        setLoading(false);
        setStatusStep("");
      }
      return;
    }

    // Source B & C: Ingredients from chips or voice without photo
    initReviewItems(effectiveItems, false);
    setLoading(false);
    return;
  };

  // =============================================================================
  // Feature B: Remove ingredient chip, add ingredient, and regenerate recipes
  // =============================================================================
  const handleRemoveIngredient = (indexToRemove: number) => {
    if (!data) return;
    const updatedItems = data.detected_items.filter((_, idx) => idx !== indexToRemove);
    setData({
      ...data,
      detected_items: updatedItems,
    });
  };

  const handleAddIngredient = () => {
    if (!data || !newIngredientName.trim()) return;
    const cleanName = newIngredientName.trim();
    const cleanQty = newIngredientQty.trim() || undefined;

    // Guess category from name
    let category = "Produce";
    const lower = cleanName.toLowerCase();
    if (lower.includes("fish") || lower.includes("meat") || lower.includes("egg") || lower.includes("chicken") || lower.includes("bean") || lower.includes("catfish")) {
      category = "Protein";
    } else if (lower.includes("oil") || lower.includes("rice") || lower.includes("crayfish") || lower.includes("salt") || lower.includes("flour") || lower.includes("iru")) {
      category = "Pantry";
    }

    const newItem: DetectedItem = {
      name: cleanName,
      category,
      confidence: 1.0,
      estimated_quantity: cleanQty,
    };

    setData({
      ...data,
      detected_items: [...data.detected_items, newItem],
    });

    setNewIngredientName("");
    setNewIngredientQty("");
  };

  const handleUpdateRecipes = async () => {
    if (!data || data.detected_items.length === 0) return;
    setUpdatingRecipes(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const sampleType = selectedFile?.name?.includes("pantry")
        ? "pantry"
        : selectedFile?.name?.includes("native")
        ? "native"
        : "market";

      const res = await fetch(`${apiUrl}/api/recipes/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detected_items: data.detected_items,
          sample_type: sampleType,
          is_demo: data.is_demo ?? false,
          spice_level: spiceLevel,
          cooking_fuel: cookingFuel,
        }),
      });

      if (res.ok) {
        const updatedResponse: ProcessResponse = await res.json();
        setData(updatedResponse);
        setCompletedSteps({});
        scrollToResults();
        return;
      }
      throw new Error(`Server returned status ${res.status}`);
    } catch {
      // Bulletproof Client Fallback: Recalculate recipes using edited ingredients as source of truth
      const availableNames = new Set(data.detected_items.map((i) => i.name.toLowerCase()));
      const updatedRecipes = data.recipes.map((r) => {
        const used = r.fridge_ingredients_used.filter((ing) =>
          Array.from(availableNames).some((avail) => avail.includes(ing.toLowerCase()) || ing.toLowerCase().includes(avail))
        );
        const removedFromUsed = r.fridge_ingredients_used.filter((ing) => !used.includes(ing));
        const combinedMissing = Array.from(new Set([...r.missing_ingredients_needed, ...removedFromUsed]));
        return {
          ...r,
          fridge_ingredients_used: used,
          missing_ingredients_needed: combinedMissing,
        };
      });

      setData({
        ...data,
        recipes: updatedRecipes,
      });
      setCompletedSteps({});
      scrollToResults();
    } finally {
      setUpdatingRecipes(false);
    }
  };

  const toggleStep = (recipeIdx: number, stepIdx: number) => {
    setCompletedSteps((prev) => {
      const currentRecipeSteps = new Set(prev[recipeIdx] || []);
      if (currentRecipeSteps.has(stepIdx)) {
        currentRecipeSteps.delete(stepIdx);
      } else {
        currentRecipeSteps.add(stepIdx);
      }
      return { ...prev, [recipeIdx]: currentRecipeSteps };
    });
  };

  const toggleShoppingItem = (idx: number) => {
    setCheckedShoppingItems((prev) => {
      const updated = new Set(prev);
      if (updated.has(idx)) {
        updated.delete(idx);
      } else {
        updated.add(idx);
      }
      return updated;
    });
  };

  const handleCopyRecipe = (recipe: Recipe, idx: number) => {
    const text = `${recipe.title}
[${recipe.meal_type === "quick" ? "Quick Meal (≤20m)" : "Proper Cooking"} • ${recipe.financial_tier === "comfortable" ? "Comfortable" : "Everyday Budget"}]
Cost Est: ${recipe.estimated_cost_tier || "N/A"}
Prep: ${recipe.prep_time_minutes}m | Cook: ${recipe.cook_time_minutes}m | Servings: ${recipe.servings} | Difficulty: ${recipe.difficulty}

${recipe.description}

Why This Recipe:
${recipe.why_this_recipe || "Selected to maximize pantry provisions with authentic Nigerian flavor balance."}

Ingredients from Kitchen:
${recipe.fridge_ingredients_used.map((i) => `- ${i}`).join("\n")}

Extra Items Needed:
${recipe.missing_ingredients_needed.map((i) => `- ${i}`).join("\n")}

Instructions:
${recipe.instructions.map((step, sIdx) => `${sIdx + 1}. ${step}`).join("\n")}

Chef's Pro Tip: ${recipe.chef_tips || "Enjoy hot!"}
— Generated by ChopSnap (ChopSnap helps you cook Nigerian meals with the ingredients you already have, within your budget.)`;

    navigator.clipboard.writeText(text);
    setCopiedRecipeIndex(idx);
    setTimeout(() => setCopiedRecipeIndex(null), 2500);
  };

  const handleCopyShoppingList = () => {
    if (!data?.shopping_list) return;
    const text = `ChopSnap Minimal Shopping List:
${data.shopping_list.map((item, i) => `${i + 1}. ${item.item} ${item.estimated_cost ? `(${item.estimated_cost})` : ""}`).join("\n")}

Zero-waste grocery additions for authentic Nigerian cooking.`;

    navigator.clipboard.writeText(text);
    setCopiedShoppingList(true);
    setTimeout(() => setCopiedShoppingList(false), 2500);
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPreAnalysisItems([]);
    setTypedIngredient("");
    setShowSavingsInfo(false);
    setIsReviewStep(false);
    setReviewItems([]);
    setSelectedReviewItemIds(new Set());
    setData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    goTo("welcome");
  };

  const looksClearItems = reviewItems.filter((it) => {
    const isUnsure = it.certainty === "unsure" || (it.alternatives && it.alternatives.length > 0);
    return !isUnsure;
  });

  const pleaseCheckItems = reviewItems.filter((it) => {
    const isUnsure = it.certainty === "unsure" || (it.alternatives && it.alternatives.length > 0);
    return isUnsure;
  });

  const NIGERIAN_SUGGESTIONS = [
    "Fresh Ugwu",
    "Scotch Bonnet (Ata Rodo)",
    "Plum Tomatoes",
    "Ripe Plantains",
    "Fresh Eggs",
    "Smoked Catfish",
    "Honey Beans",
    "White Rice",
    "Red Onions",
    "Pure Red Palm Oil",
  ];

  const canSubmit = Boolean(
    selectedFile ||
    (data && data.detected_items && data.detected_items.length > 0) ||
    preAnalysisItems.length > 0
  );

  const quickRecipes = data?.recipes.filter((r) => r.meal_type === "quick") || [];
  const properRecipes = data?.recipes.filter((r) => r.meal_type !== "quick") || [];

  const displayedRecipes = (activeTab === "quick" ? quickRecipes : properRecipes).filter((r) => {
    if (tierFilter === "all") return true;
    return r.financial_tier === tierFilter;
  });

  const activeDisplayedRecipes =
    activeTab === "quick"
      ? displayedRecipes
      : activeTab === "proper"
      ? displayedRecipes
      : (data?.recipes || []);

  const userIngredientsList = data?.detected_items || [];
  const totalUserIngredients = userIngredientsList.length;

  // Compute used ingredients across recipe fridge items, missing items, and instructions
  const usedUserIngredients = userIngredientsList.filter((item) =>
    isIngredientUsedInRecipes(item.name, activeDisplayedRecipes)
  );

  const notUsedUserIngredients = userIngredientsList.filter(
    (item) => !isIngredientUsedInRecipes(item.name, activeDisplayedRecipes)
  );

  const ingredientsUsedPercent =
    totalUserIngredients > 0
      ? Math.round((usedUserIngredients.length / totalUserIngredients) * 100)
      : 0;

  // Compute value of ingredients you're using in naira from prices.json
  let ingredientValueNaira = 0;
  let pricedItemsCount = 0;
  let unpricedItemsCount = 0;

  usedUserIngredients.forEach((item) => {
    const price = getIngredientPrice(item.name, selectedCity, cityPricesData);
    if (price !== null && price > 0) {
      ingredientValueNaira += price;
      pricedItemsCount++;
    } else {
      unpricedItemsCount++;
    }
  });

  const hasSavingsData = pricedItemsCount > 0;
  const somePricesUnavailable = unpricedItemsCount > 0;


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
    step,
    setStep,
    goTo,
    goNext,
    goBack,

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
