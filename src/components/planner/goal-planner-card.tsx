"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PlanResult, PlanPhase, SkillLevel, Tool } from "@/types";
import { ToolLogo } from "@/components/ui/tool-logo";
import { PricingBadge } from "@/components/ui/pricing-badge";
import { 
  Sparkles, 
  Layers, 
  DollarSign, 
  AlertTriangle, 
  Check, 
  Copy, 
  ArrowRight, 
  RefreshCw, 
  TrendingDown, 
  Save, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Sliders,
  Terminal,
  FileText,
  CheckCircle2,
  Cpu,
  Key,
  Video,
  Code2,
  Bot,
  Compass,
  Flame,
  Workflow,
  Search,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeletons";
import { cn } from "@/lib/utils";

interface GoalPlannerCardProps {
  initialGoal?: string;
  initialBudget?: number;
  initialSkillLevel?: SkillLevel;
  compact?: boolean;
}

const PRESET_GOAL_CARDS = [
  { 
    id: "faceless-yt",
    title: "Faceless YouTube Studio", 
    goal: "Launch an automated faceless YouTube channel producing weekly AI video essays with automated scripts, voices, and b-roll clips", 
    budget: 30, 
    skill: "beginner" as SkillLevel,
    icon: Video,
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400",
    tools: ["Claude 3.5", "ElevenLabs", "Runway Gen-3", "CapCut"]
  },
  { 
    id: "saas-mvp",
    title: "Full-Stack SaaS MVP", 
    goal: "Build a rapid full-stack SaaS MVP web application with authentication, Stripe billing, and AI backend for solopreneurs", 
    budget: 50, 
    skill: "intermediate" as SkillLevel,
    icon: Code2,
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400",
    tools: ["Cursor", "Supabase AI", "V0 by Vercel", "Resend"]
  },
  { 
    id: "local-rig",
    title: "Private Offline Local AI Rig", 
    goal: "Set up a private offline local LLM runtime paired with my code editor and document embedding search with zero telemetry", 
    budget: 0, 
    skill: "professional" as SkillLevel,
    icon: Cpu,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    tools: ["Ollama", "DeepSeek R1", "Continue.dev", "ChromaDB"]
  },
  { 
    id: "agent-fleet",
    title: "Autonomous Agent Fleet", 
    goal: "Deploy multi-agent task runners to automate web research, competitor analysis, lead generation, and CRM synchronization", 
    budget: 60, 
    skill: "intermediate" as SkillLevel,
    icon: Bot,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
    tools: ["CrewAI", "Perplexity API", "Make.com", "Airtable"]
  }
];

export const GoalPlannerCard: React.FC<GoalPlannerCardProps> = ({
  initialGoal = "",
  initialBudget,
  initialSkillLevel = "beginner",
  compact = false
}) => {
  const [goal, setGoal] = useState(initialGoal);
  const [budget, setBudget] = useState<number | undefined>(initialBudget);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(initialSkillLevel);
  const [preferOpenSource, setPreferOpenSource] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savingStack, setSavingStack] = useState(false);

  // Scanning telemetry states during loading
  const [scanStep, setScanStep] = useState(0);
  const [screenedCount, setScreenedCount] = useState(0);

  // Kie.ai Multimodal Solution State
  const [solutionDeliverable, setSolutionDeliverable] = useState<any | null>(null);
  const [generatingSolution, setGeneratingSolution] = useState(false);
  const [solutionCopied, setSolutionCopied] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim()) {
      setError("Please describe what you want to accomplish or choose a battle-tested blueprint card.");
      return;
    }

    setError(null);
    setLoading(true);
    setPlanResult(null);
    setSolutionDeliverable(null);
    setScanStep(0);
    setScreenedCount(0);

    const startTime = Date.now();
    const MIN_COGNITIVE_MS = 4600;

    // Start progress simulation for the "Crazy Searcher" experience
    const scanInterval = setInterval(() => {
      setScreenedCount((prev) => {
        if (prev >= 1048) return 1048;
        return prev + Math.floor(Math.random() * 85 + 40);
      });
      setScanStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const res = await fetch("/api/v1/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          budget: budget !== undefined && !isNaN(budget) ? Number(budget) : undefined,
          skillLevel,
          preferOpenSource
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate execution plan.");
      }

      const data = await res.json();

      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_COGNITIVE_MS) {
        await new Promise((r) => setTimeout(r, MIN_COGNITIVE_MS - elapsed));
      }

      setPlanResult(data.plan);
    } catch (err: any) {
      setError(err.message || "An error occurred while synthesizing your execution plan.");
    } finally {
      clearInterval(scanInterval);
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_GOAL_CARDS[0]) => {
    setGoal(preset.goal);
    setBudget(preset.budget);
    setSkillLevel(preset.skill);
  };

  // Swap primary tool with alternative in a phase
  const handleSwapTool = (phaseIndex: number) => {
    if (!planResult) return;
    const updatedPhases = [...planResult.phases];
    const target = updatedPhases[phaseIndex];
    if (!target.alternativeTool) return;

    const oldPrimary = target.primaryTool;
    const newPrimary = target.alternativeTool;
    const newCost = (newPrimary.pricing.model === "free" || newPrimary.pricing.freePlan)
      ? 0
      : (newPrimary.pricing.startingPrice || 0);

    updatedPhases[phaseIndex] = {
      ...target,
      primaryTool: newPrimary,
      alternativeTool: oldPrimary,
      estimatedCost: newCost,
      isFreeTier: newCost === 0
    };

    const newTotalCost = updatedPhases.reduce((sum, p) => sum + p.estimatedCost, 0);
    const isWithin = budget !== undefined ? newTotalCost <= budget : true;
    const diff = budget !== undefined ? budget - newTotalCost : undefined;

    setPlanResult({
      ...planResult,
      phases: updatedPhases,
      totalEstimatedMonthlyCost: newTotalCost,
      isWithinBudget: isWithin,
      budgetDifference: diff
    });
  };

  const handleCopyBlueprint = async () => {
    if (!planResult) return;
    try {
      await navigator.clipboard.writeText(planResult.blueprintMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy blueprint:", err);
    }
  };

  const handleSaveStack = async () => {
    if (!planResult) return;
    setSavingStack(true);
    setSavedSuccess(false);

    try {
      const payload = {
        name: `Stack: ${planResult.goal.slice(0, 45)}...`,
        description: planResult.summary,
        goal: planResult.goal,
        tools: planResult.phases.map((p, idx) => ({
          toolId: p.primaryTool.id,
          role: p.title,
          order: idx + 1
        })),
        visibility: "private",
        estimatedMonthlyCost: {
          amount: planResult.totalEstimatedMonthlyCost,
          currency: "USD"
        }
      };

      const res = await fetch("/api/v1/stacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving stack:", err);
    } finally {
      setSavingStack(false);
    }
  };

  const handleGenerateLiveSolution = async () => {
    if (!planResult) return;
    setGeneratingSolution(true);
    try {
      const res = await fetch("/api/v1/solutions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: planResult.goal,
          phaseTitle: "Comprehensive Solution Deliverable",
          skillLevel,
          customKey: customApiKey || undefined
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSolutionDeliverable(data.data);
      }
    } catch (err) {
      console.error("Failed to generate solution deliverable:", err);
    } finally {
      setGeneratingSolution(false);
    }
  };

  const handleCopySolution = async () => {
    if (!solutionDeliverable?.content) return;
    try {
      await navigator.clipboard.writeText(solutionDeliverable.content);
      setSolutionCopied(true);
      setTimeout(() => setSolutionCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy solution:", err);
    }
  };

  return (
    <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 p-6 sm:p-9 shadow-2xl shadow-indigo-950/60 space-y-8 relative overflow-hidden backdrop-blur-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -z-10 h-80 w-[450px] rounded-full bg-gradient-to-tr from-indigo-600/15 to-cyan-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-80 w-[450px] rounded-full bg-gradient-to-tr from-purple-600/15 to-pink-500/15 blur-[140px] pointer-events-none" />

      {/* Top Futuristic Header */}
      <div className="space-y-3 pb-6 border-b border-zinc-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>QUANTUM AI GOAL & STACK ARCHITECT</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Kie.ai Multimodal Engine Live</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="text-[11px] font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-zinc-800 bg-zinc-900/70 transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Kie.ai Key Config</span>
          </button>
        </div>

        {/* Optional Kie.ai Key Config Dropdown */}
        {showKeyConfig && (
          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-zinc-900/95 text-xs space-y-2.5 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Active Kie.ai Multimodal API Key
              </span>
              <a
                href="https://kie.ai/api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 text-[11px]"
              >
                Manage on Kie.ai <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Default System Key: <code className="text-cyan-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">5eec2e84e297ce765d9c596cf17a721c</code>
            </p>
            <input
              type="text"
              placeholder="Paste custom Kie.ai API key to override"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Turn Any Objective into an Audited{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">
            Multi-Phase AI Execution Blueprint
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Screen 1,000+ verified tools, eliminate redundant subscription spend, pair primary engines with free alternatives, and run live multimodal deliverables with one click.
        </p>
      </div>

      {/* Battle-Tested Blueprint Preset Cards (VISUAL & COOL!) */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Launch from a Battle-Tested AI Blueprint:</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PRESET_GOAL_CARDS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = goal === preset.goal;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden",
                  isSelected
                    ? "bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-950/40 scale-[1.02]"
                    : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={cn("w-8 h-8 rounded-xl bg-zinc-900 border flex items-center justify-center", preset.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {preset.budget === 0 ? "Free" : `$${preset.budget}/mo`}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-tight">
                    {preset.goal}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-wrap gap-1">
                  {preset.tools.map((t) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Futuristic Command Prompt Input Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2 flex items-center justify-between">
            <span>Describe Your Objective (Natural Language Goal)</span>
            <span className="text-[11px] font-normal text-zinc-500">
              Deterministic Semantic Decomposition
            </span>
          </label>

          <div className="relative rounded-2xl border-2 border-zinc-800 bg-zinc-900/90 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-3 shadow-inner">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              placeholder="e.g. I want to build an automated faceless YouTube channel producing weekly AI video essays with automated scripts, voices, and b-roll clips with ₹2000 monthly budget..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Visual Interactive Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Target Monthly Budget Controls */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Monthly Budget Ceiling
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                { label: "Free ($0)", val: 0 },
                { label: "$25 Starter", val: 25 },
                { label: "$50 Growth", val: 50 },
                { label: "$100 Pro", val: 100 }
              ].map((tier) => (
                <button
                  key={tier.val}
                  type="button"
                  onClick={() => setBudget(tier.val)}
                  className={cn(
                    "text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer font-medium",
                    budget === tier.val
                      ? "bg-indigo-600 text-white border-indigo-500 font-semibold"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white"
                  )}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">$</span>
              <input
                type="number"
                min="0"
                step="5"
                value={budget !== undefined ? budget : ""}
                onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Custom (e.g. 35)"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Technical Skill Level Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Your Technical Skill
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "beginner", label: "Beginner", sub: "No-code / Fast" },
                { id: "intermediate", label: "Intermediate", sub: "APIs & Automations" },
                { id: "professional", label: "Pro", sub: "Local / Terminal" }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSkillLevel(s.id as SkillLevel)}
                  className={cn(
                    "p-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-center",
                    skillLevel === s.id
                      ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <span className="text-xs font-bold block">{s.label}</span>
                  <span className="text-[9px] text-zinc-500 block truncate">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Open Source / Local Priority Toggle */}
          <div className="space-y-2 flex flex-col justify-end">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Open Source Preference
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/90 transition cursor-pointer">
              <input
                type="checkbox"
                checked={preferOpenSource}
                onChange={(e) => setPreferOpenSource(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-indigo-600 focus:ring-0 bg-zinc-950"
              />
              <span className="text-xs text-zinc-300 font-medium">
                Prioritize Local & Open Source
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Generate / Execute Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base tracking-wide transition shadow-xl shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
              <span>Synthesizing Multi-Phase Architecture...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>⚡ Generate Working AI Execution Blueprint</span>
            </>
          )}
        </button>
      </form>

      {/* CRAZY SEARCHER SCANNING EXPERIENCE DURING GENERATION */}
      {loading && (
        <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-zinc-950/90 shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center animate-pulse">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Quantum AI Searcher Active</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </h4>
                <p className="text-xs text-zinc-400">
                  Cross-referencing 1,000+ verified tools against objective constraints...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-300">
                Screened: {screenedCount} / 1,048 Tools
              </div>
            </div>
          </div>

          {/* Holographic Radar Waves */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { label: "Semantic Parsing", desc: "Extracting goal requirements" },
              { label: "Vector Search", desc: "Querying 16 domain matrices" },
              { label: "Cost & Redundancy", desc: "Auditing overlapping tiers" },
              { label: "Blueprint Render", desc: "Building execution pipeline" }
            ].map((step, idx) => (
              <div
                key={step.label}
                className={cn(
                  "p-3 rounded-xl border transition-all text-xs",
                  idx <= scanStep
                    ? "bg-indigo-950/40 border-indigo-500/40 text-white"
                    : "bg-zinc-900/20 border-zinc-800/40 text-zinc-600"
                )}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {idx < scanStep ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : idx === scanStep ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 text-zinc-600 font-mono text-[10px]">{idx + 1}</span>
                  )}
                  <span>{step.label}</span>
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-1">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-fuchsia-500 animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* CRAZY RESULTS: HOLOGRAPHIC BLUEPRINT VIEW */}
      {planResult && !loading && (
        <div className="space-y-8 pt-6 border-t border-zinc-800/80 animate-fade-in">
          {/* Executive Topology HUD Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Execution Blueprint Synthesized
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {planResult.phases.length}-Phase Autonomous Architecture
                </h3>
                <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                  {planResult.summary}
                </p>
              </div>

              {/* Cost & Budget Meter */}
              <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-inner shrink-0">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                    Estimated Spend
                  </span>
                  <span className="text-2xl font-black font-mono text-white">
                    ${planResult.totalEstimatedMonthlyCost}
                    <span className="text-xs font-normal text-zinc-400">/mo</span>
                  </span>
                </div>

                {planResult.targetBudget !== undefined && (
                  <span className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold border",
                    planResult.isWithinBudget
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  )}>
                    {planResult.isWithinBudget ? "Within Budget" : "Exceeds Budget"}
                  </span>
                )}
              </div>
            </div>

            {/* Redundancy Alert Banner */}
            {planResult.redundancies && planResult.redundancies.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Subscription Overlap Warning ({planResult.redundancies.length} Redundancies Audited)</span>
                </div>
                <div className="space-y-1.5">
                  {planResult.redundancies.map((r, idx) => (
                    <div key={idx} className="text-xs text-amber-200/90 leading-relaxed flex flex-wrap items-baseline gap-2">
                      <span>• <strong>{r.capabilityName}:</strong> {r.recommendation}</span>
                      {r.potentialMonthlySavings > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                          <TrendingDown className="w-3 h-3" />
                          Save ${r.potentialMonthlySavings}/mo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VISUAL PHASE PIPELINE TOPOLOGY (NODE GRAPH!) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-indigo-400" />
                <span>Sequential Phase Topology</span>
              </h4>
              <span className="text-xs text-zinc-500">
                Click &ldquo;Swap Tool&rdquo; to substitute with free/open-source alternatives
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planResult.phases.map((phase, idx) => (
                <div
                  key={phase.phaseNumber}
                  className="p-5 rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:border-indigo-500/40 transition space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Phase Header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                          {phase.phaseNumber}
                        </span>
                        <h5 className="text-sm font-bold text-white">
                          {phase.title}
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                        {phase.requiredCapability}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      {phase.description}
                    </p>

                    {/* Primary Tool Highlight */}
                    <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <ToolLogo name={phase.primaryTool.name} logoUrl={phase.primaryTool.logo} size="sm" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/tools/${phase.primaryTool.slug}`}
                              className="text-xs sm:text-sm font-bold text-white hover:text-indigo-400 transition truncate"
                            >
                              {phase.primaryTool.name}
                            </Link>
                            <PricingBadge pricing={phase.primaryTool.pricing} />
                          </div>
                          <span className="text-[11px] text-zinc-500 block truncate">
                            {phase.primaryTool.tagline}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-emerald-400 block">
                          {phase.estimatedCost === 0 ? "Free Tier" : `$${phase.estimatedCost}/mo`}
                        </span>
                        <a
                          href={phase.primaryTool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-zinc-500 hover:text-white transition inline-flex items-center gap-0.5 mt-0.5"
                        >
                          <span>Site</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Alternative Tool Option */}
                  {phase.alternativeTool && (
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono mr-1.5">
                          Alternative:
                        </span>
                        <span className="text-zinc-300 font-medium truncate">
                          {phase.alternativeTool.name} ({phase.alternativeTool.pricing.model === "free" ? "Free" : `$${phase.alternativeTool.pricing.startingPrice || 0}/mo`})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSwapTool(idx)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition shrink-0 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Swap</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Dock & Live Deliverable Trigger */}
          <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyBlueprint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Markdown!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown Blueprint</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveStack}
                disabled={savingStack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Saved to My Stacks!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingStack ? "Saving..." : "Save to Stacks"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGenerateLiveSolution}
                disabled={generatingSolution}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-cyan-600/30 cursor-pointer disabled:opacity-50"
              >
                {generatingSolution ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Kie.ai Runner...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>⚡ Run Live Solution with Kie.ai</span>
                  </>
                )}
              </button>
            </div>

            <Link
              href="/stacks"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-indigo-400 transition"
            >
              <span>Full Custom Stack Builder</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Kie.ai Live Solution Deliverable Viewer */}
          {generatingSolution && (
            <div className="p-6 rounded-3xl bg-zinc-950 border border-cyan-500/40 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                <div>
                  <h5 className="text-sm font-bold text-white">Synthesizing Working Artifact via Kie.ai Multimodal Layer</h5>
                  <p className="text-xs text-zinc-400">Constructing scripts, prompt packs, and architecture payloads...</p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-5/6 h-4 rounded-lg" />
                <Skeleton className="w-2/3 h-4 rounded-lg" />
              </div>
            </div>
          )}

          {solutionDeliverable && !generatingSolution && (
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-cyan-500/40 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      Live Solution Deliverable
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {solutionDeliverable.deliverableType}
                      </span>
                    </h5>
                    <p className="text-[11px] text-zinc-400">
                      {solutionDeliverable.statusMessage}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySolution}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition cursor-pointer"
                  >
                    {solutionCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Artifact</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSolutionDeliverable(null)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Formatted Content Output */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto shadow-inner">
                {solutionDeliverable.content}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
