"use client";

import React from "react";
import Link from "next/link";
import { Tool } from "@/types";
import { ToolLogo } from "@/components/ui/tool-logo";
import { PricingBadge } from "@/components/ui/pricing-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { 
  Check, 
  X, 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonMatrixProps {
  tools: Tool[];
  onRemoveTool?: (toolId: string) => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ tools, onRemoveTool }) => {
  if (tools.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40 max-w-xl mx-auto my-8">
        <p className="text-zinc-400 text-sm mb-4">No tools selected for comparison yet.</p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
        >
          Select Tools from Directory
        </Link>
      </div>
    );
  }

  // Generate fact-grounded "Choose X if..." summary strictly from verified specs
  const comparisonSummaries = tools.map(t => {
    const reasons: string[] = [];
    if (t.pricing.model === "free" || t.pricing.freePlan) {
      reasons.push("you want a zero-cost entry point");
    }
    if (t.difficulty === "beginner") {
      reasons.push("you prioritize immediate ease of use without complex setups");
    }
    if (t.openSource) {
      reasons.push("you require full open-source control and local hosting");
    }
    if (t.api.available) {
      reasons.push("you need to integrate programmatic API calls into your software");
    }
    if (t.strengths.length > 0) {
      reasons.push(`you specifically need ${t.strengths[0].toLowerCase()}`);
    }

    return {
      name: t.name,
      slug: t.slug,
      summary: `Choose ${t.name} if ${reasons.slice(0, 2).join(" and ")}.`
    };
  });

  return (
    <div className="space-y-8">
      {/* AI Comparison Summary Box (PRD Section 31) */}
      <div className="p-4 sm:p-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-indigo-400 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Factual Decision Guidance</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
          {comparisonSummaries.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="font-semibold text-white">{item.name}: </span>
              <span>{item.summary}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Horizontal Swipe Indicator */}
      <div className="flex sm:hidden items-center justify-end gap-1 text-[10px] text-zinc-500 font-mono">
        <span>← Swipe to compare all tools →</span>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-4 text-zinc-400 font-medium w-48 sticky left-0 bg-zinc-900/90 backdrop-blur-sm z-10">
                Specifications
              </th>
              {tools.map(tool => (
                <th key={tool.id} className="p-4 min-w-[220px] max-w-[280px]">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <ToolLogo name={tool.name} logoUrl={tool.logo} size="sm" />
                      <div>
                        <Link href={`/tools/${tool.slug}`} className="font-bold text-white hover:text-indigo-400 text-sm">
                          {tool.name}
                        </Link>
                        <p className="text-[11px] text-zinc-400 font-normal">by {tool.company.name}</p>
                      </div>
                    </div>
                    {onRemoveTool && (
                      <button
                        onClick={() => onRemoveTool(tool.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <VerificationBadge verification={tool.verification} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {/* Pricing Model */}
            <tr>
              <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950/90 z-10">
                Pricing Model
              </td>
              {tools.map(t => (
                <td key={t.id} className="p-4">
                  <PricingBadge pricing={t.pricing} />
                </td>
              ))}
            </tr>

            {/* Starting Price */}
            <tr>
              <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950/90 z-10">
                Starting Monthly Price
              </td>
              {tools.map(t => (
                <td key={t.id} className="p-4 text-zinc-200 font-mono">
                  {t.pricing.model === "free" ? "Free" : t.pricing.startingPrice ? `$${t.pricing.startingPrice}/mo` : "Custom / Unknown"}
                </td>
              ))}
            </tr>

            {/* Difficulty Level */}
            <tr>
              <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950/90 z-10">
                Target Skill Level
              </td>
              {tools.map(t => (
                <td key={t.id} className="p-4 capitalize text-zinc-200">
                  {t.difficulty}
                </td>
              ))}
            </tr>

            {/* API Availability */}
            <tr>
              <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950/90 z-10">
                Developer API
              </td>
              {tools.map(t => (
                <td key={t.id} className="p-4">
                  {t.api.available ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <Check className="w-4 h-4" /> Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500">
                      <X className="w-4 h-4" /> None
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Open Source */}
            <tr>
              <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950/90 z-10">
                Open Source
              </td>
              {tools.map(t => (
                <td key={t.id} className="p-4">
                  {t.openSource ? (
                    <span className="inline-flex items-center gap-1 text-cyan-400">
                      <Check className="w-4 h-4" /> Open Source
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500">
                      <X className="w-4 h-4" /> Proprietary
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Platform Compatibility */}
            <tr>
              <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950/90 z-10">
                Supported Platforms
              </td>
              {tools.map(t => (
                <td key={t.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(t.platforms).filter(([, v]) => v).map(([p]) => (
                      <span key={p} className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 uppercase">
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Key Strengths */}
            <tr>
              <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950/90 z-10">
                Verified Strengths
              </td>
              {tools.map(t => (
                <td key={t.id} className="p-4">
                  <ul className="space-y-1 list-disc list-inside text-zinc-300">
                    {t.strengths.slice(0, 3).map((str, idx) => (
                      <li key={idx} className="leading-snug">{str}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Verified Limitations */}
            <tr>
              <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950/90 z-10">
                Verified Limitations
              </td>
              {tools.map(t => (
                <td key={t.id} className="p-4">
                  <ul className="space-y-1 list-disc list-inside text-amber-200/80">
                    {t.limitations.slice(0, 3).map((lim, idx) => (
                      <li key={idx} className="leading-snug">{lim}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Action buttons */}
            <tr>
              <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950/90 z-10">
                Action
              </td>
              {tools.map(t => (
                <td key={t.id} className="p-4">
                  <a
                    href={t.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                  >
                    <span>Visit Tool</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
