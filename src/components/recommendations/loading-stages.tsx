"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Loader2, Sparkles, Cpu, Layers, ShieldCheck, Database, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStagesProps {
  onComplete?: () => void;
  className?: string;
  totalDurationMs?: number;
}

const STAGES = [
  { 
    title: "Deconstructing Semantic Objective & Intent", 
    desc: "Parsing goal semantics, technical requirements, budget ceilings, and skill level constraints",
    icon: Sparkles
  },
  { 
    title: "Scanning 1,000+ Verified AI Tool Universe", 
    desc: "Executing high-dimensional vector search across 16 core domains and 64 capability matrices",
    icon: Database
  },
  { 
    title: "Evaluating Cross-Tool Compatibility & APIs", 
    desc: "Verifying pricing models, multimodal bridges, token limits, and open-source alternatives",
    icon: Layers
  },
  { 
    title: "Running Deterministic Multi-Factor Scoring", 
    desc: "Calculating capability fit, usability benchmark, community reputation, and monthly ROI",
    icon: Cpu
  },
  { 
    title: "Synthesizing Execution Blueprint & Neural Pipeline", 
    desc: "Assembling step-by-step orchestrator pipeline, tool alternatives, and prompt workflows",
    icon: Zap
  }
];

export const LoadingStages: React.FC<LoadingStagesProps> = ({ 
  className,
  totalDurationMs = 5200 
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [scannedTools, setScannedTools] = useState(0);
  const [domainsChecked, setDomainsChecked] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(72);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const intervalMs = 50;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedMs(elapsed);

      // Progressively advance through 5 stages across totalDurationMs
      const stageIndex = Math.min(
        STAGES.length - 1,
        Math.floor((elapsed / totalDurationMs) * STAGES.length)
      );
      setCurrentStage(stageIndex);

      // Interpolate live telemetry counters
      const progressRatio = Math.min(1, elapsed / (totalDurationMs * 0.95));
      setScannedTools(Math.floor(progressRatio * 1048));
      setDomainsChecked(Math.floor(progressRatio * 16));
      setConfidenceScore(Math.floor(72 + progressRatio * 27.4));

      if (elapsed >= totalDurationMs) {
        clearInterval(interval);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [totalDurationMs]);

  return (
    <div className={cn("max-w-2xl mx-auto my-10 p-6 sm:p-9 rounded-3xl border border-indigo-500/30 bg-zinc-950/90 backdrop-blur-2xl shadow-2xl shadow-indigo-950/60 text-left relative overflow-hidden", className)}>
      {/* Dynamic Cosmic Aurora Glows */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-purple-500/20 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-32 bg-cyan-500/10 blur-[70px] pointer-events-none" />

      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/10 ring-2 ring-indigo-500/40 bg-black shrink-0 shadow-lg shadow-indigo-500/30">
            <Image
              src="/images/ai-atlas-logo.png"
              alt="AI Atlas"
              fill
              sizes="48px"
              className="object-cover"
            />
            <div className="absolute inset-0 rounded-2xl border border-cyan-400/50 animate-pulse pointer-events-none" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-white tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-white font-mono uppercase">
                AI Atlas Neural Decision Engine
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Multi-factor cognitive synthesis in progress
            </p>
          </div>
        </div>

        {/* Live Elapsed & Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-cyan-400 flex items-center gap-2 shadow-inner">
            <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
            <span>{(elapsedMs / 1000).toFixed(1)}s elapsed</span>
          </div>
        </div>
      </div>

      {/* Live Radar Telemetry HUD */}
      <div className="my-6 grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-inner">
        <div className="flex flex-col items-center justify-center p-2 text-center border-r border-zinc-800/80">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            Tools Screened
          </span>
          <span className="text-lg sm:text-xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            {scannedTools}
            <span className="text-xs text-zinc-500 font-normal"> / 1,048</span>
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 text-center border-r border-zinc-800/80">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            Domains Mapped
          </span>
          <span className="text-lg sm:text-xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {domainsChecked}
            <span className="text-xs text-zinc-500 font-normal"> / 16</span>
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 text-center">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            Goal Precision
          </span>
          <span className="text-lg sm:text-xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {confidenceScore}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-6 border border-zinc-800/60">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-fuchsia-500 transition-all duration-300 rounded-full"
          style={{ width: `${Math.min(100, ((currentStage + 1) / STAGES.length) * 100)}%` }}
        />
      </div>

      {/* Sequential Stages List */}
      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const isDone = index < currentStage;
          const isCurrent = index === currentStage;
          const isPending = index > currentStage;
          const Icon = stage.icon;

          return (
            <div
              key={stage.title}
              className={cn(
                "flex items-start gap-3.5 p-3 rounded-2xl transition-all duration-300 border",
                isCurrent 
                  ? "bg-indigo-950/40 border-indigo-500/40 shadow-lg shadow-indigo-950/30 scale-[1.01]" 
                  : isDone
                  ? "bg-zinc-900/40 border-zinc-800/60"
                  : "bg-transparent border-transparent opacity-30"
              )}
            >
              <div className="mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all">
                {isDone ? (
                  <div className="w-full h-full rounded-xl bg-emerald-500/20 border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-full h-full rounded-xl bg-indigo-500/20 border-indigo-500/50 text-indigo-300 flex items-center justify-center shadow-sm relative overflow-hidden">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <div className="absolute inset-0 bg-indigo-400/20 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl bg-zinc-900 border-zinc-800 text-zinc-600 flex items-center justify-center text-xs font-mono">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-bold tracking-tight",
                      isDone && "text-zinc-200",
                      isCurrent && "text-white flex items-center gap-2",
                      isPending && "text-zinc-500"
                    )}
                  >
                    <span>{stage.title}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                        Active
                      </span>
                    )}
                  </p>
                  {isDone && (
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
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
