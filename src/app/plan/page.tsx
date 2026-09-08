import React from "react";
import { Metadata } from "next";
import { GoalPlannerCard } from "@/components/planner/goal-planner-card";
import { 
  Sparkles, 
  Layers, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  Code, 
  Video, 
  Mail, 
  Database,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Goal Planner & Execution Suite | AI Atlas",
  description: "Deconstruct your objective into an audited, step-by-step AI execution plan with verified flagship tools, exact pricing, and subscription redundancy detection.",
};

export default function PlanPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive AI Decision Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          AI Goal Planner & Stack Architect
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
          Stop guessing which AI tools to buy. Tell the planner your objective and budget—we decompose the project into sequential phases, assign audited tools, eliminate subscription redundancies, and output a production blueprint.
        </p>
      </div>

      {/* Main Interactive Planner Module */}
      <section id="planner-workspace">
        <GoalPlannerCard />
      </section>

      {/* How the Analyzer Works (Decision Engine Principles) */}
      <section className="pt-6 border-t border-zinc-800/80 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Why AI Atlas Plans Differ From Generic AI Directories
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
            Grounded strictly in verified capabilities, not marketing hype or inflated tool counters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Phase-by-Phase Deconstruction
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We map your goal into real functional requirements (e.g. ideation → script → voiceover → b-roll → assembly) so you don't overpay for monolithic software.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Redundancy & Overlap Auditing
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Paying for ChatGPT Plus, Claude Pro, and Jasper simultaneously? The analyzer flags overlapping capabilities and consolidates subscriptions to save you real money.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Zero-Hallucination Pricing
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every monthly cost, free plan limit, and platform requirement is pulled directly from audited tool registries with verified data guarantees.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation Footer */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">
            Need to compare two specific tools head-to-head?
          </h4>
          <p className="text-xs text-zinc-400">
            Compare pricing tiers, latency, capabilities, and benchmarks side-by-side.
          </p>
        </div>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition"
        >
          Open Tool Comparison Engine
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
