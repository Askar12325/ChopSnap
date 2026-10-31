import io
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import Recipe, DetectedItem, ShoppingItem, ProcessResponse

client = TestClient(app)

def test_contract_sanitizers():
    """
    Directly tests that missing or malformed fields are corrected with safe Nigerian defaults.
    """
    print("\n--- Testing Schema Resilience & Contract Sanitization ---")

    # 1. Test Recipe with common LLM alias fields & missing fields
    malformed_recipe_data = {
        "name": "Express Ata Rodo Stir-Fry",
        "desc": "Quick spicy scramble.",
        "type": "fast",           # should normalize to 'quick'
        "tier": "cheap",          # should normalize to 'budget'
        "prep": -5,               # should normalize to positive default
        "cook": 10,
        "ingredients": ["Eggs", "Peppers"], # should map to fridge_ingredients_used
        "steps": ["Chop peppers", "Scramble eggs"], # should map to instructions
        "reasoning": "Uses fresh eggs before expiry." # should map to why_this_recipe
    }
    r = Recipe.model_validate(malformed_recipe_data)
    assert r.title == "Express Ata Rodo Stir-Fry"
    assert r.description == "Quick spicy scramble."
    assert r.meal_type == "quick"
    assert r.financial_tier == "budget"
    assert r.prep_time_minutes > 0
    assert r.fridge_ingredients_used == ["Eggs", "Peppers"]
    assert len(r.instructions) == 2
    assert r.why_this_recipe == "Uses fresh eggs before expiry."
    assert r.estimated_cost_tier is not None
    print("[OK] Recipe aliases and defaults sanitized successfully")

    # 2. Test Recipe with completely missing why_this_recipe and instructions
    bare_recipe_data = {
        "title": "Minimal Stew",
        "description": "Simple sauce.",
    }
    r2 = Recipe.model_validate(bare_recipe_data)
    assert r2.meal_type in ["quick", "proper"]
    assert r2.financial_tier in ["budget", "comfortable"]
    assert len(r2.instructions) > 0, "Should provide safe default instructions"
    assert len(r2.why_this_recipe) > 10, "Should guarantee non-empty why_this_recipe"
    print("[OK] Bare recipe populated with safe Nigerian culinary defaults")

    # 3. Test ProcessResponse contract enforcement
    raw_response = {
        "success": True,
        "is_demo": 1, # integer should coerce to boolean True
        "detected_items": None, # should coerce to []
        "recipes": None, # should coerce to []
        "shopping_list": None, # should coerce to []
    }
    pr = ProcessResponse.model_validate(raw_response)
    assert isinstance(pr.is_demo, bool) and pr.is_demo is True
    assert isinstance(pr.detected_items, list)
    assert isinstance(pr.recipes, list)
    assert isinstance(pr.shopping_list, list)
    print("[OK] ProcessResponse contract guarantees verified (arrays & boolean)")

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("[OK] Health check response OK")

def test_process_endpoint():
    print("\n--- Testing /api/process Response Contract ---")
    img = Image.new("RGB", (300, 300), color=(120, 150, 90))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    files = {"file": ("provisions_market.jpg", buf, "image/jpeg")}
    response = client.post("/api/process", files=files)
    assert response.status_code == 200
    data = response.json()

    # Core Contract Guarantees
    assert isinstance(data.get("is_demo"), bool), "is_demo must be a boolean"
    assert isinstance(data.get("detected_items"), list), "detected_items must be a list"
    assert isinstance(data.get("recipes"), list), "recipes must be a list"
    assert isinstance(data.get("shopping_list"), list), "shopping_list must be a list"

    assert len(data["detected_items"]) > 0
    assert len(data["recipes"]) >= 4
    assert len(data["shopping_list"]) > 0

    # Also test detect_only=True
    buf.seek(0)
    files_detect = {"file": ("provisions_market.jpg", buf, "image/jpeg")}
    res_detect = client.post("/api/process?detect_only=true", files=files_detect)
    assert res_detect.status_code == 200
    data_detect = res_detect.json()
    assert len(data_detect["detected_items"]) > 0
    assert len(data_detect["recipes"]) == 0
    print("[OK] Verified detect_only=True returns detected items before recipe generation")

    for idx, r in enumerate(data["recipes"]):
        assert r.get("why_this_recipe") and len(r["why_this_recipe"].strip()) > 10, (
            f"Recipe #{idx} ({r.get('title')}) missing why_this_recipe"
        )
        assert r.get("meal_type") in ["quick", "proper"], (
            f"Recipe #{idx} has invalid meal_type: {r.get('meal_type')}"
        )
        assert r.get("financial_tier") in ["budget", "comfortable"], (
            f"Recipe #{idx} has invalid financial_tier: {r.get('financial_tier')}"
        )

    quick_budget = [r for r in data["recipes"] if r.get("meal_type") == "quick" and r.get("financial_tier") == "budget"]
    quick_comf = [r for r in data["recipes"] if r.get("meal_type") == "quick" and r.get("financial_tier") == "comfortable"]
    proper_budget = [r for r in data["recipes"] if r.get("meal_type") == "proper" and r.get("financial_tier") == "budget"]
    proper_comf = [r for r in data["recipes"] if r.get("meal_type") == "proper" and r.get("financial_tier") == "comfortable"]

    print(f"[OK] Process endpoint returned {len(data['recipes'])} recipes with verified contract:")
    print(f"   - Quick (Budget): {len(quick_budget)} -> {[r['title'] for r in quick_budget]}")
    print(f"   - Quick (Comfortable): {len(quick_comf)} -> {[r['title'] for r in quick_comf]}")
    print(f"   - Proper Cooking (Budget): {len(proper_budget)} -> {[r['title'] for r in proper_budget]}")
    print(f"   - Proper Cooking (Comfortable): {len(proper_comf)} -> {[r['title'] for r in proper_comf]}")
    print(f"   - Shopping List: {len(data['shopping_list'])} items")

def test_demo_endpoints():
    print("\n--- Testing /api/demo/{sample_type} Response Contract ---")
    for sample in ["market", "pantry", "native"]:
        res = client.get(f"/api/demo/{sample}")
        assert res.status_code == 200, f"Demo {sample} failed with status {res.status_code}"
        d = res.json()

        # Contract assertions
        assert isinstance(d.get("is_demo"), bool) and d["is_demo"] is True
        assert isinstance(d.get("detected_items"), list)
        assert isinstance(d.get("recipes"), list)
        assert isinstance(d.get("shopping_list"), list)
        assert d.get("demo_badge") is not None
        assert len(d["recipes"]) >= 4

        for r in d["recipes"]:
            assert r.get("why_this_recipe") and len(r["why_this_recipe"].strip()) > 10, (
                f"Missing why_this_recipe in demo {sample}: {r.get('title')}"
            )
            assert r.get("meal_type") in ["quick", "proper"], (
                f"Invalid meal_type in demo {sample}: {r.get('meal_type')}"
            )
            assert r.get("financial_tier") in ["budget", "comfortable"], (
                f"Invalid financial_tier in demo {sample}: {r.get('financial_tier')}"
            )

        print(f"[OK] Verified /api/demo/{sample}: {d['demo_badge']} ({len(d['recipes'])} recipes, {len(d['detected_items'])} items)")

if __name__ == "__main__":
    test_contract_sanitizers()
    test_health()
    test_process_endpoint()
    test_demo_endpoints()
    print("\nAll backend response contract tests PASSED with 100% reliability!")
