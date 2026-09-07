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
  RotateCcw
} from "lucide-react";
import Link from "next/link";

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

  const fetchRecommendations = async (q: string, extraAnswers?: Record<string, string>) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);

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
      setData(json.data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Search Input Box */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-indigo-400 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flagship Natural Language Decision Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
          Describe what you want to achieve.
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative group">
          <div className="relative flex items-center rounded-2xl border-2 border-zinc-800 bg-zinc-900/90 shadow-2xl focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-2">
            <Search className="w-5 h-5 text-zinc-400 ml-3 shrink-0" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="e.g. I want to launch an AI YouTube channel, I'm a beginner with ₹2000 budget..."
              className="flex-1 bg-transparent px-3 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none min-w-0"
            />
            <button
              type="submit"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition"
            >
              Analyze Goal
            </button>
          </div>
        </form>
      </div>

      {/* Loading Stages Experience */}
      {loading && <LoadingStages />}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-xl mx-auto p-6 rounded-2xl border border-rose-800/40 bg-rose-950/20 text-center my-8">
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

      {/* Results View */}
      {data && !loading && (
        <div className="space-y-10 animate-fade-in">
          {/* Header Summary & Extracted Chips */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs text-zinc-400 font-mono block mb-1">Interpreted Goal</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                &ldquo;{data.interpretedGoal}&rdquo;
              </h2>
              {data.aiExplanationNotes && (
                <p className="text-xs text-amber-400/90 mt-1">
                  *{data.aiExplanationNotes}
                </p>
              )}
            </div>

            {/* Extracted Requirement Chips */}
            <div className="flex flex-wrap gap-1.5 max-w-md">
              {data.extractedRequirements.map((req, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                >
                  {req.label}
                </span>
              ))}
            </div>
          </div>

          {/* Follow-up Questions (Progressive Disclosure - PRD Section 13) */}
          {data.followUpQuestions && data.followUpQuestions.length > 0 && (
            <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Refine your recommendation:</span>
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
                          className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                            answers[q.id] === opt.value
                              ? "bg-indigo-600 text-white border-indigo-500 font-semibold"
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

          {/* Top Recommendations Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Top Verified Recommendations
                </h3>
                <p className="text-xs text-zinc-400">
                  Ranked by multi-factor deterministic scoring and capability coverage.
                </p>
              </div>

              {/* Build Stack CTA */}
              <Link
                href="/stacks"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md"
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
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Relevant Alternatives
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.alternatives.map((alt, idx) => (
                  <Link
                    key={idx}
                    href={`/tools/${alt.tool.slug}`}
                    className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition flex items-center justify-between gap-3 group"
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

          {/* Suggested Workflow CTA */}
          {data.suggestedWorkflow && (
            <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider block mb-1">
                  Pre-Structured Pipeline Available
                </span>
                <h4 className="text-base font-bold text-white mb-1">
                  {data.suggestedWorkflow.name} ({data.suggestedWorkflow.steps.length} Steps)
                </h4>
                <p className="text-xs text-zinc-300">
                  {data.suggestedWorkflow.description}
                </p>
              </div>
              <Link
                href={`/workflows/${data.suggestedWorkflow.slug}`}
                className="shrink-0 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
              >
                View Workflow Blueprint
              </Link>
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
