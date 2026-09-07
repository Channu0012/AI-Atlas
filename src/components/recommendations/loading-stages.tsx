"use client";

import React, { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";

interface LoadingStagesProps {
  onComplete?: () => void;
}

const STAGES = [
  "Understanding your goal...",
  "Finding matching tools from verified database...",
  "Checking your constraints and budget requirements...",
  "Running deterministic multi-factor scoring...",
  "Synthesizing recommendations and building workflow..."
];

export const LoadingStages: React.FC<LoadingStagesProps> = () => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const intervals = [600, 700, 600, 800];
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step < STAGES.length) {
        setCurrentStage(step);
      } else {
        clearInterval(timer);
      }
    }, intervals[Math.min(step, intervals.length - 1)]);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl text-left">
      <div className="flex items-center gap-2.5 mb-6 text-indigo-400 font-semibold text-sm">
        <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
        <span>Decision Engine Running</span>
      </div>

      <div className="space-y-4">
        {STAGES.map((label, index) => {
          const isDone = index < currentStage;
          const isCurrent = index === currentStage;

          return (
            <div key={label} className="flex items-center gap-3 text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors">
                {isDone ? (
                  <div className="w-full h-full rounded-full bg-emerald-500/20 border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-full h-full rounded-full bg-indigo-500/20 border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-800 border-zinc-700 text-zinc-500 flex items-center justify-center text-[10px]">
                    {index + 1}
                  </div>
                )}
              </div>

              <span
                className={
                  isDone
                    ? "text-zinc-400"
                    : isCurrent
                    ? "text-white font-medium"
                    : "text-zinc-600"
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
