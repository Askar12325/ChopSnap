import logging
from typing import List, Optional, Any
from pydantic import BaseModel, Field, model_validator

logger = logging.getLogger(__name__)

class DetectedItem(BaseModel):
    name: str = Field(..., description="Name of the food item detected in the fridge, pantry, or kitchen counter")
    category: str = Field(default="Produce", description="Category like Produce, Protein, Dairy, Pantry, Condiment, etc.")
    confidence: float = Field(default=0.92, description="Confidence score")
    estimated_quantity: Optional[str] = Field(default=None, description="Rough quantity observed (e.g., '4 medium', 'half carton', '1 bowl')")

    @model_validator(mode="before")
    @classmethod
    def sanitize_detected_item(cls, data: Any) -> Any:
        """
        Ensures DetectedItem fields are clean, normalized, and resilient to missing LLM fields.
        """
        if not isinstance(data, dict):
            return data

        # Normalize common LLM aliases
        name = data.get("name") or data.get("item") or data.get("ingredient") or "Household Provision"
        category = data.get("category") or data.get("type") or "Produce"
        confidence = data.get("confidence") or data.get("score") or 0.92
        qty = data.get("estimated_quantity") or data.get("quantity") or data.get("qty")

        # Clamp confidence to valid float range 0.0 - 1.0
        try:
            conf_val = float(confidence)
            conf_val = max(0.1, min(1.0, conf_val))
        except (ValueError, TypeError):
            conf_val = 0.92

        return {
            "name": str(name).strip(),
            "category": str(category).strip().title(),
            "confidence": round(conf_val, 2),
            "estimated_quantity": str(qty).strip() if qty else None,
        }

