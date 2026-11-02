import base64
import hashlib
import io
import json
import logging
import re
from typing import List, Tuple
from PIL import Image
import httpx
from ..config import settings
from ..models.schemas import DetectedItem

logger = logging.getLogger(__name__)

# In-memory SHA-256 vision cache for repeated image analysis
_VISION_CACHE = {}

VISION_PROMPT = """Analyze this household food photograph carefully (whether it is a refrigerator interior, kitchen pantry, countertop, food basket, or prep surface). Identify all visible food items, raw ingredients, packaged provisions, seasonings, and leftovers.

Format your output strictly as a JSON array of objects with the following schema:
[
  {
    "name": "Generic or visible ingredient name (e.g., 'White Rice', 'Palm Oil', 'Seasoning Cubes', 'Blended Tomato and Pepper', 'White Powder')",
    "category": "Produce | Protein | Pantry | Dairy | Condiment",
    "certainty": "clear | likely | unsure",
    "alternatives": ["alternative 1", "alternative 2"],
    "form": "raw | cooked | packaged | unknown",
    "container_state": "full | partial | nearly_empty | residue_only | unknown",
    "estimated_quantity": "Rough quantity observed using 'about' with a range or 'many' (e.g. 'about 1-2 cups', 'about 30-50 cubes', 'many')"
  }
]

Strict Rules:
1. Name only what is visible: Do not invent or assume items not directly visible in the image.
2. Certainty & Alternatives: Set certainty to "clear" if unambiguous (e.g. eggs, rice). If ambiguous (e.g. an unlabeled white powder or dark liquid), set certainty to "likely" or "unsure" and provide plausible alternatives in the "alternatives" list (for example white powder: ["salt", "sugar", "powdered milk", "flour"]). For clear items, set "alternatives" to [].
3. No invented brands, flavours, or exact counts: Never invent brand names, flavours, or exact counts. Use "about" with a range (e.g. 'about 30-50 cubes', 'about 1-2 liters') or 'many'—never state an exact count.
4. Generic names for unreadable labels: If a label or sachet is not clearly readable, use a generic name (e.g., 'Seasoning Sachets', 'Spice Packet', 'Seasoning Cubes', 'Cooking Oil') rather than guessing specific brands or spice blends.
5. Leftovers: Do not guess a specific dish name for leftovers. Use generic descriptions (e.g. 'Cooked Rice', 'Blended Tomato and Pepper Base', 'Cooked Green Vegetable Soup Leftover').
6. Containers and Lids: Ignore empty containers, loose lids, and empty bottles unless a label is readable with contents inside.
7. Residue & Nearly Empty: Do not treat residue_only or nearly_empty containers as ingredients. If a container only has food residue or is nearly empty, accurately mark container_state as 'residue_only' or 'nearly_empty'.
8. Environment: Do not describe the room, floor, tiles, walls, or background.
9. Return ONLY the raw JSON array. Do not include any greeting, explanation, or conversational markdown outside the JSON code fence.
"""

