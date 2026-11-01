"use client";

import React, { useState } from "react";
import { Recipe } from "../types";

// Map dish title to local SVG in /public/dishes/ with fallback
export function getRecipeImage(title: string, mealType?: string): string {
  const t = title.toLowerCase();
  if (t.includes("scramble") && t.includes("ugwu")) return "/dishes/ugwu_scramble.svg";
  if (t.includes("scramble")) return "/dishes/scramble.svg";
  if (t.includes("frittata")) return "/dishes/frittata.svg";
  if (t.includes("fried rice")) return "/dishes/fried_rice.svg";
  if (t.includes("ewa aganyin") || t.includes("aganyin")) return "/dishes/ewa_aganyin.svg";
  if (t.includes("pottage")) return "/dishes/beans_pottage.svg";
  if (t.includes("beans")) return "/dishes/honey_beans.svg";
  if (t.includes("catfish") || t.includes("asun")) return "/dishes/catfish.svg";
  if (t.includes("fisherman")) return "/dishes/fisherman_stew.svg";
  if (t.includes("ofe ugwu") || t.includes("royal")) return "/dishes/ofe_ugwu.svg";
  if (t.includes("stew")) return "/dishes/stew.svg";
  if (t.includes("egg") && t.includes("scent")) return "/dishes/scent_leaf_egg.svg";
  return mealType === "quick" ? "/dishes/scramble.svg" : "/dishes/default.svg";
}

// Recipe Card Hero Image Area with graceful gradient fallback
export function RecipeHeroImage({ recipe }: { recipe: Recipe }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = getRecipeImage(recipe.title, recipe.meal_type);

  return (
    <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-gradient-to-br from-[#1A1033] via-[#1D2B64] to-[#2E8B57] mb-4 shadow-sm border border-[var(--border-subtle)] group">
      {!imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={recipe.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1033] via-[#1D2B64] to-[#2E8B57] flex flex-col justify-between p-4 sm:p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              {recipe.meal_type === "quick" ? "Quick Meal (≤20m)" : "Proper Cooking"}
            </span>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              {recipe.prep_time_minutes + recipe.cook_time_minutes}m total
            </span>
          </div>
          <div>
            <span className="text-sm font-semibold text-[#FB923C] uppercase tracking-wider block mb-1">
              Nigerian Kitchen Craft
            </span>
            <h4 className="font-serif text-lg sm:text-xl font-normal leading-tight text-[#FFF8EF]">
              {recipe.title}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
}
