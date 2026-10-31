from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.routes import router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ChopSnap helps you cook Nigerian meals with the ingredients you already have, within your budget.",
    version="1.0.0",
)

# CORS setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes under /api
app.include_router(router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to ChopSnap API",
        "hackathon": "Meta Global AI Developer Hackathon (Indie track)",
        "docs_url": "/docs",
        "api_endpoint": f"{settings.API_V1_STR}/process",
    }
