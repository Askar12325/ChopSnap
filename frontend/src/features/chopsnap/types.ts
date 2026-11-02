export type FlowStep = "welcome" | "snap" | "check" | "plan" | "cooking" | "results" | "cook";

export type SupportedCity = "Lagos" | "Abuja" | "Ibadan" | "Port Harcourt" | "Kano";
export const SUPPORTED_CITIES: SupportedCity[] = ["Lagos", "Abuja", "Ibadan", "Port Harcourt", "Kano"];

export interface DetectedItem {
  id?: string;
  name: string;
  category: string;
  confidence?: number;
  certainty?: "clear" | "likely" | "unsure";
  alternatives?: string[];
  form?: "raw" | "cooked" | "packaged" | "unknown";
  container_state?: "full" | "partial" | "nearly_empty" | "residue_only" | "unknown";
  estimated_quantity?: string;
  source?: "photo" | "voice" | "manual";
}

export interface Recipe {
  title: string;
  description: string;
  meal_type?: "quick" | "proper" | string;
  financial_tier?: "budget" | "comfortable" | string;
  estimated_cost_tier?: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  difficulty: string;
  servings: number;
  fridge_ingredients_used: string[];
  missing_ingredients_needed: string[];
  instructions: string[];
  why_this_recipe?: string;
  chef_tips?: string;
  assumes?: string | null;
}

export interface ShoppingItem {
  item: string;
  estimated_cost?: string;
  for_recipes: string[];
}

export interface ProcessResponse {
  success: boolean;
  is_demo?: boolean;
  demo_badge?: string;
  detected_items: DetectedItem[];
  recipes: Recipe[];
  shopping_list: ShoppingItem[];
  model_metadata?: {
    vision_model: string;
    recipe_model: string;
    inference_mode: string;
    is_demo_mode?: boolean;
    demo_scenario?: string;
    vision_engine?: string;
    recipe_engine?: string;
  };
}

export interface VoiceInterpretation {
  budget_naira: number | null;
  servings: number | null;
  dietary: string[];
  spice_level: "Mild" | "Authentic Hot" | "Suya Extra" | null;
  cooking_fuel: "gas" | "charcoal" | "electric" | "kerosene" | null;
  add_ingredients: string[];
  remove_ingredients: string[];
  language_detected: string | null;
  source?: "model" | "fallback" | string;
  confidence?: "high" | "unclear" | string;
}

export interface PreviousVoiceState {
  householdSize: number;
  spiceLevel: "Mild" | "Authentic Hot" | "Suya Extra";
  cookingFuel: "gas" | "charcoal" | "electric" | "kerosene";
  tierFilter: "all" | "budget" | "comfortable";
  detectedItems: DetectedItem[];
  preAnalysisItems?: DetectedItem[];
}