# Realistic Nigerian Household Fridge Profiles
MOCK_PROFILES = [
    # Profile A: The Weekend Market Haul
    [
        DetectedItem(name="Plum Tomatoes", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 4-6 ripe"),
        DetectedItem(name="Scotch Bonnet (Ata Rodo)", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 4-6 peppers"),
        DetectedItem(name="Bell Pepper (Tatashe)", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 2-3 medium"),
        DetectedItem(name="Red Onions", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 2-3 bulbs"),
        DetectedItem(name="Fresh Eggs", category="Protein", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 6-12 eggs"),
        DetectedItem(name="Ripe Sweet Plantains", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 3-4 fingers"),
        DetectedItem(name="Cooked White Rice", category="Pantry", certainty="clear", alternatives=[], form="cooked", container_state="partial", estimated_quantity="about 1-2 bowls"),
        DetectedItem(name="Smoked Mackerel (Titus)", category="Protein", certainty="likely", alternatives=["smoked catfish"], form="cooked", container_state="partial", estimated_quantity="about 1-2 pieces"),
        DetectedItem(name="Fresh Ugwu Leaves (Pumpkin)", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 1 bunch"),
        DetectedItem(name="Pure Vegetable Oil", category="Pantry", certainty="clear", alternatives=[], form="packaged", container_state="partial", estimated_quantity="about half bottle"),
    ],
    # Profile B: The Midweek Crisper Rescue
    [
        DetectedItem(name="Fresh Ugwu Leaves (Pumpkin)", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="full", estimated_quantity="about 1 large bunch"),
        DetectedItem(name="Smoked Catfish / Mangala", category="Protein", certainty="likely", alternatives=["smoked fish"], form="cooked", container_state="partial", estimated_quantity="about 1 piece shredded"),
        DetectedItem(name="Scotch Bonnet (Ata Rodo)", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 3-5 peppers"),
        DetectedItem(name="Red Onions", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 2 bulbs"),
        DetectedItem(name="Fresh Eggs", category="Protein", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 4 eggs"),
        DetectedItem(name="Ripe Plantains", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 2-3 fingers"),
        DetectedItem(name="Leftover White Rice", category="Pantry", certainty="clear", alternatives=[], form="cooked", container_state="partial", estimated_quantity="about 1 bowl"),
        DetectedItem(name="Stockfish Bits (Okporoko)", category="Protein", certainty="likely", alternatives=["dried codfish"], form="raw", container_state="partial", estimated_quantity="about 1 small bowl"),
        DetectedItem(name="Pure Red Palm Oil", category="Pantry", certainty="clear", alternatives=[], form="packaged", container_state="partial", estimated_quantity="about 1 small jar"),
        DetectedItem(name="Fresh Ginger & Garlic", category="Produce", certainty="likely", alternatives=["garlic"], form="raw", container_state="partial", estimated_quantity="about 2 knobs ginger, 3 cloves garlic"),
    ],
    # Profile C: The Sunday Stew & Honey Beans Pot
    [
        DetectedItem(name="Plum Tomatoes", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 5-8 tomatoes"),
        DetectedItem(name="Bell Pepper (Tatashe)", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 3 peppers"),
        DetectedItem(name="Scotch Bonnet (Ata Rodo)", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 5 hot peppers"),
        DetectedItem(name="Red Onions", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 3 bulbs"),
        DetectedItem(name="Smoked Mackerel / Fish", category="Protein", certainty="likely", alternatives=["smoked fish"], form="cooked", container_state="partial", estimated_quantity="about 1-2 pieces"),
        DetectedItem(name="Ripe Sweet Plantains", category="Produce", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 3 fingers"),
        DetectedItem(name="Fresh Eggs", category="Protein", certainty="clear", alternatives=[], form="raw", container_state="partial", estimated_quantity="about 6 eggs"),
        DetectedItem(name="Cooked Honey Beans (Oloyin)", category="Pantry", certainty="clear", alternatives=[], form="cooked", container_state="partial", estimated_quantity="about 1 container"),
        DetectedItem(name="Fresh Scent Leaf (Efirin)", category="Produce", certainty="likely", alternatives=["nchanwu"], form="raw", container_state="partial", estimated_quantity="about 1 handful"),
        DetectedItem(name="Pure Vegetable Oil", category="Pantry", certainty="clear", alternatives=[], form="packaged", container_state="partial", estimated_quantity="about 1 small bottle"),
    ],
]

class VisionService:
    """
    Open Vision-Language Model service supporting LLaVA and Llama-3.2-Vision
    via Ollama or OpenAI-compatible endpoints with high-resilience fallback.
    """

    async def detect_ingredients(
        self,
        image_bytes: bytes,
        sample_type: str = None,
        is_demo: bool = False
    ) -> Tuple[List[DetectedItem], str, bool]:
        """
        Processes image bytes, executes VLM inference if configured, and returns
        (detected_items, provider_used, is_mock).
        """
        # If demo mode or sample is active, return curated provisions immediately without network delay
        if is_demo or sample_type:
            logger.info(f"Demo mode active: Returning curated provisions for '{sample_type or 'market'}'.")
            return self._mock_detected_items_for_sample(sample_type or "market"), "demo_curated", True

        # Check in-memory vision cache for repeated image analysis (live successes only)
        img_hash = (
            hashlib.sha256(
                f"{hashlib.sha256(image_bytes).hexdigest()}_{settings.VISION_MODEL_NAME}_low".encode()
            ).hexdigest()
            if image_bytes
            else None
        )
        if img_hash and img_hash in _VISION_CACHE:
            cached_items, cached_mode = _VISION_CACHE[img_hash]
            logger.info(f"Vision cache HIT for image hash {img_hash[:10]}: returning {len(cached_items)} items instantly.")
            return [it.model_copy(deep=True) for it in cached_items], f"{cached_mode} (cache_hit)", False

        optimized_bytes, b64_image = self._preprocess_image(image_bytes)

        # If user explicitly configured mock mode, skip live calls
        if settings.INFERENCE_MODE == "mock":
            logger.info("INFERENCE_MODE is set to 'mock'. Returning realistic Nigerian provisions.")
            return self._mock_detected_items(image_bytes), "mock_offline", True

        # Attempt live VLM inference
        try:
            if settings.VISION_PROVIDER == "ollama":
                items = await self._call_ollama_vision(b64_image)
                mode_str = f"live_ollama_{settings.VISION_MODEL_NAME}"
            else:
                items = await self._call_openai_compatible_vision(b64_image)
                mode_str = f"live_openai_{settings.VISION_MODEL_NAME}"

            # Only cache successful live results
            if img_hash:
                _VISION_CACHE[img_hash] = (items, mode_str)

            return items, mode_str, False
        except Exception as e:
            logger.warning(
                f"Live vision inference failed with {settings.VISION_MODEL_NAME} ({type(e).__name__}: {e})."
            )
            if settings.INFERENCE_MODE == "live":
                raise RuntimeError(f"Live vision inference failed: {e}") from e
            
            # In auto mode, fallback to mock but never cache fallback results
            return self._mock_detected_items(image_bytes), f"fallback_mock (vision error: {type(e).__name__})", True

    def _preprocess_image(self, image_bytes: bytes) -> Tuple[bytes, str]:
        """Validates format, constrains max resolution (1024px) for fast tokenization, and returns b64."""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            if image.mode in ("RGBA", "P"):
                image = image.convert("RGB")
            
            max_dim = 1024
            if max(image.width, image.height) > max_dim:
                image.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG", quality=85)
            processed_bytes = buffer.getvalue()
            b64_str = base64.b64encode(processed_bytes).decode("utf-8")
            return processed_bytes, b64_str
        except Exception as e:
            logger.error(f"Image preprocessing failed: {e}")
            raise ValueError(f"Uploaded file is not a valid decodable image: {e}")

    async def _call_ollama_vision(self, b64_image: str) -> List[DetectedItem]:
        """Calls Ollama with open vision models such as LLaVA or Llama-3.2-Vision."""
        endpoint = settings.VISION_ENDPOINT_OVERRIDE or f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"
        logger.info(f"Dispatching vision inference to Ollama at {endpoint} (model: {settings.VISION_MODEL_NAME})")

        payload = {
            "model": settings.VISION_MODEL_NAME,
            "prompt": VISION_PROMPT,
            "images": [b64_image],
            "stream": False,
            "options": {
                "temperature": 0.2,
                "num_predict": 3000,
            }
        }

        async with httpx.AsyncClient(timeout=settings.VISION_TIMEOUT_SECONDS) as client:
            res = await client.post(endpoint, json=payload)
            res.raise_for_status()
            data = res.json()
            raw_text = data.get("response", "")
            return self._parse_items_json(raw_text)

    async def _call_openai_compatible_vision(self, b64_image: str) -> List[DetectedItem]:
        """Calls an OpenAI-compatible vision endpoint with automatic single retry on truncation or parse error."""
        base_url = settings.VISION_ENDPOINT_OVERRIDE or f"{settings.OLLAMA_BASE_URL.rstrip('/')}/v1"
        url = f"{base_url.rstrip('/')}/chat/completions"
        logger.info(f"Dispatching vision inference to OpenAI-compatible endpoint at {url} (model: {settings.VISION_MODEL_NAME})")

        payload = {
            "model": settings.VISION_MODEL_NAME,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": VISION_PROMPT},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}
                        }
                    ]
                }
            ],
            "temperature": 0.2,
            "reasoning_effort": "low",
            "max_completion_tokens": 3000,
        }

        headers = {}
        if settings.MUSE_GLIMMER_API_KEY:
            headers["Authorization"] = f"Bearer {settings.MUSE_GLIMMER_API_KEY}"

        last_error = None
        for attempt in range(2):
            try:
                async with httpx.AsyncClient(timeout=settings.VISION_TIMEOUT_SECONDS) as client:
                    res = await client.post(url, json=payload, headers=headers)
                    res.raise_for_status()
                    data = res.json()
                    choice = data["choices"][0]
                    raw_text = choice["message"].get("content") or ""
                    finish_reason = choice.get("finish_reason")

                    if finish_reason == "length":
                        logger.warning(f"Vision response truncated by length limit on attempt {attempt + 1}")
                        if attempt == 0:
                            payload["max_completion_tokens"] = 3500
                            continue
                        raise ValueError("Vision model response was cut off due to length limit.")

                    return self._parse_items_json(raw_text)
            except Exception as e:
                last_error = e
                logger.warning(f"Vision inference attempt {attempt + 1} failed: {e}")
                if attempt == 0:
                    continue
                raise last_error

    def _parse_items_json(self, raw_text: str) -> List[DetectedItem]:
        """Robust multi-layer JSON parser extracting structured items from model text."""
        cleaned = raw_text.strip()
        match = re.search(r"```(?:json)?\s*(\[[\s\S]*?\])\s*```", cleaned)
        if match:
            cleaned = match.group(1)
        else:
            start = cleaned.find("[")
            end = cleaned.rfind("]")
            if start != -1 and end != -1 and end > start:
                cleaned = cleaned[start : end + 1]

        data = json.loads(cleaned)
        if not isinstance(data, list):
            raise ValueError("Vision model did not return a JSON array.")

        items = []
        for d in data:
            if not isinstance(d, dict) or "name" not in d:
                continue

            try:
                item = DetectedItem(**d)
            except Exception as e:
                logger.warning(f"Failed to validate detected item {d}: {e}")
                continue

            # Rule 4: Do not treat residue_only or nearly_empty containers as ingredients
            if item.container_state in ("residue_only", "nearly_empty"):
                logger.info(
                    f"Excluding non-ingredient item with container_state='{item.container_state}': {item.name}"
                )
                continue

            items.append(item)

        logger.info(f"Successfully detected {len(items)} usable ingredients via vision model.")
        return items

    def _mock_detected_items(self, image_bytes: bytes = b"") -> List[DetectedItem]:
        """
        Returns realistic Nigerian household fridge provisions.
        Uses image content to vary between distinct Nigerian kitchen scenarios.
        """
        profile_idx = len(image_bytes) % len(MOCK_PROFILES) if image_bytes else 0
        return MOCK_PROFILES[profile_idx]

    def _mock_detected_items_for_sample(self, sample_type: str = "market") -> List[DetectedItem]:
        """
        Deterministic, immediate mapping for demo buttons so they never fail
        and return the exact right profile.
        """
        st = (sample_type or "market").lower()
        if "native" in st or "green" in st:
            return MOCK_PROFILES[1]
        elif "pantry" in st or "bean" in st:
            return MOCK_PROFILES[2]
        else:
            return MOCK_PROFILES[0]
