import base64
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

VISION_PROMPT = """Analyze this household food photograph carefully (whether it is a refrigerator interior, kitchen pantry, countertop, food basket, or dining prep surface). Identify every distinct food item, ingredient, raw vegetable, meat, fish, egg, dairy item, condiment, leftover, and staple visible.

Format your output strictly as a JSON array of objects with the following schema:
[
  {
    "name": "Specific ingredient name (e.g., 'Plum Tomatoes', 'Scotch Bonnet (Ata Rodo)', 'Eggs', 'Smoked Mackerel / Fish', 'Cooked White Rice', 'Fresh Ugwu Leaves', 'Ripe Plantain')",
    "category": "Produce | Protein | Pantry | Dairy | Condiment",
    "confidence": 0.95,
    "estimated_quantity": "Rough quantity observed (e.g., '4 medium', 'half carton', '1 bowl', '1 bunch')"
  }
]

Important: Return ONLY the JSON array. Do not include any greeting, preamble, or markdown explanation outside the JSON code fence.
"""

# Realistic Nigerian Household Fridge Profiles
MOCK_PROFILES = [
    # Profile A: The Weekend Market Haul
    [
        DetectedItem(name="Plum Tomatoes", category="Produce", confidence=0.96, estimated_quantity="5 medium ripe"),
        DetectedItem(name="Scotch Bonnet (Ata Rodo)", category="Produce", confidence=0.95, estimated_quantity="4 vibrant red peppers"),
        DetectedItem(name="Bell Pepper (Tatashe)", category="Produce", confidence=0.93, estimated_quantity="2 medium"),
        DetectedItem(name="Red Onions", category="Produce", confidence=0.98, estimated_quantity="2 large bulbs"),
        DetectedItem(name="Fresh Eggs", category="Protein", confidence=0.96, estimated_quantity="6 crate pack"),
        DetectedItem(name="Ripe Sweet Plantains", category="Produce", confidence=0.97, estimated_quantity="3 ripe fingers"),
        DetectedItem(name="Cooked White Rice", category="Pantry", confidence=0.92, estimated_quantity="1 medium bowl (chilled)"),
        DetectedItem(name="Smoked Mackerel (Titus)", category="Protein", confidence=0.94, estimated_quantity="1 whole deboned piece"),
        DetectedItem(name="Fresh Ugwu Leaves (Pumpkin)", category="Produce", confidence=0.91, estimated_quantity="1 small bunch (sliced)"),
        DetectedItem(name="Pure Vegetable Oil", category="Pantry", confidence=0.90, estimated_quantity="Half bottle remaining"),
    ],
    # Profile B: The Midweek Crisper Rescue
    [
        DetectedItem(name="Fresh Ugwu Leaves (Pumpkin)", category="Produce", confidence=0.97, estimated_quantity="1 large bunch (crisp)"),
        DetectedItem(name="Smoked Catfish / Mangala", category="Protein", confidence=0.95, estimated_quantity="1 large piece shredded"),
        DetectedItem(name="Scotch Bonnet (Ata Rodo)", category="Produce", confidence=0.94, estimated_quantity="3 hot peppers"),
        DetectedItem(name="Red Onions", category="Produce", confidence=0.98, estimated_quantity="2 whole bulbs"),
        DetectedItem(name="Fresh Eggs", category="Protein", confidence=0.96, estimated_quantity="4 fresh eggs"),
        DetectedItem(name="Ripe Plantains", category="Produce", confidence=0.95, estimated_quantity="2 fingers"),
        DetectedItem(name="Leftover White Rice", category="Pantry", confidence=0.93, estimated_quantity="1 bowl cooked"),
        DetectedItem(name="Stockfish Bits (Okporoko)", category="Protein", confidence=0.91, estimated_quantity="Small bowl soaked"),
        DetectedItem(name="Pure Red Palm Oil", category="Pantry", confidence=0.94, estimated_quantity="1 small jar"),
        DetectedItem(name="Fresh Ginger & Garlic", category="Produce", confidence=0.89, estimated_quantity="2 knobs ginger, 3 cloves garlic"),
    ],
    # Profile C: The Sunday Stew & Honey Beans Pot
    [
        DetectedItem(name="Plum Tomatoes", category="Produce", confidence=0.96, estimated_quantity="6 medium plum"),
        DetectedItem(name="Bell Pepper (Tatashe)", category="Produce", confidence=0.94, estimated_quantity="3 large red peppers"),
        DetectedItem(name="Scotch Bonnet (Ata Rodo)", category="Produce", confidence=0.96, estimated_quantity="5 fiery peppers"),
        DetectedItem(name="Red Onions", category="Produce", confidence=0.98, estimated_quantity="3 bulbs"),
        DetectedItem(name="Smoked Mackerel / Fish", category="Protein", confidence=0.93, estimated_quantity="1 large piece flaked"),
        DetectedItem(name="Ripe Sweet Plantains", category="Produce", confidence=0.97, estimated_quantity="3 fingers (golden ripe)"),
        DetectedItem(name="Fresh Eggs", category="Protein", confidence=0.95, estimated_quantity="6 eggs"),
        DetectedItem(name="Cooked Honey Beans (Oloyin)", category="Pantry", confidence=0.92, estimated_quantity="1 small container (leftover)"),
        DetectedItem(name="Fresh Scent Leaf (Efirin)", category="Produce", confidence=0.90, estimated_quantity="Small handful"),
        DetectedItem(name="Pure Vegetable Oil", category="Pantry", confidence=0.91, estimated_quantity="Small bottle"),
    ],
]

