import os

os.makedirs(r"c:\Users\PC\Desktop\Meta.AI hackhaton 2026\frontend\public\dishes", exist_ok=True)

DISHES = [
    {
        "filename": "scramble.svg",
        "title": "Peppered Egg & Onion Scramble",
        "category": "Quick Meal • Budget",
        "time": "10 Mins",
        "gradient": ("#802800", "#1F5C3A", "#D94F04"),
        "accent": "#F5A742",
        "elements": ["Fresh Eggs", "Sautéed Red Onions", "Ata Rodo Chili"]
    },
    {
        "filename": "frittata.svg",
        "title": "Sweet Dodo & Smoked Titus Frittata",
        "category": "Quick Meal • Comfortable",
        "time": "17 Mins",
        "gradient": ("#1F5C3A", "#3D2517", "#E8590C"),
        "accent": "#FFB84D",
        "elements": ["Caramelized Dodo", "Flaked Smoked Titus", "Steamed Egg Cake"]
    },
    {
        "filename": "fried_rice.svg",
        "title": "Buka-Style Fried Rice with Ugwu & Dodo",
        "category": "Proper Cooking • Budget",
        "time": "23 Mins",
        "gradient": ("#26471E", "#4A3212", "#D95E16"),
        "accent": "#66D186",
        "elements": ["Turmeric Rice", "Sliced Fresh Ugwu", "Golden Dodo Cubes"]
    },
    {
        "filename": "stew.svg",
        "title": "Smoked Titus & Sweet Peppered Dodo Stew",
        "category": "Proper Cooking • Comfortable",
        "time": "37 Mins",
        "gradient": ("#7A1C0E", "#2B160C", "#1F5C3A"),
        "accent": "#FF7A59",
        "elements": ["Plum Tomato Obe Ata", "Smoked Titus Steaks", "Steamed Rice & Dodo"]
    },
    {
        "filename": "honey_beans.svg",
        "title": "Sizzled Honey Beans & Onion Mash",
        "category": "Quick Meal • Budget",
        "time": "10 Mins",
        "gradient": ("#4A2B15", "#1B2F21", "#C75816"),
        "accent": "#E8A355",
        "elements": ["Velvety Oloyin Beans", "Caramelized Onions", "Ata Rodo Sizzle"]
    },
    {
        "filename": "scent_leaf_egg.svg",
        "title": "Sweet Dodo & Herb Scent Leaf Scramble",
        "category": "Quick Meal • Comfortable",
        "time": "14 Mins",
        "gradient": ("#1E4A2D", "#3B2A1C", "#E06B22"),
        "accent": "#82E09B",
        "elements": ["Diced Plantains", "Fresh Efirin Herb", "Soft Fluffy Eggs"]
    },
    {
        "filename": "ewa_aganyin.svg",
        "title": "Classic Ewa Aganyin & Fried Plantains",
        "category": "Proper Cooking • Budget",
        "time": "35 Mins",
        "gradient": ("#2B1408", "#451B0A", "#8A320F"),
        "accent": "#FFAE52",
        "elements": ["Mashed Honey Beans", "Dark Aganyin Sauce", "Mahogany Dodo"]
    },
    {
        "filename": "beans_pottage.svg",
        "title": "Honey Beans Pottage with Smoked Fish",
        "category": "Proper Cooking • Comfortable",
        "time": "40 Mins",
        "gradient": ("#382012", "#1D3A26", "#B5450B"),
        "accent": "#F5B064",
        "elements": ["Simmered Beans", "Smoked Fish Flakes", "Scent Leaf Infusion"]
    },
    {
        "filename": "ugwu_scramble.svg",
        "title": "Native Ugwu & Palm Oil Scramble",
        "category": "Quick Meal • Budget",
        "time": "9 Mins",
        "gradient": ("#163820", "#5C2607", "#D4520B"),
        "accent": "#55D97E",
        "elements": ["Flash-Sizzled Ugwu", "Pure Red Palm Oil", "Scrambled Eggs"]
    },
    {
        "filename": "catfish.svg",
        "title": "Peppered Smoked Catfish & Sweet Plantains",
        "category": "Quick Meal • Comfortable",
        "time": "19 Mins",
        "gradient": ("#451A07", "#1E3B27", "#E05A10"),
        "accent": "#FFA742",
        "elements": ["Smoked Mangala Catfish", "Charred Ata Rodo", "Sweet Dodo Wedges"]
    },
    {
        "filename": "fisherman_stew.svg",
        "title": "Traditional Fisherman's Ugwu & Stockfish Stew",
        "category": "Proper Cooking • Budget",
        "time": "34 Mins",
        "gradient": ("#172E20", "#421C0A", "#BA430B"),
        "accent": "#5CE08A",
        "elements": ["Gelatinous Stockfish", "Smoked Catfish Broth", "Shredded Ugwu"]
    },
    {
        "filename": "ofe_ugwu.svg",
        "title": "Royal Lagos Smoked Catfish & Stockfish Ofe Ugwu",
        "category": "Proper Cooking • Comfortable",
        "time": "50 Mins",
        "gradient": ("#143820", "#2E1508", "#C4490B"),
        "accent": "#FFC04D",
        "elements": ["Whole Smoked Catfish", "Stockfish Steaks", "Unbleached Palm Oil"]
    },
    {
        "filename": "default.svg",
        "title": "Authentic Nigerian Culinary Creation",
        "category": "Fresh Kitchen Synthesis",
        "time": "20 Mins",
        "gradient": ("#1F5C3A", "#2B1B12", "#D94F04"),
        "accent": "#86EFAC",
        "elements": ["Farm Fresh Produce", "Savory Proteins", "Traditional Spices"]
    }
]

