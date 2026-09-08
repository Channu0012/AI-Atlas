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
  Key
} from "lucide-react";
import { PlanBlueprintSkeleton, Skeleton } from "@/components/ui/skeletons";

interface GoalPlannerCardProps {
  initialGoal?: string;
  initialBudget?: number;
  initialSkillLevel?: SkillLevel;
  compact?: boolean;
}

const PRESET_GOALS = [
  { label: "🎥 Faceless YouTube Automation", goal: "Launch an automated faceless YouTube channel for tech news", budget: 30, skill: "beginner" as SkillLevel },
  { label: "🚀 Full-Stack SaaS MVP", goal: "Build a rapid full-stack SaaS MVP web app for solopreneurs", budget: 50, skill: "intermediate" as SkillLevel },
  { label: "🔒 Private Offline AI Setup", goal: "Set up a private offline local AI paired with my code editor", budget: 0, skill: "professional" as SkillLevel },
  { label: "📬 B2B Cold Outreach Pipeline", goal: "Automate B2B lead discovery, enrichment, and cold email sequences", budget: 60, skill: "intermediate" as SkillLevel },
  { label: "📚 Academic Research Synthesis", goal: "Conduct peer-reviewed paper search, PDF data extraction, and literature review", budget: 20, skill: "beginner" as SkillLevel }
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

  // Kie.ai Multimodal Solution State
  const [solutionDeliverable, setSolutionDeliverable] = useState<any | null>(null);
  const [generatingSolution, setGeneratingSolution] = useState(false);
  const [solutionCopied, setSolutionCopied] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim()) {
      setError("Please describe your goal or select one of the battle-tested blueprints.");
      return;
    }

    setError(null);
    setLoading(true);

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
        throw new Error(data.error || "Failed to generate plan.");
      }

      const data = await res.json();
      setPlanResult(data.plan);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating your plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_GOALS[0]) => {
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
    <div className="rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -z-10 h-64 w-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-64 w-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Autonomous Goal Planner & Analyzer
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Kie.ai Multimodal Layer Active
          </div>
          <button
            type="button"
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="text-[11px] font-medium text-zinc-400 hover:text-white inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/60 transition"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>Kie.ai Key</span>
          </button>
        </div>

        {/* Optional Kie.ai Key Config Dropdown */}
        {showKeyConfig && (
          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/95 text-xs space-y-2.5 animate-in fade-in shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Kie.ai Multimodal API Configuration
              </span>
              <a
                href="https://kie.ai/api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 text-[11px]"
              >
                Manage Key on Kie.ai <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-zinc-400">
              Active Key: <code className="font-mono text-cyan-300 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">5eec2e84e297ce765d9c596cf17a721c</code>. You can also paste an alternate key:
            </p>
            <input
              type="text"
              placeholder="Paste custom Kie.ai API key"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Turn Any Project Goal into an Audited AI Execution Plan
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Deconstructs complex objectives into step-by-step phases, pairs verified flagship tools with budget-friendly alternatives, checks capability redundancies, and audits your monthly spend.
        </p>
      </div>

      {/* Preset Blueprint Pills */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          Or Start with a Tested Blueprint:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_GOALS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:border-indigo-500/40 hover:bg-indigo-500/10 text-zinc-300 hover:text-white transition"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-2">
            What are you trying to accomplish?
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            placeholder="e.g. Build an automated faceless YouTube channel producing weekly AI video essays with automated scripts, voices, and b-roll clips..."
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
          />
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Target Monthly Budget */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
              Monthly Budget (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
              <input
                type="number"
                min="0"
                step="5"
                value={budget !== undefined ? budget : ""}
                onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Any (e.g. 50)"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-8 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Skill Level */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
              Your Technical Skill
            </label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="beginner">Beginner (No-code / turnkey)</option>
              <option value="intermediate">Intermediate (Power user / APIs)</option>
              <option value="professional">Professional (Developer / terminal / local)</option>
            </select>
          </div>

          {/* Open Source Switch */}
          <div className="flex flex-col justify-end">
            <label className="inline-flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition">
              <input
                type="checkbox"
                checked={preferOpenSource}
                onChange={(e) => setPreferOpenSource(e.target.checked)}
                className="rounded border-zinc-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-zinc-950"
              />
              <span className="text-xs font-medium text-zinc-300">
                Prioritize Open Source / Local
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-indigo-500/25 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Analyzing Objectives & Capabilities...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Working AI Execution Plan
            </>
          )}
        </button>
      </form>

      {/* In-Place Blueprint Generation Skeleton */}
      {loading && (
        <div className="space-y-6 pt-6 border-t border-zinc-800/80 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold flex flex-wrap items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Analyzing Objectives, Calculating Constraints & Modeling Multi-Tool Phases...</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
              Deterministic Engine
            </span>
          </div>
          <PlanBlueprintSkeleton />
        </div>
      )}

      {/* Plan Results View */}
      {planResult && !loading && (
        <div className="space-y-6 pt-6 border-t border-zinc-800/80 animate-in fade-in duration-300">
          {/* Executive Plan Summary Banner */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                  Blueprint Generated
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {planResult.phases.length}-Phase Optimized Workflow
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-zinc-400 font-medium">Est. Monthly Cost</div>
                  <div className="text-xl font-bold font-mono text-white">
                    ${planResult.totalEstimatedMonthlyCost}
                    <span className="text-xs font-normal text-zinc-400">/mo</span>
                  </div>
                </div>

                {planResult.targetBudget !== undefined && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    planResult.isWithinBudget
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {planResult.isWithinBudget ? "Within Budget" : "Exceeds Budget"}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {planResult.summary}
            </p>
          </div>

          {/* Redundancy & Cost Optimizer Alert */}
          {planResult.redundancies && planResult.redundancies.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Subscription Redundancy Detected ({planResult.redundancies.length})</span>
              </div>
              <div className="space-y-1.5">
                {planResult.redundancies.map((r, idx) => (
                  <div key={idx} className="text-xs text-amber-200/90 leading-relaxed flex flex-wrap items-baseline gap-1.5">
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

          {/* Sequential Phases List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Execution Sequence & Assigned Tooling
            </h4>

            {planResult.phases.map((phase, idx) => (
              <div
                key={phase.phaseNumber}
                className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 transition space-y-4"
              >
                {/* Phase Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      {phase.phaseNumber}
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-white">
                        {phase.title}
                      </h5>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                    Cap: {phase.requiredCapability}
                  </span>
                </div>

                {/* Primary Tool Card */}
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
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
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        {phase.primaryTool.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-zinc-200">
                      {phase.estimatedCost === 0 ? (
                        <span className="text-emerald-400">Free Tier</span>
                      ) : (
                        `$${phase.estimatedCost}/mo`
                      )}
                    </span>

                    <a
                      href={phase.primaryTool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      title="Open tool website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Alternative Tool Option */}
                {phase.alternativeTool && (
                  <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-zinc-900/30 border border-zinc-800/40 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider shrink-0">
                        Alternative:
                      </span>
                      <span className="text-zinc-300 font-medium truncate">
                        {phase.alternativeTool.name} ({phase.alternativeTool.pricing.model === "free" ? "Free" : `$${phase.alternativeTool.pricing.startingPrice || 0}/mo`})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSwapTool(idx)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition shrink-0"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Swap Tool
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyBlueprint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Blueprint Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Markdown Blueprint
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveStack}
                disabled={savingStack}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition shadow-sm disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    Stack Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    {savingStack ? "Saving..." : "Save to My Stacks"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleGenerateLiveSolution}
                disabled={generatingSolution}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-semibold text-white transition shadow-sm disabled:opacity-50"
              >
                {generatingSolution ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Synthesizing with Kie.ai...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    ⚡ Generate Live Solution with Kie.ai
                  </>
                )}
              </button>
            </div>

            <Link
              href="/stacks"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-indigo-400 transition"
            >
              Open Full Stack Builder
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Multimodal Solution Synthesis Skeleton */}
          {generatingSolution && (
            <div className="p-6 rounded-2xl bg-zinc-950 border border-cyan-500/30 shadow-2xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Synthesizing Working Artifact via Kie.ai API</h5>
                  <p className="text-xs text-zinc-400">Executing multimodal pipeline, assembling deliverables, and verifying output...</p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-5/6 h-4 rounded" />
                <Skeleton className="w-2/3 h-4 rounded" />
              </div>
            </div>
          )}

          {/* Kie.ai Live Solution Deliverable Viewer */}
          {solutionDeliverable && !generatingSolution && (
            <div className="p-6 rounded-2xl bg-zinc-950 border border-cyan-500/30 shadow-2xl space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition"
                  >
                    {solutionCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Artifact
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
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {solutionDeliverable.content}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
