import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ChopSnap"
    API_V1_STR: str = "/api"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]
    
    # -------------------------------------------------------------
    # General Inference Settings
    # -------------------------------------------------------------
    # Modes: "auto" (attempts live models, falls back to mock if offline),
    #        "live" (strict live models), or "mock" (offline dev)
    INFERENCE_MODE: str = os.getenv("INFERENCE_MODE", "auto")
    FALLBACK_TO_MOCK: bool = True

    # -------------------------------------------------------------
    # 1. Vision Model Configuration (Qwen2-VL, LLaVA, Llama-3.2-Vision)
    # -------------------------------------------------------------
    # Provider: "ollama", "openai_compatible", or "mock"
    VISION_PROVIDER: str = os.getenv("VISION_PROVIDER", "ollama")
    # Base Ollama endpoint (default: http://localhost:11434)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    # Model name in Ollama or vLLM: e.g. "qwen2-vl:7b", "llava:13b", "llama3.2-vision:11b"
    VISION_MODEL_NAME: str = os.getenv("VISION_MODEL_NAME", "qwen2-vl:7b")
    # Optional direct override for vision endpoint
    VISION_ENDPOINT_OVERRIDE: Optional[str] = os.getenv("VISION_ENDPOINT_OVERRIDE", None)
    VISION_TIMEOUT_SECONDS: float = float(os.getenv("VISION_TIMEOUT_SECONDS", "45.0"))

    # -------------------------------------------------------------
    # 2. Meta Muse Glimmer (30B Open-Weight Reasoning Model)
    # -------------------------------------------------------------
    # Provider: "openai_compatible" (vLLM / LMDeploy / Ollama / TGI), "ollama", or "mock"
    MUSE_GLIMMER_PROVIDER: str = os.getenv("MUSE_GLIMMER_PROVIDER", "openai_compatible")
    # Endpoint for Muse Glimmer (e.g. http://localhost:8000/v1 or http://localhost:11434/v1)
    MUSE_GLIMMER_ENDPOINT: str = os.getenv("MUSE_GLIMMER_ENDPOINT", "http://localhost:8000/v1")
    MUSE_GLIMMER_MODEL_NAME: str = os.getenv("MUSE_GLIMMER_MODEL_NAME", "meta/muse-glimmer-30b")
    MUSE_GLIMMER_API_KEY: Optional[str] = os.getenv("MUSE_GLIMMER_API_KEY", None)
    MUSE_GLIMMER_TIMEOUT_SECONDS: float = float(os.getenv("MUSE_GLIMMER_TIMEOUT_SECONDS", "60.0"))

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
