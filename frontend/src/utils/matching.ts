/**
 * ChopSnap Ingredient Matching & Pricing Utility
 * 
 * Provides normalised, alias-aware whole-word matching between user kitchen ingredients,
 * recipe ingredients/instructions, and market price tables.
 */

export interface MinimalRecipe {
  title?: string;
  description?: string;
  fridge_ingredients_used?: string[];
  missing_ingredients_needed?: string[];
  instructions?: string[];
}

/**
 * Mapping of known Nigerian ingredient aliases and synonyms.
 */
export const ALIAS_MAP: Record<string, string[]> = {
  // Peppers
  "ata rodo": ["scotch bonnet", "atarodo", "rodo", "habanero", "fresh pepper"],
  "atarodo": ["scotch bonnet", "ata rodo", "rodo", "habanero"],
  "rodo": ["scotch bonnet", "ata rodo", "atarodo", "habanero"],
  "scotch bonnet": ["ata rodo", "atarodo", "rodo", "habanero", "fresh pepper"],
  "habanero": ["scotch bonnet", "ata rodo"],

  // Fish & Proteins
  "okporoko": ["stockfish", "codfish", "dried fish", "panla"],
  "stockfish": ["okporoko", "codfish", "dried fish"],
  "codfish": ["stockfish", "okporoko"],
  "titus": ["mackerel", "smoked mackerel", "titus fish", "smoked fish"],
  "titus fish": ["mackerel", "smoked mackerel", "titus", "smoked fish"],
  "mackerel": ["titus", "titus fish", "smoked mackerel"],
  "smoked mackerel": ["titus", "titus fish", "mackerel"],

  // Greens & Vegetables
  "ugwu": ["ugu", "pumpkin leaves", "pumpkin leaf", "fluted pumpkin", "fluted pumpkin leaves"],
  "ugu": ["ugwu", "pumpkin leaves", "pumpkin leaf", "fluted pumpkin", "fluted pumpkin leaves"],
  "pumpkin leaves": ["ugwu", "ugu", "fluted pumpkin", "pumpkin leaf"],
  "pumpkin leaf": ["ugwu", "ugu", "fluted pumpkin", "pumpkin leaves"],
  "tatashe": ["bell pepper", "red bell pepper", "tatase", "sweet pepper"],
  "tatase": ["bell pepper", "red bell pepper", "tatashe", "sweet pepper"],
  "bell pepper": ["tatashe", "tatase", "red bell pepper"],
  "efirin": ["scent leaf", "scent leaves", "nchanwu", "african basil"],
  "scent leaf": ["efirin", "scent leaves", "nchanwu"],
  "scent leaves": ["efirin", "scent leaf", "nchanwu"],
  "nchanwu": ["efirin", "scent leaf", "scent leaves"],

  // Seasonings & Condiments
  "iru": ["locust bean", "locust beans", "dawadawa"],
  "locust bean": ["iru", "locust beans", "dawadawa"],
  "locust beans": ["iru", "locust bean", "dawadawa"],
  "dawadawa": ["iru", "locust bean", "locust beans"],
  "crayfish": ["ground crayfish", "dried crayfish"],
  "ground crayfish": ["crayfish", "dried crayfish"],
  "dried crayfish": ["crayfish", "ground crayfish"],

  // Staples & Legumes
  "dodo": ["plantain", "plantains", "ripe plantain", "sweet plantain"],
  "plantain": ["dodo", "plantains", "ripe plantain"],
  "plantains": ["dodo", "plantain", "ripe plantain"],
  "ripe plantain": ["dodo", "plantain", "plantains"],
  "ewa": ["beans", "honey beans", "oloyin"],
  "beans": ["ewa", "honey beans", "oloyin"],
  "honey beans": ["ewa", "beans", "oloyin"],
  "oloyin": ["ewa", "beans", "honey beans"],
  "garri": ["gari", "cassava flakes"],
  "gari": ["garri", "cassava flakes"],
  "cassava flakes": ["garri", "gari"],
  "shombo": ["sombo", "cayenne pepper", "chili pepper", "chilli"],
  "cayenne pepper": ["shombo", "sombo", "chili pepper"],

  // Everyday staples
  "egg": ["eggs", "fresh eggs"],
  "eggs": ["egg", "fresh eggs"],
  "fresh eggs": ["egg", "eggs"],
  "tomato": ["tomatoes", "plum tomatoes"],
  "tomatoes": ["tomato", "plum tomatoes"],
  "plum tomatoes": ["tomato", "tomatoes"],
  "onion": ["onions", "red onions", "red onion"],
  "onions": ["onion", "red onions", "red onion"],
  "red onions": ["onion", "onions"],

  // Oils (specific types)
  "palm oil": ["red palm oil", "pure red palm oil", "epo", "epo pupa"],
  "red palm oil": ["palm oil", "pure red palm oil", "epo", "epo pupa"],
  "vegetable oil": ["pure vegetable oil", "groundnut oil", "sunflower oil"],
  "pure vegetable oil": ["vegetable oil", "groundnut oil"],
};

