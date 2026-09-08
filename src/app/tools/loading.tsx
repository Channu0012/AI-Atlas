import React from "react";
import { Skeleton, ToolGridSkeleton } from "@/components/ui/skeletons";

export default function ToolsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Directory Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <Skeleton className="w-32 h-4 rounded-full" />
          <Skeleton className="w-64 h-8 rounded-xl" />
          <Skeleton className="w-96 max-w-full h-4 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-28 h-9 rounded-xl" />
          <Skeleton className="w-20 h-9 rounded-xl" />
        </div>
      </div>

      {/* Filter and Search Bar Skeleton */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="flex-1 h-12 rounded-2xl" />
          <Skeleton className="w-36 h-12 rounded-2xl" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex items-center gap-2 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-8 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Tools Grid Skeleton */}
      <ToolGridSkeleton count={6} />
    </div>
  );
}
