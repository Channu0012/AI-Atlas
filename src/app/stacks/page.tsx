import React from "react";
import type { Metadata } from "next";
import { Repository } from "@/lib/db/repository";
import { StackBuilder } from "@/components/stacks/stack-builder";
import { Layers, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Stack Builder & Cost Calculator",
  description: "Assemble custom multi-tool AI pipelines tailored to your outcome. Calculate exact monthly expenditure with verified pricing.",
  alternates: {
    canonical: "/stacks",
  },
  openGraph: {
    title: "AI Stack Builder & Cost Calculator | AI Atlas",
    description: "Assemble custom multi-tool AI pipelines tailored to your outcome. Calculate exact monthly expenditure with verified pricing.",
  },
};

export default async function StacksPage() {
  const availableTools = await Repository.getPublishedTools();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 pb-6 border-b border-zinc-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Workflow Composer</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Stack Builder & Cost Calculator
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Assemble a multi-tool AI pipeline tailored to your outcome. All monthly costs calculated strictly from verified pricing.
        </p>
      </div>

      <StackBuilder availableTools={availableTools} />
    </div>
  );
}