/**
 * Normalises an ingredient string by:
 * - Lowercasing
 * - Stripping punctuation (brackets, commas, hyphens, periods, etc.)
 * - Stripping measurement units and numeric quantities
 * - Removing non-essential culinary qualifiers (fresh, dried, cooked, etc.)
 */
export function normalizeIngredient(raw: string): string {
  if (!raw) return "";
  let text = raw.toLowerCase();

  // Replace punctuation with space
  text = text.replace(/[\(\)\[\]\{\},:;\.!\?\"'\/\\_~*#-]/g, " ");

  // Strip numbers and fractions with units
  text = text.replace(
    /\b\d+(\.\d+)?(\/\d+)?\s*(g|kg|ml|l|cl|oz|lb|cups?|tbsp|tsp|tablespoons?|teaspoons?|pieces?|pcs?|bunches?|bunch|heaps?|derica|mudu|tins?|cans?|cloves?|slices?|pinches?|handfuls?|balls?|fingers?|bulbs?|crate|pack|jars?|bottles?)\b/gi,
    " "
  );

  // Standalone numbers
  text = text.replace(/\b\d+(\.\d+)?(\/\d+)?\b/g, " ");

  // Strip non-ingredient qualifiers while leaving oil and key items intact
  text = text.replace(
    /\b(fresh|dried|raw|cooked|ground|chopped|diced|sliced|shredded|sweet|pure|bits?|leaves?|leaf|root|tubers?|powder|cubes?|warm|cold|medium|large|small)\b/gi,
    " "
  );

  // Collapse whitespace
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Generates search candidate phrases for a normalised ingredient,
 * including known aliases and plural/singular forms.
 */
export function getSearchCandidates(normUserItem: string): string[] {
  const candidates = new Set<string>();
  if (!normUserItem) return [];

  candidates.add(normUserItem);

  for (const [key, aliases] of Object.entries(ALIAS_MAP)) {
    if (key === normUserItem || aliases.includes(normUserItem)) {
      candidates.add(key);
      aliases.forEach((a) => candidates.add(a));
    }
  }

  for (const c of Array.from(candidates)) {
    if (c.endsWith("s") && c.length > 3) {
      candidates.add(c.slice(0, -1));
    } else if (!c.endsWith("s")) {
      candidates.add(c + "s");
    }
  }

  return Array.from(candidates);
}

/**
 * Checks if a user ingredient matches a target string using whole-word matching
 * and alias awareness.
 * 
 * Strict Oil Rule:
 * "oil" must not match "palm oil" or "vegetable oil" unless the user's item is literally "oil".
 */
export function matchesTarget(userItem: string, targetText: string): boolean {
  if (!userItem || !targetText) return false;

  const rawUserClean = userItem.toLowerCase().trim();
  const isLiterallyOil = rawUserClean === "oil" || rawUserClean === "cooking oil";

  // Rule: If user item is literally "oil", it matches palm oil, vegetable oil, or generic oil
  if (isLiterallyOil) {
    const oilRegex = /\b(palm oil|vegetable oil|groundnut oil|red palm oil|cooking oil|oil)\b/i;
    return oilRegex.test(targetText);
  }

  // Normalise user item
  const normUser = normalizeIngredient(userItem);
  if (!normUser) return false;

  const candidates = getSearchCandidates(normUser);

  // Also include raw user item cleaned of punctuation
  const cleanRawUser = userItem
    .toLowerCase()
    .replace(/[\(\)\[\]\{\},:;\.!\?\"'\/\\_~*#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleanRawUser && cleanRawUser !== normUser) {
    candidates.push(cleanRawUser);
  }

  // Target text with punctuation normalized to space for clean word boundary checks
  const cleanTarget = targetText
    .replace(/[\(\)\[\]\{\},:;\.!\?\"'\/\\_~*#-]/g, " ")
    .replace(/\s+/g, " ");

  for (const cand of candidates) {
    if (!cand) continue;
    // Strict oil rule: "oil" must NOT match "palm oil" or "vegetable oil" unless user's item is literally "oil"
    if (cand === "oil" && !isLiterallyOil) continue;

    const escaped = cand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(cleanTarget)) {
      return true;
    }
  }

  return false;
}

/**
 * Computes whether a user ingredient is used in a specific recipe.
 * Checks fridge_ingredients_used, missing_ingredients_needed, and instructions.
 */
export function isIngredientUsedInRecipe(
  userItemName: string,
  recipe: MinimalRecipe
): boolean {
  if (!userItemName || !recipe) return false;

  // 1. Check fridge_ingredients_used
  if (recipe.fridge_ingredients_used && recipe.fridge_ingredients_used.length > 0) {
    for (const item of recipe.fridge_ingredients_used) {
      if (matchesTarget(userItemName, item)) return true;
    }
  }

  // 2. Check actual ingredient lines (missing_ingredients_needed)
  if (recipe.missing_ingredients_needed && recipe.missing_ingredients_needed.length > 0) {
    for (const line of recipe.missing_ingredients_needed) {
      if (matchesTarget(userItemName, line)) return true;
    }
  }

  // 3. Check instructions / steps
  if (recipe.instructions && recipe.instructions.length > 0) {
    for (const step of recipe.instructions) {
      if (matchesTarget(userItemName, step)) return true;
    }
  }

  return false;
}

/**
 * Checks if a user ingredient is used in any of the displayed recipes.
 */
export function isIngredientUsedInRecipes(
  userItemName: string,
  recipes: MinimalRecipe[]
): boolean {
  if (!recipes || recipes.length === 0) return false;
  return recipes.some((recipe) => isIngredientUsedInRecipe(userItemName, recipe));
}

/**
 * Looks up the estimated market price of an ingredient in a given city from prices.json.
 */
export function getIngredientPrice(
  itemName: string,
  city: string,
  pricesData: Record<string, unknown>
): number | null {
  if (!itemName || !city || !pricesData) return null;
  const cityTable = pricesData[city] as Record<string, number> | undefined;
  if (!cityTable || typeof cityTable !== "object") return null;

  const normItem = itemName.trim().toLowerCase();

  // 1. Direct case-insensitive match
  for (const [key, val] of Object.entries(cityTable)) {
    if (typeof val === "number" && key.toLowerCase().trim() === normItem) {
      return val;
    }
  }

  // 2. Normalised alias-aware match
  for (const [key, val] of Object.entries(cityTable)) {
    if (typeof val === "number") {
      if (matchesTarget(itemName, key) || matchesTarget(key, itemName)) {
        return val;
      }
    }
  }

  return null;
}
