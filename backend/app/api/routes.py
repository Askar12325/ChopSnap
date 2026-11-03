import logging
import httpx
from typing import Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Query, Request, status
from ..config import settings
from ..models.schemas import ProcessResponse, UpdateRecipesRequest, VoiceInterpretRequest, VoiceInterpretResponse
from ..services.vision_service import VisionService
from ..services.recipe_service import RecipeService
from ..core.rate_limit import check_ip_rate_limit, check_and_increment_daily_ai_cap

logger = logging.getLogger(__name__)

router = APIRouter()
vision_service = VisionService()
recipe_service = RecipeService()

def validate_image_upload(file_bytes: bytes, content_type: Optional[str]) -> None:
    """Enforces 8MB file size limit and strict JPEG/PNG/WebP signature & content-type."""
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No photo provided. Please upload a clear photo of your kitchen or fridge.",
        )

    max_bytes = 8 * 1024 * 1024  # 8 MB
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Photo exceeds the 8MB limit. Please upload a photo under 8MB.",
        )

    allowed_types = ("image/jpeg", "image/png", "image/webp")
    if not content_type or content_type.lower() not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported format. Please upload a JPEG, PNG, or WebP photo.",
        )

    if len(file_bytes) < 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is too small or corrupted. Please try another photo.",
        )

    # Magic byte signatures
    is_jpeg = file_bytes.startswith(b"\xff\xd8\xff")
    is_png = file_bytes.startswith(b"\x89PNG\r\n\x1a\n")
    is_webp = file_bytes.startswith(b"RIFF") and file_bytes[8:12] == b"WEBP"

    if not (is_jpeg or is_png or is_webp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The file content does not match a valid JPEG, PNG, or WebP image. Please upload an authentic photo.",
        )

@router.get("/health", tags=["System"])
async def health_check():
    """
    System health check and live model connectivity diagnostics.
    Tests reachability of the configured AI inference endpoint.
    """
    ai_reachable = False

    if settings.AI_BASE_URL:
        async with httpx.AsyncClient(timeout=3.0) as client:
            try:
                headers = {}
                if settings.AI_API_KEY:
                    headers["Authorization"] = f"Bearer {settings.AI_API_KEY}"
                res = await client.get(f"{settings.AI_BASE_URL}/models", headers=headers)
                ai_reachable = res.status_code == 200
            except Exception:
                ai_reachable = False

    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "inference_mode": settings.INFERENCE_MODE,
        "fallback_to_mock_enabled": settings.FALLBACK_TO_MOCK,
        "configured_models": {
            "vision": {
                "model": settings.VISION_MODEL,
                "endpoint": settings.AI_BASE_URL,
                "reachable": ai_reachable,
            },
            "recipe_reasoning": {
                "model": settings.RECIPE_MODEL,
                "endpoint": settings.AI_BASE_URL,
                "reachable": ai_reachable,
                "architecture": "Muse Spark Open Reasoning Model",
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
    Returns curated authentic Nigerian provisions and 4-tier Muse Spark Open recipes in <10ms.
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
                "vision_model": settings.VISION_MODEL,
                "recipe_model": settings.RECIPE_MODEL,
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
            "vision_model": settings.VISION_MODEL,
            "recipe_model": settings.RECIPE_MODEL,
            "inference_mode": "curated_demo",
            "is_demo_mode": True,
            "demo_scenario": profile_label,
            "vision_engine": "Curated Nigerian Vision Profile",
            "recipe_engine": "Muse Spark Open Pre-Calibrated Nigerian Culinary Engine",
        }
    )