class Recipe(BaseModel):
    title: str = Field(..., description="Authentic Nigerian dish name")
    description: str = Field(..., description="Brief appetizing description of the dish")
    meal_type: str = Field(default="proper", description="'quick' (ready in <= 20 mins) or 'proper' (deep cooking)")
    financial_tier: str = Field(default="budget", description="'budget' (average/resourceful) or 'comfortable' (rich/elevated)")
    estimated_cost_tier: str = Field(default="~₦850 (Everyday Budget)", description="Estimated cost badge or economic tier")
    prep_time_minutes: int = Field(default=10, description="Estimated prep time in minutes")
    cook_time_minutes: int = Field(default=15, description="Estimated cooking time in minutes")
    difficulty: str = Field(default="Easy", description="Easy, Medium, Hard")
    servings: int = Field(default=2, description="Number of servings")
    fridge_ingredients_used: List[str] = Field(default_factory=list, description="Ingredients sourced directly from the provisions photo")
    missing_ingredients_needed: List[str] = Field(default_factory=list, description="Extra ingredients needed")
    instructions: List[str] = Field(default_factory=list, description="Step-by-step cooking steps")
    why_this_recipe: str = Field(
        default="Selected by Meta Muse Glimmer to maximize available provisions with authentic Nigerian flavor balance and zero food waste.",
        description="Reasoning explaining why Meta Muse Glimmer synthesized this dish for the detected ingredients"
    )
    chef_tips: Optional[str] = Field(
        default="Cook on moderate flame to let aromatic peppers and palm oil bloom without scorching.",
        description="Pro tips for authentic Nigerian flavor and technique"
    )

    @model_validator(mode="before")
    @classmethod
    def sanitize_recipe(cls, data: Any) -> Any:
        """
        Guarantees strict reliability of every recipe field:
        - Normalizes meal_type to strictly 'quick' or 'proper'.
        - Normalizes financial_tier to strictly 'budget' or 'comfortable'.
        - Ensures why_this_recipe is non-empty and descriptive.
        - Provides safe Nigerian culinary fallbacks for missing instructions or times.
        """
        if not isinstance(data, dict):
            return data

        # 1. Title & Description
        title = data.get("title") or data.get("name") or data.get("dish_name") or data.get("recipe_name") or "Authentic Nigerian Dish"
        description = (
            data.get("description")
            or data.get("summary")
            or data.get("desc")
            or "Savory Nigerian meal maximizing available household provisions."
        )

        # 2. Timing
        prep = data.get("prep_time_minutes") or data.get("prep_time") or 10
        cook = data.get("cook_time_minutes") or data.get("cook_time") or 15
        try:
            prep_int = max(1, int(prep))
        except (ValueError, TypeError):
            prep_int = 10
        try:
            cook_int = max(1, int(cook))
        except (ValueError, TypeError):
            cook_int = 15

        # 3. Meal Type Normalization ('quick' vs 'proper')
        raw_meal_type = str(data.get("meal_type") or data.get("type") or data.get("category") or "").lower()
        if any(k in raw_meal_type for k in ["quick", "fast", "speed", "snack", "rapid", "express"]):
            meal_type = "quick"
        elif any(k in raw_meal_type for k in ["proper", "full", "deep", "elaborate", "stew", "soup"]):
            meal_type = "proper"
        elif (prep_int + cook_int) <= 20:
            meal_type = "quick"
        else:
            meal_type = "proper"

        # 4. Financial Tier Normalization ('budget' vs 'comfortable')
        raw_tier = str(data.get("financial_tier") or data.get("tier") or data.get("economic_tier") or "").lower()
        if any(k in raw_tier for k in ["budget", "cheap", "low", "economy", "modest", "student", "campus"]):
            financial_tier = "budget"
        elif any(k in raw_tier for k in ["comfort", "rich", "luxury", "high", "royal", "celebration", "party"]):
            financial_tier = "comfortable"
        else:
            financial_tier = "budget"

        # 5. Estimated Cost Tier
        cost_tier = data.get("estimated_cost_tier") or data.get("cost_tier") or data.get("cost")
        if not cost_tier or not str(cost_tier).strip():
            cost_tier = "~₦850 (Everyday Budget)" if financial_tier == "budget" else "~₦3,500 (Comfortable)"

        # 6. Ingredients
        used = data.get("fridge_ingredients_used") or data.get("fridge_ingredients") or data.get("ingredients_used") or data.get("ingredients") or []
        if isinstance(used, str):
            used = [i.strip() for i in used.split(",") if i.strip()]
        elif not isinstance(used, list):
            used = []

        missing = data.get("missing_ingredients_needed") or data.get("missing_ingredients") or data.get("extra_ingredients") or data.get("to_buy") or []
        if isinstance(missing, str):
            missing = [i.strip() for i in missing.split(",") if i.strip()]
        elif not isinstance(missing, list):
            missing = []

        # Filter out assumed household staples (salt, water, cooking oil, seasoning cubes)
        STAPLE_KEYWORDS = ["salt", "water", "cooking oil", "vegetable oil", "maggi", "knorr", "seasoning cube", "stock cube", "bouillon"]
        missing = [
            m for m in missing
            if not any(k in m.lower() for k in STAPLE_KEYWORDS)
        ]

        # 7. Instructions
        instructions = data.get("instructions") or data.get("steps") or data.get("method") or data.get("directions") or []
        if isinstance(instructions, str):
            instructions = [s.strip() for s in instructions.split("\n") if s.strip()]
        elif not isinstance(instructions, list):
            instructions = []
        if not instructions:
            instructions = [
                "Prepare provisions by washing and slicing cleanly according to Nigerian traditions.",
                "Sauté aromatics in seasoned oil and simmer until flavors marry together richly.",
                "Serve piping hot."
            ]

        # 8. Guaranteed why_this_recipe
        why = data.get("why_this_recipe") or data.get("reasoning") or data.get("why") or data.get("explanation")
        if not why or not str(why).strip():
            ingredients_preview = ", ".join(used[:3]) if used else "staple provisions"
            why = (
                f"Selected by Meta Muse Glimmer to maximize {ingredients_preview} "
                f"using authentic Nigerian flavor balance and zero food waste."
            )

        # 9. Chef Tips
        tips = data.get("chef_tips") or data.get("chef_tip") or data.get("pro_tip") or data.get("tip")
        if not tips or not str(tips).strip():
            tips = "Cook on steady medium heat to let natural pepper aromatics bloom fully without burning."

        # 10. Difficulty & Servings
        difficulty = str(data.get("difficulty") or "Easy").strip().title()
        if difficulty not in ["Easy", "Medium", "Hard"]:
            difficulty = "Medium" if meal_type == "proper" else "Easy"

        servings = data.get("servings") or 2
        try:
            servings_int = max(1, int(servings))
        except (ValueError, TypeError):
            servings_int = 2

        return {
            "title": str(title).strip(),
            "description": str(description).strip(),
            "meal_type": meal_type,
            "financial_tier": financial_tier,
            "estimated_cost_tier": str(cost_tier).strip(),
            "prep_time_minutes": prep_int,
            "cook_time_minutes": cook_int,
            "difficulty": difficulty,
            "servings": servings_int,
            "fridge_ingredients_used": [str(x).strip() for x in used if str(x).strip()],
            "missing_ingredients_needed": [str(x).strip() for x in missing if str(x).strip()],
            "instructions": [str(x).strip() for x in instructions if str(x).strip()],
            "why_this_recipe": str(why).strip(),
            "chef_tips": str(tips).strip() if tips else None,
        }

