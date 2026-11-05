# ChopSnap

ChopSnap helps people cook Nigerian meals with the ingredients you already have, within your budget.

Built with Muse Spark Open

## Links

- Live demo: https://chop-snap-ro2x.vercel.app/
- Demo video: https://youtube.com/shorts/gcoDtaYOQYs?feature=share
- Source: this repository

## Problem

Household cooks often have various ingredients across their refrigerator, counter, and pantry, but struggle to identify meals they can prepare without buying many additional items. Unplanned food purchases increase grocery costs, while unused perishables often spoil before being used. Commercial recipe tools frequently assume Western pantry staples or do not consider ingredient costs and fuel constraints common in Nigerian households.

## What It Does

ChopSnap provides the following features:

- Ingredient capture: Users upload a photo of kitchen provisions or type ingredients manually.
- Ingredient confirmation: Users review and edit detected items before generating meals, correcting any misidentified items.
- Plan settings: Users configure household size (servings), budget in Naira, spice preference (Mild, Medium, Extra Hot), cooking fuel (gas, charcoal, electric, kerosene), dietary preferences, and market city.
- Budget-aware recipe generation: Muse Spark Open synthesizes recipes categorized into Quick Meals (20 minutes or less) and Proper Cooking, prioritizing items on hand.
- Cost-to-buy calculation: The application computes the estimated cost of missing ingredients using a local price reference table, marking whether a meal fits the specified budget.
- Shopping list: Generates a minimal checklist of required missing items with estimated local costs, excluding assumed staples such as water and salt.
- Cook mode: A focused, step-by-step cooking interface with integrated countdown timers and wake lock to keep the screen active.
- WhatsApp sharing: Formats the recipe and shopping list for sharing via WhatsApp or copying to the clipboard.
- Voice instructions: An optional voice interface that accepts spoken requests to adjust ingredients, budget, or preferences.

## How It Works

1. The user captures a photo of ingredients or types items into the interface.
2. The frontend sends the image to the backend /api/process endpoint.
3. Muse Spark Open identifies visible food items from the image.
4. The user verifies, adds, or removes ingredients on the review screen.
5. The user sets their budget, household size, cooking fuel, spice level, and city on the plan screen.
6. Muse Spark Open generates Nigerian recipes tailored to the confirmed ingredients and preferences.
7. The application calculates the cost of any missing items against local market price data and displays the recipes with Cook mode instructions.

```
+-------------------------------------------------------------+
|                       Browser Client                        |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|    Next.js Frontend (React 19, TypeScript, Tailwind CSS)    |
+-------------------------------------------------------------+
                               |
                               | REST API
                               v
+-------------------------------------------------------------+
|         FastAPI Backend (Python 3.11, Uvicorn)              |
+-------------------------------------------------------------+
                               |
                               | OpenAI-compatible HTTPS API
                               v
+-------------------------------------------------------------+
|                Muse Spark Open on Baseten                   |
+-------------------------------------------------------------+
```

Voice input uses the browser's built-in Web Speech API directly in the client to transcribe spoken audio before sending text parameters to the backend.

## Models and Technology

| Component | Technology | Role | Execution Environment |
|---|---|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS | User interface, state management, Cook mode, cost calculations | Client browser / Vercel |
| Backend | FastAPI, Python 3.11, Uvicorn, HTTPX | API routing, input validation, rate limiting, daily caps | Cloud server / Render |
| Vision & Recipe AI | Muse Spark Open | Image ingredient recognition, Nigerian recipe synthesis, voice parsing | Remote inference (Baseten) |
| Voice Transcription | Web Speech API | Client-side speech-to-text | Client browser |
| Price Reference | JSON table (frontend/src/data/prices.json) | Estimated ingredient price lookup by Nigerian city | Client-side static data |

Muse Spark Open handles image understanding and recipe generation. Voice uses the browser's built-in speech recognition. Prices come from a small editable table of rough estimates in frontend/src/data/prices.json.

## Design Decisions

User confirmation of detected ingredients: Vision models can misread or overlook ingredients in crowded kitchen photos. The application requires users to confirm the detected ingredient list before generating recipes, preventing misidentified items from corrupting meal plans.

No silent fallback to demo data: When live inference is active, the backend never silently returns mock data if a request fails. Instead, it returns an explicit error with a retry option and a separate manual option to explore example scenarios.

Budget estimates computed in code and not by the model: Language models are prone to arithmetic errors and hallucinated prices. ChopSnap uses Muse Spark Open for culinary creativity, but calculates shopping costs and budget compliance deterministically in application code using frontend/src/data/prices.json. Assumed staples (salt, water, cooking oil, seasoning cubes) are excluded from purchase totals.

