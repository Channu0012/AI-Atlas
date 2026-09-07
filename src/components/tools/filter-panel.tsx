"use client";

import React from "react";
import { Category } from "@/types";
import { Filter, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (id?: string) => void;
  selectedPricing?: string;
  onSelectPricing: (model?: string) => void;
  selectedPlatform?: string;
  onSelectPlatform: (platform?: string) => void;
  selectedDifficulty?: string;
  onSelectDifficulty: (diff?: string) => void;
  hasApi?: boolean;
  onToggleApi: () => void;
  isOpenSource?: boolean;
  onToggleOpenSource: () => void;
  verifiedOnly?: boolean;
  onToggleVerifiedOnly: () => void;
  onResetAll: () => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPricing,
  onSelectPricing,
  selectedPlatform,
  onSelectPlatform,
  selectedDifficulty,
  onSelectDifficulty,
  hasApi = false,
  onToggleApi,
  isOpenSource = false,
  onToggleOpenSource,
  verifiedOnly = false,
  onToggleVerifiedOnly,
  onResetAll,
  className
}) => {
  return (
    <div className={cn("space-y-6 text-sm text-zinc-300", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 font-semibold text-zinc-100">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetAll}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
          Category
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory(undefined)}
            className={cn(
              "w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between",
              !selectedCategory ? "bg-indigo-600/20 text-indigo-300 font-semibold" : "text-zinc-400 hover:bg-zinc-800"
            )}
          >
            <span>All Categories</span>
            {!selectedCategory && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.filter(c => !c.parentId).map(cat => {
            const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? undefined : cat.slug)}
                className={cn(
                  "w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between",
                  isSelected
                    ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                )}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing Model */}
      <div>
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
          Pricing Model
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All", value: undefined },
            { label: "Free", value: "free" },
            { label: "Freemium", value: "freemium" },
            { label: "Paid", value: "paid" }
          ].map(opt => (
            <button
              key={opt.label}
              onClick={() => onSelectPricing(opt.value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium border transition",
                selectedPricing === opt.value
                  ? "bg-indigo-600 text-white border-indigo-500"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
          Platform
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "Web", value: "web" },
            { label: "Mac", value: "mac" },
            { label: "Windows", value: "windows" },
            { label: "iOS", value: "ios" },
            { label: "Android", value: "android" }
          ].map(opt => (
            <button
              key={opt.label}
              onClick={() => onSelectPlatform(selectedPlatform === opt.value ? undefined : opt.value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium border transition",
                selectedPlatform === opt.value
                  ? "bg-indigo-600 text-white border-indigo-500"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
          Difficulty Level
        </h4>
        <div className="space-y-1">
          {["beginner", "intermediate", "professional"].map(level => (
            <label key={level} className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-200">
              <input
                type="radio"
                name="difficulty"
                checked={selectedDifficulty === level}
                onChange={() => onSelectDifficulty(selectedDifficulty === level ? undefined : level)}
                className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0"
              />
              <span className="capitalize">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-3 border-t border-zinc-800 space-y-2.5">
        <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
          <span>Verified Status Only</span>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={onToggleVerifiedOnly}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0"
          />
        </label>
        <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
          <span>Developer API Available</span>
          <input
            type="checkbox"
            checked={hasApi}
            onChange={onToggleApi}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0"
          />
        </label>
        <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
          <span>Open Source Only</span>
          <input
            type="checkbox"
            checked={isOpenSource}
            onChange={onToggleOpenSource}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0"
          />
        </label>
      </div>
    </div>
  );
};
