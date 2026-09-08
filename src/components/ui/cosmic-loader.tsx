"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CosmicLoaderProps {
  size?: "sm" | "md" | "lg" | "screen";
  status?: string;
  substatus?: string;
  className?: string;
}

export const CosmicLoader: React.FC<CosmicLoaderProps> = ({
  size = "md",
  status,
  substatus,
  className
}) => {
  const isScreen = size === "screen";

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    screen: "w-20 h-20"
  };

  const ringSizes = {
    sm: "w-11 h-11 -inset-1.5",
    md: "w-20 h-20 -inset-3",
    lg: "w-28 h-28 -inset-4",
    screen: "w-28 h-28 -inset-4"
  };

  const loaderContent = (
    <div className={cn("flex flex-col items-center justify-center text-center", className)}>
      <div className="relative flex items-center justify-center">
        {/* Ambient celestial glow */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-xl animate-pulse-glow" />

        {/* Orbiting celestial halo ring */}
        <div 
          className={cn(
            "absolute rounded-full border border-transparent border-t-indigo-400 border-r-cyan-400 border-b-purple-500/40 animate-cosmic-orbit pointer-events-none",
            ringSizes[size]
          )} 
        />

        {/* Outer squircle logo container */}
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/30 border border-white/10 ring-1 ring-white/10 bg-black flex items-center justify-center",
            sizeClasses[size]
          )}
        >
          <Image
            src="/images/ai-atlas-logo.png"
            alt="AI Atlas"
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Meaningful status caption */}
      {status && (
        <div className="mt-4 space-y-1">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>{status}</span>
          </div>
          {substatus && (
            <p className="text-[11px] sm:text-xs text-zinc-400 max-w-xs mx-auto">
              {substatus}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (isScreen) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 rounded-3xl border border-white/[0.08] bg-zinc-950/70 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-1/2 translate-x-1/2 -z-10 h-32 w-48 rounded-full bg-indigo-500/15 blur-[80px] pointer-events-none" />
          {loaderContent}
        </div>
      </div>
    );
  }

  return loaderContent;
};