Rate and daily limits that protect model credits: To prevent credit exhaustion and abuse, the backend enforces a per-IP rate limit (15 requests per minute by default, proxy-aware via the X-Forwarded-For header) and a configurable global daily cap on live AI calls. When limits are reached, the API returns HTTP 429 with an invitation to explore pre-computed example scenarios.

## Limitations

- Vision can misread or miss items, which is why users confirm the ingredient list.
- Prices are rough, unreviewed estimates and vary by seasonal availability, market location, and vendor.
- Voice in languages other than English (Nigerian Pidgin, Yoruba, Hausa, and Igbo) is experimental and relies on browser vendor speech engines.
- An internet connection is required to communicate with the backend and hosted model endpoints.
- Recipes are AI-generated suggestions and not professional advice.
- First request after inactivity can be slow due to serverless cold-start latency.

## Getting Started

### Prerequisites

- Node.js 18 or later
- Python 3.11
- An API key for an OpenAI-compatible endpoint serving Muse Spark Open (such as Baseten)

### Local Setup

1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Askar12325/ChopSnap.git
cd ChopSnap
```

2. Configure and run the backend:

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your AI_BASE_URL and AI_API_KEY
python -m uvicorn app.main:app --reload --port 8000
```

3. Configure and run the frontend in a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local
npm run dev
```

The frontend runs at http://localhost:3000 and communicates with the backend at http://localhost:8000.

### Environment Variables

#### Backend (backend/.env)

| Variable Name | Purpose |
|---|---|
| AI_BASE_URL | Base URL for the OpenAI-compatible inference endpoint |
| AI_API_KEY | Authentication key for the model provider |
| VISION_MODEL | Model identifier used for image ingredient detection |
| RECIPE_MODEL | Model identifier used for recipe reasoning and voice interpretation |
| INFERENCE_MODE | Runtime mode: live, auto, or mock |
| ENVIRONMENT | Environment name: development or production |
| ALLOWED_ORIGINS | Comma-separated list of permitted frontend origins for CORS |
| RATE_LIMIT_PER_MINUTE | Maximum requests per minute permitted per client IP |
| DAILY_AI_CALL_LIMIT | Maximum live AI requests allowed per day across all users |
| PORT | Port number for the HTTP server (provided automatically by cloud hosts) |

#### Frontend (frontend/.env.local)

| Variable Name | Purpose |
|---|---|
| NEXT_PUBLIC_API_URL | URL of the backend API server |

## Deployment

The frontend is deployed on Vercel with the root directory set to frontend and NEXT_PUBLIC_API_URL pointing to the backend URL. The backend is deployed on Render with the root directory set to backend, start command uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips='*', and ALLOWED_ORIGINS configured with the Vercel domain.

## Project Structure

```
ChopSnap/
|-- README.md                 Root project documentation
|-- LICENSE                   MIT license file
|-- THIRD_PARTY_NOTICES.md    Third-party software, model, and font licenses
|-- .python-version           Pinned Python runtime version (3.11.9)
|-- backend/                  FastAPI application
|   |-- app/
|   |   |-- api/              Route definitions (process, recipes, voice, health)
|   |   |-- core/             Rate limiting and daily call caps
|   |   |-- models/           Pydantic schemas and response contracts
|   |   |-- services/         Vision and recipe inference services
|   |   |-- config.py         Application settings and environment validation
|   |   `-- main.py           FastAPI application entry point and CORS setup
|   |-- requirements.txt      Pinned Python package dependencies
|   |-- runtime.txt           Cloud host runtime version pin
|   `-- .env.example          Backend environment variable template
`-- frontend/                 Next.js application
    |-- src/
    |   |-- app/              Next.js App Router (layout, page, providers)
    |   |-- components/       Reusable UI components
    |   |-- config/           Centralized API client configuration
    |   |-- data/             Local ingredient price reference table (prices.json)
    |   |-- features/chopsnap/ Screens, hooks, and domain components
    |   `-- utils/            Matching logic, price calculations, unit tests
    |-- package.json          Frontend dependencies and scripts
    `-- .env.example          Frontend environment variable template
```

## Licenses and Credits

This project is licensed under the MIT License - Copyright (c) 2026 Umar Abubakar Sadiq. See the [LICENSE](LICENSE) file for details.

Third-party libraries, fonts, and model notices are documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

ChopSnap is built with Muse Spark Open, served through Baseten, and used under the [Muse Model License](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B/blob/main/LICENSE.md) and its [Usage Policy (Exhibit A)](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B/blob/main/LICENSE.md).

ChopSnap is intended for adult users. Pidgin, Yoruba, Hausa, and Igbo voice and text handling is experimental and not verified by the model's authors.

## Hackathon

This project was created for the Meta Global AI Developer Hackathon.
