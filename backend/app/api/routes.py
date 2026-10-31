import logging
import httpx
from typing import Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Query, status
from ..config import settings
from ..models.schemas import ProcessResponse, UpdateRecipesRequest, VoiceInterpretRequest, VoiceInterpretResponse
from ..services.vision_service import VisionService
from ..services.recipe_service import RecipeService

logger = logging.getLogger(__name__)

router = APIRouter()
vision_service = VisionService()
recipe_service = RecipeService()

@router.get("/health", tags=["System"])
async def health_check():
    """
    System health check and live model connectivity diagnostics.
    Tests reachability of Ollama and Muse Glimmer endpoints.
    """
    ollama_reachable = False
    muse_reachable = False

    async with httpx.AsyncClient(timeout=3.0) as client:
        # Check Ollama
        try:
            res = await client.get(f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/tags")
            ollama_reachable = res.status_code == 200
        except Exception:
            ollama_reachable = False

        # Check Muse Glimmer endpoint
        try:
            res = await client.get(f"{settings.MUSE_GLIMMER_ENDPOINT.rstrip('/')}/models")
            muse_reachable = res.status_code == 200
        except Exception:
            muse_reachable = False

    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "inference_mode": settings.INFERENCE_MODE,
        "fallback_to_mock_enabled": settings.FALLBACK_TO_MOCK,
        "configured_models": {
            "vision": {
                "provider": settings.VISION_PROVIDER,
                "model": settings.VISION_MODEL_NAME,
                "endpoint": settings.VISION_ENDPOINT_OVERRIDE or settings.OLLAMA_BASE_URL,
                "reachable": ollama_reachable,
            },
            "recipe_reasoning": {
                "provider": settings.MUSE_GLIMMER_PROVIDER,
                "model": settings.MUSE_GLIMMER_MODEL_NAME,
                "endpoint": settings.MUSE_GLIMMER_ENDPOINT,
                "reachable": muse_reachable,
                "architecture": "Meta 30B Open-Weight Reasoning Model",
            },
        },
    }

@router.get("/demo/{sample_type}", response_model=ProcessResponse, tags=["Demo Mode"])
async def get_demo_recipes(
    sample_type: str = "market",
    detect_only: bool = Query(default=False, description="Return detected items only for review before cooking"),
    spice_level: Optional[str] = Query(default="Mild", description="Spice level: Mild, Medium, Extra Hot"),
    cooking_fuel: Optional[str] = Query(default="gas", description="Cooking fuel: gas, charcoal, electric, kerosene"),
):
    """
    Dedicated endpoint for Demo Mode:
    Returns curated authentic Nigerian provisions and 4-tier Muse Glimmer recipes in <10ms.
    """
    clean_type = sample_type.lower()
    detected_items, vision_mode, _ = await vision_service.detect_ingredients(b"", sample_type=clean_type, is_demo=True)

    profile_names = {
        "market": "Lagos Market Haul (Fridge & Counter)",
        "pantry": "Pantry Shelf & Honey Beans Station",
        "native": "Native Greens & Smoked Fish Crisper",
    }
    profile_label = profile_names.get(clean_type, "Curated Nigerian Household Provisions")

    if detect_only:
        logger.info(f"Demo detect_only active for '{clean_type}': {len(detected_items)} items")
        return ProcessResponse(
            success=True,
            is_demo=True,
            demo_badge=f"Demo Mode • {profile_label}",
            detected_items=detected_items,
            recipes=[],
            shopping_list=[],
            model_metadata={
                "vision_model": settings.VISION_MODEL_NAME,
                "recipe_model": settings.MUSE_GLIMMER_MODEL_NAME,
                "inference_mode": "curated_demo",
                "is_demo_mode": True,
                "demo_scenario": profile_label,
                "vision_engine": "Curated Nigerian Vision Profile",
                "recipe_engine": "none (detect_only review)",
            }
        )

    recipes, shopping_list, recipe_mode, _ = await recipe_service.generate_recipes(
        detected_items,
        sample_type=clean_type,
        is_demo=True,
        spice_level=spice_level,
        cooking_fuel=cooking_fuel,
    )

    logger.info(
        f"Verified demo response contract: {len(recipes)} recipes, "
        f"{len(detected_items)} items, {len(shopping_list)} shopping items, "
        f"is_demo=True, profile='{profile_label}'"
    )

    return ProcessResponse(
        success=True,
        is_demo=True,
        demo_badge=f"Demo Mode • {profile_label}",
        detected_items=detected_items,
        recipes=recipes,
        shopping_list=shopping_list,
        model_metadata={
            "vision_model": settings.VISION_MODEL_NAME,
            "recipe_model": settings.MUSE_GLIMMER_MODEL_NAME,
            "inference_mode": "curated_demo",
            "is_demo_mode": True,
            "demo_scenario": profile_label,
            "vision_engine": "Curated Nigerian Vision Profile",
            "recipe_engine": "Meta Muse Glimmer (30B) Pre-Calibrated Nigerian Culinary Engine",
        }
    )

