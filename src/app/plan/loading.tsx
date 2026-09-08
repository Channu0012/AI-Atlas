import React from "react";
import { Skeleton, PlanBlueprintSkeleton } from "@/components/ui/skeletons";

export default function PlanLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Planner Header Skeleton */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Skeleton className="w-36 h-5 rounded-full mx-auto" />
        <Skeleton className="w-80 max-w-full h-9 rounded-xl mx-auto" />
        <Skeleton className="w-96 max-w-full h-4 rounded mx-auto" />
      </div>

      {/* Goal Planner Input Form Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="w-40 h-4 rounded" />
          <Skeleton className="w-full h-24 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-full h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-full h-11 rounded-xl" />
          </div>
        </div>

        <Skeleton className="w-full h-12 rounded-xl" />
      </div>

      {/* Plan Blueprint Skeleton */}
      <PlanBlueprintSkeleton />
    </div>
  );
}
