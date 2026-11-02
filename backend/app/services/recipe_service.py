# NOTE: All demo recipes need review by an authentic Nigerian cook.

import hashlib
import json
import logging
import re
from typing import List, Tuple, Optional
import httpx
from ..config import settings
from ..models.schemas import DetectedItem, Recipe, ShoppingItem

logger = logging.getLogger(__name__)

# In-memory recipe cache by ingredient set + preferences + count
_RECIPE_CACHE = {}

def get_muse_system_prompt(recipe_count: int = 3) -> str:
    return f"""You are a master Nigerian culinary chef and resourceful home cook powered by Muse Spark Open.
Your mission: Given the household food items detected from the user's photo (from fridge, pantry, or kitchen counter), formulate {recipe_count} authentic Nigerian recipes categorized by meal-type and financial tier:

CRITICAL RECIPE STRUCTURE:
1. ORDERING RULE: Every ingredient set MUST produce at least one CLASSIC Nigerian heritage dish FIRST (e.g. ugwu + stockfish -> authentic Traditional Ofe Ugwu / Fisherman's Soup; tomatoes + rice -> Classic Obe Ata / Jollof / Fried Rice; beans -> Classic Ewa Aganyin or Pottage). Follow the classic dish with resourceful creative variations.
2. DISH MIX: Return {recipe_count} recipes covering both Quick Meals (ready in <= 20 mins) and Proper Cooking dishes (25-45 mins). Total recipes: {recipe_count}.
3. SPICE CALIBRATION (Scotch Bonnet / Ata Rodo):
   - Mild (default): 1 scotch bonnet for 2 servings (gentle warming flavor without burning heat).
   - Authentic Hot: 2-3 scotch bonnets for authentic Lagos street flavor.
   - Suya Extra: 4+ scotch bonnets plus dry pepper flakes for fierce heat.
4. COOKING FUEL ADAPTATION:
   - Gas: baseline cooking times.
   - Charcoal: +10-15m prep/simmer, ember management instructions.
   - Electric: +3-5m preheat, coil heat-retention instructions.
   - Kerosene: soot prevention, clean blue flame adjustment notes.
5. INGREDIENTS MAPPING:
   - fridge_ingredients_used: list ONLY the detected items actually utilized in the dish.
   - missing_ingredients_needed: list ONLY genuinely missing essential additions. Do NOT list assumed staples (salt, water, vegetable oil, seasoning cubes).
6. STRICT NON-HEALTH / NON-MEDICAL MANDATE:
   - You are a culinary and household budget assistant ONLY.
   - NEVER give health, medical, wellness, weight, fitness, or nutrition advice.
   - NEVER mention or claim health benefits (e.g. do NOT say "nutrient-dense", "vitamin-rich", "cleansing", "boosts immunity", or "healthy fats").
   - NEVER include calorie counts, macro breakdowns, or nutrient numbers.
   - Focus exclusively on taste, texture, authentic Nigerian cooking techniques, and budget efficiency.
7. STRICT INGREDIENT USAGE & UNCERTAINTY RULES:
   - Recipes MUST use ONLY the selected confirmed items provided in the kitchen provisions list.
   - NEVER assume the type of protein or oil when the certainty is unsure. If an item is listed as unsure or has alternatives (e.g. generic 'oil', 'fish', 'meat', or 'white powder'), NEVER arbitrarily assume it is chicken, beef, goat meat, palm oil, or groundnut oil unless specifically stated in the confirmed item name.
   - NEVER build a dish around residue or nearly-empty containers.
   - ASSUMPTIONS: If a recipe relies on any culinary assumption, you MUST include an "assumes" field explaining it clearly as "Assumes: <assumption>" (e.g. "Assumes: cooking oil is vegetable oil" or "Assumes: white powder is salt"). If no assumption was made, set "assumes": null.

Output Schema (return strictly valid JSON matching this schema):
{{
  "recipes": [
    {{
      "title": "Nigerian dish name (Classic dish first)",
      "description": "Appetizing culinary description",
      "meal_type": "quick | proper",
      "financial_tier": "budget | comfortable",
      "estimated_cost_tier": "~₦800 (Everyday Budget) | ~₦2,800 (Comfortable)",
      "prep_time_minutes": 10,
      "cook_time_minutes": 15,
      "difficulty": "Easy | Medium",
      "servings": 2,
      "fridge_ingredients_used": ["Item 1", "Item 2"],
      "missing_ingredients_needed": ["Small staple 1"],
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "why_this_recipe": "1-2 sentences explaining why this dish was chosen, why it is classic or creative, and how it maximizes on-hand ingredients.",
      "chef_tips": "Authentic Nigerian culinary secret",
      "assumes": "Assumes: cooking oil is vegetable oil, or null if none"
    }}
  ],
  "shopping_list": [
    {{
      "item": "Pantry staple name",
      "estimated_cost": "~₦150 (Pantry staple)",
      "for_recipes": ["Recipe title"]
    }}
  ]
}}
"""

MUSE_GLIMMER_SYSTEM_PROMPT = get_muse_system_prompt(3)