class ShoppingItem(BaseModel):
    item: str = Field(..., description="Item to buy")
    estimated_cost: Optional[str] = Field(default="~₦250 (Pantry staple)", description="Estimated price in Naira or priority")
    for_recipes: List[str] = Field(default_factory=list, description="Which recipes require this item")

    @model_validator(mode="before")
    @classmethod
    def sanitize_shopping_item(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data
        item = data.get("item") or data.get("name") or data.get("ingredient") or "Nigerian Cooking Essential"
        cost = data.get("estimated_cost") or data.get("cost") or data.get("price") or "~₦250 (Pantry staple)"
        for_rec = data.get("for_recipes") or data.get("recipes") or data.get("for") or []
        if isinstance(for_rec, str):
            for_rec = [for_rec]
        elif not isinstance(for_rec, list):
            for_rec = []
        return {
            "item": str(item).strip(),
            "estimated_cost": str(cost).strip(),
            "for_recipes": [str(r).strip() for r in for_rec if str(r).strip()],
        }

class ProcessResponse(BaseModel):
    success: bool = True
    is_demo: bool = Field(default=False, description="True if curated demo data or offline mock fallback was used")
    demo_badge: Optional[str] = Field(default=None, description="Descriptive badge when demo mode or curated data is active")
    detected_items: List[DetectedItem] = Field(default_factory=list)
    recipes: List[Recipe] = Field(default_factory=list)
    shopping_list: List[ShoppingItem] = Field(default_factory=list)
    model_metadata: dict = Field(
        default_factory=lambda: {
            "vision_model": "Open Vision-Language Model",
            "recipe_model": "Meta Muse Glimmer (30B open-weight)",
            "inference_mode": "auto",
        }
    )

    @model_validator(mode="before")
    @classmethod
    def validate_response_contract(cls, data: Any) -> Any:
        """
        Enforces that the response contract is always complete and non-null:
        - is_demo is strictly a boolean.
        - detected_items, recipes, and shopping_list are always lists.
        """
        if not isinstance(data, dict):
            return data

        raw_demo = data.get("is_demo")
        data["is_demo"] = bool(raw_demo) if raw_demo is not None else False

        if data.get("detected_items") is None:
            data["detected_items"] = []
        if data.get("recipes") is None:
            data["recipes"] = []
        if data.get("shopping_list") is None:
            data["shopping_list"] = []

        return data

class UpdateRecipesRequest(BaseModel):
    detected_items: List[DetectedItem] = Field(default_factory=list, description="Edited list of ingredients")
    sample_type: Optional[str] = Field(default=None, description="Optional preset sample type: market, pantry, or native")
    is_demo: bool = Field(default=False, description="Whether request is in demo mode")
    spice_level: Optional[str] = Field(default="Mild", description="Spice preference: Mild, Authentic Hot, Suya Extra")
    cooking_fuel: Optional[str] = Field(default="gas", description="Cooking fuel: gas, charcoal, electric, kerosene")

class VoiceInterpretRequest(BaseModel):
    transcript: str = Field(..., description="User voice transcript or spoken instruction")
    language: Optional[str] = Field(default="en-NG", description="Spoken language locale code")

class VoiceInterpretResponse(BaseModel):
    budget_naira: Optional[int] = Field(default=None, description="Budget in Naira if specified, else None")
    servings: Optional[int] = Field(default=None, description="Number of household portions/servings, else None")
    dietary: List[str] = Field(default_factory=list, description="Dietary restrictions explicitly requested (e.g., 'no pork', 'halal', 'no fish', 'vegetarian')")
    spice_level: Optional[str] = Field(default=None, description="'Mild', 'Authentic Hot', or 'Suya Extra' if specified, else None")
    cooking_fuel: Optional[str] = Field(default=None, description="'gas', 'charcoal', 'electric', or 'kerosene' if specified, else None")
    add_ingredients: List[str] = Field(default_factory=list, description="Specific ingredients user wants added/included")
    remove_ingredients: List[str] = Field(default_factory=list, description="Specific ingredients user wants excluded/removed")
    language_detected: Optional[str] = Field(default=None, description="Detected language: English, Nigerian Pidgin, Yoruba, Hausa, Igbo, etc.")
    source: Optional[str] = Field(default="model", description="'model' if parsed by Meta LLM, 'fallback' if rule-based fallback ran")
    confidence: Optional[str] = Field(default="high", description="'high' if clear parameters found, 'unclear' if input was ambiguous")

    @model_validator(mode="before")
    @classmethod
    def sanitize_voice_response(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data

        # Ensure budget is integer or None
        raw_budget = data.get("budget_naira")
        if raw_budget is not None:
            try:
                # Handle string numbers like '3000', '3,000', '₦3000'
                if isinstance(raw_budget, str):
                    clean_b = "".join(c for c in raw_budget if c.isdigit())
                    data["budget_naira"] = int(clean_b) if clean_b else None
                else:
                    data["budget_naira"] = int(raw_budget)
            except (ValueError, TypeError):
                data["budget_naira"] = None

        # Ensure servings is integer or None
        raw_servings = data.get("servings")
        if raw_servings is not None:
            try:
                if isinstance(raw_servings, str):
                    clean_s = "".join(c for c in raw_servings if c.isdigit())
                    data["servings"] = int(clean_s) if clean_s else None
                else:
                    data["servings"] = int(raw_servings)
            except (ValueError, TypeError):
                data["servings"] = None

        # Standardize spice_level if present
        raw_spice = data.get("spice_level")
        if raw_spice:
            s_lower = str(raw_spice).lower()
            if "mild" in s_lower or "little" in s_lower or "small" in s_lower:
                data["spice_level"] = "Mild"
            elif "extra" in s_lower or "suya" in s_lower or "very hot" in s_lower or "plenty" in s_lower:
                data["spice_level"] = "Suya Extra"
            elif "hot" in s_lower or "medium" in s_lower or "authentic" in s_lower or "normal" in s_lower:
                data["spice_level"] = "Authentic Hot"

        # Standardize cooking_fuel if present
        raw_fuel = data.get("cooking_fuel")
        if raw_fuel:
            f_lower = str(raw_fuel).lower()
            if "gas" in f_lower:
                data["cooking_fuel"] = "gas"
            elif "charcoal" in f_lower or "coal" in f_lower or "abacha" in f_lower:
                data["cooking_fuel"] = "charcoal"
            elif "electric" in f_lower or "hotplate" in f_lower or "coil" in f_lower:
                data["cooking_fuel"] = "electric"
            elif "kerosene" in f_lower or "stove" in f_lower:
                data["cooking_fuel"] = "kerosene"
            else:
                data["cooking_fuel"] = None

        # Ensure lists are lists
        for list_key in ("dietary", "add_ingredients", "remove_ingredients"):
            val = data.get(list_key)
            if val is None:
                data[list_key] = []
            elif isinstance(val, str):
                data[list_key] = [v.strip() for v in val.split(",") if v.strip()]
            elif isinstance(val, list):
                data[list_key] = [str(v).strip() for v in val if str(v).strip()]

        return data



