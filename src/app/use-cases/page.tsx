import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Repository } from "@/lib/db/repository";
import { Target, ArrowRight, Workflow, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Use Cases & Production Solutions",
  description: "Discover verified AI tools mapped directly to real-world outcomes, business workflows, and technical challenges.",
  alternates: {
    canonical: "/use-cases",
  },
  openGraph: {
    title: "AI Use Cases & Production Solutions | AI Atlas",
    description: "Discover verified AI tools mapped directly to real-world outcomes, business workflows, and technical challenges.",
  },
};

export default async function UseCasesPage() {
  const useCases = await Repository.getUseCases();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 pb-6 border-b border-zinc-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
          <Target className="w-4 h-4" />
          <span>Outcome-Based Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Use Cases
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Discover verified tools mapped directly to real outcomes and projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {useCases.map(uc => (
          <div
            key={uc.id}
            className="p-5 sm:p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {uc.targetUsers.join(", ")}
                </span>
                {uc.recommendedWorkflowId && (
                  <span className="text-xs text-indigo-400 flex items-center gap-1">
                    <Workflow className="w-3.5 h-3.5" />
                    Workflow Ready
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{uc.name}</h2>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {uc.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {uc.requiredCapabilities.map(cap => (
                  <span key={cap} className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800">
                    {cap.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-4 border-t border-zinc-800 text-xs">
              <Link
                href={`/ask?q=${encodeURIComponent(uc.name)}`}
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get AI Stack</span>
              </Link>
              <Link
                href={`/tools?q=${encodeURIComponent(uc.name)}`}
                className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition"
              >
                <span>Browse Matching Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
