"use client";

import React, { useState } from "react";
import { PlusCircle, Check, AlertCircle, ShieldCheck, ArrowRight } from "lucide-react";

export default function SubmitToolPage() {
  const [toolName, setToolName] = useState("");
  const [website, setWebsite] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("cat-writing");
  const [pricingModel, setPricingModel] = useState<"free" | "freemium" | "paid">("freemium");
  const [startingPrice, setStartingPrice] = useState<number>(20);
  const [openSource, setOpenSource] = useState(false);
  const [contactEmail, setContactEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ isDuplicate: boolean; text: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResultMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/tool-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName,
          website,
          tagline,
          description,
          categoryIds: [category],
          pricingModel,
          startingPrice: Number(startingPrice) || 0,
          openSource,
          platforms: ["web"],
          contactEmail
        })
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || "Failed to submit tool");
      }

      setResultMessage({
        isDuplicate: json.data.isDuplicate,
        text: json.data.message
      });

      // Reset form
      setToolName("");
      setWebsite("");
      setTagline("");
      setDescription("");
      setContactEmail("");
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Process</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Submit an AI Tool for Verification
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl mx-auto leading-relaxed">
          We do not publish unverified AI tools or simulated specs. Submissions undergo automated duplicate checks and manual feature verification before publication.
        </p>
      </div>

      {resultMessage ? (
        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Submission Received</h2>
          <p className="text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
            {resultMessage.text}
          </p>
          <button
            onClick={() => setResultMessage(null)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
          >
            Submit Another Tool
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl border border-rose-800/40 bg-rose-950/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Tool Name *</label>
              <input
                type="text"
                required
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="e.g. Acme AI"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Official Website URL *</label>
              <input
                type="url"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">One-line Tagline *</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. State-of-the-art conversational AI code assistant."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Comprehensive Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the core capabilities, architecture, and exact use cases..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Primary Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="cat-coding">AI Coding</option>
                <option value="cat-writing">AI Writing & Chat</option>
                <option value="cat-video">AI Video</option>
                <option value="cat-research">AI Research</option>
                <option value="cat-design">AI Design</option>
                <option value="cat-audio">AI Audio</option>
                <option value="cat-automation">AI Automation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Pricing Model</label>
              <select
                value={pricingModel}
                onChange={(e) => setPricingModel(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="free">100% Free</option>
                <option value="freemium">Freemium (Free tier available)</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Starting Price ($ USD/mo)</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                min={0}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={openSource}
                onChange={(e) => setOpenSource(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-0"
              />
              <span>This tool is Open Source</span>
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Submitter Contact Email *</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-md disabled:opacity-50"
          >
            {submitting ? "Submitting for Verification..." : "Submit Tool for Verification"}
          </button>
        </form>
      )}
    </div>
  );
}
