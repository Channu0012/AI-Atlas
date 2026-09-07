import React from "react";
import Link from "next/link";
import { SearchX, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
  suggestedActionHref?: string;
  suggestedActionLabel?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No verified tools found matching criteria",
  description = "We couldn't find a verified tool matching all your specified filters. Try relaxing hard constraints, increasing budget bounds, or searching with broader terms.",
  onResetFilters,
  suggestedActionHref = "/tools",
  suggestedActionLabel = "Explore All Tools",
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40 max-w-xl mx-auto my-8",
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
        <SearchX className="w-6 h-6 text-zinc-400" />
      </div>

      <h3 className="text-lg font-semibold text-zinc-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
        )}
        {suggestedActionHref && (
          <Link
            href={suggestedActionHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition"
          >
            {suggestedActionLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};
