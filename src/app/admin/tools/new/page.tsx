"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Check, AlertCircle } from "lucide-react";

export default function AdminNewToolPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("cat-coding");
  const [pricingModel, setPricingModel] = useState<"free" | "freemium" | "paid">("freemium");
  const [startingPrice, setStartingPrice] = useState(20);
  const [freePlan, setFreePlan] = useState(true);
  const [hasApi, setHasApi] = useState(true);
  const [openSource, setOpenSource] = useState(false);
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "professional">("intermediate");
  const [strengths, setStrengths] = useState("High reasoning fidelity\nClean UI integration");
  const [limitations, setLimitations] = useState("Rate limits apply on free tier");
  const [status, setStatus] = useState<"published" | "draft">("published");

  // Verification Checklist
  const [websiteChecked, setWebsiteChecked] = useState(true);
  const [pricingChecked, setPricingChecked] = useState(true);
  const [featuresChecked, setFeaturesChecked] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const now = new Date().toISOString();

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tagline,
      description,
      website,
      company: { name: companyName || name },
      categoryIds: [category],
      capabilityIds: ["text-generation", "code-generation"],
      useCaseIds: ["uc-build-website"],
      targetUsers: ["developer", "founder"],
      features: ["Full codebase assistance", "Multi-file diff refactoring"],
      pricing: {
        model: pricingModel,
        freePlan,
        freeTrial: false,
        startingPrice: Number(startingPrice) || 0,
        currency: "USD",
        billingPeriod: "monthly"
      },
      platforms: { web: true, ios: false, android: false, windows: true, mac: true, linux: true },
      api: { available: hasApi },
      openSource,
      difficulty,
      strengths: strengths.split("\n").map(s => s.trim()).filter(Boolean),
      limitations: limitations.split("\n").map(l => l.trim()).filter(Boolean),
      integrations: ["VS Code", "Git"],
      supportedLanguages: ["English"],
      verification: {
        status: websiteChecked && pricingChecked && featuresChecked ? "verified" : "needs-review",
        websiteChecked,
        pricingChecked,
        featuresChecked,
        lastVerifiedAt: now,
        pricingCheckedAt: now,
        featuresCheckedAt: now,
        websiteCheckedAt: now
      },
      metrics: { viewCount: 10, saveCount: 1, outboundClickCount: 0 },
      status
    };

    try {
      const res = await fetch("/api/v1/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || "Failed to create tool");
      }

      router.push("/admin/tools");
    } catch (err: any) {
      setError(err.message || "Failed to create tool");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
        <div>
          <Link
            href="/admin/tools"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tools</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create Verified Tool Record
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Admin tool editor per PRD Section 44 with verification checklist and audit logs.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-800/40 bg-rose-950/20 text-xs text-rose-300 flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section: Basic Identity */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Tool Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Cursor"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cursor"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Website URL *</label>
              <input
                type="url"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://cursor.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Parent Company</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Anysphere"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">One-line Tagline *</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="The AI-first code editor designed for pair-programming at lightspeed."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Full Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive architectural overview of capabilities..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Section: Pricing & Specs */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Pricing & Target Users</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Pricing Model</label>
              <select
                value={pricingModel}
                onChange={(e) => setPricingModel(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="free">100% Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Starting Price ($/mo)</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Target Skill Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={freePlan}
                onChange={(e) => setFreePlan(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-0"
              />
              <span>Includes permanent free tier</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasApi}
                onChange={(e) => setHasApi(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-0"
              />
              <span>Developer API available</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={openSource}
                onChange={(e) => setOpenSource(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-0"
              />
              <span>Open Source code repository</span>
            </label>
          </div>
        </div>

        {/* Section: Strengths & Limitations */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Factual Trade-Offs</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Strengths (one per line)</label>
              <textarea
                rows={3}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Limitations (one per line)</label>
              <textarea
                rows={3}
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section: Verification Checklist (PRD Section 44) */}
        <div className="p-6 rounded-2xl border border-emerald-900/40 bg-emerald-950/10 space-y-4">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">4. Verification Audit Checklist</h2>

          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={websiteChecked}
                onChange={(e) => setWebsiteChecked(e.target.checked)}
                className="w-4 h-4 rounded border-emerald-700 bg-zinc-950 text-emerald-500 focus:ring-0"
              />
              <span>Website URL reachable and active</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={pricingChecked}
                onChange={(e) => setPricingChecked(e.target.checked)}
                className="w-4 h-4 rounded border-emerald-700 bg-zinc-950 text-emerald-500 focus:ring-0"
              />
              <span>Pricing model and starting prices audited against vendor pricing page</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={featuresChecked}
                onChange={(e) => setFeaturesChecked(e.target.checked)}
                className="w-4 h-4 rounded border-emerald-700 bg-zinc-950 text-emerald-500 focus:ring-0"
              />
              <span>Features, platforms, and API verified</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Publication Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="published">Published</option>
              <option value="draft">Draft (Unlisted)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving to Database..." : "Save & Publish Tool"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
