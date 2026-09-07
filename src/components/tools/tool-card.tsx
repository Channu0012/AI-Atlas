"use client";

import React from "react";
import Link from "next/link";
import { Tool } from "@/types";
import { ToolLogo } from "@/components/ui/tool-logo";
import { PricingBadge } from "@/components/ui/pricing-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { useAuth } from "@/features/auth/auth-context";
import { Bookmark, ExternalLink, Scale, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  className?: string;
  onCompareToggle?: (toolId: string) => void;
  isComparing?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ 
  tool, 
  className,
  onCompareToggle,
  isComparing = false
}) => {
  const { toggleSaveTool, isToolSaved } = useAuth();
  const saved = isToolSaved(tool.id);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 hover:border-zinc-700/80 hover:bg-zinc-900/90 transition-all duration-200 shadow-sm",
        className
      )}
    >
      <div>
        {/* Header: Logo, Identity, Verification, Save */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <ToolLogo name={tool.name} logoUrl={tool.logo} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/tools/${tool.slug}`}
                  className="text-base font-bold text-zinc-100 hover:text-indigo-400 transition truncate"
                >
                  {tool.name}
                </Link>
                <VerificationBadge verification={tool.verification} />
              </div>
              <p className="text-xs text-zinc-400 truncate">
                by {tool.company.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleSaveTool(tool.id)}
            title={saved ? "Remove from saved" : "Save tool"}
            className={cn(
              "p-2 rounded-lg transition border",
              saved
                ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
                : "bg-zinc-800/50 text-zinc-400 border-zinc-700/40 hover:text-zinc-200 hover:bg-zinc-800"
            )}
          >
            <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
          </button>
        </div>

        {/* Tagline */}
        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-4">
          {tool.tagline}
        </p>

        {/* Capabilities Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.capabilityIds.slice(0, 3).map(cap => (
            <span
              key={cap}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-800/70 text-zinc-300 border border-zinc-700/40"
            >
              {cap.replace(/-/g, " ")}
            </span>
          ))}
          {tool.capabilityIds.length > 3 && (
            <span className="text-[11px] text-zinc-500 px-1 py-0.5">
              +{tool.capabilityIds.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: Pricing Badge & Quick Actions */}
      <div className="pt-3.5 border-t border-zinc-800/60 flex items-center justify-between gap-2">
        <PricingBadge pricing={tool.pricing} />

        <div className="flex items-center gap-1.5">
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(tool.id)}
              className={cn(
                "p-1.5 rounded-md text-xs font-medium border transition flex items-center gap-1",
                isComparing
                  ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                  : "bg-zinc-800/40 text-zinc-400 border-zinc-700/40 hover:text-zinc-200"
              )}
              title="Compare with other tools"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            href={`/tools/${tool.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-zinc-800 transition"
          >
            Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
