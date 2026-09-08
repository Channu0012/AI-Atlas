import React from "react";
import Link from "next/link";
import { Repository } from "@/lib/db/repository";
import { GoalSearch } from "@/components/search/goal-search";
import { DomainMatrix } from "@/components/home/domain-matrix";
import { InteractiveUniverse } from "@/components/home/interactive-universe";
import { GoalPlannerCard } from "@/components/planner/goal-planner-card";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Workflow as WorkflowIcon, 
  CheckCircle2, 
  Search,
  Scale,
  Flame,
  Cpu,
  Bot,
  Zap,
  DollarSign
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const publishedTools = await Repository.getPublishedTools();
  const categories = await Repository.getCategories();
  const workflows = await Repository.getWorkflows();

  const featuredWorkflow = workflows[0] || null;

  return (
    <div className="w-full flex flex-col items-center bg-radial-ambient bg-grid-cyber">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative">
        {/* Animated Aurora Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-cyan-500/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />

        {/* Top Ticker Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-indigo-300 mb-8 shadow-inner border border-indigo-500/30">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{publishedTools.length} Fact-Verified Tools · {categories.filter(c => !c.parentId).length} Deep Domains · Zero Hallucinated Pricing</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
          Find the right AI for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 animate-aurora">
            any job imaginable
          </span>.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Stop guessing which AI tool to use. Enter what you want to achieve — our deterministic decision engine retrieves the optimal tools, explains why, and connects them into complete multi-step stacks.
        </p>

        {/* Goal Search Hero Form */}
        <div className="mt-10 max-w-3xl mx-auto">
          <GoalSearch />
        </div>

        {/* Quick-Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto text-xs">
          <span className="text-zinc-500 font-medium mr-1">Popular Stacks:</span>
          <Link
            href="/plan"
            className="glass-pill px-3 py-1.5 rounded-full text-indigo-300 hover:text-white hover:border-indigo-500/40 flex items-center gap-1.5 transition border-indigo-500/30 bg-indigo-500/10 font-semibold"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>AI Goal Planner</span>
          </Link>
          <Link
            href="/tools?collection=developers"
            className="glass-pill px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:border-cyan-500/40 flex items-center gap-1.5 transition"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Developer IDEs</span>
          </Link>
          <Link
            href="/tools?collection=best-free"
            className="glass-pill px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:border-emerald-500/40 flex items-center gap-1.5 transition"
          >
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>Best Free AI</span>
          </Link>
          <Link
            href="/tools?category=ai-video"
            className="glass-pill px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:border-purple-500/40 flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Cinematic Video</span>
          </Link>
          <Link
            href="/tools?collection=trending"
            className="glass-pill px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:border-sky-500/40 flex items-center gap-1.5 transition"
          >
            <Bot className="w-3 h-3 text-sky-400" />
            <span>Trending Velocity</span>
          </Link>
          <Link
            href="/tools?collection=top-100"
            className="glass-pill px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:border-amber-500/40 flex items-center gap-1.5 transition"
          >
            <DollarSign className="w-3 h-3 text-amber-400" />
            <span>Top 100 Tools</span>
          </Link>
        </div>
      </section>

      {/* Flagship Working AI Module: Interactive Goal & Stack Planner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GoalPlannerCard />
      </section>

      {/* Real-Time Metrics & Guarantees Ribbon */}
      <section className="w-full border-y border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              {publishedTools.length} Tools
            </span>
            <span className="text-xs text-zinc-400 mt-1 font-medium">Hand-Verified Decision Catalog</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {categories.filter(c => !c.parentId).length}
            </span>
            <span className="text-xs text-zinc-400 mt-1 font-medium">Global AI Sectors</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              0%
            </span>
            <span className="text-xs text-zinc-400 mt-1 font-medium">Hallucinated Pricing</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              &lt; 50ms
            </span>
            <span className="text-xs text-zinc-400 mt-1 font-medium">Weighted Sum Decision Engine</span>
          </div>
        </div>
      </section>

      {/* AI Universe: 16 Domains Directory */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Full Taxonomy Navigation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {categories.filter(c => !c.parentId).length} AI Domains. Zero Blind Spots.
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">
              From terminal agents and diffusion engines to local offline LLMs and legal discovery — navigate every corner of modern artificial intelligence.
            </p>
          </div>
          <Link
            href="/categories"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition group"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <DomainMatrix categories={categories} tools={publishedTools} />
      </section>

      {/* Interactive Tool Universe Explorer */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Curated Tool Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Instant Tool Explorer
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Filter top-tier tools by domain, open-source license, or trending adoption.
            </p>
          </div>
          <Link
            href="/tools"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-white transition"
          >
            <span>Full Directory ({publishedTools.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <InteractiveUniverse allTools={publishedTools} categories={categories} />
      </section>

      {/* Feature Teasers: Stacks & Comparison */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stack Builder Teaser */}
          <div className="p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-all" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                AI Stack Builder & Cost Calculator
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Design custom AI tool combinations for your startup or production workflow. Calculate exact monthly expenditure, detect feature overlap redundancies, and export clean invoices.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/stacks"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition shadow-lg shadow-indigo-600/20"
              >
                <span>Launch Stack Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Compare Duel Teaser */}
          <div className="p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 group-hover:bg-cyan-500/20 transition-all" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Side-by-Side Tool Comparison
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Compare Claude 3.5 Sonnet vs. ChatGPT vs. Gemini, or Cursor vs. Windsurf vs. Replit Agent across pricing, strengths, weaknesses, API access, and verified enterprise security.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/compare?tools=claude-3-5-sonnet,chatgpt,cursor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm font-semibold text-white transition"
              >
                <span>Compare Frontier Tools</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Spotlight */}
      {featuredWorkflow && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800/60">
          <div className="p-8 sm:p-10 rounded-3xl glass-card border-indigo-500/30 glow-border-indigo flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-3">
                <WorkflowIcon className="w-3.5 h-3.5" />
                <span>Featured Production Workflow</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {featuredWorkflow.name}
              </h3>
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                {featuredWorkflow.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-300">{featuredWorkflow.steps.length} Steps:</span>
                {featuredWorkflow.steps.map((s, idx) => (
                  <span key={s.id} className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                      {idx + 1}. {s.title}
                    </span>
                    {idx < featuredWorkflow.steps.length - 1 && <span className="text-zinc-600">→</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href={`/workflows/${featuredWorkflow.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-500/25 group cursor-pointer"
              >
                <span>Execute This Workflow</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