# NOTE: All demo recipes need review by an authentic Nigerian cook.
# High-Fidelity Authentic Nigerian Culinary Recipe Collections (Classic first, 2-3 Quick + 2-3 Proper)
RECIPE_COLLECTIONS = [
    # --------------------------------------------------------------------------
    # Collection 0: Lagos Market Haul (Fridge & Counter)
    # Signature: Tomatoes, Ata Rodo, Tatashe, Red Onions, Fresh Eggs, Plantains, Rice, Smoked Titus, Ugwu
    # --------------------------------------------------------------------------
    (
        [
            # 1. CLASSIC FIRST: Proper Cooking • Comfortable
            Recipe(
                title="Classic Lagos Sunday Obe Ata with Smoked Titus, Dodo & Steamed Rice",
                description="The undisputed pillar of Nigerian Sunday cuisine: richly simmered plum tomato and tatashe pepper stew braised with succulent smoked Titus mackerel, ladled over warm rice beside golden fried dodo.",
                meal_type="proper",
                financial_tier="comfortable",
                estimated_cost_tier="~₦2,800 (Comfortable)",
                prep_time_minutes=12,
                cook_time_minutes=25,
                difficulty="Medium",
                servings=4,
                fridge_ingredients_used=[
                    "Plum Tomatoes",
                    "Bell Pepper (Tatashe)",
                    "Scotch Bonnet (Ata Rodo)",
                    "Smoked Mackerel (Titus)",
                    "Ripe Sweet Plantains",
                    "Cooked White Rice",
                    "Red Onions",
                    "Pure Vegetable Oil",
                ],
                missing_ingredients_needed=["1 Garlic Clove", "1/2 inch Ginger Root"],
                instructions=[
                    "Roughly blend tomatoes, tatashe, scotch bonnet (scaled to spice level), ginger, garlic, and one onion bulb.",
                    "Heat vegetable oil in a deep pot, fry sliced onions until fragrant, then pour in blended pepper puree.",
                    "Boil uncovered for 15 minutes until oil floats to the surface and the raw pepper tang mellows.",
                    "Gently slide in deboned smoked mackerel steaks; simmer 8 minutes on low to allow smoky fish oils to infuse the sauce.",
                    "Serve piping hot ladled over reheated white rice with thick sliced fried sweet plantain fingers.",
                ],
                why_this_recipe="A cornerstone classic of Nigerian households: utilizes the full harvest of tomatoes, tatashe, and ata rodo, braising smoked Titus so savory ocean umami permeates the rich stew.",
                chef_tips="Boiling down the blended pepper base uncovered evaporates excess moisture fast, locking in deep natural tomato sweetness.",
            ),
            # 2. Proper Cooking • Budget
            Recipe(
                title="Buka-Style Street Fried Rice with Sliced Ugwu & Caramelized Dodo",
                description="Resourceful pantry alchemy transforming chilled white rice into fragrant turmeric-tinted fried rice tossed with shredded ugwu greens and crispy dodo cubes.",
                meal_type="proper",
                financial_tier="budget",
                estimated_cost_tier="~₦850 (Everyday Budget)",
                prep_time_minutes=8,
                cook_time_minutes=15,
                difficulty="Easy",
                servings=3,
                fridge_ingredients_used=[
                    "Cooked White Rice",
                    "Fresh Ugwu Leaves (Pumpkin)",
                    "Ripe Sweet Plantains",
                    "Red Onions",
                    "Pure Vegetable Oil",
                ],
                missing_ingredients_needed=["1 tsp Curry Powder", "1/2 tsp Dried Thyme"],
                instructions=[
                    "Dice sweet plantains into small cubes; fry in vegetable oil until caramelized golden brown. Drain.",
                    "In a large pan or wok, heat 2 tablespoons of oil. Sauté onions, curry powder, and thyme for 2 minutes.",
                    "Add chilled cooked rice, breaking up lumps with a wooden spoon over brisk heat for 5 minutes.",
                    "Fold in shredded fresh ugwu leaves and fried dodo cubes during the final 90 seconds so greens stay vibrant and crisp.",
                ],
                why_this_recipe="Resourcefully repurposes day-old chilled rice, folding in sliced fresh ugwu leaves at the very end to preserve their crisp texture and vivid green color.",
                chef_tips="Chilled rice grains are slightly dehydrated, meaning they absorb savory seasoned pan oils without turning mushy.",
            ),
            # 3. Quick Meal • Budget
            Recipe(
                title="Campus-Style 10-Minute Peppered Egg & Onion Scramble",
                description="The ultimate fast Nigerian comfort bite: diced red onions and scotch bonnet sizzled in vegetable oil, folded with whisked fresh eggs.",
                meal_type="quick",
                financial_tier="budget",
                estimated_cost_tier="~₦650 (Everyday Budget)",
                prep_time_minutes=3,
                cook_time_minutes=7,
                difficulty="Easy",
                servings=2,
                fridge_ingredients_used=[
                    "Fresh Eggs",
                    "Scotch Bonnet (Ata Rodo)",
                    "Red Onions",
                    "Pure Vegetable Oil",
                ],
                missing_ingredients_needed=[],
                instructions=[
                    "Finely dice red onions and slice scotch bonnet (scaled to spice level).",
                    "Heat 2 tablespoons of vegetable oil in a skillet. Sauté onions for 60 seconds until edges caramelize.",
                    "Add ata rodo, stirring briskly for 30 seconds.",
                    "Crack eggs into pan, lower flame to medium, and stir gently for 2 minutes until soft fluffy curds form.",
                    "Serve steaming hot with bread, rice, or yam.",
                ],
                why_this_recipe="Zero-waste quick meal prepared in under 10 minutes using only staple eggs, onions, and scotch bonnet with zero extra shopping required.",
                chef_tips="Sautéing onions until golden first caramelizes natural sugars, giving savory richness without needing butter.",
            ),
            # 4. Quick Meal • Comfortable
            Recipe(
                title="Executive Sweet Dodo & Smoked Titus Skillet Frittata",
                description="An elevated West African morning skillet: golden fried plantain disks layered with flaked smoked mackerel, baked gently under a fluffy egg crust.",
                meal_type="quick",
                financial_tier="comfortable",
                estimated_cost_tier="~₦2,200 (Comfortable)",
                prep_time_minutes=5,
                cook_time_minutes=12,
                difficulty="Easy",
                servings=2,
                fridge_ingredients_used=[
                    "Fresh Eggs",
                    "Smoked Mackerel (Titus)",
                    "Ripe Sweet Plantains",
                    "Plum Tomatoes",
                    "Red Onions",
                    "Scotch Bonnet (Ata Rodo)",
                    "Pure Vegetable Oil",
                ],
                missing_ingredients_needed=["1 Fresh Curry Leaf Spring", "White Pepper"],
                instructions=[
                    "Slice ripe plantains into round coins; shallow fry in oil for 4 minutes until golden.",
                    "Debone smoked mackerel into large juicy bite-sized flakes.",
                    "Whisk 4 eggs with a pinch of white pepper, sliced onions, and chopped scotch bonnet.",
                    "Layer plantain coins and smoked mackerel in skillet, pour whisked eggs over, cover tightly, and steam 6 minutes on low.",
                    "Slide onto a plate and slice into warm wedges.",
                ],
                why_this_recipe="Brings sweet ripe plantains and rich smoked mackerel together in a quick steamed egg cake that prevents plantain spoilage.",
                chef_tips="Covering tightly with a lid traps internal steam, puffing the frittata into a soufflé-like texture.",
            ),
            # 5. Quick Meal • Budget
            Recipe(
                title="Flash-Sautéed Ata Rodo & Tomato Egg Fold",
                description="Street-style fast breakfast: diced plum tomatoes and scotch bonnet reduction folded into soft eggs with caramelized onion ribbons.",
                meal_type="quick",
                financial_tier="budget",
                estimated_cost_tier="~₦700 (Everyday Budget)",
                prep_time_minutes=3,
                cook_time_minutes=8,
                difficulty="Easy",
                servings=2,
                fridge_ingredients_used=[
                    "Fresh Eggs",
                    "Plum Tomatoes",
                    "Scotch Bonnet (Ata Rodo)",
                    "Red Onions",
                    "Pure Vegetable Oil",
                ],
                missing_ingredients_needed=[],
                instructions=[
                    "Dice tomatoes, onions, and scotch bonnet finely.",
                    "Sauté onions and scotch bonnet in hot vegetable oil for 1 minute.",
                    "Add tomatoes, cooking down for 3 minutes until thick and pasty.",
                    "Pour whisked eggs into the simmering sauce, folding gently until softly set.",
                ],
                why_this_recipe="Fast, nourishing breakfast utilizing surplus ripe tomatoes before they soften, requiring zero extra market purchases.",
                chef_tips="Cooking down the tomatoes before adding eggs prevents excess water from making the scramble runny.",
            ),
        ],
        [
            ShoppingItem(item="Curry Powder & Dried Thyme", estimated_cost="~₦200 (Pantry pack)", for_recipes=["Buka-Style Street Fried Rice"]),
            ShoppingItem(item="Fresh Ginger & Garlic Roots", estimated_cost="~₦150 (Market stall)", for_recipes=["Classic Lagos Sunday Obe Ata"]),
        ]
    ),

    # --------------------------------------------------------------------------
    # Collection 1: Native Greens & Stockfish Crisper
    # Signature: Fresh Ugwu, Stockfish Bits (Okporoko), Smoked Catfish (Mangala), Palm Oil, Ata Rodo, Onions, Plantains
    # --------------------------------------------------------------------------
    (
        [
            # 1. CLASSIC FIRST: Proper Cooking • Comfortable
            Recipe(
                title="Traditional Royal Ofe Ugwu with Steamed Okporoko & Smoked Catfish",
                description="The quintessential celebration soup of Southern and Eastern Nigeria: rich unbleached red palm oil braised with fork-tender stockfish, succulent smoked mangala catfish, and fresh shredded ugwu leaves.",
                meal_type="proper",
                financial_tier="comfortable",
                estimated_cost_tier="~₦4,500 (Comfortable)",
                prep_time_minutes=15,
                cook_time_minutes=35,
                difficulty="Medium",
                servings=4,
                fridge_ingredients_used=[
                    "Fresh Ugwu Leaves (Pumpkin)",
                    "Stockfish Bits (Okporoko)",
                    "Smoked Catfish / Mangala",
                    "Pure Red Palm Oil",
                    "Scotch Bonnet (Ata Rodo)",
                    "Red Onions",
                    "Ripe Plantains",
                ],
                missing_ingredients_needed=["2 tbsp Ground Crayfish", "1 tsp Fermented Locust Beans (Iru)"],
                instructions=[
                    "Boil soaked stockfish bits with sliced onions and salt for 20 minutes until fork-tender and collagen broth is extracted.",
                    "Heat unbleached red palm oil in a pot, bloom iru and crushed scotch bonnet (scaled to spice level) for 90 seconds.",
                    "Pour in stockfish with its rich broth, smoked catfish chunks, and ground crayfish. Simmer 12 minutes.",
                    "Fold in freshly washed shredded ugwu leaves; turn off flame immediately so greens gently steam-cook.",
                    "Serve with thick golden fried sweet plantain fingers or swallow.",
                ],
                why_this_recipe="A revered Nigerian classic: pairs slow-steeped stockfish collagen with whole smoked catfish and fresh ugwu in unbleached palm oil for deep ancestral umami.",
                chef_tips="Turning off the heat right as ugwu is folded keeps the leaves vibrant emerald green and tender-crisp.",
            ),
            # 2. Proper Cooking • Budget
            Recipe(
                title="Fisherman's Native Palm Oil Stew with Softened Stockfish Bits & Ugwu",
                description="An earthy, deeply satisfying coastal home pot: softened stockfish bits simmered in aromatic palm oil and rich fish broth, thickened with sliced ugwu greens.",
                meal_type="proper",
                financial_tier="budget",
                estimated_cost_tier="~₦1,100 (Everyday Budget)",
                prep_time_minutes=10,
                cook_time_minutes=24,
                difficulty="Medium",
                servings=3,
                fridge_ingredients_used=[
                    "Stockfish Bits (Okporoko)",
                    "Smoked Catfish / Mangala",
                    "Fresh Ugwu Leaves (Pumpkin)",
                    "Pure Red Palm Oil",
                    "Red Onions",
                    "Scotch Bonnet (Ata Rodo)",
                ],
                missing_ingredients_needed=["1 tbsp Ground Crayfish"],
                instructions=[
                    "Boil soaked stockfish bits in 1.5 cups of water with onions until tender broth forms.",
                    "In a separate pot, heat palm oil and sauté onions and crushed scotch bonnet.",
                    "Add stockfish with its rich broth, flaked catfish, and crayfish; simmer 10 minutes.",
                    "Stir in freshly washed ugwu leaves, cook for 3 minutes, and take off heat.",
                ],
                why_this_recipe="Extracts rich gelatin and natural stock from stockfish bits to braise catfish and ugwu with authentic coastal flavor.",
                chef_tips="The natural gelatin released by boiling stockfish bones forms the rich body of authentic native vegetable soups.",
            ),
            # 3. Quick Meal • Budget
            Recipe(
                title="Native Flash-Wilted Ugwu & Palm Oil Scramble over Leftover Rice",
                description="Fast native skillet: fresh shredded pumpkin leaves flash-sizzled in aromatic palm oil with beaten eggs and scotch bonnet over warm leftover rice.",
                meal_type="quick",
                financial_tier="budget",
                estimated_cost_tier="~₦700 (Everyday Budget)",
                prep_time_minutes=3,
                cook_time_minutes=6,
                difficulty="Easy",
                servings=2,
                fridge_ingredients_used=[
                    "Fresh Ugwu Leaves (Pumpkin)",
                    "Pure Red Palm Oil",
                    "Fresh Eggs",
                    "Scotch Bonnet (Ata Rodo)",
                    "Leftover White Rice",
                    "Red Onions",
                ],
                missing_ingredients_needed=[],
                instructions=[
                    "Heat 2 tbsp red palm oil in skillet until fragrant and translucent (do not bleach).",
                    "Add sliced scotch bonnet and onions, sauté for 45 seconds.",
                    "Pour in whisked eggs, swirl gently, then fold in shredded ugwu leaves.",
                    "Serve piping hot over reheated leftover white rice.",
                ],
                why_this_recipe="Rescues fresh ugwu leaves with a flash 90-second palm oil sizzle, locking in vibrant color while coating leftover rice with rich savory sauce.",
                chef_tips="Cooking ugwu for under 90 seconds preserves its vivid green color and crisp vegetable crunch.",
            ),
            # 4. Quick Meal • Comfortable
            Recipe(
                title="Peppered Smoked Catfish & Sweet Plantain Medley (Asun-Style Fish)",
                description="Charred scotch bonnet peppers, caramelized red onions, and tender smoked catfish chunks tossed with sweet fried dodo cubes.",
                meal_type="quick",
                financial_tier="comfortable",
                estimated_cost_tier="~₦2,500 (Comfortable)",
                prep_time_minutes=5,
                cook_time_minutes=14,
                difficulty="Easy",
                servings=2,
                fridge_ingredients_used=[
                    "Smoked Catfish / Mangala",
                    "Ripe Plantains",
                    "Scotch Bonnet (Ata Rodo)",
                    "Red Onions",
                    "Pure Red Palm Oil",
                ],
                missing_ingredients_needed=["1/2 tsp Suya Pepper / Yaji"],
                instructions=[
                    "Dice sweet plantains into cubes and fry in palm or vegetable oil until golden.",
                    "Coarsely pound scotch bonnet with onions.",
                    "Sauté pepper mixture with shredded smoked catfish and suya spice for 3 minutes.",
                    "Toss in the fried plantains, coat thoroughly, and serve immediately.",
                ],
                why_this_recipe="Pairs spicy ata rodo reduction with caramelized sweet dodo, using natural plantain sugars to temper fierce pepper heat over flaky catfish.",
                chef_tips="Gently breaking catfish into large flakes rather than shreds keeps the fish juicy and tender.",
            ),
            # 5. Quick Meal • Budget
            Recipe(
                title="Quick Palm Oil & Shredded Ugwu Sizzle with Sliced Onions",
                description="Quick native vegetable side: fresh sliced pumpkin leaves sautéed in unbleached red palm oil with onions and mild chili.",
                meal_type="quick",
                financial_tier="budget",
                estimated_cost_tier="~₦500 (Everyday Budget)",
                prep_time_minutes=2,
                cook_time_minutes=5,
                difficulty="Easy",
                servings=2,
                fridge_ingredients_used=[
                    "Fresh Ugwu Leaves (Pumpkin)",
                    "Pure Red Palm Oil",
                    "Red Onions",
                    "Scotch Bonnet (Ata Rodo)",
                ],
                missing_ingredients_needed=[],
                instructions=[
                    "Heat 1.5 tablespoons of red palm oil in skillet on medium.",
                    "Sauté sliced onions and scotch bonnet for 60 seconds.",
                    "Toss in shredded ugwu leaves, stir for 90 seconds with a pinch of salt, and take off fire immediately.",
                ],
                why_this_recipe="The fastest native vegetable dish in Nigerian home cooking: zero waste, maximum flavor, and quick preparation.",
                chef_tips="Never overcook ugwu; residual heat in the pan will finish the cooking off the stove.",
            ),
        ],
        [
            ShoppingItem(item="Fermented Locust Beans (Iru)", estimated_cost="~₦100 (Native umami aroma)", for_recipes=["Royal Ofe Ugwu"]),
            ShoppingItem(item="Ground Dried Crayfish", estimated_cost="~₦300 (Pantry staple)", for_recipes=["Fisherman's Stew", "Royal Ofe Ugwu"]),
        ]
    ),

    # --------------------------------------------------------------------------
    # Collection 2: Pantry Shelf & Honey Beans Station
    # Signature: Honey Beans, Sweet Plantains, Tomatoes, Onions, Ata Rodo, Scent Leaves, Smoked Fish, Eggs
    # --------------------------------------------------------------------------
    (
        [
            # 1. CLASSIC FIRST: Proper Cooking • Budget
            Recipe(
                title="Classic Ewa Aganyin with Caramelized Onion Sauce & Fried Dodo",
                description="The crown jewel of Lagos street food: tender velvety honey beans served alongside sweet golden dodo, topped with fiery dark-caramelized onion and chili reduction.",
                meal_type="proper",
                financial_tier="budget",
                estimated_cost_tier="~₦950 (Everyday Budget)",
                prep_time_minutes=10,
                cook_time_minutes=25,
                difficulty="Medium",
                servings=3,
                fridge_ingredients_used=[
                    "Cooked Honey Beans (Oloyin)",
                    "Ripe Sweet Plantains",
                    "Plum Tomatoes",
                    "Red Onions",
                    "Scotch Bonnet (Ata Rodo)",
                    "Pure Vegetable Oil",
                ],
                missing_ingredients_needed=["1 tbsp Ground Dried Chili Flakes"],
                instructions=[
                    "Mash cooked honey beans until smooth and velvety, adding a pinch of salt. Keep warm.",
                    "Slice plantains diagonally and fry to deep mahogany perfection.",
                    "Slow-fry plenty of sliced onions in vegetable oil until deep dark brown (not burnt).",
                    "Add crushed dried chili, ata rodo (scaled to spice level), and tomatoes; fry for 15 minutes until oil turns dark crimson.",
                    "Ladle the fiery Aganyin sauce generously over the soft beans and dodo.",
                ],
                why_this_recipe="The classic street-food standard for Nigerian beans: harnesses slow onion caramelization to recreate authentic Aganyin aroma from everyday pantry staples.",
                chef_tips="Darkening the onions slowly on medium heat is the exact culinary secret behind authentic Aganyin pepper sauce.",
            ),
            # 2. Proper Cooking • Comfortable
            Recipe(
                title="Slow-Simmered Honey Beans Pottage with Smoked Fish & Fresh Scent Leaf",
                description="Hearty, rich Nigerian bean pottage: sweet brown beans stewed with smoked fish flakes, pure tomato-pepper reduction, and golden fried plantains folded in with fragrant scent leaves.",
                meal_type="proper",
                financial_tier="comfortable",
                estimated_cost_tier="~₦2,400 (Comfortable)",
                prep_time_minutes=10,
                cook_time_minutes=30,
                difficulty="Medium",
                servings=4,
                fridge_ingredients_used=[
                    "Cooked Honey Beans (Oloyin)",
                    "Smoked Fish Flakes",
                    "Ripe Sweet Plantains",
                    "Plum Tomatoes",
                    "Red Onions",
                    "Scotch Bonnet (Ata Rodo)",
                    "Fresh Scent Leaves (Efirin)",
                ],
                missing_ingredients_needed=["1 tbsp Ground Crayfish"],
                instructions=[
                    "Blend tomatoes, ata rodo, and one onion bulb coarsely.",
                    "In a deep pot, combine cooked honey beans, blended pepper, and washed smoked fish flakes.",
                    "Add 1 cup of water and simmer for 15 minutes, allowing fish stock to infuse the beans.",
                    "Fry diced plantains in a separate pan until sweet and golden.",
                    "Gently fold fried plantains and shredded scent leaves into the bubbling bean pottage for 3 minutes.",
                ],
                why_this_recipe="Layers smoked fish umami into creamy honey beans while scent leaves cut through bean starch with a clean, digestive herbal note.",
                chef_tips="Folding fried plantains in at the very end keeps them from turning mushy while absorbing rich bean gravy.",
            ),
            # 3. Quick Meal • Budget
            Recipe(
                title="10-Minute Sizzled Honey Beans & Sweet Onion Mash",
                description="Comfort food in its purest, most wholesome form: pre-cooked sweet honey beans warmed and lightly mashed with red onions and ata rodo sizzled in vegetable oil.",
                meal_type="quick",
                financial_tier="budget",
                estimated_cost_tier="~₦500 (Everyday Budget)",
                prep_time_minutes=2,
                cook_time_minutes=8,
                difficulty="Easy",
                servings=2,
                fridge_ingredients_used=[
                    "Cooked Honey Beans (Oloyin)",
                    "Red Onions",
                    "Scotch Bonnet (Ata Rodo)",
                    "Pure Vegetable Oil",
                ],
                missing_ingredients_needed=[],
                instructions=[
                    "Dice red onions and slice scotch bonnet finely.",
                    "Heat 2 tablespoons of vegetable oil in a pot and sizzle onions for 2 minutes until translucent.",
                    "Add ata rodo and cooked honey beans with 3 tablespoons of water.",
                    "Simmer for 4 minutes, gently crushing a portion of the beans with a wooden spoon for creamy gravy.",
                ],
                why_this_recipe="Takes advantage of pre-cooked honey beans to yield a hearty, zero-waste hot meal in under 10 minutes without firing up long cooking cycles.",
                chef_tips="Crushing roughly a quarter of the beans creates a velvety sauce without needing any flour or starch.",
            ),
            # 4. Quick Meal • Comfortable
            Recipe(
                title="Sweet Dodo & Fresh Efirin Herb Scrambled Eggs",
                description="A fast, aromatic morning scramble: sweet plantain cubes tossed with beaten eggs and torn fresh scent leaves for an earthy clove fragrance.",
                meal_type="quick",
                financial_tier="comfortable",
                estimated_cost_tier="~₦1,400 (Comfortable)",
                prep_time_minutes=4,
                cook_time_minutes=10,
                difficulty="Easy",
                servings=2,
                fridge_ingredients_used=[
                    "Ripe Sweet Plantains",
                    "Fresh Eggs",
                    "Fresh Scent Leaves (Efirin)",
                    "Red Onions",
                    "Pure Vegetable Oil",
                ],
                missing_ingredients_needed=["1 pinch Black Pepper"],
                instructions=[
                    "Dice plantains into bite-sized cubes and pan-fry in oil until golden.",
                    "In a bowl, whisk eggs with torn scent leaves and diced onions.",
                    "Pour eggs over warm plantains in the pan, folding gently for 2 minutes until soft.",
                    "Serve immediately with hot tea or warm bread.",
                ],
                why_this_recipe="Marries the sweet, caramelized notes of ripe plantains with the peppery clove aroma of fresh scent leaves in a savory egg fold.",
                chef_tips="Tear scent leaves by hand instead of cutting with a knife to release essential fragrant oils without bruising.",
            ),
            # 5. Quick Meal • Budget
            Recipe(
                title="Pan-Sautéed Peppered Honey Beans Quick Stir",
                description="Fast pantry stir-fry: whole honey beans pan-tossed with caramelized red onions, tomato dice, and mild chili.",
                meal_type="quick",
                financial_tier="budget",
                estimated_cost_tier="~₦550 (Everyday Budget)",
                prep_time_minutes=2,
                cook_time_minutes=7,
                difficulty="Easy",
                servings=2,
                fridge_ingredients_used=[
                    "Cooked Honey Beans (Oloyin)",
                    "Plum Tomatoes",
                    "Red Onions",
                    "Pure Vegetable Oil",
                ],
                missing_ingredients_needed=[],
                instructions=[
                    "Heat 1.5 tablespoons of vegetable oil in skillet.",
                    "Add diced onions and tomatoes; cook down for 3 minutes until fragrant.",
                    "Toss in cooked honey beans, stirring over medium heat for 4 minutes until thoroughly warmed through.",
                ],
                why_this_recipe="Quick, light pantry meal that requires zero preparation and delivers wholesome sustained energy.",
                chef_tips="Pan-tossing whole beans on medium-high heat gives the skin a pleasant slight crispness.",
            ),
        ],
        [
            ShoppingItem(item="Ground Dried Crayfish", estimated_cost="~₦250 (Pantry stall)", for_recipes=["Slow-Simmered Honey Beans Pottage"]),
            ShoppingItem(item="Ground Dried Chili Flakes", estimated_cost="~₦150 (Spice merchant)", for_recipes=["Classic Ewa Aganyin"]),
        ]
    ),
]

