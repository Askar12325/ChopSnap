"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Utensils,
  ShoppingCart,
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChefHat,
  Info,
  Copy,
  Check,
  SlidersHorizontal,
  ChevronDown,
  X,
  ShieldCheck,
  Zap,
  Wallet,
  Coins,
  Cpu,
  Layers,
  Salad,
  Store,
  Lock,
  Sun,
  Moon,
  Camera,
  ArrowRight,
  RotateCcw,
  Plus,
  Tag,
  Mic,
  MicOff,
  Volume2,
  Undo2,
} from "lucide-react";

interface DetectedItem {
  name: string;
  category: string;
  confidence: number;
  estimated_quantity?: string;
}

interface Recipe {
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
}

interface ShoppingItem {
  item: string;
  estimated_cost?: string;
  for_recipes: string[];
}

interface ProcessResponse {
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

interface VoiceInterpretation {
  budget_naira: number | null;
  servings: number | null;
  dietary: string[];
  spice_level: "Mild" | "Authentic Hot" | "Suya Extra" | null;
  cooking_fuel: "gas" | "charcoal" | "electric" | "kerosene" | null;
  add_ingredients: string[];
  remove_ingredients: string[];
  language_detected: string | null;
}

interface PreviousVoiceState {
  householdSize: number;
  spiceLevel: "Mild" | "Authentic Hot" | "Suya Extra";
  cookingFuel: "gas" | "charcoal" | "electric" | "kerosene";
  tierFilter: "all" | "budget" | "comfortable";
  detectedItems: DetectedItem[];
}

// Map dish title to local SVG in /public/dishes/ with fallback
function getRecipeImage(title: string, mealType?: string): string {
  const t = title.toLowerCase();
  if (t.includes("scramble") && t.includes("ugwu")) return "/dishes/ugwu_scramble.svg";
  if (t.includes("scramble")) return "/dishes/scramble.svg";
  if (t.includes("frittata")) return "/dishes/frittata.svg";
  if (t.includes("fried rice")) return "/dishes/fried_rice.svg";
  if (t.includes("ewa aganyin") || t.includes("aganyin")) return "/dishes/ewa_aganyin.svg";
  if (t.includes("pottage")) return "/dishes/beans_pottage.svg";
  if (t.includes("beans")) return "/dishes/honey_beans.svg";
  if (t.includes("catfish") || t.includes("asun")) return "/dishes/catfish.svg";
  if (t.includes("fisherman")) return "/dishes/fisherman_stew.svg";
  if (t.includes("ofe ugwu") || t.includes("royal")) return "/dishes/ofe_ugwu.svg";
  if (t.includes("stew")) return "/dishes/stew.svg";
  if (t.includes("egg") && t.includes("scent")) return "/dishes/scent_leaf_egg.svg";
  return mealType === "quick" ? "/dishes/scramble.svg" : "/dishes/default.svg";
}

// Recipe Card Hero Image Area with graceful gradient fallback
function RecipeHeroImage({ recipe }: { recipe: Recipe }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = getRecipeImage(recipe.title, recipe.meal_type);

  return (
    <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-gradient-to-br from-[#2B1B12] via-[#3B2518] to-[#1F5C3A] mb-4 shadow-sm border border-[var(--border-subtle)] group">
      {!imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={recipe.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B1B12] via-[#3D2517] to-[#1F5C3A] flex flex-col justify-between p-4 sm:p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              {recipe.meal_type === "quick" ? "Quick Meal (≤20m)" : "Proper Cooking"}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              {recipe.prep_time_minutes + recipe.cook_time_minutes}m total
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#FB923C] uppercase tracking-wider block mb-1">
              Nigerian Kitchen Craft
            </span>
            <h4 className="font-serif text-lg sm:text-xl font-normal leading-tight text-[#FFF8EF]">
              {recipe.title}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
}

// NOTE: All demo recipes need review by an authentic Nigerian cook.
// Client-Side Curated Fallback Data
const CLIENT_DEMO_DATA: Record<string, ProcessResponse> = {
  "market": {
    "success": true,
    "is_demo": true,
    "demo_badge": "Demo Mode \u2022 Lagos Market Haul (Fridge & Counter)",
    "detected_items": [
      {
        "name": "Plum Tomatoes",
        "category": "Produce",
        "confidence": 0.96,
        "estimated_quantity": "5 medium ripe"
      },
      {
        "name": "Scotch Bonnet (Ata Rodo)",
        "category": "Produce",
        "confidence": 0.95,
        "estimated_quantity": "4 vibrant red peppers"
      },
      {
        "name": "Bell Pepper (Tatashe)",
        "category": "Produce",
        "confidence": 0.93,
        "estimated_quantity": "2 medium"
      },
      {
        "name": "Red Onions",
        "category": "Produce",
        "confidence": 0.98,
        "estimated_quantity": "2 large bulbs"
      },
      {
        "name": "Fresh Eggs",
        "category": "Protein",
        "confidence": 0.96,
        "estimated_quantity": "6 crate pack"
      },
      {
        "name": "Ripe Sweet Plantains",
        "category": "Produce",
        "confidence": 0.97,
        "estimated_quantity": "3 ripe fingers"
      },
      {
        "name": "Cooked White Rice",
        "category": "Pantry",
        "confidence": 0.92,
        "estimated_quantity": "1 medium bowl (chilled)"
      },
      {
        "name": "Smoked Mackerel (Titus)",
        "category": "Protein",
        "confidence": 0.94,
        "estimated_quantity": "1 whole deboned piece"
      },
      {
        "name": "Fresh Ugwu Leaves (Pumpkin)",
        "category": "Produce",
        "confidence": 0.91,
        "estimated_quantity": "1 small bunch (sliced)"
      },
      {
        "name": "Pure Vegetable Oil",
        "category": "Pantry",
        "confidence": 0.9,
        "estimated_quantity": "Half bottle remaining"
      }
    ],
    "recipes": [
      {
        "title": "Classic Lagos Sunday Obe Ata with Smoked Titus, Dodo & Steamed Rice",
        "description": "The undisputed pillar of Nigerian Sunday cuisine: richly simmered plum tomato and tatashe pepper stew braised with succulent smoked Titus mackerel, ladled over warm rice beside golden fried dodo.",
        "meal_type": "proper",
        "financial_tier": "comfortable",
        "estimated_cost_tier": "~\u20a62,800 (Comfortable)",
        "prep_time_minutes": 12,
        "cook_time_minutes": 25,
        "difficulty": "Medium",
        "servings": 4,
        "fridge_ingredients_used": [
          "Plum Tomatoes",
          "Bell Pepper (Tatashe)",
          "Scotch Bonnet (Ata Rodo)",
          "Smoked Mackerel (Titus)",
          "Ripe Sweet Plantains",
          "Cooked White Rice",
          "Red Onions",
          "Pure Vegetable Oil"
        ],
        "missing_ingredients_needed": [
          "1 Garlic Clove",
          "1/2 inch Ginger Root"
        ],
        "instructions": [
          "Roughly blend tomatoes, tatashe, scotch bonnet (scaled to spice level), ginger, garlic, and one onion bulb.",
          "Heat vegetable oil in a deep pot, fry sliced onions until fragrant, then pour in blended pepper puree.",
          "Boil uncovered for 15 minutes until oil floats to the surface and the raw pepper tang mellows.",
          "Gently slide in deboned smoked mackerel steaks; simmer 8 minutes on low to allow smoky fish oils to infuse the sauce.",
          "Serve piping hot ladled over reheated white rice with thick sliced fried sweet plantain fingers."
        ],
        "why_this_recipe": "A cornerstone classic of Nigerian households: utilizes the full harvest of tomatoes, tatashe, and ata rodo, braising smoked Titus so savory ocean umami permeates the rich stew.",
        "chef_tips": "Boiling down the blended pepper base uncovered evaporates excess moisture fast, locking in deep natural tomato sweetness."
      },
      {
        "title": "Buka-Style Street Fried Rice with Sliced Ugwu & Caramelized Dodo",
        "description": "Resourceful pantry alchemy transforming chilled white rice into fragrant turmeric-tinted fried rice tossed with shredded ugwu greens and crispy dodo cubes.",
        "meal_type": "proper",
        "financial_tier": "budget",
        "estimated_cost_tier": "~\u20a6850 (Everyday Budget)",
        "prep_time_minutes": 8,
        "cook_time_minutes": 15,
        "difficulty": "Easy",
        "servings": 3,
        "fridge_ingredients_used": [
          "Cooked White Rice",
          "Fresh Ugwu Leaves (Pumpkin)",
          "Ripe Sweet Plantains",
          "Red Onions",
          "Pure Vegetable Oil"
        ],
        "missing_ingredients_needed": [
          "1 tsp Curry Powder",
          "1/2 tsp Dried Thyme"
        ],
        "instructions": [
          "Dice sweet plantains into small cubes; fry in vegetable oil until caramelized golden brown. Drain.",
          "In a large pan or wok, heat 2 tablespoons of oil. Saut\u00e9 onions, curry powder, and thyme for 2 minutes.",
          "Add chilled cooked rice, breaking up lumps with a wooden spoon over brisk heat for 5 minutes.",
          "Fold in shredded fresh ugwu leaves and fried dodo cubes during the final 90 seconds so greens stay vibrant and crisp."
        ],
        "why_this_recipe": "Resourcefully repurposes day-old chilled rice, using sliced fresh ugwu leaves at the very end to preserve vitamins and vivid green color.",
        "chef_tips": "Chilled rice grains are slightly dehydrated, meaning they absorb savory seasoned pan oils without turning mushy."
      },
      {
        "title": "Campus-Style 10-Minute Peppered Egg & Onion Scramble",
        "description": "The ultimate fast Nigerian comfort bite: diced red onions and scotch bonnet sizzled in vegetable oil, folded with whisked fresh eggs.",
        "meal_type": "quick",
        "financial_tier": "budget",
        "estimated_cost_tier": "~\u20a6650 (Everyday Budget)",
        "prep_time_minutes": 3,
        "cook_time_minutes": 7,
        "difficulty": "Easy",
        "servings": 2,
        "fridge_ingredients_used": [
          "Fresh Eggs",
          "Scotch Bonnet (Ata Rodo)",
          "Red Onions",
          "Pure Vegetable Oil"
        ],
        "missing_ingredients_needed": [],
        "instructions": [
          "Finely dice red onions and slice scotch bonnet (scaled to spice level).",
          "Heat 2 tablespoons of vegetable oil in a skillet. Saut\u00e9 onions for 60 seconds until edges caramelize.",
          "Add ata rodo, stirring briskly for 30 seconds.",
          "Crack eggs into pan, lower flame to medium, and stir gently for 2 minutes until soft fluffy curds form.",
          "Serve steaming hot with bread, rice, or yam."
        ],
        "why_this_recipe": "Zero-waste quick protein meal prepared in under 10 minutes using only staple eggs, onions, and scotch bonnet with zero extra shopping required.",
        "chef_tips": "Saut\u00e9ing onions until golden first caramelizes natural sugars, giving savory richness without needing butter."
      },
      {
        "title": "Executive Sweet Dodo & Smoked Titus Skillet Frittata",
        "description": "An elevated West African morning skillet: golden fried plantain disks layered with flaked smoked mackerel, baked gently under a fluffy egg crust.",
        "meal_type": "quick",
        "financial_tier": "comfortable",
        "estimated_cost_tier": "~\u20a62,200 (Comfortable)",
        "prep_time_minutes": 5,
        "cook_time_minutes": 12,
        "difficulty": "Easy",
        "servings": 2,
        "fridge_ingredients_used": [
          "Fresh Eggs",
          "Smoked Mackerel (Titus)",
          "Ripe Sweet Plantains",
          "Plum Tomatoes",
          "Red Onions",
          "Scotch Bonnet (Ata Rodo)",
          "Pure Vegetable Oil"
        ],
        "missing_ingredients_needed": [
          "1 Fresh Curry Leaf Spring",
          "White Pepper"
        ],
        "instructions": [
          "Slice ripe plantains into round coins; shallow fry in oil for 4 minutes until golden.",
          "Debone smoked mackerel into large juicy bite-sized flakes.",
          "Whisk 4 eggs with a pinch of white pepper, sliced onions, and chopped scotch bonnet.",
          "Layer plantain coins and smoked mackerel in skillet, pour whisked eggs over, cover tightly, and steam 6 minutes on low.",
          "Slide onto a plate and slice into warm wedges."
        ],
        "why_this_recipe": "Brings sweet ripe plantains and rich smoked mackerel together in a quick steamed egg cake that prevents plantain spoilage.",
        "chef_tips": "Covering tightly with a lid traps internal steam, puffing the frittata into a souffl\u00e9-like texture."
      },
      {
        "title": "Flash-Saut\u00e9ed Ata Rodo & Tomato Egg Fold",
        "description": "Street-style fast breakfast: diced plum tomatoes and scotch bonnet reduction folded into soft eggs with caramelized onion ribbons.",
        "meal_type": "quick",
        "financial_tier": "budget",
        "estimated_cost_tier": "~\u20a6700 (Everyday Budget)",
        "prep_time_minutes": 3,
        "cook_time_minutes": 8,
        "difficulty": "Easy",
        "servings": 2,
        "fridge_ingredients_used": [
          "Fresh Eggs",
          "Plum Tomatoes",
          "Scotch Bonnet (Ata Rodo)",
          "Red Onions",
          "Pure Vegetable Oil"
        ],
        "missing_ingredients_needed": [],
        "instructions": [
          "Dice tomatoes, onions, and scotch bonnet finely.",
          "Saut\u00e9 onions and scotch bonnet in hot vegetable oil for 1 minute.",
          "Add tomatoes, cooking down for 3 minutes until thick and pasty.",
          "Pour whisked eggs into the simmering sauce, folding gently until softly set."
        ],
        "why_this_recipe": "Fast, nourishing breakfast utilizing surplus ripe tomatoes before they soften, requiring zero extra market purchases.",
        "chef_tips": "Cooking down the tomatoes before adding eggs prevents excess water from making the scramble runny."
      }
    ],
    "shopping_list": [
      {
        "item": "Curry Powder & Dried Thyme",
        "estimated_cost": "~\u20a6200 (Pantry pack)",
        "for_recipes": [
          "Buka-Style Street Fried Rice"
        ]
      },
      {
        "item": "Fresh Ginger & Garlic Roots",
        "estimated_cost": "~\u20a6150 (Market stall)",
        "for_recipes": [
          "Classic Lagos Sunday Obe Ata"
        ]
      }
    ]
  },
  "native": {
    "success": true,
    "is_demo": true,
    "demo_badge": "Demo Mode \u2022 Native Greens & Smoked Fish Crisper",
    "detected_items": [
      {
        "name": "Fresh Ugwu Leaves (Pumpkin)",
        "category": "Produce",
        "confidence": 0.97,
        "estimated_quantity": "1 large bunch (crisp)"
      },
      {
        "name": "Smoked Catfish / Mangala",
        "category": "Protein",
        "confidence": 0.95,
        "estimated_quantity": "1 large piece shredded"
      },
      {
        "name": "Scotch Bonnet (Ata Rodo)",
        "category": "Produce",
        "confidence": 0.94,
        "estimated_quantity": "3 hot peppers"
      },
      {
        "name": "Red Onions",
        "category": "Produce",
        "confidence": 0.98,
        "estimated_quantity": "2 whole bulbs"
      },
      {
        "name": "Fresh Eggs",
        "category": "Protein",
        "confidence": 0.96,
        "estimated_quantity": "4 fresh eggs"
      },
      {
        "name": "Ripe Plantains",
        "category": "Produce",
        "confidence": 0.95,
        "estimated_quantity": "2 fingers"
      },
      {
        "name": "Leftover White Rice",
        "category": "Pantry",
        "confidence": 0.93,
        "estimated_quantity": "1 bowl cooked"
      },
      {
        "name": "Stockfish Bits (Okporoko)",
        "category": "Protein",
        "confidence": 0.91,
        "estimated_quantity": "Small bowl soaked"
      },
      {
        "name": "Pure Red Palm Oil",
        "category": "Pantry",
        "confidence": 0.94,
        "estimated_quantity": "1 small jar"
      },
      {
        "name": "Fresh Ginger & Garlic",
        "category": "Produce",
        "confidence": 0.89,
        "estimated_quantity": "2 knobs ginger, 3 cloves garlic"
      }
    ],
    "recipes": [
      {
        "title": "Traditional Royal Ofe Ugwu with Steamed Okporoko & Smoked Catfish",
        "description": "The quintessential celebration soup of Southern and Eastern Nigeria: rich unbleached red palm oil braised with fork-tender stockfish, succulent smoked mangala catfish, and fresh shredded ugwu leaves.",
        "meal_type": "proper",
        "financial_tier": "comfortable",
        "estimated_cost_tier": "~\u20a64,500 (Comfortable)",
        "prep_time_minutes": 15,
        "cook_time_minutes": 35,
        "difficulty": "Medium",
        "servings": 4,
        "fridge_ingredients_used": [
          "Fresh Ugwu Leaves (Pumpkin)",
          "Stockfish Bits (Okporoko)",
          "Smoked Catfish / Mangala",
          "Pure Red Palm Oil",
          "Scotch Bonnet (Ata Rodo)",
          "Red Onions",
          "Ripe Plantains"
        ],
        "missing_ingredients_needed": [
          "2 tbsp Ground Crayfish",
          "1 tsp Fermented Locust Beans (Iru)"
        ],
        "instructions": [
          "Boil soaked stockfish bits with sliced onions and salt for 20 minutes until fork-tender and collagen broth is extracted.",
          "Heat unbleached red palm oil in a pot, bloom iru and crushed scotch bonnet (scaled to spice level) for 90 seconds.",
          "Pour in stockfish with its rich broth, smoked catfish chunks, and ground crayfish. Simmer 12 minutes.",
          "Fold in freshly washed shredded ugwu leaves; turn off flame immediately so greens gently steam-cook.",
          "Serve with thick golden fried sweet plantain fingers or swallow."
        ],
        "why_this_recipe": "A revered Nigerian classic: pairs slow-steeped stockfish collagen with whole smoked catfish and fresh ugwu in unbleached palm oil for deep ancestral umami.",
        "chef_tips": "Turning off the heat right as ugwu is folded keeps the leaves vibrant emerald green and crisp with zero vitamin loss."
      },
      {
        "title": "Fisherman's Native Palm Oil Stew with Softened Stockfish Bits & Ugwu",
        "description": "An earthy, deeply satisfying coastal home pot: softened stockfish bits simmered in aromatic palm oil and rich fish broth, thickened with sliced ugwu greens.",
        "meal_type": "proper",
        "financial_tier": "budget",
        "estimated_cost_tier": "~\u20a61,100 (Everyday Budget)",
        "prep_time_minutes": 10,
        "cook_time_minutes": 24,
        "difficulty": "Medium",
        "servings": 3,
        "fridge_ingredients_used": [
          "Stockfish Bits (Okporoko)",
          "Smoked Catfish / Mangala",
          "Fresh Ugwu Leaves (Pumpkin)",
          "Pure Red Palm Oil",
          "Red Onions",
          "Scotch Bonnet (Ata Rodo)"
        ],
        "missing_ingredients_needed": [
          "1 tbsp Ground Crayfish"
        ],
        "instructions": [
          "Boil soaked stockfish bits in 1.5 cups of water with onions until tender broth forms.",
          "In a separate pot, heat palm oil and saut\u00e9 onions and crushed scotch bonnet.",
          "Add stockfish with its rich broth, flaked catfish, and crayfish; simmer 10 minutes.",
          "Stir in freshly washed ugwu leaves, cook for 3 minutes, and take off heat."
        ],
        "why_this_recipe": "Extracts rich gelatin and natural stock from stockfish bits to braise catfish and ugwu with authentic coastal flavor.",
        "chef_tips": "The natural gelatin released by boiling stockfish bones forms the rich body of authentic native vegetable soups."
      },
      {
        "title": "Native Flash-Wilted Ugwu & Palm Oil Scramble over Leftover Rice",
        "description": "Fast nutrient-dense native skillet: fresh shredded pumpkin leaves flash-sizzled in aromatic palm oil with beaten eggs and scotch bonnet over warm leftover rice.",
        "meal_type": "quick",
        "financial_tier": "budget",
        "estimated_cost_tier": "~\u20a6700 (Everyday Budget)",
        "prep_time_minutes": 3,
        "cook_time_minutes": 6,
        "difficulty": "Easy",
        "servings": 2,
        "fridge_ingredients_used": [
          "Fresh Ugwu Leaves (Pumpkin)",
          "Pure Red Palm Oil",
          "Fresh Eggs",
          "Scotch Bonnet (Ata Rodo)",
          "Leftover White Rice",
          "Red Onions"
        ],
        "missing_ingredients_needed": [],
        "instructions": [
          "Heat 2 tbsp red palm oil in skillet until fragrant and translucent (do not bleach).",
          "Add sliced scotch bonnet and onions, saut\u00e9 for 45 seconds.",
          "Pour in whisked eggs, swirl gently, then fold in shredded ugwu leaves.",
          "Serve piping hot over reheated leftover white rice."
        ],
        "why_this_recipe": "Rescues fresh ugwu leaves with a flash 90-second palm oil sizzle, locking in chlorophyll while coating leftover rice with rich savory fats.",
        "chef_tips": "Cooking ugwu for under 90 seconds preserves its vivid chlorophyll green and crisp vitamin crunch."
      },
      {
        "title": "Peppered Smoked Catfish & Sweet Plantain Medley (Asun-Style Fish)",
        "description": "Charred scotch bonnet peppers, caramelized red onions, and tender smoked catfish chunks tossed with sweet fried dodo cubes.",
        "meal_type": "quick",
        "financial_tier": "comfortable",
        "estimated_cost_tier": "~\u20a62,500 (Comfortable)",
        "prep_time_minutes": 5,
        "cook_time_minutes": 14,
        "difficulty": "Easy",
        "servings": 2,
        "fridge_ingredients_used": [
          "Smoked Catfish / Mangala",
          "Ripe Plantains",
          "Scotch Bonnet (Ata Rodo)",
          "Red Onions",
          "Pure Red Palm Oil"
        ],
        "missing_ingredients_needed": [
          "1/2 tsp Suya Pepper / Yaji"
        ],
        "instructions": [
          "Dice sweet plantains into cubes and fry in palm or vegetable oil until golden.",
          "Coarsely pound scotch bonnet with onions.",
          "Saut\u00e9 pepper mixture with shredded smoked catfish and suya spice for 3 minutes.",
          "Toss in the fried plantains, coat thoroughly, and serve immediately."
        ],
        "why_this_recipe": "Pairs spicy ata rodo reduction with caramelized sweet dodo, using natural plantain sugars to temper fierce pepper heat over flaky catfish.",
        "chef_tips": "Gently breaking catfish into large flakes rather than shreds keeps the fish juicy and tender."
      },
      {
        "title": "Quick Palm Oil & Shredded Ugwu Sizzle with Sliced Onions",
        "description": "Quick native vegetable side: fresh sliced pumpkin leaves saut\u00e9ed in unbleached red palm oil with onions and mild chili.",
        "meal_type": "quick",
        "financial_tier": "budget",
        "estimated_cost_tier": "~\u20a6500 (Everyday Budget)",
        "prep_time_minutes": 2,
        "cook_time_minutes": 5,
        "difficulty": "Easy",
        "servings": 2,
        "fridge_ingredients_used": [
          "Fresh Ugwu Leaves (Pumpkin)",
          "Pure Red Palm Oil",
          "Red Onions",
          "Scotch Bonnet (Ata Rodo)"
        ],
        "missing_ingredients_needed": [],
        "instructions": [
          "Heat 1.5 tablespoons of red palm oil in skillet on medium.",
          "Saut\u00e9 sliced onions and scotch bonnet for 60 seconds.",
          "Toss in shredded ugwu leaves, stir for 90 seconds with a pinch of salt, and take off fire immediately."
        ],
        "why_this_recipe": "The fastest native vegetable dish in Nigerian home cooking: zero waste, preserves all natural iron and vitamins.",
        "chef_tips": "Never overcook ugwu; residual heat in the pan will finish the cooking off the stove."
      }
    ],
    "shopping_list": [
      {
        "item": "Fermented Locust Beans (Iru)",
        "estimated_cost": "~\u20a6100 (Native umami aroma)",
        "for_recipes": [
          "Royal Ofe Ugwu"
        ]
      },
      {
        "item": "Ground Dried Crayfish",
        "estimated_cost": "~\u20a6300 (Pantry staple)",
        "for_recipes": [
          "Fisherman's Stew",
          "Royal Ofe Ugwu"
        ]
      }
    ]
  },
  "pantry": {
    "success": true,
    "is_demo": true,
    "demo_badge": "Demo Mode \u2022 Pantry Shelf & Honey Beans Station",
    "detected_items": [
      {
        "name": "Plum Tomatoes",
        "category": "Produce",
        "confidence": 0.96,
        "estimated_quantity": "6 medium plum"
      },
      {
        "name": "Bell Pepper (Tatashe)",
        "category": "Produce",
        "confidence": 0.94,
        "estimated_quantity": "3 large red peppers"
      },
      {
        "name": "Scotch Bonnet (Ata Rodo)",
        "category": "Produce",
        "confidence": 0.96,
        "estimated_quantity": "5 fiery peppers"
      },
      {
        "name": "Red Onions",
        "category": "Produce",
        "confidence": 0.98,
        "estimated_quantity": "3 bulbs"
      },
      {
        "name": "Smoked Mackerel / Fish",
        "category": "Protein",
        "confidence": 0.93,
        "estimated_quantity": "1 large piece flaked"
      },
      {
        "name": "Ripe Sweet Plantains",
        "category": "Produce",
        "confidence": 0.97,
        "estimated_quantity": "3 fingers (golden ripe)"
      },
      {
        "name": "Fresh Eggs",
        "category": "Protein",
        "confidence": 0.95,
        "estimated_quantity": "6 eggs"
      },
      {
        "name": "Cooked Honey Beans (Oloyin)",
        "category": "Pantry",
        "confidence": 0.92,
        "estimated_quantity": "1 small container (leftover)"
      },
      {
        "name": "Fresh Scent Leaf (Efirin)",
        "category": "Produce",
        "confidence": 0.9,
        "estimated_quantity": "Small handful"
      },
      {
        "name": "Pure Vegetable Oil",
        "category": "Pantry",
        "confidence": 0.91,
        "estimated_quantity": "Small bottle"
      }
    ],
    "recipes": [
      {
        "title": "Classic Ewa Aganyin with Caramelized Onion Sauce & Fried Dodo",
        "description": "The crown jewel of Lagos street food: tender velvety honey beans served alongside sweet golden dodo, topped with fiery dark-caramelized onion and chili reduction.",
        "meal_type": "proper",
        "financial_tier": "budget",
        "estimated_cost_tier": "~\u20a6950 (Everyday Budget)",
        "prep_time_minutes": 10,
        "cook_time_minutes": 25,
        "difficulty": "Medium",
        "servings": 3,
        "fridge_ingredients_used": [
          "Cooked Honey Beans (Oloyin)",
          "Ripe Sweet Plantains",
          "Plum Tomatoes",
          "Red Onions",
          "Scotch Bonnet (Ata Rodo)",
          "Pure Vegetable Oil"
        ],
        "missing_ingredients_needed": [
          "1 tbsp Ground Dried Chili Flakes"
        ],
        "instructions": [
          "Mash cooked honey beans until smooth and velvety, adding a pinch of salt. Keep warm.",
          "Slice plantains diagonally and fry to deep mahogany perfection.",
          "Slow-fry plenty of sliced onions in vegetable oil until deep dark brown (not burnt).",
          "Add crushed dried chili, ata rodo (scaled to spice level), and tomatoes; fry for 15 minutes until oil turns dark crimson.",
          "Ladle the fiery Aganyin sauce generously over the soft beans and dodo."
        ],
        "why_this_recipe": "The classic street-food benchmark for Nigerian beans: harnesses slow onion caramelization to recreate authentic Aganyin aroma from everyday pantry staples.",
        "chef_tips": "Darkening the onions slowly on medium heat is the exact culinary secret behind authentic Aganyin pepper sauce."
      },
      {
        "title": "Slow-Simmered Honey Beans Pottage with Smoked Fish & Fresh Scent Leaf",
        "description": "Hearty, rich Nigerian bean pottage: sweet brown beans stewed with smoked fish flakes, pure tomato-pepper reduction, and golden fried plantains folded in with fragrant scent leaves.",
        "meal_type": "proper",
        "financial_tier": "comfortable",
        "estimated_cost_tier": "~\u20a62,400 (Comfortable)",
        "prep_time_minutes": 10,
        "cook_time_minutes": 30,
        "difficulty": "Medium",
        "servings": 4,
        "fridge_ingredients_used": [
          "Cooked Honey Beans (Oloyin)",
          "Smoked Fish Flakes",
          "Ripe Sweet Plantains",
          "Plum Tomatoes",
          "Red Onions",
          "Scotch Bonnet (Ata Rodo)",
          "Fresh Scent Leaves (Efirin)"
        ],
        "missing_ingredients_needed": [
          "1 tbsp Ground Crayfish"
        ],
        "instructions": [
          "Blend tomatoes, ata rodo, and one onion bulb coarsely.",
          "In a deep pot, combine cooked honey beans, blended pepper, and washed smoked fish flakes.",
          "Add 1 cup of water and simmer for 15 minutes, allowing fish stock to infuse the beans.",
          "Fry diced plantains in a separate pan until sweet and golden.",
          "Gently fold fried plantains and shredded scent leaves into the bubbling bean pottage for 3 minutes."
        ],
        "why_this_recipe": "Layers smoked fish umami into creamy honey beans while scent leaves cut through bean starch with a clean, digestive herbal note.",
        "chef_tips": "Folding fried plantains in at the very end keeps them from turning mushy while absorbing rich bean gravy."
      },
      {
        "title": "10-Minute Sizzled Honey Beans & Sweet Onion Mash",
        "description": "Comfort food in its purest, most wholesome form: pre-cooked sweet honey beans warmed and lightly mashed with red onions and ata rodo sizzled in vegetable oil.",
        "meal_type": "quick",
        "financial_tier": "budget",
        "estimated_cost_tier": "~\u20a6500 (Everyday Budget)",
        "prep_time_minutes": 2,
        "cook_time_minutes": 8,
        "difficulty": "Easy",
        "servings": 2,
        "fridge_ingredients_used": [
          "Cooked Honey Beans (Oloyin)",
          "Red Onions",
          "Scotch Bonnet (Ata Rodo)",
          "Pure Vegetable Oil"
        ],
        "missing_ingredients_needed": [],
        "instructions": [
          "Dice red onions and slice scotch bonnet finely.",
          "Heat 2 tablespoons of vegetable oil in a pot and sizzle onions for 2 minutes until translucent.",
          "Add ata rodo and cooked honey beans with 3 tablespoons of water.",
          "Simmer for 4 minutes, gently crushing a portion of the beans with a wooden spoon for creamy gravy."
        ],
        "why_this_recipe": "Takes advantage of pre-cooked honey beans to yield a high-protein, zero-waste hot meal in under 10 minutes without firing up long cooking cycles.",
        "chef_tips": "Crushing roughly a quarter of the beans creates a velvety sauce without needing any flour or starch."
      },
      {
        "title": "Sweet Dodo & Fresh Efirin Herb Scrambled Eggs",
        "description": "A fast, aromatic morning scramble: sweet plantain cubes tossed with beaten eggs and torn fresh scent leaves for an earthy clove fragrance.",
        "meal_type": "quick",
        "financial_tier": "comfortable",
        "estimated_cost_tier": "~\u20a61,400 (Comfortable)",
        "prep_time_minutes": 4,
        "cook_time_minutes": 10,
        "difficulty": "Easy",
        "servings": 2,
        "fridge_ingredients_used": [
          "Ripe Sweet Plantains",
          "Fresh Eggs",
          "Fresh Scent Leaves (Efirin)",
          "Red Onions",
          "Pure Vegetable Oil"
        ],
        "missing_ingredients_needed": [
          "1 pinch Black Pepper"
        ],
        "instructions": [
          "Dice plantains into bite-sized cubes and pan-fry in oil until golden.",
          "In a bowl, whisk eggs with torn scent leaves and diced onions.",
          "Pour eggs over warm plantains in the pan, folding gently for 2 minutes until soft.",
          "Serve immediately with hot tea or warm bread."
        ],
        "why_this_recipe": "Marries the sweet, caramelized notes of ripe plantains with the peppery clove aroma of fresh scent leaves in a protein-rich egg fold.",
        "chef_tips": "Tear scent leaves by hand instead of cutting with a knife to release essential fragrant oils without bruising."
      },
      {
        "title": "Pan-Saut\u00e9ed Peppered Honey Beans Quick Stir",
        "description": "Fast pantry stir-fry: whole honey beans pan-tossed with caramelized red onions, tomato dice, and mild chili.",
        "meal_type": "quick",
        "financial_tier": "budget",
        "estimated_cost_tier": "~\u20a6550 (Everyday Budget)",
        "prep_time_minutes": 2,
        "cook_time_minutes": 7,
        "difficulty": "Easy",
        "servings": 2,
        "fridge_ingredients_used": [
          "Cooked Honey Beans (Oloyin)",
          "Plum Tomatoes",
          "Red Onions",
          "Pure Vegetable Oil"
        ],
        "missing_ingredients_needed": [],
        "instructions": [
          "Heat 1.5 tablespoons of vegetable oil in skillet.",
          "Add diced onions and tomatoes; cook down for 3 minutes until fragrant.",
          "Toss in cooked honey beans, stirring over medium heat for 4 minutes until thoroughly warmed through."
        ],
        "why_this_recipe": "Quick, light pantry meal that requires zero preparation and delivers wholesome sustained energy.",
        "chef_tips": "Pan-tossing whole beans on medium-high heat gives the skin a pleasant slight crispness."
      }
    ],
    "shopping_list": [
      {
        "item": "Ground Dried Crayfish",
        "estimated_cost": "~\u20a6250 (Pantry stall)",
        "for_recipes": [
          "Slow-Simmered Honey Beans Pottage"
        ]
      },
      {
        "item": "Ground Dried Chili Flakes",
        "estimated_cost": "~\u20a6150 (Spice merchant)",
        "for_recipes": [
          "Classic Ewa Aganyin"
        ]
      }
    ]
  }
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingRecipes, setUpdatingRecipes] = useState(false);
  const [statusStep, setStatusStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProcessResponse | null>(null);

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

      // 6. Ingredients additions/removals if data exists
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
      }

      if (changeSummaries.length > 0) {
        setVoiceAppliedChanges(changeSummaries.join(" • "));
      } else {
        setVoiceAppliedChanges("Preferences understood, ready to cook.");
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

  // Instant Demo Trigger
  const triggerDemo = async (sampleType: "market" | "pantry" | "native" = "market") => {
    setLoading(true);
    setError(null);
    setStatusStep(`Loading ${sampleType === "market" ? "Lagos Market" : sampleType === "pantry" ? "Pantry & Beans" : "Native Greens"} curated demo...`);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/demo/${sampleType}?spice_level=${encodeURIComponent(spiceLevel)}&cooking_fuel=${encodeURIComponent(cookingFuel)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const result: ProcessResponse = await res.json();
        setData(result);
        setActiveTab("quick");
        setCompletedSteps({});
        setCheckedShoppingItems(new Set());
        scrollToResults();
        return;
      }
      throw new Error(`Server returned ${res.status}`);
    } catch {
      const fallbackResult = CLIENT_DEMO_DATA[sampleType] || CLIENT_DEMO_DATA.market;
      setData(fallbackResult);
      setActiveTab("quick");
      setCompletedSteps({});
      setCheckedShoppingItems(new Set());
      scrollToResults();
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
    bgGrad.addColorStop(0.5, "#1F5C3A");
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

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please snap or upload a photo of your kitchen first.");
      return;
    }

    if (selectedFile.name.startsWith("provisions_")) {
      const type = selectedFile.name.includes("pantry")
        ? "pantry"
        : selectedFile.name.includes("native")
        ? "native"
        : "market";
      triggerDemo(type);
      return;
    }

    setLoading(true);
    setError(null);
    setStatusStep("Looking closely at your kitchen photo...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const timer1 = setTimeout(() => {
        setStatusStep("Spotting ingredients across your kitchen...");
      }, 900);

      const timer2 = setTimeout(() => {
        setStatusStep("Finding Nigerian meals to match your ingredients...");
      }, 1800);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/process?spice_level=${encodeURIComponent(spiceLevel)}&cooking_fuel=${encodeURIComponent(cookingFuel)}`,
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
      setData(result);
      setActiveTab("quick");
      setCompletedSteps({});
      setCheckedShoppingItems(new Set());
      scrollToResults();
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
— Generated by ChopSnap (Snap your kitchen. Know what to chop.)`;

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
    setData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const quickRecipes = data?.recipes.filter((r) => r.meal_type === "quick") || [];
  const properRecipes = data?.recipes.filter((r) => r.meal_type !== "quick") || [];

  const displayedRecipes = (activeTab === "quick" ? quickRecipes : properRecipes).filter((r) => {
    if (tierFilter === "all") return true;
    return r.financial_tier === tierFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#1F5C3A] selection:text-white overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-page)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2.5">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={resetAll}
              className="flex items-center gap-2 focus:outline-none cursor-pointer"
              aria-label="ChopSnap Home"
            >
              <Image
                src="/logo.svg"
                alt="ChopSnap"
                width={190}
                height={46}
                priority
                className="h-10 sm:h-11 w-auto object-contain shrink-0"
              />
            </button>
            <div className="hidden md:block min-w-0 pl-3 border-l border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-muted)] font-medium truncate">
                Snap your kitchen. Know what to chop.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] shadow-sm">
              {data ? (
                data.is_demo ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#E8590C]" />
                    <span className="font-semibold text-[var(--text-primary)]">Curated Demo Mode</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#1F5C3A] dark:bg-[#86EFAC] animate-pulse" />
                    <span className="font-semibold text-[var(--text-primary)]">Live Kitchen Analysis</span>
                  </>
                )
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#1F5C3A] dark:bg-[#86EFAC]" />
                  <span>AI Ready</span>
                </>
              )}
            </div>

            <button
              onClick={toggleTheme}
              type="button"
              className="min-h-[42px] px-2.5 sm:px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm active:scale-95 cursor-pointer"
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-[#FB923C]" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#1F5C3A]" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowOpenWeightModal(true)}
              type="button"
              className="min-h-[42px] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] shadow-sm active:scale-95 cursor-pointer"
              title="Why Open-Weight Models?"
            >
              <Info className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC]" />
              <span className="hidden sm:inline">Why Open-Weight?</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sticky Compact Active Scan Bar */}
      {data && (
        <div className="sticky top-18 sm:top-20 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F5C3A] dark:bg-[#86EFAC] shrink-0 animate-pulse" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate">
                  {selectedFile?.name || "Kitchen Ingredients Scan"}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate hidden sm:block">
                  {data.detected_items.length} ingredients active • {data.recipes.length} recipes matched
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-text)] hover:opacity-90 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span>Change photo</span>
              </button>

              <button
                type="button"
                onClick={resetAll}
                className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[#D94F04] transition-all text-xs font-medium flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Start fresh scan"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">New scan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 space-y-10 sm:space-y-16">
        {/* ==============================================================
            SECTION 1: HERO (Above fold on 1366x768 & Phones)
           ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Primary Action */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-text)] text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
              <span>Snap your kitchen. Know what to chop.</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)] leading-[1.15] tracking-tight">
              Cook celebratory Nigerian meals from what’s{" "}
              <span className="italic text-[#1F5C3A] dark:text-[#86EFAC]">already in your kitchen.</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-snug font-sans">
              Snap your fridge, pantry shelf, or counter and get authentic Nigerian dishes matched to your ingredients and budget.
            </p>

            {/* Streamlined Upload Card */}
            <div className="chop-card p-4 sm:p-6 relative overflow-hidden shadow-md">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="kitchen-upload-input"
              />

              {!previewUrl ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    {/* Snap Button / Area (3 cols) */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current?.click()}
                      className="sm:col-span-3 group border-2 border-dashed border-[var(--border-default)] hover:border-[#1F5C3A] dark:hover:border-[#287A4D] rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] flex flex-col items-center justify-center min-h-[140px]"
                    >
                      <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-[var(--primary-subtle)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary-text)] group-hover:scale-105 transition-transform duration-200 shadow-sm">
                        <Camera className="w-5 h-5 text-[#1F5C3A] dark:text-[#86EFAC]" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
                        Snap fridge, shelf, or counter
                      </p>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        Tap photo or drag & drop here
                      </p>
                    </div>

                    {/* Speak Mic Action Box (1 col) */}
                    <div className="sm:col-span-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3 flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[140px]">
                      <div className="w-full flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Speak
                        </span>
                        {isListening && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-500 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {recordingSeconds}s
                          </span>
                        )}
                      </div>

