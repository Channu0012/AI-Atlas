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
  Check, 
  Copy, 
  ArrowRight, 
  RefreshCw, 
  Save, 
  ExternalLink,
  Zap,
  Clock,
  CheckCircle2,
  Video,
  Code2,
  Bot,
  ShoppingBag,
  BookOpen,
  Terminal,
  AlertTriangle,
  Play
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeletons";
import { cn } from "@/lib/utils";

interface GoalPlannerCardProps {
  initialGoal?: string;
  initialBudget?: number;
  initialSkillLevel?: SkillLevel;
  compact?: boolean;
}

const QUICK_GOAL_PRESETS = [
  {
    id: "youtube-shorts",
    title: "Faceless YouTube Shorts",
    desc: "Viral 60-second video channel",
    goal: "Launch a faceless YouTube Shorts channel with automated viral scripts, realistic voices, and b-roll clips",
    budget: 0,
    skill: "beginner" as SkillLevel,
    time: "45 mins",
    cost: "100% Free",
    icon: Video,
    color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30"
  },
  {
    id: "saas-mvp",
    title: "Launch SaaS Web App",
    desc: "Full-stack app with Stripe & DB",
    goal: "Build and deploy a full-stack SaaS MVP web application with user authentication, database, and Stripe payments",
    budget: 25,
    skill: "intermediate" as SkillLevel,
    time: "2 hours",
    cost: "Free to $25/mo",
    icon: Code2,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30"
  },
  {
    id: "ecommerce-brand",
    title: "E-Commerce Launch",
    desc: "Product descriptions & ad creatives",
    goal: "Launch an e-commerce brand with AI-generated product photography, high-converting copy, and ad creatives",
    budget: 0,
    skill: "beginner" as SkillLevel,
    time: "1 hour",
    cost: "100% Free",
    icon: ShoppingBag,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
  },
  {
    id: "workflow-automation",
    title: "Automate Business Leads",
    desc: "Outreach & CRM synchronization",
    goal: "Automate customer lead generation, web scraping, email outreach sequences, and CRM pipeline updates",
    budget: 30,
    skill: "intermediate" as SkillLevel,
    time: "1.5 hours",
    cost: "Free Tier",
    icon: Bot,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30"
  },
  {
    id: "academic-research",
    title: "Research Paper Deep Dive",
    desc: "Analyze literature & citations",
    goal: "Synthesize 20+ academic papers on my topic, extract data findings, and draft a structured literature review with citations",
    budget: 0,
    skill: "beginner" as SkillLevel,
    time: "1 hour",
    cost: "100% Free",
    icon: BookOpen,
    color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30"
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
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savingStack, setSavingStack] = useState(false);

  // Track completed steps like an interactive checklist
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedPrompts, setCopiedPrompts] = useState<Record<number, boolean>>({});

  // Kie.ai live solution runner
  const [generatingDeliverable, setGeneratingDeliverable] = useState(false);
  const [deliverable, setDeliverable] = useState<any | null>(null);
  const [copiedDeliverable, setCopiedDeliverable] = useState(false);

  const handleGenerate = async (e?: React.FormEvent, customGoal?: string) => {
    if (e) e.preventDefault();
    const query = (customGoal || goal).trim();
    if (!query) {
      setError("Please describe what you want to build or pick a goal below.");
      return;
    }

    setError(null);
    setLoading(true);
    setPlanResult(null);
    setDeliverable(null);
    setCompletedSteps({});

    try {
      const res = await fetch("/api/v1/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: query,
          budget: budget !== undefined && !isNaN(budget) ? Number(budget) : undefined,
          skillLevel
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate plan.");
      }

      const data = await res.json();
      setPlanResult(data.plan);
    } catch (err: any) {
      setError(err.message || "An error occurred while creating your plan.");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (preset: typeof QUICK_GOAL_PRESETS[0]) => {
    setGoal(preset.goal);
    setBudget(preset.budget);
    setSkillLevel(preset.skill);
    handleGenerate(undefined, preset.goal);
  };

  const handleToggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const handleCopyPrompt = async (stepNumber: number, promptText?: string) => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompts(prev => ({ ...prev, [stepNumber]: true }));
      setTimeout(() => {
        setCopiedPrompts(prev => ({ ...prev, [stepNumber]: false }));
      }, 2500);
    } catch (err) {
      console.error("Failed to copy prompt:", err);
    }
  };

  const handleCopyBlueprint = async () => {
    if (!planResult) return;
    try {
      await navigator.clipboard.writeText(planResult.blueprintMarkdown);
      setCopiedBlueprint(true);
      setTimeout(() => setCopiedBlueprint(false), 2500);
    } catch (err) {
      console.error("Failed to copy blueprint:", err);
    }
  };

  const handleSaveStack = async () => {
    if (!planResult) return;
    setSavingStack(true);
    try {
      const payload = {
        name: `Stack: ${planResult.goal.slice(0, 40)}...`,
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
      console.error("Failed to save stack:", err);
    } finally {
      setSavingStack(false);
    }
  };

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

  const handleGenerateLiveDeliverable = async () => {
    if (!planResult) return;
    setGeneratingDeliverable(true);
    try {
      const res = await fetch("/api/v1/solutions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: planResult.goal,
          phaseTitle: "Initial Ready-to-Use Deliverable",
          skillLevel
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDeliverable(data.data);
      }
    } catch (err) {
      console.error("Failed to generate deliverable:", err);
    } finally {
      setGeneratingDeliverable(false);
    }
  };

  const handleCopyDeliverable = async () => {
    if (!deliverable?.content) return;
    try {
      await navigator.clipboard.writeText(deliverable.content);
      setCopiedDeliverable(true);
      setTimeout(() => setCopiedDeliverable(false), 2500);
    } catch (err) {
      console.error("Failed to copy deliverable:", err);
    }
  };

  // Progress percentage of completed steps
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = planResult?.phases.length || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-zinc-900/95 via-zinc-950 to-black p-4 sm:p-8 shadow-2xl shadow-indigo-950/40 space-y-6 relative overflow-hidden backdrop-blur-2xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 -z-10 h-64 w-[380px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-64 w-[380px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Crazy Simple AI Action Planner</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
          What do you want to achieve?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Tell us your goal. We give you the exact step-by-step tools, time to launch, and ready-to-copy prompts to execute today.
        </p>
      </div>

      {/* Main Input Box */}
      <form onSubmit={handleGenerate} className="space-y-4 max-w-3xl mx-auto">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl border-2 border-indigo-500/50 hover:border-indigo-500 bg-zinc-950 p-1.5 sm:p-2 shadow-xl focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10 transition-all">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Launch a faceless YouTube channel with $0 budget, or build a SaaS app..."
            aria-label="Describe what you want to achieve"
            disabled={loading}
            className="flex-1 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-base text-white placeholder-zinc-500 focus:outline-none min-w-0"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50 shrink-0 active:scale-95"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Creating Plan...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-cyan-300 fill-cyan-300" />
                <span>Create Action Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Clean, Simple Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400 px-1">
          {/* Quick Budget selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-500 font-medium">Budget:</span>
            {[
              { label: "Any", val: undefined },
              { label: "100% Free ($0)", val: 0 },
              { label: "< $30/mo", val: 30 },
              { label: "< $100/mo", val: 100 }
            ].map(b => (
              <button
                key={b.label}
                type="button"
                onClick={() => setBudget(b.val)}
                className={cn(
                  "px-2.5 py-1 rounded-lg border transition cursor-pointer text-[10px] sm:text-[11px] font-medium active:scale-95",
                  budget === b.val
                    ? "bg-indigo-600 text-white border-indigo-500 font-semibold"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                )}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Quick Skill selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-500 font-medium">Skill:</span>
            {[
              { id: "beginner", label: "Beginner" },
              { id: "intermediate", label: "Intermediate" },
              { id: "professional", label: "Pro" }
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSkillLevel(s.id as SkillLevel)}
                className={cn(
                  "px-2.5 py-1 rounded-lg border transition cursor-pointer text-[10px] sm:text-[11px] font-medium active:scale-95",
                  skillLevel === s.id
                    ? "bg-cyan-600 text-white border-cyan-500 font-semibold"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* 1-Click Popular Goal Cards (Crazy Simple & Fast!) */}
      <div className="space-y-2.5 max-w-3xl mx-auto pt-2">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 block px-1">
          Or tap a popular 1-click playbook:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {QUICK_GOAL_PRESETS.map(preset => {
            const Icon = preset.icon;
            const isSelected = goal === preset.goal;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={cn(
                  "p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer active:scale-95",
                  isSelected
                    ? "bg-indigo-950/70 border-indigo-500 shadow-md scale-[1.02]"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                )}
              >
                <div className="space-y-1 sm:space-y-1.5">
                  <div className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-xl border flex items-center justify-center", preset.color)}>
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-zinc-400 line-clamp-1 leading-tight">
                    {preset.desc}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-zinc-500">
                  <span>{preset.time}</span>
                  <span className="text-emerald-400 font-bold">{preset.cost}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 rounded-3xl border border-indigo-500/30 bg-zinc-950 text-center space-y-4 max-w-3xl mx-auto animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-cyan-400 flex items-center justify-center mx-auto animate-pulse">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Synthesizing Step-by-Step Action Plan</h4>
            <p className="text-xs text-zinc-400 mt-1">Screening 1,000+ verified AI tools & crafting ready-to-use prompts...</p>
          </div>
          <div className="w-48 h-1.5 bg-zinc-900 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-cyan-400 animate-pulse" />
          </div>
        </div>
      )}

      {/* RESULT DASHBOARD: CRAZY SIMPLE & CRAZY USEFUL */}
      {planResult && !loading && (
        <div className="space-y-6 pt-4 border-t border-zinc-800/80 animate-fade-in max-w-3xl mx-auto">
          {/* Action Plan Summary Bar */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/90 border border-indigo-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Action Plan Ready
                </span>
                <h3 className="text-base sm:text-xl font-bold text-white mt-1">
                  {planResult.phases.length}-Step Execution Roadmap
                </h3>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-between sm:justify-start gap-3 bg-zinc-950 px-3.5 py-1.5 sm:py-2 rounded-xl border border-zinc-800">
                <span className="text-xs text-zinc-400">Progress:</span>
                <span className="text-xs font-mono font-bold text-cyan-400">{completedCount}/{totalSteps} Done</span>
                <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-4 text-center">
              <div className="p-2 sm:p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono text-zinc-500 block truncate">Time to Launch</span>
                <span className="text-xs sm:text-base font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                  <span>~{planResult.estimatedHoursToLaunch || 2}h</span>
                </span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono text-zinc-500 block truncate">Estimated Cost</span>
                <span className="text-xs sm:text-base font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate">{planResult.totalEstimatedMonthlyCost === 0 ? "Free" : `$${planResult.totalEstimatedMonthlyCost}/mo`}</span>
                </span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono text-zinc-500 block truncate">Tools Needed</span>
                <span className="text-xs sm:text-base font-bold text-indigo-300 flex items-center justify-center gap-1 mt-0.5">
                  <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 shrink-0" />
                  <span>{planResult.phases.length} Tools</span>
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyBlueprint}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition cursor-pointer active:scale-95"
                >
                  {copiedBlueprint ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Plan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveStack}
                  disabled={savingStack}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Stack</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleGenerateLiveDeliverable}
                disabled={generatingDeliverable}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {generatingDeliverable ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>⚡ Generate with Kie.ai</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* STEP-BY-STEP ACTIONABLE ROADMAP */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-2 px-1">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Step-by-Step Execution Guide</span>
            </h4>

            <div className="space-y-3.5">
              {planResult.phases.map((phase, idx) => {
                const isDone = Boolean(completedSteps[phase.phaseNumber]);
                const isPromptCopied = Boolean(copiedPrompts[phase.phaseNumber]);

                return (
                  <div
                    key={phase.phaseNumber}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all duration-200 space-y-3 relative",
                      isDone
                        ? "bg-zinc-950/60 border-emerald-500/40 opacity-80"
                        : "bg-zinc-900/70 border-zinc-800 hover:border-indigo-500/40"
                    )}
                  >
                    {/* Step Title and Checkbox */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        {/* Interactive Mark as Done Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleStep(phase.phaseNumber)}
                          className={cn(
                            "w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer shrink-0 active:scale-90",
                            isDone
                              ? "bg-emerald-500 border-emerald-400 text-black font-bold"
                              : "border-zinc-700 bg-zinc-950 text-zinc-500 hover:border-indigo-500"
                          )}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-mono">{phase.phaseNumber}</span>}
                        </button>

                        <div className="min-w-0">
                          <h5 className={cn("text-xs sm:text-sm font-bold transition truncate", isDone ? "line-through text-zinc-500" : "text-white")}>
                            {phase.title}
                          </h5>
                          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 line-clamp-2">
                            {phase.howToExecute || phase.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 shrink-0">
                        ⏱️ ~{phase.estimatedMinutes || 20}m
                      </span>
                    </div>

                    {/* Tool Recommendation Pill */}
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ToolLogo name={phase.primaryTool.name} logoUrl={phase.primaryTool.logo} size="sm" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              href={`/tools/${phase.primaryTool.slug}`}
                              className="text-xs font-bold text-white hover:text-cyan-300 transition truncate"
                            >
                              {phase.primaryTool.name}
                            </Link>
                            <PricingBadge pricing={phase.primaryTool.pricing} />
                          </div>
                          <span className="text-[10px] text-zinc-500 block truncate">
                            {phase.primaryTool.tagline}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <a
                          href={phase.primaryTool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition active:scale-95"
                        >
                          <span>Open Tool</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Actionable Copyable Prompt (Crazy Useful & Mobile Safe!) */}
                    {phase.actionablePrompt && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span className="font-semibold text-zinc-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            Ready-to-Paste Prompt:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyPrompt(phase.phaseNumber, phase.actionablePrompt)}
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition cursor-pointer active:scale-95"
                          >
                            {isPromptCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Prompt</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-950/90 border border-zinc-800/80 text-[11px] sm:text-xs font-mono text-zinc-300 leading-relaxed overflow-x-auto break-words whitespace-pre-wrap select-all max-w-full">
                          {phase.actionablePrompt}
                        </div>
                      </div>
                    )}

                    {/* Free Alternative swap link */}
                    {phase.alternativeTool && (
                      <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] text-zinc-500">
                        <span className="truncate">
                          Alternative: <strong className="text-zinc-300">{phase.alternativeTool.name}</strong> ({phase.alternativeTool.pricing.model === "free" ? "Free" : `$${phase.alternativeTool.pricing.startingPrice || 0}/mo`})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSwapTool(idx)}
                          className="text-cyan-400 hover:text-cyan-300 transition font-medium cursor-pointer shrink-0"
                        >
                          Swap ⇄
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kie.ai Live Deliverable Viewer */}
          {generatingDeliverable && (
            <div className="p-6 rounded-2xl bg-zinc-950 border border-cyan-500/40 space-y-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                <div>
                  <h5 className="text-sm font-bold text-white">Generating Deliverable with Kie.ai</h5>
                  <p className="text-xs text-zinc-400">Constructing your initial script, template, or code deliverable...</p>
                </div>
              </div>
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-4/5 h-4 rounded" />
            </div>
          )}

          {deliverable && !generatingDeliverable && (
            <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-cyan-500/40 space-y-3 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <h5 className="text-sm font-bold text-white">
                    Generated Solution Deliverable
                  </h5>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyDeliverable}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-200 transition cursor-pointer"
                  >
                    {copiedDeliverable ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Deliverable</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliverable(null)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {deliverable.content}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