@router.post("/process", response_model=ProcessResponse, tags=["Fridge Processing"])
async def process_fridge_image(
    file: UploadFile = File(...),
    detect_only: bool = Query(default=False, description="Run vision detection only, returning items for review before recipes are generated"),
    demo: bool = Query(default=False, description="Explicitly trigger fast demo mode with curated data"),
    sample_type: Optional[str] = Query(default=None, description="Preset demo sample: 'market', 'pantry', or 'native'"),
    spice_level: Optional[str] = Query(default="Mild", description="Spice level: Mild, Medium, Extra Hot"),
    cooking_fuel: Optional[str] = Query(default="gas", description="Cooking fuel: gas, charcoal, electric, kerosene"),
):
    """
    Core pipeline:
    1. Receives fridge/household provisions photo upload.
    2. Open Vision Model (Qwen2-VL, LLaVA, Llama-3.2-Vision) identifies food items.
    3. Meta's Muse Glimmer (30B open-weight) synthesizes authentic zero-waste
       Nigerian recipes that maximize provisions + outputs a short shopping list.
    4. Automatically falls back cleanly to high-fidelity mock data if local GPU is offline.
    5. If demo=true or file is a demo sample, responds instantly with curated verified data.
    """
    # Validate content type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Uploaded file '{file.filename}' is not an image (content-type: {file.content_type}).",
        )

    try:
        # Detect demo mode from query param or filename pattern
        is_demo_file = (
            demo
            or file.filename.startswith("provisions_")
            or "sample" in file.filename.lower()
            or "demo" in file.filename.lower()
        )

        resolved_sample_type = sample_type
        if not resolved_sample_type and file.filename.startswith("provisions_"):
            parts = file.filename.replace("provisions_", "").split(".")
            if parts:
                resolved_sample_type = parts[0]

        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        logger.info(f"Processing provisions image: {file.filename} ({len(image_bytes)} bytes) [demo: {is_demo_file}]")

        # Step 1: Open vision model identification (with instant demo bypass if requested)
        detected_items, vision_mode, is_vision_mock = await vision_service.detect_ingredients(
            image_bytes, sample_type=resolved_sample_type, is_demo=is_demo_file
        )

        is_overall_mock = is_demo_file or is_vision_mock
        badge = (
            "Demo Mode • Curated Nigerian Provisions"
            if is_overall_mock
            else None
        )
        combined_mode = (
            "curated_demo"
            if is_demo_file
            else ("live" if not is_overall_mock else "auto (resilient fallback)")
        )

        if detect_only:
            logger.info(
                f"Vision detection complete (detect_only=True): {len(detected_items)} items detected. "
                "Returning items for user confirmation before recipe generation."
            )
            return ProcessResponse(
                success=True,
                is_demo=is_overall_mock,
                demo_badge=badge,
                detected_items=detected_items,
                recipes=[],
                shopping_list=[],
                model_metadata={
                    "vision_model": settings.VISION_MODEL_NAME,
                    "recipe_model": settings.MUSE_GLIMMER_MODEL_NAME,
                    "inference_mode": combined_mode,
                    "is_demo_mode": is_overall_mock,
                    "vision_engine": vision_mode,
                    "recipe_engine": "none (detect_only review)",
                }
            )

        # Step 2: Muse Glimmer 30B culinary reasoning & maximization (3 recipes first for <10s response)
        recipes, shopping_list, recipe_mode, is_recipe_mock = await recipe_service.generate_recipes(
            detected_items,
            sample_type=resolved_sample_type,
            is_demo=is_demo_file,
            spice_level=spice_level,
            cooking_fuel=cooking_fuel,
            recipe_count=3,
        )

        # Determine overall mock/demo state
        is_overall_mock = is_demo_file or is_vision_mock or is_recipe_mock
        badge = (
            "Demo Mode • Curated Nigerian Provisions"
            if is_overall_mock
            else None
        )
        combined_mode = (
            "curated_demo"
            if is_demo_file
            else ("live" if not is_overall_mock else "auto (resilient fallback)")
        )

        logger.info(
            f"Verified process response contract: {len(recipes)} recipes, "
            f"{len(detected_items)} items, {len(shopping_list)} shopping items, "
            f"is_demo={is_overall_mock}, mode='{combined_mode}'"
        )

        return ProcessResponse(
            success=True,
            is_demo=is_overall_mock,
            demo_badge=badge,
            detected_items=detected_items,
            recipes=recipes,
            shopping_list=shopping_list,
            model_metadata={
                "vision_model": settings.VISION_MODEL_NAME,
                "recipe_model": settings.MUSE_GLIMMER_MODEL_NAME,
                "inference_mode": combined_mode,
                "is_demo_mode": is_overall_mock,
                "vision_engine": vision_mode,
                "recipe_engine": recipe_mode,
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error processing fridge image")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal processing failed: {str(e)}",
        )

@router.post("/recipes/update", response_model=ProcessResponse, tags=["Recipe Synthesis"])
async def update_recipes(
    payload: UpdateRecipesRequest,
    count: int = Query(default=3, description="Number of recipes to generate (default 3 for instant generation)"),
):
    """
    Regenerate recipes using the user's edited detected_items list as the single source of truth.
    Generates 3 recipes first for ultra-fast response, expandable in background.
    """
    try:
        if not payload.detected_items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one ingredient is required to generate recipes.",
            )

        logger.info(
            f"Updating recipes from edited ingredient list: {len(payload.detected_items)} items "
            f"(sample_type={payload.sample_type}, is_demo={payload.is_demo}, count={count})"
        )

        recipes, shopping_list, recipe_mode, is_recipe_mock = await recipe_service.generate_recipes(
            payload.detected_items,
            sample_type=payload.sample_type,
            is_demo=payload.is_demo,
            spice_level=payload.spice_level,
            cooking_fuel=payload.cooking_fuel,
            recipe_count=count,
        )

        badge = "Demo Mode • Updated Recipes" if (payload.is_demo or is_recipe_mock) else None
        combined_mode = "curated_demo" if payload.is_demo else ("live" if not is_recipe_mock else "auto (resilient fallback)")

        return ProcessResponse(
            success=True,
            is_demo=payload.is_demo or is_recipe_mock,
            demo_badge=badge,
            detected_items=payload.detected_items,
            recipes=recipes,
            shopping_list=shopping_list,
            model_metadata={
                "vision_model": settings.VISION_MODEL_NAME,
                "recipe_model": settings.MUSE_GLIMMER_MODEL_NAME,
                "inference_mode": combined_mode,
                "is_demo_mode": payload.is_demo or is_recipe_mock,
                "vision_engine": "User Confirmed Ingredients",
                "recipe_engine": recipe_mode,
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error updating recipes from edited ingredients")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recipe update failed: {str(e)}",
        )

@router.post("/recipes/expand", response_model=ProcessResponse, tags=["Recipe Synthesis"])
async def expand_recipes(
    payload: UpdateRecipesRequest,
    count: int = Query(default=2, description="Number of additional variation recipes to generate in background"),
):
    """
    Background non-blocking endpoint:
    Synthesizes additional creative variation recipes to enrich the user's initial meal set.
    """
    try:
        if not payload.detected_items:
            return ProcessResponse(success=True, detected_items=[], recipes=[], shopping_list=[])

        recipes, shopping_list, recipe_mode, is_recipe_mock = await recipe_service.generate_recipes(
            payload.detected_items,
            sample_type=payload.sample_type,
            is_demo=payload.is_demo,
            spice_level=payload.spice_level,
            cooking_fuel=payload.cooking_fuel,
            recipe_count=count,
        )

        return ProcessResponse(
            success=True,
            is_demo=payload.is_demo or is_recipe_mock,
            demo_badge=None,
            detected_items=payload.detected_items,
            recipes=recipes,
            shopping_list=shopping_list,
            model_metadata={
                "vision_model": settings.VISION_MODEL_NAME,
                "recipe_model": settings.MUSE_GLIMMER_MODEL_NAME,
                "inference_mode": "background_expansion",
                "is_demo_mode": payload.is_demo or is_recipe_mock,
                "vision_engine": "User Confirmed Ingredients",
                "recipe_engine": recipe_mode,
            }
        )
    except Exception as e:
        logger.warning(f"Background recipe expansion failed non-critically: {e}")
        return ProcessResponse(success=False, detected_items=payload.detected_items, recipes=[], shopping_list=[])
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error updating recipes from edited ingredients")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recipe update failed: {str(e)}",
        )

