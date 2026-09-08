import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { 
  Skeleton, 
  ToolCardSkeleton, 
  ToolGridSkeleton, 
  ComparisonMatrixSkeleton, 
  PlanBlueprintSkeleton, 
  StackComposerSkeleton, 
  CategoryGridSkeleton 
} from "../skeletons";

describe("Skeletons Component Suite", () => {
  it("renders base Skeleton with shimmer-mask class", () => {
    const html = renderToStaticMarkup(<Skeleton className="w-20 h-4" />);
    expect(html).toContain("shimmer-mask");
    expect(html).toContain("w-20");
  });

  it("renders ToolCardSkeleton with proper layout containers", () => {
    const html = renderToStaticMarkup(<ToolCardSkeleton />);
    expect(html).toContain("shimmer-mask");
    expect(html).toContain("rounded-2xl");
  });

  it("renders ToolGridSkeleton with default and custom count", () => {
    const html6 = renderToStaticMarkup(<ToolGridSkeleton count={6} />);
    expect(html6).toContain("grid-cols-1");
    // Should have 6 instances of card containers
    const count = (html6.match(/rounded-2xl border border-zinc-800/g) || []).length;
    expect(count).toBe(6);

    const html3 = renderToStaticMarkup(<ToolGridSkeleton count={3} />);
    const count3 = (html3.match(/rounded-2xl border border-zinc-800/g) || []).length;
    expect(count3).toBe(3);
  });

  it("renders ComparisonMatrixSkeleton", () => {
    const html = renderToStaticMarkup(<ComparisonMatrixSkeleton />);
    expect(html).toContain("grid-cols-1 md:grid-cols-4");
  });

  it("renders PlanBlueprintSkeleton", () => {
    const html = renderToStaticMarkup(<PlanBlueprintSkeleton />);
    expect(html).toContain("shimmer-mask");
    expect(html).toContain("bg-zinc-900/80");
  });

  it("renders StackComposerSkeleton", () => {
    const html = renderToStaticMarkup(<StackComposerSkeleton />);
    expect(html).toContain("lg:col-span-2");
  });

  it("renders CategoryGridSkeleton", () => {
    const html = renderToStaticMarkup(<CategoryGridSkeleton />);
    expect(html).toContain("grid-cols-1 sm:grid-cols-2");
  });
});