def apply_fuel_and_spice_adjustments(
    recipes: List[Recipe],
    cooking_fuel: str = "gas",
    spice_level: str = "Mild",
) -> List[Recipe]:
    """
    Adjusts prep/cook times and instructions based on the selected cooking fuel
    (Gas, Charcoal, Electric, Kerosene) and scales scotch bonnet quantities.
    """
    fuel = (cooking_fuel or "gas").lower()
    spice = (spice_level or "Mild").title()

    # Pepper calibration for 2 servings
    if "Hot" in spice:
        pepper_phrase = "2-3 scotch bonnets (ata rodo) for authentic Nigerian heat"
    elif "Suya" in spice or "Extra" in spice:
        pepper_phrase = "4+ scotch bonnets (ata rodo) plus extra pepper for fierce fire"
    else:
        pepper_phrase = "1 scotch bonnet (ata rodo) for gentle warmth (mild)"

    prep_delta = 0
    cook_delta = 0
    fuel_note = ""

    if "charcoal" in fuel:
        prep_delta = 10
        cook_delta = 5
        fuel_note = "Charcoal fuel: Fan hot coals to glowing white embers before placing pot; push coals outward for gentle simmering."
    elif "electric" in fuel:
        prep_delta = 3
        cook_delta = 2
        fuel_note = "Electric stove: Preheat heavy coil 3 mins; turn down heat slightly early as hot plate holds heat."
    elif "kerosene" in fuel:
        prep_delta = 2
        cook_delta = 3
        fuel_note = "Kerosene stove: Maintain a clean blue flame to avoid soot; wipe bottom of pot dry before cooking."

    adjusted: List[Recipe] = []
    for r in recipes:
        copy_r = r.model_copy(deep=True)
        copy_r.prep_time_minutes = max(2, copy_r.prep_time_minutes + prep_delta)
        copy_r.cook_time_minutes = max(5, copy_r.cook_time_minutes + cook_delta)

        new_instructions = []
        for step in copy_r.instructions:
            s = step
            # Replace scotch bonnet references with calibrated amount
            if "ata rodo" in s.lower() or "scotch bonnet" in s.lower():
                s = re.sub(
                    r"\b\d+\s*(?:to\s*\d+)?\s*(?:scotch bonnet|ata rodo)s?\b",
                    pepper_phrase,
                    s,
                    flags=re.IGNORECASE,
                )
            new_instructions.append(s)

        if fuel_note and fuel != "gas":
            new_instructions.insert(0, f"Fuel Note ({fuel.capitalize()}): {fuel_note}")

        copy_r.instructions = new_instructions
        adjusted.append(copy_r)

    return adjusted

