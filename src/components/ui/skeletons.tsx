"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-zinc-900/70 border border-white/[0.04] shimmer-mask",
        className
      )}
    />
  );
};

export const ToolCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-sm space-y-4">
      <div>
        {/* Header: Logo, Name, Verification, Save */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-16 h-3.5 rounded-full" />
              </div>
              <Skeleton className="w-16 h-3 rounded" />
            </div>
          </div>
          <Skeleton className="w-7 h-7 rounded-lg" />
        </div>

        {/* Tagline / Description */}
        <div className="space-y-1.5 mb-4">
          <Skeleton className="w-full h-3.5 rounded" />
          <Skeleton className="w-4/5 h-3.5 rounded" />
        </div>

        {/* Capability Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Skeleton className="w-16 h-5 rounded-md" />
          <Skeleton className="w-20 h-5 rounded-md" />
          <Skeleton className="w-14 h-5 rounded-md" />
        </div>
      </div>

      {/* Footer / Pricing & Actions */}
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <Skeleton className="w-20 h-5 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-7 rounded-lg" />
          <Skeleton className="w-16 h-7 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const ToolGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ComparisonMatrixSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Selector Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="w-20 h-3.5 rounded" />
              <Skeleton className="w-12 h-2.5 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Matrix Table Skeleton */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 py-3 border-b border-zinc-800/60 last:border-b-0">
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-28 h-4 rounded" />
            <Skeleton className="w-28 h-4 rounded" />
            <Skeleton className="w-28 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const PlanBlueprintSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Summary Card */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="w-32 h-3 rounded" />
            <Skeleton className="w-48 h-6 rounded" />
          </div>
          <Skeleton className="w-28 h-8 rounded-xl" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="w-full h-3.5 rounded" />
          <Skeleton className="w-3/4 h-3.5 rounded" />
        </div>
      </div>

      {/* Phase Timeline Cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 flex-1">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="w-40 h-4 rounded" />
                <Skeleton className="w-full max-w-md h-3 rounded" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="w-24 h-5 rounded-md" />
                  <Skeleton className="w-20 h-5 rounded-md" />
                </div>
              </div>
            </div>
            <Skeleton className="w-28 h-8 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const StackComposerSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-3">
          <Skeleton className="w-48 h-6 rounded" />
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="w-28 h-4 rounded" />
                <Skeleton className="w-20 h-3 rounded" />
              </div>
            </div>
            <Skeleton className="w-20 h-6 rounded-md" />
          </div>
        ))}
      </div>
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4 h-fit">
        <Skeleton className="w-36 h-5 rounded" />
        <Skeleton className="w-full h-16 rounded-xl" />
        <Skeleton className="w-full h-10 rounded-xl" />
      </div>
    </div>
  );
};

export const CategoryGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="w-32 h-4 rounded" />
          <Skeleton className="w-full h-3 rounded" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="w-16 h-3 rounded" />
            <Skeleton className="w-4 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