                      {voiceSupported ? (
                        <button
                          type="button"
                          onClick={startVoiceRecognition}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer active:scale-90 ${
                            isListening
                              ? "bg-rose-600 hover:bg-rose-700 text-white animate-bounce shadow-rose-600/30 ring-4 ring-rose-500/20"
                              : "bg-[#1F5C3A] hover:bg-[#17472D] text-white shadow-[#1F5C3A]/25 hover:scale-105"
                          }`}
                          title={isListening ? "Press to stop recording" : "Press to start speaking instructions"}
                          aria-label={isListening ? "Stop listening" : "Start voice input"}
                        >
                          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                          <Volume2 className="w-5 h-5" />
                        </div>
                      )}

                      <p className="text-[11px] font-medium text-[var(--text-secondary)] leading-tight">
                        {isListening ? "Listening (tap stop)" : voiceSupported ? "Tap to speak" : "Type below"}
                      </p>
                    </div>
                  </div>

                  {/* Language Selector + Voice Guidance */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-medium">Voice Language:</span>
                      <select
                        value={voiceLang}
                        onChange={(e) => setVoiceLang(e.target.value)}
                        disabled={isListening}
                        className="text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-[#1F5C3A]"
                      >
                        <option value="en-NG">English (en-NG)</option>
                        <option value="en-NG">Nigerian Pidgin (en-NG)</option>
                        <option value="yo-NG">Yorùbá (yo-NG) [Beta]</option>
                        <option value="ha-NG">Hausa (ha-NG) [Beta]</option>
                        <option value="ig-NG">Igbo (ig-NG) [Beta]</option>
                      </select>
                      {(voiceLang === "yo-NG" || voiceLang === "ha-NG" || voiceLang === "ig-NG") && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E8590C]/15 text-[#E8590C] border border-[#E8590C]/25">
                          BETA
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">
                      30s max • Editable before send
                    </span>
                  </div>

                  {/* Editable Transcript Text Box */}
                  {(voiceTranscript || !voiceSupported || isListening) && (
                    <div className="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-[#1F5C3A] dark:text-[#86EFAC]" />
                          Spoken / Typed Instructions
                        </label>
                        {voiceTranscript && (
                          <button
                            type="button"
                            onClick={() => setVoiceTranscript("")}
                            className="text-[10px] text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <textarea
                        value={voiceTranscript}
                        onChange={(e) => setVoiceTranscript(e.target.value)}
                        placeholder="e.g. 'Abeg make food for 4 people no put pork, budget na 3000 naira, mild pepper'"
                        rows={2}
                        className="w-full text-xs sm:text-sm p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#1F5C3A] resize-none"
                      />

                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Edit text freely, then apply to settings.
                        </span>
                        <button
                          type="button"
                          onClick={handleInterpretVoice}
                          disabled={voiceInterpreting || !voiceTranscript.trim()}
                          className={`min-h-[30px] px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            voiceInterpreting || !voiceTranscript.trim()
                              ? "bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]"
                              : "bg-[#1F5C3A] hover:bg-[#17472D] text-white shadow-sm active:scale-95"
                          }`}
                        >
                          {voiceInterpreting ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Interpreting...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 text-[#E8590C]" />
                              <span>Apply to Plan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Feedback / Error / Changes Banner */}
                  {voiceMessage && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{voiceMessage}</span>
                    </div>
                  )}

                  {voiceAppliedChanges && (
                    <div className="p-2.5 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-text)] text-xs flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC] shrink-0" />
                        <span className="truncate font-medium">{voiceAppliedChanges}</span>
                      </div>
                      {previousVoiceState && (
                        <button
                          type="button"
                          onClick={handleUndoVoice}
                          className="px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#D94F04] text-[var(--text-primary)] hover:text-[#D94F04] font-semibold text-[11px] shrink-0 flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <Undo2 className="w-3 h-3" />
                          <span>Undo</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] group aspect-[16/9] max-h-48 flex items-center justify-center shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Kitchen Snapshot"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white gap-2">
                      <span className="truncate max-w-[190px] font-medium opacity-95">
                        {selectedFile?.name || "kitchen_snapshot.jpg"}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {voiceSupported && (
                          <button
                            onClick={startVoiceRecognition}
                            type="button"
                            className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-xs text-white backdrop-blur-sm transition-all active:scale-95 flex items-center gap-1 cursor-pointer ${
                              isListening
                                ? "bg-rose-600 border-rose-400 animate-pulse ring-2 ring-rose-400/40"
                                : "bg-black/60 hover:bg-black/80 border-white/20"
                            }`}
                            title="Speak instruction"
                          >
                            <Mic className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isListening ? `${recordingSeconds}s` : "Speak"}</span>
                          </button>
                        )}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                          className="min-h-[32px] px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 text-xs text-white backdrop-blur-sm transition-colors active:scale-95 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transcript box when photo preview is present */}
                  {(voiceTranscript || isListening) && (
                    <div className="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-[#1F5C3A] dark:text-[#86EFAC]" />
                          Spoken Instructions
                        </label>
                        <button
                          type="button"
                          onClick={() => setVoiceTranscript("")}
                          className="text-[10px] text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                      <textarea
                        value={voiceTranscript}
                        onChange={(e) => setVoiceTranscript(e.target.value)}
                        placeholder="e.g. 'Make food for 4 people no put pork, budget na 3000 naira'"
                        rows={2}
                        className="w-full text-xs p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#1F5C3A] resize-none"
                      />
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={handleInterpretVoice}
                          disabled={voiceInterpreting || !voiceTranscript.trim()}
                          className="min-h-[28px] px-3 py-1 rounded-lg text-xs font-semibold bg-[#1F5C3A] hover:bg-[#17472D] text-white flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          {voiceInterpreting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-[#E8590C]" />}
                          <span>Apply to Plan</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {voiceAppliedChanges && (
                    <div className="p-2.5 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-text)] text-xs flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC] shrink-0" />
                        <span className="truncate font-medium">{voiceAppliedChanges}</span>
                      </div>
                      {previousVoiceState && (
                        <button
                          type="button"
                          onClick={handleUndoVoice}
                          className="px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#D94F04] text-[var(--text-primary)] hover:text-[#D94F04] font-semibold text-[11px] shrink-0 flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <Undo2 className="w-3 h-3" />
                          <span>Undo</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Knob */}
              <div className="mt-3.5 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="w-full min-h-[36px] flex items-center justify-between text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-0.5 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#1F5C3A] dark:text-[#86EFAC] shrink-0" />
                    Spice, Servings & Fuel ({householdSize} {householdSize === 1 ? "person" : "people"}, {spiceLevel}, {cookingFuel.toUpperCase()})
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                      showPreferences ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showPreferences && (
                  <div className="mt-2.5 space-y-3.5 p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[var(--text-muted)] font-medium">Spice Level</label>
                        <span className="text-[var(--text-muted)] text-[11px]">
                          {spiceLevel === "Mild" ? "1 Ata Rodo / 2 Servings" : spiceLevel === "Authentic Hot" ? "3 Ata Rodo / 2 Servings" : "5+ Ata Rodo / 2 Servings"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(["Mild", "Authentic Hot", "Suya Extra"] as const).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setSpiceLevel(level)}
                            className={`min-h-[36px] py-1 px-1.5 rounded-lg text-center text-xs transition-all active:scale-95 font-medium cursor-pointer ${
                              spiceLevel === level
                                ? "bg-[#1F5C3A] text-white shadow-sm dark:bg-[#287A4D]"
                                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[var(--text-muted)] font-medium">Cooking Fuel</label>
                        <span className="text-[var(--text-primary)] font-semibold text-xs capitalize">{cookingFuel}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(["gas", "charcoal", "electric", "kerosene"] as const).map((fuel) => (
                          <button
                            key={fuel}
                            type="button"
                            onClick={() => setCookingFuel(fuel)}
                            className={`min-h-[36px] py-1 px-1 rounded-lg text-center text-xs transition-all active:scale-95 font-medium cursor-pointer capitalize ${
                              cookingFuel === fuel
                                ? "bg-[#1F5C3A] text-white shadow-sm dark:bg-[#287A4D]"
                                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                            }`}
                          >
                            {fuel === "gas" && "⚡ Gas"}
                            {fuel === "charcoal" && "🔥 Charcoal"}
                            {fuel === "electric" && "🔌 Electric"}
                            {fuel === "kerosene" && "⏱️ Kerosene"}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1.5 italic">
                        {cookingFuel === "gas" && "Gas: Instant controllable heat, standard cook times."}
                        {cookingFuel === "charcoal" && "Charcoal: +10m prep for hot glowing coals, rich smoky flavor."}
                        {cookingFuel === "electric" && "Electric: +3m coil preheat, steady uniform heat."}
                        {cookingFuel === "kerosene" && "Kerosene: +2m wick stabilization, gentle steady simmer."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[var(--text-muted)] font-medium">Household Servings</label>
                        <span className="text-[var(--text-primary)] font-semibold text-xs">{householdSize} Servings</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={6}
                        step={1}
                        value={householdSize}
                        onChange={(e) => setHouseholdSize(Number(e.target.value))}
                        className="w-full accent-[#1F5C3A] dark:accent-[#287A4D] cursor-pointer h-5"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !selectedFile}
                  className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md cursor-pointer ${
                    loading || !selectedFile
                      ? "bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]"
                      : "bg-[#1F5C3A] hover:bg-[#17472D] active:bg-[#123823] dark:bg-[#287A4D] dark:hover:bg-[#31945D] text-white shadow-[#1F5C3A]/20 hover:shadow-lg active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white shrink-0" />
                      <span className="truncate">{statusStep || "Finding what to chop..."}</span>
                    </>
                  ) : (
                    <>
                      <Utensils className="w-4 h-4 text-white shrink-0" />
                      <span>Show me what to chop</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-3.5 p-3 rounded-xl bg-[#FDEEEC] dark:bg-[#2E1816] border border-[#F5C2BC] dark:border-[#5C2A25] text-[#A6281E] dark:text-[#FCA5A5] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#D94F04] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold">Notice</p>
                    <p className="leading-relaxed">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Culinary Showcase */}
          <div className="lg:col-span-6">
            <div className="chop-card p-5 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-surface-subtle)] to-[var(--bg-surface)] shadow-lg border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="chop-pill chop-pill-accent text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-[#E8590C]" />
                  Nigerian Home Cooking
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">Zero Food Waste</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#2B1B12] via-[#3E2519] to-[#1F5C3A] p-5 sm:p-7 flex flex-col justify-between text-white shadow-inner">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8590C]/25 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1F5C3A]/35 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#FB923C] block">
                      Everyday Kitchen Magic
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#FFF8EF] leading-tight">
                      From Raw Ingredients to Royal Pots
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <ChefHat className="w-6 h-6 text-[#FFF8EF]" />
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
                  <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                    <p className="text-xs text-[#FB923C] font-semibold">Sweet Dodo</p>
                    <p className="text-xs text-white/80">Golden plantain cubes</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                    <p className="text-xs text-[#4ADE80] font-semibold">Fresh Ugwu</p>
                    <p className="text-xs text-white/80">Vitamin rich greens</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 col-span-2 sm:col-span-1">
                    <p className="text-xs text-[#FDBA74] font-semibold">Smoked Titus</p>
                    <p className="text-xs text-white/80">Deep savory umami</p>
                  </div>
                </div>

                <div className="relative z-10 p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#E8590C] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        Peppered Titus & Dodo Frittata
                      </p>
                      <p className="text-xs text-white/80 truncate">
                        Ready in ≤15 mins • Everyday Budget
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-white text-[#2B1B12] px-2.5 py-1 rounded-full shrink-0 shadow-sm">
                    ~₦850
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                  <p className="font-semibold text-[var(--text-primary)]">Quick Meals (≤20m)</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Fast weekday scrambles & pan roasts</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                  <p className="font-semibold text-[var(--text-primary)]">Proper Cooking</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Soul-satisfying soups, stews & beans</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 2: HOW IT WORKS
           ============================================================== */}
        <section className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[var(--text-primary)]">
              How ChopSnap Works
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Three simple steps to waste nothing and eat well every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="chop-card p-5 sm:p-6 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-text)] flex items-center justify-center font-bold text-base shadow-sm">
                  1
                </div>
                <span className="chop-pill chop-pill-primary">Snap</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Snap Your Kitchen
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Take a clear snapshot of your fridge crisper, pantry cupboard, or kitchen counter basket.
              </p>
            </div>

            <div className="chop-card p-5 sm:p-6 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent-text)] flex items-center justify-center font-bold text-base shadow-sm">
                  2
                </div>
                <span className="chop-pill chop-pill-accent">Check</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Check What You Have
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                We spot your proteins, produce, and staples. You can add or remove items to customize the list.
              </p>
            </div>

            <div className="chop-card p-5 sm:p-6 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[var(--primary-text)] flex items-center justify-center font-bold text-base shadow-sm">
                  3
                </div>
                <span className="chop-pill chop-pill-primary">Cook</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Cook and Waste Nothing
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Follow simple, step-by-step instructions. If an ingredient is missing, a tiny shopping list is ready.
              </p>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 3: TRY AN EXAMPLE
           ============================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 border-b border-[var(--border-subtle)] pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8590C] uppercase tracking-wider mb-0.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant Demo Mode</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[var(--text-primary)]">
                Try an example
              </h2>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              No photo ready right now? Tap any verified kitchen to test immediately:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
              onClick={() => handleLoadSample("market")}
              type="button"
              className="chop-card p-4 sm:p-5 text-left hover:border-[#1F5C3A] dark:hover:border-[#287A4D] transition-all group shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary-text)] flex items-center justify-center border border-[var(--primary-border)] group-hover:scale-105 transition-transform">
                  <Store className="w-4 h-4 text-[#D94F04]" />
                </div>
                <span className="chop-pill chop-pill-primary text-xs">Fridge & Counter</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] group-hover:text-[#1F5C3A] dark:group-hover:text-[#86EFAC] transition-colors flex items-center justify-between">
                <span>Lagos Market Haul</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                Fresh eggs, smoked Titus fish, sweet ripe plantains, plum tomatoes, ata rodo, and sliced ugwu.
              </p>
            </button>

            <button
              onClick={() => handleLoadSample("pantry")}
              type="button"
              className="chop-card p-4 sm:p-5 text-left hover:border-[#E8590C] transition-all group shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent-text)] flex items-center justify-center border border-[var(--accent-border)] group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4 text-[#E8590C]" />
                </div>
                <span className="chop-pill chop-pill-accent text-xs">Pantry Shelf</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] group-hover:text-[#E8590C] transition-colors flex items-center justify-between">
                <span>Honey Beans Station</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                Cooked Oloyin honey beans, fresh scent leaves (efirin), dodo plantains, eggs, and smoked fish flakes.
              </p>
            </button>

            <button
              onClick={() => handleLoadSample("native")}
              type="button"
              className="chop-card p-4 sm:p-5 text-left hover:border-[#1F5C3A] dark:hover:border-[#287A4D] transition-all group shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary-text)] flex items-center justify-center border border-[var(--primary-border)] group-hover:scale-105 transition-transform">
                  <Salad className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC]" />
                </div>
                <span className="chop-pill chop-pill-primary text-xs">Native Crisper</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] group-hover:text-[#1F5C3A] dark:group-hover:text-[#86EFAC] transition-colors flex items-center justify-between">
                <span>Native Greens Crisper</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                Fresh pumpkin ugwu leaves, smoked catfish mangala, stockfish bits (okporoko), and pure red palm oil.
              </p>
            </button>
          </div>
        </section>

        {/* ==============================================================
            SECTION 4: RESULTS & DETECTED INGREDIENTS PANEL
           ============================================================== */}
        <div id="results-section" ref={resultsRef} className="pt-2">
          {/* Loading State */}
          {loading && (
            <div className="chop-card p-7 sm:p-10 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary-text)] mb-4 shadow-sm">
                <ChefHat className="w-8 h-8 animate-bounce text-[#1F5C3A] dark:text-[#86EFAC]" />
              </div>

              <div className="chop-pill chop-pill-primary mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
                <span>Finding What to Chop</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-normal text-[var(--text-primary)] mb-2">
                Finding What You Can Cook
              </h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed font-sans px-2">
                {statusStep || "Looking closely at your ingredients..."}
              </p>

              <div className="flex flex-col gap-2.5 w-full max-w-sm text-xs text-left">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC] shrink-0" />
                    <span className="text-[var(--text-primary)] font-medium">Reading ingredients from photo</span>
                  </div>
                  <span className="chop-pill chop-pill-primary text-xs">Done</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--primary-border)]">
                  <div className="flex items-center gap-2.5">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#E8590C] shrink-0" />
                    <span className="text-[var(--text-primary)] font-semibold">Matching Nigerian recipes</span>
                  </div>
                  <span className="chop-pill chop-pill-accent text-xs">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Results State */}
          {data && !loading && (
            <div className="space-y-6">
              {/* Status Indicator Bar */}
              <div className="chop-card p-4 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    {data.is_demo ? (
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E8590C]" />
                    ) : (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F5C3A] dark:bg-[#86EFAC] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1F5C3A] dark:bg-[#86EFAC]" />
                      </>
                    )}
                  </span>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {data.is_demo ? "Using Curated Demo Data" : "Live Kitchen Analysis Active"}
                    </span>
                    <span className="text-[var(--text-muted)] hidden sm:inline">•</span>
                    <span className="text-xs text-[var(--text-muted)] hidden sm:inline truncate max-w-xs">
                      {data.is_demo
                        ? (data.model_metadata?.demo_scenario || "Curated Nigerian Household Scenario")
                        : "Real-time AI analysis of your ingredients"}
                    </span>
                  </div>
                </div>

                <span className={`chop-pill ${data.is_demo ? "chop-pill-accent" : "chop-pill-primary"} self-start sm:self-auto`}>
                  {data.is_demo ? "Demo Mode" : "Real Model Output"}
                </span>
              </div>

              {/* ==========================================================
                  FEATURE B: DETECTED INGREDIENTS PANEL (Next to Photo)
                  Editable Chips + Add Item Input + "Update Recipes" Button
                 ========================================================== */}
              <div className="chop-card p-5 sm:p-7 shadow-md border-2 border-[var(--primary-border)] relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Photo Thumbnail (Beside Panel) */}
                  <div className="lg:col-span-4 space-y-2.5">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] shadow-inner flex items-center justify-center group">
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt="Scanned Kitchen Photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-4 text-center">
                          <Camera className="w-8 h-8 mx-auto text-[#1F5C3A] dark:text-[#86EFAC] mb-2" />
                          <p className="text-xs text-[var(--text-muted)]">Verified Kitchen Scan</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="font-semibold truncate max-w-[150px]">
                          {selectedFile?.name || "Kitchen Photo"}
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2 py-0.5 rounded bg-black/60 hover:bg-black/80 border border-white/20 text-xs text-white backdrop-blur-sm cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] text-center">
                      Ingredients detected directly from this kitchen photo
                    </p>
                  </div>

                  {/* Editable Chips & Regeneration Area */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC]" />
                          <span>Detected Ingredients ({data.detected_items.length})</span>
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Remove wrong items with <strong>(×)</strong>, or type extra items below. Tap <strong>Update recipes</strong> to re-cook.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleUpdateRecipes}
                        disabled={updatingRecipes || data.detected_items.length === 0}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1F5C3A] hover:bg-[#17472D] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {updatingRecipes ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Updating recipes...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span>Update recipes</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Removable Chips */}
                    <div className="flex flex-wrap items-center gap-2 min-h-[48px] p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                      {data.detected_items.length === 0 ? (
                        <p className="text-xs text-[var(--text-muted)] italic">
                          No ingredients in list. Type an ingredient below to add!
                        </p>
                      ) : (
                        data.detected_items.map((item, idx) => {
                          const isProduce = item.category === "Produce";
                          const isProtein = item.category === "Protein";

                          return (
                            <div
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--primary-border)] shadow-xs text-xs font-semibold text-[var(--text-primary)] transition-all group"
                            >
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isProduce
                                    ? "bg-[#1F5C3A] dark:bg-[#86EFAC]"
                                    : isProtein
                                    ? "bg-[#E8590C]"
                                    : "bg-[#D97706]"
                                }`}
                              />
                              <span>{item.name}</span>
                              {item.estimated_quantity && (
                                <span className="text-xs px-1.5 py-0.5 rounded-md bg-[var(--border-subtle)] text-[var(--text-muted)] font-normal">
                                  {item.estimated_quantity}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveIngredient(idx)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[#D94F04] hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-0.5 cursor-pointer"
                                title={`Remove ${item.name}`}
                                aria-label={`Remove ${item.name}`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Add Missing Item Input Row */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <div className="relative flex-1 w-full">
                        <input
                          type="text"
                          value={newIngredientName}
                          onChange={(e) => setNewIngredientName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddIngredient();
                            }
                          }}
                          placeholder="Add ingredient (e.g. Crayfish, Yam, Stockfish)..."
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1F5C3A]"
                        />
                      </div>

                      <div className="w-full sm:w-44">
                        <input
                          type="text"
                          value={newIngredientQty}
                          onChange={(e) => setNewIngredientQty(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddIngredient();
                            }
                          }}
                          placeholder="Qty (e.g. 1 bunch, 2 bulbs)"
                          className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1F5C3A]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddIngredient}
                        disabled={!newIngredientName.trim()}
                        className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl bg-[var(--primary-subtle)] hover:bg-[var(--primary-border)] border border-[var(--primary-border)] text-[var(--primary-text)] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Category Navigation Tabs */}
              <div className="border-b border-[var(--border-subtle)] pb-1">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                  <button
                    onClick={() => setActiveTab("quick")}
                    className={`min-h-[44px] px-4 py-2 flex items-center justify-center gap-2 rounded-xl transition-all whitespace-nowrap text-xs sm:text-sm font-semibold cursor-pointer ${
                      activeTab === "quick"
                        ? "bg-[#1F5C3A] text-white shadow-sm dark:bg-[#287A4D]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]"
                    }`}
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>Quick Meals (≤20m)</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "quick" ? "bg-white/20 text-white" : "bg-[var(--border-subtle)] text-[var(--text-secondary)]"}`}>
                      {quickRecipes.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("proper")}
                    className={`min-h-[44px] px-4 py-2 flex items-center justify-center gap-2 rounded-xl transition-all whitespace-nowrap text-xs sm:text-sm font-semibold cursor-pointer ${
                      activeTab === "proper"
                        ? "bg-[#1F5C3A] text-white shadow-sm dark:bg-[#287A4D]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]"
                    }`}
                  >
                    <Utensils className="w-4 h-4 shrink-0" />
                    <span>Proper Cooking</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "proper" ? "bg-white/20 text-white" : "bg-[var(--border-subtle)] text-[var(--text-secondary)]"}`}>
                      {properRecipes.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("ingredients")}
                    className={`min-h-[44px] px-4 py-2 flex items-center justify-center gap-2 rounded-xl transition-all whitespace-nowrap text-xs sm:text-sm font-semibold cursor-pointer ${
                      activeTab === "ingredients"
                        ? "bg-[#1F5C3A] text-white shadow-sm dark:bg-[#287A4D]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Ingredients</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "ingredients" ? "bg-white/20 text-white" : "bg-[var(--border-subtle)] text-[var(--text-secondary)]"}`}>
                      {data.detected_items.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("shopping")}
                    className={`min-h-[44px] px-4 py-2 flex items-center justify-center gap-2 rounded-xl transition-all whitespace-nowrap text-xs sm:text-sm font-semibold cursor-pointer ${
                      activeTab === "shopping"
                        ? "bg-[#1F5C3A] text-white shadow-sm dark:bg-[#287A4D]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    <span>Shopping</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "shopping" ? "bg-white/20 text-white" : "bg-[var(--border-subtle)] text-[var(--text-secondary)]"}`}>
                      {data.shopping_list.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Economic Tier Filter Bar */}
              {(activeTab === "quick" || activeTab === "proper") && (
                <div className="chop-card p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Wallet className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC] shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm">Economic Tier:</span>
                  </div>

                  <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setTierFilter("all")}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xl transition-all font-medium text-xs text-center flex items-center justify-center active:scale-95 cursor-pointer ${
                        tierFilter === "all"
                          ? "bg-[#1F5C3A] text-white shadow-sm dark:bg-[#287A4D]"
                          : "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <span>All</span>
                      <span className="ml-1 opacity-80">
                        ({activeTab === "quick" ? quickRecipes.length : properRecipes.length})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTierFilter("budget")}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xl transition-all font-medium text-xs text-center flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                        tierFilter === "budget"
                          ? "bg-[#1F5C3A] text-white shadow-sm dark:bg-[#287A4D]"
                          : "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 shrink-0" />
                      <span>Budget</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTierFilter("comfortable")}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xl transition-all font-medium text-xs text-center flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                        tierFilter === "comfortable"
                          ? "bg-[#1F5C3A] text-white shadow-sm dark:bg-[#287A4D]"
                          : "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                      <span>Comfortable</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Recipe Cards Feed (Feature A: Hero Image on each Recipe Card) */}
              {(activeTab === "quick" || activeTab === "proper") && (
                <div className="space-y-6">
                  {displayedRecipes.length === 0 ? (
                    <div className="chop-card p-8 text-center text-xs text-[var(--text-muted)]">
                      No recipes found matching the selected financial filter. Try choosing &quot;All&quot;.
                    </div>
                  ) : (
                    displayedRecipes.map((recipe, idx) => {
                      const completedCount = completedSteps[idx]?.size || 0;
                      const totalSteps = recipe.instructions.length;
                      const isBudget = recipe.financial_tier === "budget";

                      return (
                        <article
                          key={idx}
                          className="chop-card p-5 sm:p-8 space-y-5 shadow-sm"
                        >
                          {/* Feature A: Recipe Card Hero Image Area */}
                          <RecipeHeroImage recipe={recipe} />

                          {/* Recipe Header */}
                          <div className="space-y-2.5">
                            {/* Badges & Copy button */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="chop-pill chop-pill-primary">
                                  {recipe.meal_type === "quick" ? (
                                    <>
                                      <Zap className="w-3.5 h-3.5 shrink-0" /> Quick (≤20m)
                                    </>
                                  ) : (
                                    <>
                                      <Utensils className="w-3.5 h-3.5 shrink-0" /> Proper Cooking
                                    </>
                                  )}
                                </span>

                                <span className={`chop-pill ${isBudget ? "chop-pill-primary" : "chop-pill-accent"}`}>
                                  {isBudget ? (
                                    <>
                                      <Coins className="w-3.5 h-3.5 shrink-0" />
                                      <span>Budget Tier</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                      <span>Comfortable</span>
                                    </>
                                  )}
                                </span>

                                {recipe.estimated_cost_tier && (
                                  <span className="chop-pill chop-pill-neutral tabular-nums">
                                    <span>~</span>
                                    <span className="font-semibold tabular-nums">
                                      {recipe.estimated_cost_tier.replace(/^~\s*/, "")}
                                    </span>
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleCopyRecipe(recipe, idx)}
                                title="Copy recipe details"
                                className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
                              >
                                {copiedRecipeIndex === idx ? (
                                  <>
                                    <Check className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC]" />
                                    <span className="text-[var(--primary-text)] font-medium">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span className="hidden sm:inline font-medium">Copy</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-normal text-[var(--text-primary)] tracking-tight leading-snug">
                              {recipe.title}
                            </h3>
                          </div>

                          {/* Meta Specs Bar */}
                          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 text-xs text-[var(--text-secondary)]">
                            <span className="flex items-center justify-center sm:justify-start gap-1.5 bg-[var(--bg-surface-subtle)] p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                              <Clock className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC] shrink-0" />
                              <span className="truncate">{recipe.prep_time_minutes + recipe.cook_time_minutes}m total</span>
                            </span>
                            <span className="flex items-center justify-center sm:justify-start gap-1.5 bg-[var(--bg-surface-subtle)] p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                              <Flame className="w-4 h-4 text-[#D94F04] shrink-0" />
                              <span className="truncate">{recipe.difficulty}</span>
                            </span>
                            <span className="flex items-center justify-center sm:justify-start gap-1.5 bg-[var(--bg-surface-subtle)] p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                              <Utensils className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC] shrink-0" />
                              <span className="truncate">{recipe.servings} Servings</span>
                            </span>
                            <span className="flex items-center justify-center sm:justify-start gap-1.5 bg-[var(--bg-surface-subtle)] p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                              <Tag className="w-4 h-4 text-[#1F5C3A] dark:text-[#86EFAC] shrink-0" />
                              <span className="truncate">
                                {recipe.fridge_ingredients_used.length} of {data?.detected_items?.length || recipe.fridge_ingredients_used.length} used
                              </span>
                            </span>
                          </div>

                          {/* Story & Description */}
                          <p className="text-base text-[var(--text-secondary)] leading-relaxed font-sans">
                            {recipe.description}
                          </p>

                          {/* Reasoning Box */}
                          {recipe.why_this_recipe && (
                            <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs flex items-start gap-3 shadow-sm">
                              <div className="w-6 h-6 rounded-lg bg-[var(--primary-subtle)] text-[var(--primary-text)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--primary-border)]">
                                <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
                              </div>
                              <div className="space-y-1 min-w-0">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#1F5C3A] dark:text-[#86EFAC] flex items-center gap-1">
                                  Why this works
                                </span>
                                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                                  {recipe.why_this_recipe}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Ingredients Breakdown Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            {/* Used from Kitchen */}
                            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--primary-border)]">
                              <div className="flex items-center justify-between mb-2.5">
                                <p className="text-xs sm:text-sm font-semibold text-[#1F5C3A] dark:text-[#86EFAC] flex items-center gap-2 uppercase tracking-wider">
                                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                                  Used from Your Kitchen:
                                </p>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--primary-subtle)] text-[var(--primary-text)] border border-[var(--primary-border)]">
                                  {recipe.fridge_ingredients_used.length} of {data?.detected_items?.length || recipe.fridge_ingredients_used.length} used
                                </span>
                              </div>
                              <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-2 font-sans">
                                {recipe.fridge_ingredients_used.length > 0 ? (
                                  recipe.fridge_ingredients_used.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="w-2 h-2 rounded-full bg-[#1F5C3A] dark:bg-[#86EFAC] mt-1.5 shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-[var(--text-muted)] italic text-xs">Custom staples selected</li>
                                )}
                              </ul>
                            </div>

                            {/* Extra Items Needed */}
                            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--accent-border)]">
                              <p className="text-xs sm:text-sm font-semibold text-[#D94F04] dark:text-[#FDBA74] mb-2.5 flex items-center gap-2 uppercase tracking-wider">
                                <ShoppingCart className="w-4 h-4 shrink-0" />
                                Extra Items Needed:
                              </p>
                              <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-2 font-sans">
                                {recipe.missing_ingredients_needed.length > 0 ? (
                                  recipe.missing_ingredients_needed.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="w-2 h-2 rounded-full bg-[#E8590C] mt-1.5 shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-[var(--text-muted)] italic text-xs sm:text-sm">100% ready with what you already have!</li>
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* Step-by-Step Instructions */}
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                                Preparation Steps
                              </h4>
                              <span className="text-xs text-[var(--text-muted)] font-medium">
                                {completedCount} of {totalSteps} done
                              </span>
                            </div>

                            <ol className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                              {recipe.instructions.map((step, sIdx) => {
                                const isChecked = completedSteps[idx]?.has(sIdx) || false;

                                return (
                                  <li
                                    key={sIdx}
                                    onClick={() => toggleStep(idx, sIdx)}
                                    className={`min-h-[48px] flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl cursor-pointer transition-colors active:scale-[0.99] ${
                                      isChecked
                                        ? "bg-[var(--bg-surface-subtle)]/60 text-[var(--text-muted)] line-through"
                                        : "bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)]"
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-colors mt-0.5 cursor-pointer ${
                                        isChecked
                                          ? "bg-[#1F5C3A] border-[#1F5C3A] text-white"
                                          : "border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[#1F5C3A]"
                                      }`}
                                    >
                                      {isChecked ? (
                                        <Check className="w-3.5 h-3.5" />
                                      ) : (
                                        <span className="text-xs font-semibold text-[var(--text-muted)]">
                                          {sIdx + 1}
                                        </span>
                                      )}
                                    </button>
                                    <span className="leading-relaxed select-none text-sm">{step}</span>
                                  </li>
                                );
                              })}
                            </ol>
                          </div>

                          {/* Chef's Pro Tip */}
                          {recipe.chef_tips && (
                            <div className="p-4 sm:p-5 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-xs text-[var(--primary-text)] flex items-start gap-3 shadow-sm">
                              <div className="w-7 h-7 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center shrink-0 mt-0.5">
                                <ChefHat className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <span className="font-semibold uppercase tracking-wider text-xs block">
                                  Chef’s Secret Technique
                                </span>
                                <p className="leading-relaxed text-xs sm:text-sm font-sans">{recipe.chef_tips}</p>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              )}

              {/* Tab 3: Detected Ingredients */}
              {activeTab === "ingredients" && (
                <div className="chop-card p-5 sm:p-8 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                        Your Kitchen Ingredients
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        Spotted from your kitchen photo (fridge, pantry, or counter)
                      </p>
                    </div>
                    <span className="chop-pill chop-pill-primary self-start sm:self-auto">
                      {data.detected_items.length} items logged
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.detected_items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] hover:border-[var(--primary-border)] transition-colors"
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            Category: <span className="text-[#1F5C3A] dark:text-[#86EFAC] font-medium">{item.category}</span>
                          </p>
                        </div>
                        {item.estimated_quantity && (
                          <span className="chop-pill chop-pill-neutral text-xs">
                            {item.estimated_quantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Minimal Shopping List */}
              {activeTab === "shopping" && (
                <div className="chop-card p-5 sm:p-8 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                        Smart Minimal Shopping List
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        Only indispensable staples required to unlock all recipes
                      </p>
                    </div>
                    <button
                      onClick={handleCopyShoppingList}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#1F5C3A] hover:bg-[#17472D] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 self-start sm:self-auto shadow-sm cursor-pointer"
                    >
                      {copiedShoppingList ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Copied List</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy List</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.shopping_list.map((item, idx) => {
                      const isChecked = checkedShoppingItems.has(idx);

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleShoppingItem(idx)}
                          className={`min-h-[50px] p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] ${
                            isChecked
                              ? "bg-[var(--bg-surface-subtle)]/60 border-[var(--border-subtle)] text-[var(--text-muted)]"
                              : "bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--primary-border)] text-[var(--text-primary)]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                                isChecked
                                  ? "bg-[#1F5C3A] border-[#1F5C3A] text-white"
                                  : "border-[var(--border-default)] bg-[var(--bg-surface)]"
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p
                                className={`text-sm font-semibold truncate ${
                                  isChecked ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"
                                }`}
                              >
                                {item.item}
                              </p>
                              {item.for_recipes.length > 0 && (
                                <p className="text-xs text-[var(--text-muted)] truncate">
                                  Required for: {item.for_recipes.join(", ")}
                                </p>
                              )}
                            </div>
                          </div>

                          {item.estimated_cost && (
                            <span className="chop-pill chop-pill-accent tabular-nums shrink-0 text-xs">
                              {item.estimated_cost}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 4. Polished Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-page)] py-8 text-xs text-[var(--text-muted)] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 shadow-sm">
              <Image
                src="/icon.svg"
                alt="ChopSnap"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[var(--text-primary)] font-semibold">ChopSnap</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span>Meta Global AI Hackathon (Indie Track)</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-xs">
            <span>Powered by Meta Muse Glimmer (30B open-weight)</span>
          </div>
        </div>
      </footer>

      {/* 5. "Why Open-Weight?" Modal Dialog */}
      {showOpenWeightModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowOpenWeightModal(false)}
        >
          <div
            className="chop-card max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary-text)] flex items-center justify-center shrink-0 border border-[var(--primary-border)] shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-normal text-[var(--text-primary)]">
                    Why Open-Weight Models?
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Why ChopSnap uses open weights instead of closed APIs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOpenWeightModal(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[#D94F04] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Concrete Pillars */}
            <div className="space-y-4 text-xs text-[var(--text-secondary)]">
              <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-[#1F5C3A] dark:text-[#86EFAC] text-sm">
                  <Coins className="w-4 h-4 shrink-0" />
                  <span>1. Zero Per-Token Tax (Cost)</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Closed commercial APIs charge for every token and uploaded kitchen photo. For Nigerian home cooks and indie apps, API bills can rapidly spiral. Open-weight models run on self-managed servers at fixed, predictable costs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-[#1F5C3A] dark:text-[#86EFAC] text-sm">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>2. Household Privacy (Privacy)</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Snapshots of your home kitchen, pantry cupboards, and personal food habits never leak to third-party ad brokers or get ingested to train external commercial models. Your kitchen data stays yours.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-[#E8590C] text-sm">
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>3. True Independence (Can Be Hosted Ourselves)</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Proprietary APIs can change pricing, throttle rate limits, or shut down overnight. With open weights, the software is fully sovereign and can be deployed anywhere—from a cloud GPU to an offline edge machine in Lagos.
                </p>
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowOpenWeightModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#1F5C3A] hover:bg-[#17472D] text-xs font-semibold text-white transition-colors active:scale-95 shadow-sm cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