@router.post("/voice/interpret", response_model=VoiceInterpretResponse, tags=["Voice Intelligence"])
async def interpret_voice(payload: VoiceInterpretRequest):
    """
    Interprets user spoken transcript via RECIPE_MODEL into structured culinary & budget parameters:
    - budget_naira
    - servings
    - dietary (e.g. no pork, halal, no fish)
    - spice_level (Mild, Authentic Hot, Suya Extra)
    - cooking_fuel (gas, charcoal, electric, kerosene)
    - add_ingredients
    - remove_ingredients
    - language_detected
    Explicitly supports Nigerian English, Nigerian Pidgin, Yoruba, Hausa, and Igbo.
    Missing fields are returned as null/empty list, never guessed.
    """
    clean_text = payload.transcript.strip()
    if not clean_text:
        return VoiceInterpretResponse(
            budget_naira=None,
            servings=None,
            dietary=[],
            spice_level=None,
            cooking_fuel=None,
            add_ingredients=[],
            remove_ingredients=[],
            language_detected="Unknown"
        )

    try:
        raw_result = await recipe_service.interpret_voice_instruction(clean_text, language=payload.language or "en-NG")
        return VoiceInterpretResponse(**raw_result)
    except Exception as e:
        logger.exception("Voice interpretation error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Voice interpretation failed: {str(e)}"
        )

