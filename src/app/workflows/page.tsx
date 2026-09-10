import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Repository } from "@/lib/db/repository";
import { Workflow as WorkflowIcon, ArrowRight, Layers, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curated AI Workflows & Execution Pipelines",
  description: "Explore verified multi-step blueprints connecting specialized AI tools together into production-ready workflows.",
  alternates: {
    canonical: "/workflows",
  },
  openGraph: {
    title: "Curated AI Workflows & Execution Pipelines | AI Atlas",
    description: "Explore verified multi-step blueprints connecting specialized AI tools together into production-ready workflows.",
  },
};

export default async function WorkflowsPage() {
  const workflows = await Repository.getWorkflows();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 pb-6 border-b border-zinc-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
          <WorkflowIcon className="w-4 h-4" />
          <span>Multi-Step Blueprints</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Workflows & Execution Pipelines
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Proven step-by-step blueprints connecting specific tools together into high-retention workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map(wf => (
          <Link
            key={wf.id}
            href={`/workflows/${wf.slug}`}
            className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900 transition flex flex-col justify-between shadow-sm group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  {wf.steps.length} Steps
                </span>
                <span className="text-xs text-zinc-500">{wf.category}</span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition mb-2">
                {wf.name}
              </h2>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                {wf.description}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-300 group-hover:text-white">
              <span>View Step-by-Step Architecture</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
