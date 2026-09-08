"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStagesProps {
  onComplete?: () => void;
  className?: string;
}

const STAGES = [
  { title: "Analyzing Objective & Intent", desc: "Extracting goal semantics, budget constraints, and skill level" },
  { title: "Querying Verified Tool Universe", desc: "Screening fact-verified database across 16 core domains" },
  { title: "Evaluating Compatibility & Constraints", desc: "Checking pricing tiers, API capabilities, and cross-tool bridges" },
  { title: "Running Deterministic Multi-Factor Scoring", desc: "Weighting capability fit, usability, community fidelity, and ROI" },
  { title: "Synthesizing Recommendations & Blueprint", desc: "Composing multi-step execution stack and alternative paths" }
];

export const LoadingStages: React.FC<LoadingStagesProps> = ({ className }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const stageDurations = [450, 650, 600, 750];
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step < STAGES.length) {
        setCurrentStage(step);
      } else {
        clearInterval(timer);
      }
    }, stageDurations[Math.min(step, stageDurations.length - 1)]);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("max-w-lg mx-auto my-10 p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-zinc-950/70 backdrop-blur-2xl shadow-2xl text-left relative overflow-hidden", className)}>
      {/* Top Ambient Glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/15 blur-[60px] pointer-events-none" />

      {/* Branded Header */}
      <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-zinc-800/80">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 ring-1 ring-white/5 bg-black shrink-0 shadow-md shadow-indigo-500/20">
          <Image
            src="/images/ai-atlas-logo.png"
            alt="AI Atlas"
            fill
            sizes="40px"
            className="object-cover"
          />
          <div className="absolute inset-0 rounded-xl border border-indigo-400/40 animate-pulse pointer-events-none" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white tracking-wide">
            <span>AI ATLAS DECISION ENGINE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-zinc-400">
            Real-time evaluation against verified database
          </p>
        </div>
      </div>

      {/* Stages List */}
      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const isDone = index < currentStage;
          const isCurrent = index === currentStage;
          const isPending = index > currentStage;

          return (
            <div
              key={stage.title}
              className={cn(
                "flex items-start gap-3.5 transition-all duration-300",
                isPending && "opacity-40"
              )}
            >
              <div className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors">
                {isDone ? (
                  <div className="w-full h-full rounded-full bg-emerald-500/20 border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-full h-full rounded-full bg-indigo-500/20 border-indigo-500/50 text-indigo-300 flex items-center justify-center shadow-sm">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-900 border-zinc-800 text-zinc-600 flex items-center justify-center text-[10px] font-mono">
                    {index + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-xs sm:text-sm font-semibold tracking-tight",
                    isDone && "text-zinc-300",
                    isCurrent && "text-white font-bold",
                    isPending && "text-zinc-500"
                  )}
                >
                  {stage.title}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