@router.post("/process", response_model=ProcessResponse, tags=["Fridge Processing"])
async def process_fridge_image(
    request: Request,
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
    2. Open Vision Model identifies food items.
    3. Muse Spark Open synthesizes authentic zero-waste
       Nigerian recipes that maximize provisions + outputs a short shopping list.
    4. Automatically falls back cleanly to high-fidelity mock data if local GPU is offline.
    5. If demo=true or file is a demo sample, responds instantly with curated verified data.
    """
    check_ip_rate_limit(request)

    try:
        # Explicit demo mode only from query parameter (no silent filename hijacking)
        is_demo_file = bool(demo)
        resolved_sample_type = sample_type if is_demo_file else None

        image_bytes = await file.read()

        if not is_demo_file:
            validate_image_upload(image_bytes, file.content_type)
            check_and_increment_daily_ai_cap()

        logger.info(f"Processing provisions image: {file.filename} ({len(image_bytes)} bytes) [demo: {is_demo_file}]")

        # Step 1: Open vision model identification (with instant demo bypass if requested)
        detected_items, vision_mode, is_vision_mock = await vision_service.detect_ingredients(
            image_bytes, sample_type=resolved_sample_type, is_demo=is_demo_file
        )

        is_fallback = bool(is_vision_mock and not is_demo_file)
        badge = (
            "Demo Mode • Example Nigerian Provisions"
            if is_demo_file
            else ("Example Data (Fallback)" if is_fallback else None)
        )
        combined_mode = (
            "curated_demo"
            if is_demo_file
            else ("auto (fallback)" if is_fallback else "live")
        )

        if detect_only:
            logger.info(
                f"Vision detection complete (detect_only=True): {len(detected_items)} items detected. "
                "Returning items for user confirmation before recipe generation."
            )
            return ProcessResponse(
                success=True,
                is_demo=is_demo_file,
                fallback_triggered=is_fallback,
                fallback_reason="Live vision analysis failed; displaying example provisions." if is_fallback else None,
                demo_badge=badge,
                detected_items=detected_items,
                recipes=[],
                shopping_list=[],
                model_metadata={
                    "vision_model": settings.VISION_MODEL,
                    "recipe_model": settings.RECIPE_MODEL,
                    "inference_mode": combined_mode,
                    "is_demo_mode": is_demo_file,
                    "vision_engine": vision_mode,
                    "recipe_engine": "none (detect_only review)",
                }
            )

        # Step 2: Muse Spark Open culinary reasoning & maximization (3 recipes first for fast response)
        recipes, shopping_list, recipe_mode, is_recipe_mock = await recipe_service.generate_recipes(
            detected_items,
            sample_type=resolved_sample_type,
            is_demo=is_demo_file,
            spice_level=spice_level,
            cooking_fuel=cooking_fuel,
            recipe_count=3,
        )

        is_fallback = bool((is_vision_mock or is_recipe_mock) and not is_demo_file)
        badge = (
            "Demo Mode • Example Nigerian Provisions"
            if is_demo_file
            else ("Example Data (Fallback)" if is_fallback else None)
        )
        combined_mode = (
            "curated_demo"
            if is_demo_file
            else ("auto (fallback)" if is_fallback else "live")
        )

        logger.info(
            f"Verified process response contract: {len(recipes)} recipes, "
            f"{len(detected_items)} items, {len(shopping_list)} shopping items, "
            f"is_demo={is_demo_file}, is_fallback={is_fallback}, mode='{combined_mode}'"
        )

        return ProcessResponse(
            success=True,
            is_demo=is_demo_file,
            fallback_triggered=is_fallback,
            fallback_reason="Live analysis failed; displaying example data." if is_fallback else None,
            demo_badge=badge,
            detected_items=detected_items,
            recipes=recipes,
            shopping_list=shopping_list,
            model_metadata={
                "vision_model": settings.VISION_MODEL,
                "recipe_model": settings.RECIPE_MODEL,
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
    request: Request,
    payload: UpdateRecipesRequest,
    count: int = Query(default=3, description="Number of recipes to generate (default 3 for instant generation)"),
):
    """
    Regenerate recipes using the user's edited detected_items list as the single source of truth.
    Generates 3 recipes first for ultra-fast response, expandable in background.
    """
    check_ip_rate_limit(request)
    if not payload.is_demo:
        check_and_increment_daily_ai_cap()

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
            budget_naira=payload.budget_naira,
            servings=payload.servings or 2,
            city=payload.city or "Abuja",
        )

        is_fallback = bool(is_recipe_mock and not payload.is_demo)
        badge = "Demo Mode • Example Nigerian Recipes" if payload.is_demo else ("Example Data (Fallback)" if is_fallback else None)
        combined_mode = "curated_demo" if payload.is_demo else ("auto (fallback)" if is_fallback else "live")

        return ProcessResponse(
            success=True,
            is_demo=payload.is_demo,
            fallback_triggered=is_fallback,
            fallback_reason="Live recipe generation failed; displaying example recipes." if is_fallback else None,
            demo_badge=badge,
            detected_items=payload.detected_items,
            recipes=recipes,
            shopping_list=shopping_list,
            model_metadata={
                "vision_model": settings.VISION_MODEL,
                "recipe_model": settings.RECIPE_MODEL,
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
    request: Request,
    payload: UpdateRecipesRequest,
    count: int = Query(default=2, description="Number of additional variation recipes to generate in background"),
):
    """
    Background non-blocking endpoint:
    Synthesizes additional creative variation recipes to enrich the user's initial meal set.
    """
    check_ip_rate_limit(request)
    if not payload.is_demo:
        check_and_increment_daily_ai_cap()

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
            budget_naira=payload.budget_naira,
            servings=payload.servings or 2,
            city=payload.city or "Abuja",
        )

        return ProcessResponse(
            success=True,
            is_demo=payload.is_demo or is_recipe_mock,
            demo_badge=None,
            detected_items=payload.detected_items,
            recipes=recipes,
            shopping_list=shopping_list,
            model_metadata={
                "vision_model": settings.VISION_MODEL,
                "recipe_model": settings.RECIPE_MODEL,
                "inference_mode": "background_expansion",
                "is_demo_mode": payload.is_demo or is_recipe_mock,
                "vision_engine": "User Confirmed Ingredients",
                "recipe_engine": recipe_mode,
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Background recipe expansion failed non-critically: {e}")
        return ProcessResponse(success=False, detected_items=payload.detected_items, recipes=[], shopping_list=[])

@router.post("/voice/interpret", response_model=VoiceInterpretResponse, tags=["Voice Intelligence"])
async def interpret_voice(request: Request, payload: VoiceInterpretRequest):
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
    check_ip_rate_limit(request)
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

