"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, ArrowRight, Search, Zap } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Expanded on cursor hover, focus, or when there is text
  const isExpanded = isHovered || isFocused || Boolean(query.trim());

  const shortcuts = [
    { label: "Build Website", prompt: "I want to build a modern website with clean UI" },
    { label: "Create Videos", prompt: "I want to create YouTube videos and shorts with AI" },
    { label: "Coding Assistant", prompt: "I need the best AI code editor and refactoring agent" },
    { label: "Voice & Audio", prompt: "I want ultra-realistic voice cloning and text to speech" },
    { label: "Automate Business", prompt: "I want to automate my business workflows and connect APIs" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSearching) return;

    if (!query.trim()) {
      router.push("/ask");
      return;
    }

    setIsSearching(true);
    router.push(`/ask?q=${encodeURIComponent(query.trim())}`);
  };

  const handleShortcutClick = (prompt: string) => {
    setQuery(prompt);
    setIsSearching(true);
    router.push(`/ask?q=${encodeURIComponent(prompt)}`);
  };

  const handleLogoClick = () => {
    router.push("/ask");
  };

  return (
    <div 
      className={cn("w-full flex flex-col items-center justify-center transition-all duration-500", className)}
      onMouseEnter={() => {
        setIsHovered(true);
        setTimeout(() => inputRef.current?.focus(), 150);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {/* Search Container: Morphs from compact logo button into full search HUD */}
      <div 
        className={cn(
          "w-full transition-all duration-500 ease-out flex justify-center",
          isExpanded ? "max-w-3xl px-2 sm:px-0" : "max-w-xs"
        )}
      >
        {!isExpanded ? (
          /* IDLE STATE: Only search button like logo */
          <div className="flex flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsHovered(true);
                setIsFocused(true);
                setTimeout(() => inputRef.current?.focus(), 150);
              }}
              aria-label="Open AI Atlas Search"
              className="group relative flex items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-zinc-950/90 hover:bg-zinc-900 border-2 border-indigo-500/50 hover:border-cyan-400 shadow-[0_0_35px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] backdrop-blur-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {/* Pulsing ambient glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-purple-600 opacity-40 group-hover:opacity-75 blur-md transition duration-500 animate-pulse" />

              {/* Logo container */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-white/20 ring-1 ring-white/20 bg-black flex items-center justify-center shadow-2xl shrink-0">
                <Image
                  src="/images/ai-atlas-logo.png"
                  alt="AI Atlas"
                  fill
                  sizes="48px"
                  priority
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-xl border border-cyan-400/40 pointer-events-none" />
              </div>

              {/* Search Badge Attached to Logo Button */}
              <div className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center border-2 border-black shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </div>
            </button>

            {/* Subtle floating hint */}
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-indigo-300/70 uppercase flex items-center gap-1 text-center">
              <Zap className="w-3 h-3 text-cyan-400 animate-pulse" /> Tap or Hover to Search
            </span>
          </div>
        ) : (
          /* EXPANDED STATE: Full Search Engine HUD */
          <form 
            onSubmit={handleSubmit} 
            className="w-full relative group animate-fade-in"
          >
            <div className="relative flex items-center rounded-2xl border-2 border-indigo-500 bg-zinc-950/95 shadow-[0_0_40px_rgba(99,102,241,0.3)] ring-4 ring-indigo-500/10 transition-all p-1.5 sm:p-2.5 backdrop-blur-2xl">
              {/* Logo Button inside search bar (click opens /ask) */}
              <button
                type="button"
                onClick={handleLogoClick}
                title="Open Search Page"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-white/20 ring-1 ring-white/10 bg-black shrink-0 ml-1 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <Image
                  src="/images/ai-atlas-logo.png"
                  alt="AI Atlas"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </button>

              <div className="pl-2 sm:pl-3 pr-1.5 sm:pr-2 text-cyan-400 shrink-0">
                <Sparkles className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isSearching ? "animate-spin text-cyan-300" : "animate-pulse")} />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Describe your goal... (e.g., launch a YouTube channel or SaaS app)"
                autoFocus={autoFocus || isFocused}
                disabled={isSearching}
                className="flex-1 bg-transparent px-1.5 sm:px-2 text-xs sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none min-w-0 disabled:opacity-70 font-medium"
              />

              <button
                type="submit"
                disabled={isSearching}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition cursor-pointer active:scale-95",
                  isSearching
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 shadow-indigo-500/30 cursor-wait animate-pulse"
                    : query.trim()
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-600/30"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                )}
              >
                {isSearching ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                    <span className="hidden sm:inline">Connecting...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{query.trim() ? "Find My AI Stack" : "Open Search"}</span>
                    <span className="sm:hidden">{query.trim() ? "Search" : "Go"}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Popular goal shortcuts */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 animate-fade-in px-1">
              <span className="text-[11px] sm:text-xs text-zinc-500 font-medium mr-1 hidden sm:inline">Popular goals:</span>
              {shortcuts.map(s => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleShortcutClick(s.prompt)}
                  className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/40 text-zinc-300 transition hover:text-white cursor-pointer shadow-sm active:scale-95"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
