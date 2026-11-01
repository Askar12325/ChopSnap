import { ProcessResponse } from '../types';

// NOTE: All demo recipes need review by an authentic Nigerian cook.
// Client-Side Curated Fallback Data
export const CLIENT_DEMO_DATA: Record<string, ProcessResponse> = {
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
        "certainty": "clear",
        "confidence": 0.9,
        "estimated_quantity": "Half bottle remaining"
      },
      {
        "name": "White Seasoning Powder",
        "category": "Pantry",
        "certainty": "unsure",
        "alternatives": ["Salt", "Sugar", "White Pepper"],
        "estimated_quantity": "1 small jar"
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
        "assumes": "cooking oil is vegetable oil",
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
        "why_this_recipe": "Resourcefully repurposes day-old chilled rice, folding in sliced fresh ugwu leaves at the very end to preserve their crisp texture and vivid green color.",
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
        "why_this_recipe": "Zero-waste quick meal prepared in under 10 minutes using only staple eggs, onions, and scotch bonnet with zero extra shopping required.",
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
        "chef_tips": "Turning off the heat right as ugwu is folded keeps the leaves vibrant emerald green and tender-crisp."
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
        "description": "Fast native skillet: fresh shredded pumpkin leaves flash-sizzled in aromatic palm oil with beaten eggs and scotch bonnet over warm leftover rice.",
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
        "why_this_recipe": "Rescues fresh ugwu leaves with a flash 90-second palm oil sizzle, locking in vibrant color while coating leftover rice with rich savory sauce.",
        "chef_tips": "Cooking ugwu for under 90 seconds preserves its vivid green color and crisp vegetable crunch."
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
        "why_this_recipe": "The fastest native vegetable dish in Nigerian home cooking: zero waste, maximum flavor, and quick preparation.",
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
        "why_this_recipe": "The classic street-food standard for Nigerian beans: harnesses slow onion caramelization to recreate authentic Aganyin aroma from everyday pantry staples.",
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
        "why_this_recipe": "Takes advantage of pre-cooked honey beans to yield a hearty, zero-waste hot meal in under 10 minutes without firing up long cooking cycles.",
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
        "why_this_recipe": "Marries the sweet, caramelized notes of ripe plantains with the peppery clove aroma of fresh scent leaves in a savory egg fold.",
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

export const NIGERIAN_SUGGESTIONS = [
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
