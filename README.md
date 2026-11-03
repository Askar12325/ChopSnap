# 🍲 ChopSnap
> **Meta Global AI Developer Hackathon 2026 — Indie Track**  
> *ChopSnap helps you cook Nigerian meals with the ingredients you already have, within your budget.*

**Built with Muse Spark Open**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5_(Turbopack)-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![Muse Spark Open](https://img.shields.io/badge/Reasoning-Muse_Spark_Open_(Open--Weight)-0866FF.svg?logo=meta&logoColor=white)](https://ai.meta.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ 30-Second Executive Summary

**ChopSnap** helps you cook Nigerian meals with the ingredients you already have, within your budget. Users snap a photograph of their **refrigerator, pantry shelf, or kitchen counter**. 
- An **Open Vision-Language Model** spots raw ingredients, perishables, and cooked leftovers.
- **Muse Spark Open (open-weight)** performs culturally grounded culinary reasoning to formulate 4 categorized dishes across **Quick Meals (≤20m)** and **Proper Cooking**, calibrated for both **Everyday Budget** and **Comfortable Living**—complete with clear "Why this works" reasoning and a minimal 2–3 item shopping list.

---

## 🎯 Problem Statement

1. **High Food Waste in Nigerian Households**: Perishable staples (plum tomatoes, scotch bonnets, ripe plantains, sliced leafy greens, and cooked starch leftovers) spoil quickly in warm climates or during intermittent refrigeration.
2. **Kitchen Decision Fatigue**: Looking at an assortment of disconnected pantry items and not knowing what to cook leads either to food spoilage or unnecessary food delivery expenses.
3. **Economic Disconnect in Generic AI**: Western AI tools frequently recommend pasta, cheese, or hard-to-source ingredients that do not align with Nigerian kitchens or household budgets.
4. **Income Realities**: Meal planning must serve varied economic levels—from resourceful student/everyday budget cooking (~₦600–₦1,000) to affluent, comfortable multi-course meals (~₦3,000–₦4,500).

---

## 💡 Solution Overview: Snap, Check, Cook

ChopSnap provides an intelligent culinary bridge:
- **1. Snap**: Accepts any kitchen photo: refrigerator shelves, pantry racks, or kitchen counter prep surfaces.
- **2. Check**: Understands authentic Nigerian culinary chemistry: balances pepper reductions (*ata rodo*, *tatashe*), oil blooming, fish and meat stretching (smoked mackerel, crayfish, stockfish), and starch retrogradation (cold rice for jollof), matching dishes to your budget.
- **3. Cook**: Delivers straightforward preparation steps with what you already have, plus a lean shopping list of only essential missing items.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 📸 **Multimodal Kitchen Scanner** | Detects and catalogs vegetables, fish, meats, pantry staples, and condiments from any kitchen photo with confidence metrics. |
| ⚡ **Quick Meals (≤20 Mins)** | Immediate hunger antidotes (e.g. 10-minute peppered egg scrambles, sweet dodo frittatas, express spiced honey beans). |
| 🍲 **Proper Cooking** | Deep authentic dishes (e.g. classic buka stew with cold rice, royal smoked fish ofe ugwu, authentic ewa aganyin). |
| 🪙 **Everyday Budget Tier** | Resourceful street techniques, low-cost staples, and ingredient stretching (~₦600–₦1,100). |
| ✨ **Comfortable Living Tier** | Elevated meals incorporating smoked catfish, unbleached palm oil reductions, sweet dodo wedges, and rich garnishes. |
| 🛒 **Minimal Shopping List** | Recommends only 2–3 indispensable items required to complete all recipes, avoiding wasteful grocery hauls. |
| 🧠 **"Why This Works" Reasoning** | Every recipe includes transparent reasoning explaining *why* the dish was chosen and how it prevents food waste. |
| 🛡️ **Self-Healing Data Contract** | Strict backend schema sanitization automatically normalizes LLM outputs to prevent frontend crashes. |

---

## 🧠 Why Meta Open-Weight Models (Indie Track)?

Building for the **Indie Track**, relying solely on closed proprietary APIs creates structural challenges:
- **Zero Per-Token Tax (Cost)**: Closed commercial APIs charge for every single token and uploaded photograph. For everyday households and indie makers, bills spike uncontrollably. Open weights run on self-managed infrastructure at predictable, fixed cost.
- **Household Privacy (Privacy)**: Snapshots of your home kitchen, pantry staples, and personal food habits never leak to third-party ad brokers or get ingested to train external commercial models.
- **True Independence (Can Be Hosted Ourselves)**: Proprietary APIs can change pricing, throttle rate limits, or shut down overnight. With open weights, the software is fully sovereign and can be deployed anywhere—from a cloud GPU to an offline edge machine in Lagos.
- **Muse Spark Open (Open-Weight)**:
  - Reasoning depth captures complex cultural nuance without hallucinating Western substitutes.
  - Balances ingredient trade-offs (e.g. utilizing retrograded starch in chilled rice to prevent soggy jollof; blooming fermented locust beans in hot oil for authentic umami).

---

## 🏗️ Architecture

```
                      ┌────────────────────────────────────────┐
                      │          Next.js 15 Frontend           │
                      │  (Turbopack, TypeScript, Tailwind CSS) │
                      └───────────────────┬────────────────────┘
                                          │ Multipart Upload
                                          ▼
                      ┌────────────────────────────────────────┐
                      │          FastAPI Backend               │
                      │    (Python 3.11, Pydantic v2 Engine)   │
                      └─────────────┬────────────────────┬─────┘
                                    │                    │
                                    ▼                    ▼
   ┌──────────────────────────────────┐        ┌──────────────────────────────────┐
   │    Open Vision-Language Model    │        │         Muse Spark Open          │
   │        (Llama 3.2-Vision)        │        │     (Open-Weight Reasoning)      │
   │                                  │        │                                  │
   │  • Detects kitchen ingredients   │        │  • 4-tier Nigerian formulation   │
   │  • Catalogs items & categories   │        │  • Plain-English "Why this works"│
   │  • Resilient offline fallback    │        │  • Minimal 2-3 item grocery list │
   └──────────────────────────────────┘        └──────────────────────────────────┘
                                    │                    │
                                    └──────────┬─────────┘
                                               ▼
                      ┌────────────────────────────────────────┐
                      │     Self-Healing Contract Validator    │
                      │   (Strict coercion, safe defaults)     │
                      └───────────────────┬────────────────────┘
                                          │ Validated JSON
                                          ▼
                      ┌────────────────────────────────────────┐
                      │     Categorized UI Results Atelier     │
                      │ (Quick/Proper tabs, Budget/Rich filter)│
                      └────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (Turbopack, App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI, Python 3.11, Pydantic v2 (self-healing validation), Uvicorn, Pillow, Httpx.
- **Reasoning AI**: Muse Spark Open (open-weight) via OpenAI-compatible endpoint.
- **Vision AI**: Open Vision-Language Model via OpenAI-compatible endpoint.
- **Fallback Engine**: Pre-calibrated high-fidelity Nigerian culinary dataset guaranteeing reliable demonstration.

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (Python 3.11 recommended)

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows:
.\.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --reload --port 8000
```
- API Health Check: `http://localhost:8000/api/health`
- Interactive Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎪 Demo Mode (Quick Scenario Evaluation)

For judges and developers evaluating the application without spinning up a local GPU cluster, ChopSnap includes a **Curated Scenario Engine**:

1. **Quick-Start Launchpad Cards**:
   - 🍅 **Market Haul** *(Fridge)*: Fresh eggs, titus fish, sweet plantains, ugwu leaves, tomatoes.
   - 🫘 **Honey Beans** *(Pantry)*: Cooked oloyin beans, fresh scent leaves, red onions, dodo.
   - 🥬 **Native Crisper** *(Greens)*: Fresh ugwu, smoked catfish, okporoko stockfish, palm oil.
2. **Dedicated Fast Routes**: `/api/demo/{sample_type}` returns verified response schemas immediately with client-side fallback.
3. **Live Indicator Transparency**:
   - `Using Curated Demo Data` (Amber indicator) when running curated offline scenarios.
   - `Live Kitchen Analysis Active` (Pulsing emerald radar) when live model pipelines are active.

---

## 🎙️ Snap + Speak (Voice Intelligence)

ChopSnap includes zero-cost **Snap + Speak** voice input powered by the Web Speech API (`webkitSpeechRecognition`):
- **Languages supported**: English (`en-NG`), Nigerian Pidgin (`en-NG`), Yorùbá (`yo-NG` [Beta]), Hausa (`ha-NG` [Beta]), and Igbo (`ig-NG` [Beta]).
- **Editable Transcript**: The transcribed voice command appears in an editable text box before being submitted, allowing immediate corrections for local food words.
- **Model vs. Fallback Notice**: The interpretation engine sends spoken transcripts to the live reasoning model (`meta-models/muse-spark-open-1026`). If the model endpoint is unreachable or times out, a local heuristic extractor runs automatically and informs the user with a `"Basic understanding used"` indicator in the changes banner.
- **Unclear Input Handling**: If the spoken command is garbled or no culinary parameters can be recognized, the system will never guess or invent parameters—it prompts the user to edit or rephrase the instruction.
- **Privacy & Compatibility Note**: Browser speech recognition (`SpeechRecognition` / `webkitSpeechRecognition`) may process audio on browser vendor speech servers (e.g. Google's speech recognition backend in Chromium). It works best on modern desktop or mobile versions of **Google Chrome** and **Microsoft Edge**. If speech recognition is unsupported or permissions are denied, ChopSnap gracefully displays a direct text input field so you are never blocked.

---

## 🔮 Future Improvements

1. **Baseten & Dedicated Inference Hosting**: Deploy quantized Muse Spark Open on cloud serverless infrastructure (Baseten / vLLM) for high-concurrency production serving.
2. **Fine-Tuned West African Regional LoRA**: Fine-tune Muse Spark Open on regional dialects, local marketplace ingredient naming variations (*efirin*, *nchanwu*, *ata rodo*, *shombo*), and diaspora substitutions.
3. **Receipt & Expiry OCR**: Cross-reference grocery receipts with shelf photos to monitor ingredient freshness and prompt cooking reminders before spoilage.
4. **WhatsApp & SMS Export**: 1-click sharing of the minimal shopping list directly to local open-market vendors or family shoppers via WhatsApp.
5. **Ingredients Used & Value of Ingredients You're Using**:
   - **Formula**: Real code-computed usage percentage `(Unique kitchen ingredients used in displayed recipes ÷ Total confirmed kitchen ingredients) × 100`.
   - **Market Value**: `Sum of approximate local market prices for all used ingredients in selected city (estimate)`. This represents the approximate market value of what you already have at home, not a comparison against a specific purchase.
   - **Price Estimates**: Prices are rough estimates and have not been formally reviewed. They will be updated and verified regularly. Market prices in `frontend/src/data/prices.json` represent approximate retail ranges in Nigerian markets that can be edited.
   - **Normalised, Alias-Aware Matching**: Standardizes names, strips measurement units/quantities, and maps Nigerian ingredient aliases (`ata rodo` ↔ `scotch bonnet`, `okporoko` ↔ `stockfish`, `ugwu` ↔ `pumpkin leaves`, `titus` ↔ `mackerel`). Whole-word matching strictly prevents false positives (`oil` does not match `palm oil` or `vegetable oil` unless the user's item was literally `oil`).
   - **Unit Tests**: Full test suite verifying alias matching, multi-source recipe checks, and oil differentiation (`npm test` in `frontend`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — Copyright (c) 2026 Umar Abubakar Sadiq. Developed for the **Meta Global AI Developer Hackathon (Indie Track)**.

Models, fonts and libraries used by ChopSnap are covered by their own licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

### Muse Spark Open License & Compliance
- **Built with Muse Spark Open**
- The underlying AI model is Muse Spark Open, served through Baseten, used under the [Muse Model License](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B/blob/main/LICENSE.md) and its [Usage Policy (Exhibit A)](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B/blob/main/LICENSE.md).
- ChopSnap is intended for adult users. Pidgin, Yoruba, Hausa and Igbo voice and text handling is experimental and not verified by the model's authors.
