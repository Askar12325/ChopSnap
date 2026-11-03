import os
import logging
from pathlib import Path
from typing import List, Optional
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

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
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    ALLOWED_ORIGINS: Optional[str] = None

    # Rate limiting & daily AI caps
    RATE_LIMIT_PER_MINUTE: int = 15
    DAILY_AI_CALL_LIMIT: int = 300

    # -------------------------------------------------------------
    # Primary AI Inference Configuration
    # -------------------------------------------------------------
    AI_BASE_URL: Optional[str] = None
    AI_API_KEY: Optional[str] = None
    VISION_MODEL: str = "meta/muse-spark-open"
    RECIPE_MODEL: str = "meta/muse-spark-open"

    # Timeouts (in seconds)
    VISION_TIMEOUT_SECONDS: float = 45.0
    RECIPE_TIMEOUT_SECONDS: float = 90.0

    # Inference settings
    INFERENCE_MODE: Optional[str] = None
    FALLBACK_TO_MOCK: bool = False

    @model_validator(mode="after")
    def validate_and_finalize_settings(self):
        # Default INFERENCE_MODE based on environment: "live" in production, "auto" otherwise
        if not self.INFERENCE_MODE:
            self.INFERENCE_MODE = "live" if self.is_production else "auto"

        # Sanitize AI_BASE_URL
        if self.AI_BASE_URL:
            self.AI_BASE_URL = self.AI_BASE_URL.rstrip("/")

        # Clear startup warning if AI_API_KEY is missing (never prints value)
        if not self.AI_API_KEY:
            logger.warning(
                "[ChopSnap Startup Warning] AI_API_KEY is not configured. "
                "Live inference requests to remote AI endpoints will fail without authentication."
            )

        return self

    @property
    def cors_origins(self) -> List[str]:
        origins = ["http://localhost:3000"]
        if self.ALLOWED_ORIGINS:
            for o in self.ALLOWED_ORIGINS.split(","):
                clean = o.strip().rstrip("/")
                if clean and clean not in origins:
                    origins.append(clean)
        return origins

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() in ("production", "prod")

settings = Settings()
