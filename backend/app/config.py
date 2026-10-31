import os
from pathlib import Path
from typing import List, Optional
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
PRICES_FILE_PATH: Path = BACKEND_DIR.parent / "frontend" / "src" / "data" / "prices.json"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(str(BACKEND_DIR / ".env"), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )

    PROJECT_NAME: str = "ChopSnap"
    API_V1_STR: str = "/api"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]

    # -------------------------------------------------------------
    # Primary Generic AI Variables
    # -------------------------------------------------------------
    AI_BASE_URL: Optional[str] = None
    AI_API_KEY: Optional[str] = None
    VISION_MODEL: Optional[str] = None
    RECIPE_MODEL: Optional[str] = None

    # -------------------------------------------------------------
    # General Inference Settings
    # -------------------------------------------------------------
    INFERENCE_MODE: str = "auto"
    FALLBACK_TO_MOCK: bool = True

    # -------------------------------------------------------------
    # 1. Vision Model Configuration (Qwen2-VL, LLaVA, Llama-3.2-Vision)
    # -------------------------------------------------------------
    VISION_PROVIDER: str = "ollama"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    VISION_MODEL_NAME: str = "qwen2-vl:7b"
    VISION_ENDPOINT_OVERRIDE: Optional[str] = None
    VISION_TIMEOUT_SECONDS: float = 45.0

    # -------------------------------------------------------------
    # 2. Meta Muse Glimmer (30B Open-Weight Reasoning Model)
    # -------------------------------------------------------------
    MUSE_GLIMMER_PROVIDER: str = "openai_compatible"
    MUSE_GLIMMER_ENDPOINT: str = "http://localhost:8000/v1"
    MUSE_GLIMMER_MODEL_NAME: str = "meta/muse-glimmer-30b"
    MUSE_GLIMMER_API_KEY: Optional[str] = None
    MUSE_GLIMMER_TIMEOUT_SECONDS: float = 60.0

    @model_validator(mode="after")
    def apply_ai_aliases(self):
        # Wire AI_BASE_URL to both recipe reasoning and vision endpoints
        if self.AI_BASE_URL:
            clean_url = self.AI_BASE_URL.rstrip("/")
            if self.MUSE_GLIMMER_ENDPOINT in ("http://localhost:8000/v1", "http://localhost:8000"):
                self.MUSE_GLIMMER_ENDPOINT = clean_url
            if not self.VISION_ENDPOINT_OVERRIDE:
                self.VISION_ENDPOINT_OVERRIDE = clean_url
            # If an external/OpenAI-compatible AI base URL is provided, default vision provider to openai_compatible
            if self.VISION_PROVIDER == "ollama" and ("http://localhost:11434" not in clean_url):
                self.VISION_PROVIDER = "openai_compatible"

        # Wire AI_API_KEY
        if self.AI_API_KEY and not self.MUSE_GLIMMER_API_KEY:
            self.MUSE_GLIMMER_API_KEY = self.AI_API_KEY

        # Wire model names
        if self.VISION_MODEL:
            self.VISION_MODEL_NAME = self.VISION_MODEL
        if self.RECIPE_MODEL:
            self.MUSE_GLIMMER_MODEL_NAME = self.RECIPE_MODEL

        return self

settings = Settings()