class VisionService:
    """
    Open Vision-Language Model service supporting Qwen2-VL, LLaVA, and Llama-3.2-Vision
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

        optimized_bytes, b64_image = self._preprocess_image(image_bytes)

        # If user explicitly configured mock mode, skip live calls
        if settings.INFERENCE_MODE == "mock":
            logger.info("INFERENCE_MODE is set to 'mock'. Returning realistic Nigerian provisions.")
            return self._mock_detected_items(image_bytes), "mock_offline", True

        # Attempt live VLM inference
        try:
            if settings.VISION_PROVIDER == "ollama":
                items = await self._call_ollama_vision(b64_image)
                return items, f"live_ollama_{settings.VISION_MODEL_NAME}", False
            else:
                items = await self._call_openai_compatible_vision(b64_image)
                return items, f"live_openai_{settings.VISION_MODEL_NAME}", False
        except Exception as e:
            logger.warning(
                f"Live vision inference failed with {settings.VISION_MODEL_NAME} ({type(e).__name__}: {e}). "
                f"Falling back to high-fidelity Nigerian mock data."
            )
            if settings.INFERENCE_MODE == "live" and not settings.FALLBACK_TO_MOCK:
                raise RuntimeError(f"Live vision inference failed and fallback is disabled: {e}")
            
            return self._mock_detected_items(image_bytes), f"fallback_mock (vision error: {type(e).__name__})", True

    def _preprocess_image(self, image_bytes: bytes) -> Tuple[bytes, str]:
        """Validates format, constrains max resolution for fast tokenization, and returns b64."""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            if image.mode in ("RGBA", "P"):
                image = image.convert("RGB")
            
            max_dim = 1440
            if max(image.width, image.height) > max_dim:
                image.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG", quality=88)
            processed_bytes = buffer.getvalue()
            b64_str = base64.b64encode(processed_bytes).decode("utf-8")
            return processed_bytes, b64_str
        except Exception as e:
            logger.error(f"Image preprocessing failed: {e}")
            raise ValueError(f"Uploaded file is not a valid decodable image: {e}")

    async def _call_ollama_vision(self, b64_image: str) -> List[DetectedItem]:
        """Calls Ollama with open vision models such as Qwen2-VL, LLaVA, or Llama-3.2-Vision."""
        endpoint = settings.VISION_ENDPOINT_OVERRIDE or f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"
        logger.info(f"Dispatching vision inference to Ollama at {endpoint} (model: {settings.VISION_MODEL_NAME})")

        payload = {
            "model": settings.VISION_MODEL_NAME,
            "prompt": VISION_PROMPT,
            "images": [b64_image],
            "stream": False,
            "options": {
                "temperature": 0.2,
            }
        }

        async with httpx.AsyncClient(timeout=settings.VISION_TIMEOUT_SECONDS) as client:
            res = await client.post(endpoint, json=payload)
            res.raise_for_status()
            data = res.json()
            raw_text = data.get("response", "")
            return self._parse_items_json(raw_text)

    async def _call_openai_compatible_vision(self, b64_image: str) -> List[DetectedItem]:
        """Calls an OpenAI-compatible vision endpoint (e.g. vLLM or local server)."""
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
        }

        headers = {}
        if settings.MUSE_GLIMMER_API_KEY:
            headers["Authorization"] = f"Bearer {settings.MUSE_GLIMMER_API_KEY}"

        async with httpx.AsyncClient(timeout=settings.VISION_TIMEOUT_SECONDS) as client:
            res = await client.post(url, json=payload, headers=headers)
            res.raise_for_status()
            data = res.json()
            raw_text = data["choices"][0]["message"]["content"]
            return self._parse_items_json(raw_text)

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
            items.append(
                DetectedItem(
                    name=str(d.get("name", "Unknown item")),
                    category=str(d.get("category", "Produce")),
                    confidence=float(d.get("confidence", 0.92)),
                    estimated_quantity=d.get("estimated_quantity")
                )
            )

        if not items:
            raise ValueError("No valid food items could be parsed from vision model response.")

        logger.info(f"Successfully detected {len(items)} items via vision model.")
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
