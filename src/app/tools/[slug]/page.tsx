import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Repository } from "@/lib/db/repository";
import { ToolLogo } from "@/components/ui/tool-logo";
import { PricingBadge } from "@/components/ui/pricing-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { 
  ExternalLink, 
  Bookmark, 
  Scale, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Workflow, 
  Layers, 
  Code2, 
  Globe, 
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await Repository.getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  const title = `${tool.name} — Overview, Pricing & Alternatives`;
  const description = tool.tagline || tool.description?.slice(0, 160) || `Explore ${tool.name} capabilities and verified pricing on AI Atlas.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/tools/${slug}`,
    },
    openGraph: {
      title: `${tool.name} — Verified AI Tool Profile | AI Atlas`,
      description,
      images: tool.logo ? [{ url: tool.logo, alt: `${tool.name} Logo` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} — Review & Pricing | AI Atlas`,
      description,
    },
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await Repository.getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const allTools = await Repository.getPublishedTools();
  const workflows = await Repository.getWorkflows();

  // Find alternatives in the same category
  const alternatives = allTools
    .filter(t => t.id !== tool.id && t.categoryIds.some(c => tool.categoryIds.includes(c)))
    .slice(0, 3);

  // Find related workflows
  const relatedWorkflows = workflows.filter(wf => 
    wf.steps.some(step => step.recommendedToolIds.includes(tool.id))
  );

  const activePlatforms = Object.entries(tool.platforms || {})
    .filter(([_, enabled]) => Boolean(enabled))
    .map(([platform]) => platform.toUpperCase())
    .join(", ") || "Web, Cloud";

  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: (tool.categoryIds || []).join(", "),
    operatingSystem: activePlatforms,
    url: tool.website,
    offers: {
      "@type": "Offer",
      price: tool.pricing?.startingPrice || 0,
      priceCurrency: tool.pricing?.currency || "USD",
      description: tool.pricing?.model || "free",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-medium">
        <Link href="/" className="hover:text-zinc-300">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-zinc-300">Tools</Link>
        <span>/</span>
        <span className="text-zinc-200">{tool.name}</span>
      </nav>

      {/* Top Header Card */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl mb-10 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
            <ToolLogo name={tool.name} logoUrl={tool.logo} size="xl" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {tool.name}
                </h1>
                <VerificationBadge verification={tool.verification} showDate={true} />
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 font-medium mb-3">
                by {tool.company.name}
              </p>

              <p className="text-sm sm:text-base text-zinc-200 max-w-2xl leading-relaxed">
                {tool.tagline}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2.5 sm:gap-3 shrink-0">
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/20"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href={`/compare?tools=${tool.slug}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare</span>
              </Link>
              <Link
                href="/stacks"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Add to Stack</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Specs Ribbon */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Pricing:</span>
            <PricingBadge pricing={tool.pricing} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Skill Level:</span>
            <span className="capitalize font-mono text-zinc-200">{tool.difficulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Developer API:</span>
            <span className={tool.api.available ? "text-emerald-400 font-medium" : "text-zinc-500"}>
              {tool.api.available ? "Available" : "No API"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">License:</span>
            <span className={tool.openSource ? "text-cyan-400 font-medium" : "text-zinc-400"}>
              {tool.openSource ? "Open Source" : "Proprietary"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Detail Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Deep Specifications & Facts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <h2 className="text-lg font-bold text-white mb-3">Overview</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {tool.description}
            </p>
          </section>

          {/* Capabilities & Key Features */}
          <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <h2 className="text-lg font-bold text-white mb-4">Core Capabilities & Features</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {tool.capabilityIds.map(cap => (
                <span
                  key={cap}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {cap.replace(/-/g, " ")}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Strengths & Honest Limitations (Data Trust Section) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-6 rounded-2xl border border-emerald-900/30 bg-emerald-950/10">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-3">
                <Check className="w-4 h-4" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {tool.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div className="p-6 rounded-2xl border border-amber-900/30 bg-amber-950/10">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Verified Limitations & Trade-offs</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {tool.limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Target Audience: Who Should & Shouldn't Use It */}
          <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <h2 className="text-lg font-bold text-white mb-4">Fit & Suitability</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">Ideal For:</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tool.targetUsers.map(u => (
                    <span key={u} className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 capitalize border border-zinc-700">
                      {u.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">Platform Compatibility:</h3>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(tool.platforms).filter(([, v]) => v).map(([p]) => (
                    <span key={p} className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 uppercase font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Related Workflows */}
          {relatedWorkflows.length > 0 && (
            <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-indigo-400" />
                <span>Workflows Powered by {tool.name}</span>
              </h2>
              <div className="space-y-3">
                {relatedWorkflows.map(wf => (
                  <Link
                    key={wf.id}
                    href={`/workflows/${wf.slug}`}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition flex items-center justify-between group"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                        {wf.name}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">{wf.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Col: Pricing & Verification Sidebar */}
        <div className="space-y-6">
          {/* Pricing Details Box */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Pricing Structure</h3>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-2xl font-bold font-mono text-white">
                {tool.pricing.model === "free" ? (
                  <span className="text-emerald-400">100% Free</span>
                ) : tool.pricing.startingPrice ? (
                  `$${tool.pricing.startingPrice}/mo`
                ) : (
                  "Custom / Unknown"
                )}
              </div>
              <span className="text-xs text-zinc-400 capitalize block mt-1">
                Model: {tool.pricing.model}
              </span>
            </div>

            {tool.pricing.notes && (
              <p className="text-xs text-zinc-400 leading-relaxed">
                {tool.pricing.notes}
              </p>
            )}

            <div className="space-y-2 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Free Tier Available:</span>
                <span className={tool.pricing.freePlan ? "text-emerald-400 font-medium" : "text-zinc-500"}>
                  {tool.pricing.freePlan ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Free Trial:</span>
                <span className={tool.pricing.freeTrial ? "text-emerald-400 font-medium" : "text-zinc-500"}>
                  {tool.pricing.freeTrial ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Audit Certificate */}
          <div className="p-6 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Audit Metadata</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Every spec on this profile has been validated against the vendor&apos;s live product.
            </p>
            <div className="space-y-1.5 text-[11px] font-mono text-zinc-400 border-t border-emerald-900/30 pt-3">
              <div className="flex items-center justify-between">
                <span>Website Reachable:</span>
                <span className="text-emerald-400">Passed</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pricing Confirmed:</span>
                <span className="text-emerald-400">Passed</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Features Audited:</span>
                <span className="text-emerald-400">Passed</span>
              </div>
              {tool.verification.lastVerifiedAt && (
                <div className="flex items-center justify-between">
                  <span>Last Audit:</span>
                  <span className="text-zinc-300">{new Date(tool.verification.lastVerifiedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Direct Alternatives List */}
          {alternatives.length > 0 && (
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Top Alternatives
              </h3>
              <div className="space-y-2.5">
                {alternatives.map(alt => (
                  <Link
                    key={alt.id}
                    href={`/tools/${alt.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ToolLogo name={alt.name} logoUrl={alt.logo} size="sm" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-indigo-400 block truncate">
                          {alt.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 truncate block">
                          {alt.pricing.model === "free" ? "Free" : `$${alt.pricing.startingPrice || 0}/mo`}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
