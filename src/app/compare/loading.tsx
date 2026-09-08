import React from "react";
import { Skeleton, ComparisonMatrixSkeleton } from "@/components/ui/skeletons";

export default function CompareLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Compare Header Skeleton */}
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <Skeleton className="w-32 h-4 rounded-full" />
        <Skeleton className="w-64 h-8 rounded-xl" />
        <Skeleton className="w-96 max-w-full h-4 rounded" />
      </div>

      {/* Comparison Matrix Skeleton */}
      <ComparisonMatrixSkeleton />
    </div>
  );
}
