"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationFeedbackProps {
  recommendationId: string;
}

export const RecommendationFeedback: React.FC<RecommendationFeedbackProps> = ({ recommendationId }) => {
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string | null>(null);

  const handleFeedback = async (type: "helpful" | "not_relevant" | "wrong_budget" | "wrong_capability" | "too_difficult" | "other") => {
    setFeedbackType(type);
    setSubmitted(true);

    try {
      await fetch(`/api/v1/recommendations/${recommendationId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackType: type })
      });
    } catch (err) {
      console.warn("Feedback submission error:", err);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
        <Check className="w-4 h-4 text-emerald-400" />
        <span>Thank you for your feedback! This continuously refines our ranking weights.</span>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 max-w-xl mx-auto my-6 text-center">
      <p className="text-xs font-semibold text-zinc-300 mb-3">
        Was this recommendation useful?
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => handleFeedback("helpful")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-emerald-600/20 text-zinc-300 hover:text-emerald-300 border border-zinc-700 transition"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful
        </button>

        <button
          onClick={() => handleFeedback("wrong_budget")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
        >
          Wrong Budget
        </button>

        <button
          onClick={() => handleFeedback("wrong_capability")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
        >
          Wrong Capability
        </button>

        <button
          onClick={() => handleFeedback("too_difficult")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
        >
          Too Difficult
        </button>

        <button
          onClick={() => handleFeedback("not_relevant")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-rose-600/20 text-zinc-300 hover:text-rose-300 border border-zinc-700 transition"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          Not Relevant
        </button>
      </div>
    </div>
  );
};