def make_svg(d):
    g1, g2, g3 = d["gradient"]
    elements_svg = "".join([
        f'<g transform="translate({30 + i*230}, 340)">'
        f'<rect width="210" height="34" rx="17" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="1" />'
        f'<circle cx="20" cy="17" r="5" fill="{d["accent"]}" />'
        f'<text x="35" y="22" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#FFF8EF">{el}</text>'
        f'</g>'
        for i, el in enumerate(d["elements"])
    ])

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{g1}" />
      <stop offset="50%" stop-color="{g2}" />
      <stop offset="100%" stop-color="{g3}" />
    </linearGradient>
    <radialGradient id="panGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="{d['accent']}" stop-opacity="0.32" />
      <stop offset="60%" stop-color="{g1}" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.5" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="450" fill="url(#bgGrad)" />
  <rect width="800" height="450" fill="url(#panGlow)" />

  <!-- Skillet / Serving Bowl Silhouette Rim -->
  <circle cx="400" cy="210" r="175" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.1)" stroke-width="3" />
  <circle cx="400" cy="210" r="150" fill="rgba(255,255,255,0.06)" stroke="{d['accent']}" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="6 4" />

  <!-- Stylized Culinary Accent Core -->
  <g transform="translate(400, 210)">
    <!-- Palm oil & broth shimmer -->
    <ellipse cx="0" cy="0" rx="90" ry="70" fill="{d['accent']}" fill-opacity="0.22" />
    <!-- Center Pot Icon -->
    <circle cx="0" cy="-5" r="36" fill="#1F5C3A" stroke="#FFF8EF" stroke-width="2" />
    <!-- Steaming Waves -->
    <path d="M-12 -50 Q-8 -60 -12 -70" stroke="#FFF8EF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />
    <path d="M0 -52 Q4 -64 0 -76" stroke="#FFF8EF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8" />
    <path d="M12 -50 Q16 -60 12 -70" stroke="#FFF8EF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />
    <!-- Fork & Knife Emblem -->
    <path d="M-10 -15 L-10 5 M-14 -15 L-6 -15 M-10 5 L-10 15" stroke="#FFF8EF" stroke-width="2" stroke-linecap="round" />
    <path d="M10 -15 C6 -15 6 -5 10 -2 L10 15" stroke="#FFF8EF" stroke-width="2" stroke-linecap="round" fill="none" />
  </g>

  <!-- Top Badges -->
  <g transform="translate(30, 30)">
    <rect width="180" height="32" rx="16" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
    <text x="20" y="21" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="{d['accent']}">CHOPSNAP CUISINE</text>
  </g>
  <g transform="translate(620, 30)">
    <rect width="150" height="32" rx="16" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
    <text x="22" y="21" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#FFF8EF">{d['time']}</text>
  </g>

  <!-- Title & Category Overlay -->
  <g transform="translate(30, 270)">
    <text x="0" y="0" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="1" fill="{d['accent']}" text-transform="uppercase">{d['category']}</text>
    <text x="0" y="32" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#FFF8EF">{d['title']}</text>
  </g>

  <!-- Ingredient Tags Row -->
  {elements_svg}

  <!-- Watermark / Custom Photo Tip -->
  <text x="400" y="425" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="rgba(255,255,255,0.55)">
    CHIC NIGERIAN RECIPE PREVIEW • REPLACE WITH CUSTOM PHOTO IN /public/dishes/{d['filename']}
  </text>
</svg>"""

for dish in DISHES:
    out_path = os.path.join(r"c:\Users\PC\Desktop\Meta.AI hackhaton 2026\frontend\public\dishes", dish["filename"])
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(make_svg(dish))

print("Created all 13 SVG dish placeholders in frontend/public/dishes/")
