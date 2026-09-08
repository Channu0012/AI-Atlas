"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalSearchProps {
  initialQuery?: string;
  className?: string;
  autoFocus?: boolean;
}

export const GoalSearch: React.FC<GoalSearchProps> = ({ 
  initialQuery = "", 
  className,
  autoFocus = false 
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  const shortcuts = [
    { label: "Build a Website", prompt: "I want to build a modern website with clean UI" },
    { label: "Create Videos", prompt: "I want to create YouTube videos and shorts with AI" },
    { label: "Study & Research", prompt: "I need AI tools for studying and literature reviews" },
    { label: "Coding Assistant", prompt: "I need the best AI code editor and refactoring agent" },
    { label: "Voice & Audio", prompt: "I want ultra-realistic voice cloning and text to speech" },
    { label: "Design & Graphics", prompt: "I want to generate brand assets and vector icons" },
    { label: "Automate Business", prompt: "I want to automate my business workflows and connect APIs" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    setIsSearching(true);
    router.push(`/ask?q=${encodeURIComponent(query.trim())}`);
  };

  const handleShortcutClick = (prompt: string) => {
    setQuery(prompt);
    setIsSearching(true);
    router.push(`/ask?q=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-2xl border-2 border-zinc-800 bg-zinc-900/90 shadow-2xl shadow-indigo-950/20 focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-2 sm:p-2.5">
          <div className="pl-3 pr-2 text-indigo-400">
            <Sparkles className={cn("w-5 h-5", isSearching ? "animate-spin text-cyan-400" : "animate-pulse")} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tell us what you want to accomplish... (e.g., I want to launch a YouTube channel with ₹2,000 budget)"
            autoFocus={autoFocus}
            disabled={isSearching}
            className="flex-1 bg-transparent px-2 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none min-w-0 disabled:opacity-70"
          />

          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-md transition",
              isSearching
                ? "bg-gradient-to-r from-indigo-600 to-cyan-600 shadow-indigo-500/30 cursor-wait animate-pulse"
                : query.trim()
                ? "bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
                : "bg-zinc-800 text-zinc-400 cursor-not-allowed"
            )}
          >
            {isSearching ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Connecting Universe...</span>
              </>
            ) : (
              <>
                <span>Find My AI Stack</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline-block" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Goal Shortcuts */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-zinc-500 font-medium mr-1">Popular goals:</span>
        {shortcuts.map(s => (
          <button
            key={s.label}
            type="button"
            onClick={() => handleShortcutClick(s.prompt)}
            className="text-xs px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition hover:text-white"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
