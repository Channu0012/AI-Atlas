"use client";

import React from "react";
import Link from "next/link";
import { RecommendationResultItem } from "@/types";
import { ToolLogo } from "@/components/ui/tool-logo";
import { PricingBadge } from "@/components/ui/pricing-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { useAuth } from "@/features/auth/auth-context";
import { 
  Bookmark, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Layers, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  item: RecommendationResultItem;
  onCompare?: (toolId: string) => void;
  onAddToStack?: (toolId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  item, 
  onCompare,
  onAddToStack 
}) => {
  const { tool, score, rank, badgeLabel, whyRecommended, keyLimitations, componentScores } = item;
  const { toggleSaveTool, isToolSaved } = useAuth();
  const saved = isToolSaved(tool.id);

  return (
    <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-6 shadow-xl hover:border-zinc-700/80 transition-all flex flex-col justify-between">
      {/* Top Banner / Match Score & Badge */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs font-mono font-bold text-zinc-300">
              #{rank}
            </span>
            {badgeLabel && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {badgeLabel}
              </span>
            )}
            <VerificationBadge verification={tool.verification} />
          </div>

          {/* Match Score Indicator */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-xs text-zinc-400 block font-mono">Match Score</span>
              <span className="text-base font-bold text-indigo-400 font-mono">{score}%</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center relative">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-zinc-700"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500"
                  strokeDasharray={`${score}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 absolute" />
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="flex items-start gap-4 mb-4">
          <ToolLogo name={tool.name} logoUrl={tool.logo} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between">
              <Link 
                href={`/tools/${tool.slug}`}
                className="text-lg font-bold text-white hover:text-indigo-400 transition"
              >
                {tool.name}
              </Link>
            </div>
            <p className="text-xs text-zinc-400">by {tool.company.name}</p>
            <p className="text-sm text-zinc-300 mt-1 leading-snug">{tool.tagline}</p>
          </div>
        </div>

        {/* Fact-Grounded Why Recommended */}
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            Why recommended for your goal:
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {whyRecommended}
          </p>
        </div>

        {/* Limitations (Honest Data Trust Principle) */}
        {keyLimitations.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Verified trade-offs to keep in mind:
            </div>
            <ul className="text-xs text-amber-200/80 list-disc list-inside space-y-0.5">
              {keyLimitations.map((lim, idx) => (
                <li key={idx} className="leading-snug">{lim}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Platform & Pricing tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <PricingBadge pricing={tool.pricing} />
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
            {tool.difficulty.toUpperCase()}
          </span>
          {tool.api.available && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-emerald-400 border border-zinc-700">
              API Available
            </span>
          )}
          {tool.openSource && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-cyan-400 border border-zinc-700">
              Open Source
            </span>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveTool(tool.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition",
              saved
                ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
                : "bg-zinc-800/60 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
            )}
          >
            <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-current")} />
            {saved ? "Saved" : "Save"}
          </button>

          {onCompare && (
            <button
              onClick={() => onCompare(tool.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/60 text-zinc-300 border border-zinc-700 hover:bg-zinc-800 hover:text-white transition"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare
            </button>
          )}

          {onAddToStack && (
            <button
              onClick={() => onAddToStack(tool.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/60 text-zinc-300 border border-zinc-700 hover:bg-zinc-800 hover:text-white transition"
            >
              <Layers className="w-3.5 h-3.5" />
              Add to Stack
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/tools/${tool.slug}`}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition px-2 py-1"
          >
            Full Profile
          </Link>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
          >
            Visit Website
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
