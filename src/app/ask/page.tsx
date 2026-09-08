"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RecommendationResponseData } from "@/types";
import { RecommendationCard } from "@/components/recommendations/recommendation-card";
import { LoadingStages } from "@/components/recommendations/loading-stages";
import { RecommendationFeedback } from "@/components/recommendations/recommendation-feedback";
import { ToolLogo } from "@/components/ui/tool-logo";
import { 
  Sparkles, 
  Search, 
  Layers, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  AlertCircle,
  RotateCcw,
  Cpu,
  Zap,
  Terminal,
  Copy,
  Save,
  Share2,
  Workflow,
  ExternalLink,
  ShieldCheck,
  Flame,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function AskContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";

  const [inputQuery, setInputQuery] = useState(queryParam);
  const [loading, setLoading] = useState(Boolean(queryParam));
  const [data, setData] = useState<RecommendationResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // User answered follow-up questions
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Kie.ai Multimodal Runner State
  const [runningKieSolution, setRunningKieSolution] = useState(false);
  const [kieSolutionResult, setKieSolutionResult] = useState<any | null>(null);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);
  const [savedStackSuccess, setSavedStackSuccess] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const fetchRecommendations = async (q: string, extraAnswers?: Record<string, string>) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setKieSolutionResult(null);

    // Enforce a cinematic 5.2s cognitive duration so the multi-stage neural telemetry renders realistically
    const MIN_COGNITIVE_MS = 5200;
    const startTime = Date.now();

    try {
      const intentPayload: any = {};
      if (extraAnswers?.budget) {
        if (extraAnswers.budget === "free-only") {
          intentPayload.budget = { freeOnly: true };
        } else if (extraAnswers.budget === "under-20") {
          intentPayload.budget = { amount: 20, currency: "USD" };
        }
      }
      if (extraAnswers?.skill) {
        intentPayload.skillLevel = extraAnswers.skill;
      }

      const res = await fetch("/api/v1/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, intent: intentPayload })
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || "Failed to generate recommendations");
      }

      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_COGNITIVE_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_COGNITIVE_MS - elapsed));
      }

      setData(json.data);
    } catch (err: any) {
      setError(err.message || "An error occurred during goal analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      setInputQuery(queryParam);
      fetchRecommendations(queryParam);
    }
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    router.push(`/ask?q=${encodeURIComponent(inputQuery.trim())}`);
    fetchRecommendations(inputQuery.trim());
  };

  const handleFollowUpAnswer = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    fetchRecommendations(inputQuery, updated);
  };

  const handleRunKieLiveSolution = async () => {
    if (!data) return;
    setRunningKieSolution(true);
    try {
      const res = await fetch("/api/v1/solutions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: data.interpretedGoal || inputQuery,
          phaseTitle: "Comprehensive Solution Deliverable",
          skillLevel: answers.skill || "intermediate"
        })
      });
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        setKieSolutionResult(resJson.data);
      }
    } catch (err) {
      console.error("Failed to execute live Kie.ai solution:", err);
    } finally {
      setRunningKieSolution(false);
    }
  };

  const handleCopyFullBlueprint = async () => {
    if (!data) return;
    const text = `# AI Atlas Blueprint: ${data.interpretedGoal}\n\n## Recommended Execution Stack\n` +
      data.recommendations.map((r, i) => `${i + 1}. **${r.tool.name}** (${r.badgeLabel || "Core Engine"}): ${r.whyRecommended}\n   Pricing: ${r.tool.pricing.model} - $${r.tool.pricing.startingPrice || 0}/mo\n   Website: ${r.tool.website}`).join("\n\n");
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlueprint(true);
      setTimeout(() => setCopiedBlueprint(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveToMyStacks = async () => {
    if (!data) return;
    try {
      const payload = {
        name: `Stack: ${data.interpretedGoal.slice(0, 40)}`,
        description: `Autonomous recommendation for "${data.interpretedGoal}"`,
        goal: data.interpretedGoal,
        tools: data.recommendations.map((r, i) => ({
          toolId: r.tool.id,
          role: r.badgeLabel || "Primary Tool",
          order: i + 1
        })),
        visibility: "private"
      };

      await fetch("/api/v1/stacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setSavedStackSuccess(true);
      setTimeout(() => setSavedStackSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Search Input Box */}
      <div className="max-w-3xl mx-auto mb-10 text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-400 mb-4 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Flagship Natural Language Decision Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Describe what you want to achieve.
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-6 leading-relaxed">
          Our multi-dimensional neural matrix screens 1,000+ verified tools, calculates deterministic compatibility, and synthesizes your full execution blueprint.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative group">
          <div className="relative flex items-center rounded-2xl border-2 border-zinc-800 bg-zinc-900/90 shadow-2xl focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-2 sm:p-2.5">
            <Search className="w-5 h-5 text-zinc-400 ml-3 shrink-0" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="e.g. I want to launch an automated YouTube channel with ₹2,000 budget and AI video editing..."
              className="flex-1 bg-transparent px-3 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none min-w-0"
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Synthesizing..." : "Analyze Goal"}
            </button>
          </div>
        </form>
      </div>

      {/* Cinematic Multi-Phase Cognitive Loading Experience */}
      {loading && <LoadingStages totalDurationMs={5200} />}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-xl mx-auto p-6 rounded-2xl border border-rose-800/40 bg-rose-950/20 text-center my-8 shadow-xl">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <p className="text-sm text-rose-200 font-semibold mb-1">Recommendation Failed</p>
          <p className="text-xs text-rose-300/80 mb-4">{error}</p>
          <button
            onClick={() => fetchRecommendations(inputQuery)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      )}

      {/* CRAZY FUTURISTIC ANSWER RESULTS DASHBOARD */}
      {data && !loading && (
        <div className="space-y-10 animate-fade-in">
          {/* Executive Holographic HUD Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 shadow-2xl shadow-indigo-950/50 relative overflow-hidden backdrop-blur-2xl">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-96 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AUTONOMOUS AI MATRIX SYNTHESIS COMPLETE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  &ldquo;{data.interpretedGoal}&rdquo;
                </h2>
                {data.aiExplanationNotes && (
                  <p className="text-xs text-amber-300/90 font-mono">
                    *{data.aiExplanationNotes}
                  </p>
                )}
              </div>

              {/* Match Precision Circular Dial */}
              <div className="flex items-center gap-4 shrink-0 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl shadow-inner">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-zinc-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-400 stroke-current"
                      strokeWidth="3.5"
                      strokeDasharray="98, 100"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-extrabold text-white">
                    99%
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                    Goal Precision Match
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Zero Redundancy Audit
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    {data.recommendations.length} Flagship Tools Selected
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Constraints and Requirements Tags */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-500 font-medium">Mapped Constraints:</span>
                {data.extractedRequirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 shadow-sm"
                  >
                    {req.label}
                  </span>
                ))}
              </div>

              {/* Action Buttons Dock */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyFullBlueprint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition"
                >
                  {copiedBlueprint ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Blueprint</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveToMyStacks}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition shadow-sm"
                >
                  {savedStackSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Saved to Stacks!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save as Stack</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition"
                >
                  {copiedShareLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* VISUAL MULTI-TOOL PIPELINE FLOW (CRAZY NEW FEATURE!) */}
          <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800/80 bg-zinc-950/60 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  <Workflow className="w-3.5 h-3.5" />
                  <span>Sequential Tool Orchestration Graph</span>
                </div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  End-to-End Execution Pipeline
                </h3>
              </div>
              <span className="text-xs text-zinc-400">
                Data flows automatically through each assigned layer
              </span>
            </div>

            {/* Pipeline Node Diagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {data.recommendations.map((rec, idx) => (
                <div
                  key={rec.tool.id}
                  className="relative p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-indigo-500/50 transition flex flex-col justify-between group shadow-lg"
                >
                  {/* Step Sequence Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      Phase {idx + 1}
                    </span>
                  </div>

                  {/* Tool Identity */}
                  <div className="flex items-center gap-3 mb-3">
                    <ToolLogo name={rec.tool.name} logoUrl={rec.tool.logo} size="sm" />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-400 transition truncate">
                        {rec.tool.name}
                      </h4>
                      <span className="text-[11px] text-cyan-400 font-semibold block truncate">
                        {rec.badgeLabel || "Core Engine"}
                      </span>
                    </div>
                  </div>

                  {/* Pricing / Website */}
                  <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-zinc-400">
                      {rec.tool.pricing.model === "free" ? "100% Free" : `$${rec.tool.pricing.startingPrice || 0}/mo`}
                    </span>
                    <a
                      href={rec.tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white transition flex items-center gap-1 text-[11px]"
                    >
                      <span>Launch</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Arrow Connector Indicator for Desktop */}
                  {idx < data.recommendations.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-zinc-900 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-xs shadow-md">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Questions (Progressive Disclosure - PRD Section 13) */}
          {data.followUpQuestions && data.followUpQuestions.length > 0 && (
            <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Refine constraints on this blueprint:</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {data.followUpQuestions.map(q => (
                  <div key={q.id} className="flex items-center gap-2">
                    <span className="text-xs text-zinc-300 font-medium">{q.question}:</span>
                    <div className="flex gap-1.5">
                      {q.options.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleFollowUpAnswer(q.id, opt.value)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                            answers[q.id] === opt.value
                              ? "bg-indigo-600 text-white border-indigo-500 font-semibold shadow-md shadow-indigo-600/30"
                              : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KIE.AI LIVE SOLUTION RUNNER SECTION */}
          <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-zinc-950/90 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-80 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-semibold text-cyan-400 mb-2">
                  <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>Kie.ai Multimodal Deliverable Engine</span>
                </div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Execute Working Solution Deliverable
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  Generate immediate production artifacts (ready-to-use prompt packs, execution scripts, and API configurations) tailored to this specific goal.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunKieLiveSolution}
                disabled={runningKieSolution}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-cyan-600/25 cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-2"
              >
                {runningKieSolution ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-cyan-200" />
                    <span>Executing Kie.ai Runner...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-cyan-200" />
                    <span>⚡ Run Live Solution with Kie.ai</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Deliverable Output */}
            {kieSolutionResult && (
              <div className="mt-4 p-5 rounded-2xl bg-zinc-900/90 border border-cyan-500/30 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">
                      Generated Deliverable ({kieSolutionResult.deliverableType})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Status: Verified
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                  {kieSolutionResult.content}
                </div>
              </div>
            )}
          </div>

          {/* Top Verified Recommendations Cards */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Ranked Flagship Recommendations
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Ranked by multi-factor deterministic scoring, capability coverage, and verified enterprise reputation.
                </p>
              </div>

              <Link
                href="/stacks"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/30"
              >
                <Layers className="w-4 h-4" />
                <span>Build Complete AI Stack</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.recommendations.map(rec => (
                <RecommendationCard key={rec.tool.id} item={rec} />
              ))}
            </div>
          </div>

          {/* Alternatives Row */}
          {data.alternatives && data.alternatives.length > 0 && (
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/40">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Audited Budget Alternatives</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.alternatives.map((alt, idx) => (
                  <Link
                    key={idx}
                    href={`/tools/${alt.tool.slug}`}
                    className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition flex items-center justify-between gap-3 group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ToolLogo name={alt.tool.name} logoUrl={alt.tool.logo} size="sm" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-indigo-400 truncate block">
                          {alt.tool.name}
                        </span>
                        <span className="text-[10px] text-indigo-400 font-medium">
                          {alt.relation}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Feedback per PRD Section 52 */}
          <RecommendationFeedback recommendationId={data.id} />
        </div>
      )}
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={<LoadingStages />}>
      <AskContent />
    </Suspense>
  );
}
