import { describe, it } from "node:test";
import assert from "node:assert";
import {
  matchesTarget,
  isIngredientUsedInRecipe,
  isIngredientUsedInRecipes,
  getIngredientPrice,
  normalizeIngredient,
} from "./matching.ts";

describe("Normalized Alias-Aware Ingredient Matching", () => {
  // Requirement 6.1: ata rodo vs scotch bonnet
  it("matches 'ata rodo' against 'scotch bonnet' (alias-aware)", () => {
    assert.strictEqual(
      matchesTarget("ata rodo", "2 scotch bonnet peppers, finely chopped"),
      true,
      "ata rodo should match scotch bonnet in ingredient text"
    );
    assert.strictEqual(
      matchesTarget("scotch bonnet", "Scotch Bonnet (Ata Rodo)"),
      true,
      "scotch bonnet should match Scotch Bonnet (Ata Rodo)"
    );
  });

  // Requirement 6.2: okporoko vs stockfish
  it("matches 'okporoko' against 'stockfish' (alias-aware)", () => {
    assert.strictEqual(
      matchesTarget("okporoko", "Pre-soaked stockfish bits"),
      true,
      "okporoko should match stockfish in recipe line"
    );
    assert.strictEqual(
      matchesTarget("stockfish", "Stockfish Bits (Okporoko)"),
      true,
      "stockfish should match Stockfish Bits (Okporoko)"
    );
  });

  // Requirement 6.3: oil vs palm oil
  it("matches 'oil' against 'palm oil' when user item is literally 'oil'", () => {
    assert.strictEqual(
      matchesTarget("oil", "Heat 2 tablespoons palm oil in pan"),
      true,
      "generic 'oil' should match 'palm oil'"
    );
    assert.strictEqual(
      matchesTarget("oil", "Pure Vegetable Oil"),
      true,
      "generic 'oil' should match 'vegetable oil'"
    );
  });

  it("strictly prevents 'oil' from causing 'palm oil' to match 'vegetable oil'", () => {
    // When user specifies palm oil, it must NOT match vegetable oil
    assert.strictEqual(
      matchesTarget("palm oil", "Pure Vegetable Oil"),
      false,
      "palm oil must NOT match vegetable oil"
    );
    assert.strictEqual(
      matchesTarget("vegetable oil", "Pure Red Palm Oil"),
      false,
      "vegetable oil must NOT match palm oil"
    );
  });

  // Requirement 6.4: an item that is not used
  it("correctly identifies an item that is not used", () => {
    const recipe = {
      title: "Ugwu Egg Scramble",
      description: "Quick breakfast scramble with leafy greens",
      fridge_ingredients_used: ["Fresh Eggs", "Fresh Ugwu Leaves", "Red Onions"],
      missing_ingredients_needed: ["1 pinch salt"],
      instructions: [
        "Whisk eggs with chopped onions",
        "Heat 1 tbsp palm oil and scramble eggs",
        "Toss in sliced ugwu until soft",
      ],
    };

    assert.strictEqual(
      isIngredientUsedInRecipe("honey beans", recipe),
      false,
      "honey beans should NOT match an egg and ugwu recipe"
    );
    assert.strictEqual(
      isIngredientUsedInRecipe("yam", recipe),
      false,
      "yam should NOT match an egg and ugwu recipe"
    );
  });

  // Requirement 4: checks ingredient lines, steps, and fridge_ingredients_used
  it("detects used items across fridge ingredients, missing lines, and instructions", () => {
    const recipe = {
      title: "Quick Native Stir-Fry",
      fridge_ingredients_used: ["Fresh Eggs"],
      missing_ingredients_needed: ["2 scotch bonnet peppers"],
      instructions: ["Heat vegetable oil", "Add okporoko and stir"],
    };

    // Item in fridge_ingredients_used
    assert.strictEqual(isIngredientUsedInRecipe("egg", recipe), true);
    // Item in missing_ingredients_needed via alias (ata rodo -> scotch bonnet)
    assert.strictEqual(isIngredientUsedInRecipe("ata rodo", recipe), true);
    // Item in instructions via alias (stockfish -> okporoko)
    assert.strictEqual(isIngredientUsedInRecipe("stockfish", recipe), true);
    // Unused item
    assert.strictEqual(isIngredientUsedInRecipe("plantain", recipe), false);
  });

  it("normalises ingredient strings by stripping units, numbers, and noise", () => {
    assert.strictEqual(normalizeIngredient("2 cups sliced onions"), "onions");
    assert.strictEqual(normalizeIngredient("Fresh Ugwu Leaves (Pumpkin)"), "ugwu pumpkin");
  });

  it("computes usage across an array of recipes using isIngredientUsedInRecipes", () => {
    const recipes = [
      {
        title: "Recipe A",
        fridge_ingredients_used: ["Fresh Eggs"],
      },
      {
        title: "Recipe B",
        instructions: ["Garnish with fresh scent leaf"],
      },
    ];
    assert.strictEqual(isIngredientUsedInRecipes("egg", recipes), true);
    assert.strictEqual(isIngredientUsedInRecipes("efirin", recipes), true);
    assert.strictEqual(isIngredientUsedInRecipes("yam", recipes), false);
  });

  it("looks up ingredient prices in prices.json using alias matching", () => {
    const mockPrices = {
      Lagos: {
        "Scotch Bonnet (Ata Rodo)": 500,
        "Stockfish Bits (Okporoko)": 1800,
        "Pure Red Palm Oil": 700,
        "Fresh Ugwu Leaves (Pumpkin)": 400,
      },
    };

    assert.strictEqual(getIngredientPrice("ata rodo", "Lagos", mockPrices), 500);
    assert.strictEqual(getIngredientPrice("okporoko", "Lagos", mockPrices), 1800);
    assert.strictEqual(getIngredientPrice("ugwu", "Lagos", mockPrices), 400);
    assert.strictEqual(getIngredientPrice("palm oil", "Lagos", mockPrices), 700);
    assert.strictEqual(getIngredientPrice("sushi rice", "Lagos", mockPrices), null);
  });
});