class RecipeService:
    """
    Culinary synthesis service utilizing Muse Spark Open
    via vLLM, Ollama, or OpenAI-compatible inference with resilient mock fallback.
    """

    async def generate_recipes(
        self,
        detected_items: List[DetectedItem],
        sample_type: str = None,
        is_demo: bool = False,
        spice_level: str = "Mild",
        cooking_fuel: str = "gas",
        recipe_count: int = 3,
        budget_naira: Optional[int] = None,
        servings: int = 2,
        city: str = "Abuja",
    ) -> Tuple[List[Recipe], List[ShoppingItem], str, bool]:
        """
        Synthesizes Nigerian recipes and returns (recipes, shopping_list, provider_used, is_mock).
        Optimized for <10s generation by producing 3 high-impact dishes first, expandable on demand.
        """
        # If demo mode is active, return curated recipes immediately without network delay
        if is_demo or sample_type:
            logger.info(f"Demo mode active: Returning curated recipes for '{sample_type or 'market'}'.")
            raw_recipes, shopping = self._mock_recipes_for_sample(sample_type, detected_items)
            adjusted_recipes = apply_fuel_and_spice_adjustments(raw_recipes, cooking_fuel, spice_level)
            return adjusted_recipes, shopping, "demo_curated", True

        # Check in-memory recipe cache for repeated queries (live successes only)
        cache_key = hashlib.sha256(
            f"{'|'.join(sorted(it.name.lower() for it in detected_items))}_{spice_level}_{cooking_fuel}_{recipe_count}_{budget_naira}_{servings}_{city}_{settings.MUSE_GLIMMER_MODEL_NAME}_low".encode()
        ).hexdigest()
        if cache_key in _RECIPE_CACHE:
            cached_recipes, cached_shopping, cached_mode = _RECIPE_CACHE[cache_key]
            logger.info(f"Recipe cache HIT for key {cache_key[:10]}: returning {len(cached_recipes)} recipes instantly.")
            return (
                [r.model_copy(deep=True) for r in cached_recipes],
                [s.model_copy(deep=True) for s in cached_shopping],
                f"{cached_mode} (cache_hit)",
                False,
            )

        item_summary = []
        for item in detected_items:
            details = [item.name]
            if item.estimated_quantity:
                details.append(f"qty: {item.estimated_quantity}")
            details.append(f"category: {item.category}")
            details.append(f"certainty: {getattr(item, 'certainty', 'clear')}")
            if getattr(item, "alternatives", None):
                details.append(f"alternatives: {', '.join(item.alternatives)}")
            if getattr(item, "form", None) and item.form != "unknown":
                details.append(f"form: {item.form}")
            item_summary.append("- " + " | ".join(details))

        if settings.INFERENCE_MODE == "mock":
            logger.info("INFERENCE_MODE is set to 'mock'. Returning pre-crafted Nigerian recipes.")
            raw_recipes, shopping = self._mock_recipes(detected_items)
            adjusted_recipes = apply_fuel_and_spice_adjustments(raw_recipes, cooking_fuel, spice_level)
            return adjusted_recipes, shopping, "mock_offline", True

        # Attempt live inference with Muse Spark Open
        try:
            if settings.MUSE_GLIMMER_PROVIDER == "ollama":
                raw_recipes, shopping = await self._call_ollama_chat(
                    item_summary, spice_level, cooking_fuel, recipe_count, budget_naira, servings, city
                )
                mode_str = f"live_ollama_{settings.MUSE_GLIMMER_MODEL_NAME}"
            else:
                raw_recipes, shopping = await self._call_openai_compatible(
                    item_summary, spice_level, cooking_fuel, recipe_count, budget_naira, servings, city
                )
                mode_str = f"live_openai_{settings.MUSE_GLIMMER_MODEL_NAME}"

            adjusted_recipes = apply_fuel_and_spice_adjustments(raw_recipes, cooking_fuel, spice_level)
            # Only cache successful live results
            _RECIPE_CACHE[cache_key] = (adjusted_recipes, shopping, mode_str)
            return adjusted_recipes, shopping, mode_str, False
        except Exception as e:
            logger.warning(
                f"Muse Spark Open inference failed ({type(e).__name__}: {e})."
            )
            if settings.INFERENCE_MODE == "live":
                raise RuntimeError(f"Live Muse Spark Open inference failed: {e}") from e

            # In auto mode, fallback to mock but never cache fallback results
            raw_recipes, shopping = self._mock_recipes(detected_items)
            adjusted_recipes = apply_fuel_and_spice_adjustments(raw_recipes, cooking_fuel, spice_level)
            return adjusted_recipes, shopping, f"fallback_mock (muse error: {type(e).__name__})", True

    async def _call_openai_compatible(
        self,
        item_summary: List[str],
        spice_level: str = "Mild",
        cooking_fuel: str = "gas",
        recipe_count: int = 3,
        budget_naira: Optional[int] = None,
        servings: int = 2,
        city: str = "Abuja",
    ) -> Tuple[List[Recipe], List[ShoppingItem]]:
        """Calls vLLM, LMDeploy, or Ollama /v1 OpenAI-compatible endpoint with automatic single retry on truncation or parse error."""
        if budget_naira and budget_naira > 0:
            budget_clause = (
                f"The household has about N{budget_naira:,} for {servings} people. "
                f"Design meals so that the cost of any ingredients the user must still buy stays within this budget, "
                f"preferring what the user already has. If the budget is very low, prefer simple low-cost dishes. "
                f"Never claim a recipe fits the budget; the app calculates that."
            )
        else:
            budget_clause = (
                f"The household has {servings} people in {city}. "
                f"Design meals preferring what the user already has and keeping extra ingredients to buy minimal. "
                f"Never claim a recipe fits the budget; the app calculates that."
            )

        user_message = (
            f"Here are the provisions currently available in the kitchen:\n"
            + "\n".join(item_summary)
            + f"\n\nPreferences: Spice level = {spice_level}, Cooking Fuel = {cooking_fuel}, Market City = {city}.\n"
            + f"{budget_clause}\n"
            + f"Please formulate {recipe_count} authentic Nigerian recipes with at least one CLASSIC Nigerian dish FIRST, "
            + f"including Quick Meals (<=20m) and Proper Cooking dishes, plus a minimal shopping list. "
            + "Do not provide health, medical or nutrition advice, and do not include calorie or nutrient numbers."
        )

        url = f"{settings.MUSE_GLIMMER_ENDPOINT.rstrip('/')}/chat/completions"
        logger.info(f"Dispatching recipe synthesis to Muse Spark Open at {url} (model: {settings.MUSE_GLIMMER_MODEL_NAME}, count: {recipe_count})")

        payload = {
            "model": settings.MUSE_GLIMMER_MODEL_NAME,
            "messages": [
                {"role": "system", "content": get_muse_system_prompt(recipe_count)},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.5,
            "response_format": {"type": "json_object"},
            "reasoning_effort": "low",
            "max_completion_tokens": 4000,
        }

        headers = {}
        if settings.MUSE_GLIMMER_API_KEY:
            headers["Authorization"] = f"Bearer {settings.MUSE_GLIMMER_API_KEY}"

        last_error = None
        for attempt in range(2):
            try:
                async with httpx.AsyncClient(timeout=settings.MUSE_GLIMMER_TIMEOUT_SECONDS) as client:
                    res = await client.post(url, json=payload, headers=headers)
                    res.raise_for_status()
                    data = res.json()
                    choice = data["choices"][0]
                    raw_text = choice["message"].get("content") or ""
                    finish_reason = choice.get("finish_reason")

                    if finish_reason == "length":
                        logger.warning(f"Recipe response truncated by length limit on attempt {attempt + 1}")
                        if attempt == 0:
                            payload["max_completion_tokens"] = 4800
                            continue
                        raise ValueError("Recipe synthesis response was cut off due to length limit.")

                    return self._parse_recipe_json(raw_text)
            except Exception as e:
                last_error = e
                logger.warning(f"Recipe synthesis attempt {attempt + 1} failed: {e}")
                if attempt == 0:
                    continue
                raise last_error

    async def _call_ollama_chat(
        self,
        item_summary: List[str],
        spice_level: str = "Mild",
        cooking_fuel: str = "gas",
        recipe_count: int = 3,
        budget_naira: Optional[int] = None,
        servings: int = 2,
        city: str = "Abuja",
    ) -> Tuple[List[Recipe], List[ShoppingItem]]:
        """Calls native Ollama chat API."""
        if budget_naira and budget_naira > 0:
            budget_clause = (
                f"The household has about N{budget_naira:,} for {servings} people. "
                f"Design meals so that the cost of any ingredients the user must still buy stays within this budget, "
                f"preferring what the user already has. If the budget is very low, prefer simple low-cost dishes. "
                f"Never claim a recipe fits the budget; the app calculates that."
            )
        else:
            budget_clause = (
                f"The household has {servings} people in {city}. "
                f"Design meals preferring what the user already has and keeping extra ingredients to buy minimal. "
                f"Never claim a recipe fits the budget; the app calculates that."
            )

        user_message = (
            f"Here are the provisions currently available in the kitchen:\n"
            + "\n".join(item_summary)
            + f"\n\nPreferences: Spice level = {spice_level}, Cooking Fuel = {cooking_fuel}, Market City = {city}.\n"
            + f"{budget_clause}\n"
            + f"Please formulate {recipe_count} authentic Nigerian recipes with at least one CLASSIC Nigerian dish FIRST, "
            + f"including Quick Meals (<=20m) and Proper Cooking dishes, plus a minimal shopping list. "
            + "Do not provide health, medical or nutrition advice, and do not include calorie or nutrient numbers."
        )

        url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/chat"
        logger.info(f"Dispatching recipe synthesis to Ollama Chat at {url} (model: {settings.MUSE_GLIMMER_MODEL_NAME})")

        payload = {
            "model": settings.MUSE_GLIMMER_MODEL_NAME,
            "messages": [
                {"role": "system", "content": get_muse_system_prompt(recipe_count)},
                {"role": "user", "content": user_message}
            ],
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.5,
                "num_predict": 1800,
            }
        }

        async with httpx.AsyncClient(timeout=settings.MUSE_GLIMMER_TIMEOUT_SECONDS) as client:
            res = await client.post(url, json=payload)
            res.raise_for_status()
            data = res.json()
            raw_text = data["message"]["content"]
            return self._parse_recipe_json(raw_text)

    def _parse_recipe_json(self, raw_text: str) -> Tuple[List[Recipe], List[ShoppingItem]]:
        """Multi-layer robust JSON parser extracting recipes and shopping list from Muse Spark Open output."""
        cleaned = raw_text.strip()
        match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", cleaned)
        if match:
            cleaned = match.group(1)
        else:
            start = cleaned.find("{")
            end = cleaned.rfind("}")
            if start != -1 and end != -1 and end > start:
                cleaned = cleaned[start : end + 1]

        data = json.loads(cleaned)
        if not isinstance(data, dict):
            raise ValueError("Model output did not parse into a JSON object.")

        recipes_raw = data.get("recipes", [])
        shopping_raw = data.get("shopping_list", [])

        recipes = [Recipe(**r) for r in recipes_raw if isinstance(r, dict)]
        shopping_list = [ShoppingItem(**s) for s in shopping_raw if isinstance(s, dict)]

        # Guarantee why_this_recipe is present on every recipe
        for r in recipes:
            if not r.why_this_recipe:
                ingredients_snippet = ", ".join(r.fridge_ingredients_used[:3])
                r.why_this_recipe = (
                    f"Selected by Muse Spark Open to maximize {ingredients_snippet} "
                    f"using resourceful Nigerian cooking principles with minimal waste."
                )

        if not recipes:
            raise ValueError("No valid recipes found in parsed model output.")

        logger.info(f"Successfully synthesized {len(recipes)} Nigerian recipes with Muse Spark Open.")
        return recipes, shopping_list

    def _mock_recipes(self, detected_items: List[DetectedItem]) -> Tuple[List[Recipe], List[ShoppingItem]]:
        """
        Returns rich authentic Nigerian recipes tailored to detected ingredients with classic first.
        """
        item_text = " ".join([i.name.lower() for i in detected_items])
        if "stockfish" in item_text or "catfish" in item_text or "ugwu" in item_text:
            collection_idx = 1
        elif "beans" in item_text or "scent leaf" in item_text or "oloyin" in item_text:
            collection_idx = 2
        else:
            collection_idx = 0

        recipes, shopping_list = RECIPE_COLLECTIONS[collection_idx]
        return recipes, shopping_list

    async def interpret_voice_instruction(self, transcript: str, language: str = "en-NG") -> dict:
        """
        Interprets spoken user instructions into structured parameters for ChopSnap:
        budget_naira, servings, dietary, spice_level, cooking_fuel, add_ingredients, remove_ingredients, language_detected.
        Explicitly handles Nigerian English, Nigerian Pidgin, Yoruba, Hausa, and Igbo.
        """
        system_prompt = (
            "You are an expert Nigerian culinary voice assistant for the ChopSnap app. "
            "Your task is to analyze user spoken instructions and extract structured cooking and budget preferences. "
            "The user input may be spoken in Nigerian English, Nigerian Pidgin (e.g., 'abeg make food for 4 people no put pork', 'make am sharp hot', 'I get 3000 naira'), "
            "Yoruba (e.g., 'e se ounjẹ fun eniyan mẹrin', 'ma fi ẹlẹdẹ si'), "
            "Hausa (e.g., 'abinci na mutane hudu', 'ba alade ba'), "
            "or Igbo (e.g., 'nri maka mmadụ anọ', 'etinyeghị anụ ezi').\n\n"
            "Return ONLY a valid JSON object with EXACTLY these keys:\n"
            "{\n"
            '  "budget_naira": integer or null,\n'
            '  "servings": integer or null,\n'
            '  "dietary": [string, ...] (only explicit dietary restrictions like "no pork", "halal", "no fish", "vegetarian", else empty array),\n'
            '  "spice_level": "Mild" | "Authentic Hot" | "Suya Extra" | null,\n'
            '  "cooking_fuel": "gas" | "charcoal" | "electric" | "kerosene" | null,\n'
            '  "add_ingredients": [string, ...] (ingredients mentioned to add, else empty array),\n'
            '  "remove_ingredients": [string, ...] (ingredients mentioned to avoid/remove, else empty array),\n'
            '  "language_detected": string (e.g. "Nigerian English", "Nigerian Pidgin", "Yoruba", "Hausa", "Igbo")\n'
            "}\n\n"
            "CRITICAL RULES:\n"
            "1. Missing or unmentioned fields MUST be null (for budget_naira, servings, spice_level, cooking_fuel) or empty list [] (for dietary, add_ingredients, remove_ingredients). NEVER GUESS.\n"
            "2. For budget, extract the numeric value in Naira (e.g. '3k', '3000 naira', 'three thousand' -> 3000).\n"
            "3. For servings, extract the portion count (e.g. 'for me and my wife' -> 2, 'four people' -> 4, 'eniyan meta' -> 3).\n"
            "4. Return ONLY valid JSON, with no markdown code blocks and no preamble.\n"
            "5. You are a cooking and budget assistant only. Never give health, medical, wellness, or nutrition advice, and never calculate or output calories or nutrients."
        )

        user_content = f"Spoken Transcript ({language}): \"{transcript}\""

        # Attempt live model call
        if settings.INFERENCE_MODE != "mock":
            try:
                url = f"{settings.MUSE_GLIMMER_ENDPOINT.rstrip('/')}/chat/completions"
                payload = {
                    "model": settings.MUSE_GLIMMER_MODEL_NAME,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content}
                    ],
                    "temperature": 0.1,
                    "response_format": {"type": "json_object"}
                }
                headers = {}
                if settings.MUSE_GLIMMER_API_KEY:
                    headers["Authorization"] = f"Bearer {settings.MUSE_GLIMMER_API_KEY}"

                async with httpx.AsyncClient(timeout=settings.MUSE_GLIMMER_TIMEOUT_SECONDS) as client:
                    res = await client.post(url, json=payload, headers=headers)
                    res.raise_for_status()
                    data = res.json()
                    raw_content = data["choices"][0]["message"]["content"]
                    
                    cleaned = raw_content.strip()
                    if cleaned.startswith("```"):
                        match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", cleaned)
                        if match:
                            cleaned = match.group(1)
                    parsed = json.loads(cleaned)
                    if isinstance(parsed, dict):
                        parsed["source"] = "model"
                        parsed["confidence"] = "high"
                        return parsed
            except Exception as e:
                logger.warning(f"Live voice interpretation failed ({type(e).__name__}: {e}), utilizing resilient parser.")

        # Resilient fallback parser for offline/demo/rule-based processing
        lower_t = transcript.lower()
        extracted: dict = {
            "budget_naira": None,
            "servings": None,
            "dietary": [],
            "spice_level": None,
            "cooking_fuel": None,
            "add_ingredients": [],
            "remove_ingredients": [],
            "language_detected": "English",
            "source": "fallback",
            "confidence": "high"
        }

        # Budget extraction: e.g. ₦3000, 3000 naira, 3k
        budget_match = re.search(r"(?:₦|naira\s*)?(\d+(?:,\d+)?)\s*(?:k\b|naira|\b)", lower_t)
        if "3k" in lower_t:
            extracted["budget_naira"] = 3000
        elif "2k" in lower_t:
            extracted["budget_naira"] = 2000
        elif "5k" in lower_t:
            extracted["budget_naira"] = 5000
        elif "10k" in lower_t:
            extracted["budget_naira"] = 10000
        elif budget_match and any(kw in lower_t for kw in ("naira", "budget", "spend", "cost", "₦")):
            try:
                num_str = budget_match.group(1).replace(",", "")
                extracted["budget_naira"] = int(num_str)
            except ValueError:
                pass

        # Servings extraction
        serv_match = re.search(r"(\d+)\s*(?:people|persons|servings|heads|mouths|eniyan|mutane|mmadụ)", lower_t)
        if serv_match:
            try:
                extracted["servings"] = int(serv_match.group(1))
            except ValueError:
                pass
        elif "just me" in lower_t or "myself" in lower_t or "single" in lower_t:
            extracted["servings"] = 1
        elif "me and my wife" in lower_t or "two of us" in lower_t:
            extracted["servings"] = 2
        elif "family of 4" in lower_t or "four of us" in lower_t:
            extracted["servings"] = 4

        # Dietary
        if "no pork" in lower_t or "without pork" in lower_t or "ẹlẹdẹ" in lower_t or "alade" in lower_t:
            extracted["dietary"].append("no pork")
        if "halal" in lower_t:
            extracted["dietary"].append("halal")
        if "no fish" in lower_t or "without fish" in lower_t or "allergic to fish" in lower_t:
            extracted["dietary"].append("no fish")
        if "vegetarian" in lower_t or "no meat" in lower_t:
            extracted["dietary"].append("vegetarian")

        # Spice
        if any(w in lower_t for w in ("mild", "not pepper", "no too much pepper", "small pepper", "little pepper")):
            extracted["spice_level"] = "Mild"
        elif any(w in lower_t for w in ("suya extra", "very hot", "plenty pepper", "die hot", "extra hot")):
            extracted["spice_level"] = "Suya Extra"
        elif any(w in lower_t for w in ("hot", "authentic hot", "normal pepper", "sweet pepper")):
            extracted["spice_level"] = "Authentic Hot"

        # Fuel
        if "charcoal" in lower_t or "coal" in lower_t:
            extracted["cooking_fuel"] = "charcoal"
        elif "gas" in lower_t:
            extracted["cooking_fuel"] = "gas"
        elif "electric" in lower_t or "hotplate" in lower_t:
            extracted["cooking_fuel"] = "electric"
        elif "kerosene" in lower_t or "stove" in lower_t:
            extracted["cooking_fuel"] = "kerosene"

        # Language detection heuristic
        if any(w in lower_t for w in ("abeg", "dey", "wetin", "no put", "sharp sharp", "fit", "chop", "na")):
            extracted["language_detected"] = "Nigerian Pidgin"
        elif any(w in lower_t for w in ("e se", "ounje", "eniyan", "eledẹ", "ata", "bawo")):
            extracted["language_detected"] = "Yoruba"
        elif any(w in lower_t for w in ("abinci", "mutane", "alade", "sannu", "ina")):
            extracted["language_detected"] = "Hausa"
        elif any(w in lower_t for w in ("nri", "mmadu", "anu ezi", "kedu", "biko")):
            extracted["language_detected"] = "Igbo"
        else:
            extracted["language_detected"] = "Nigerian English"

        # If fallback could not extract any meaningful fields, mark confidence as unclear
        has_any_field = any([
            extracted["budget_naira"] is not None,
            extracted["servings"] is not None,
            len(extracted["dietary"]) > 0,
            extracted["spice_level"] is not None,
            extracted["cooking_fuel"] is not None,
            len(extracted["add_ingredients"]) > 0,
            len(extracted["remove_ingredients"]) > 0,
        ])
        if not has_any_field:
            extracted["confidence"] = "unclear"

        return extracted

    def _mock_recipes_for_sample(
        self, sample_type: str = None, detected_items: List[DetectedItem] = None
    ) -> Tuple[List[Recipe], List[ShoppingItem]]:
        """
        Guarantees exact, high-fidelity recipe pairing for the chosen demo button.
        """
        if sample_type:
            st = sample_type.lower()
            if "native" in st or "green" in st:
                return RECIPE_COLLECTIONS[1]
            elif "pantry" in st or "bean" in st:
                return RECIPE_COLLECTIONS[2]
            else:
                return RECIPE_COLLECTIONS[0]
        return self._mock_recipes(detected_items or [])
