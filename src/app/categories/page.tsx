import React from "react";
import Link from "next/link";
import { Repository } from "@/lib/db/repository";
import { 
  Layers, 
  ArrowRight, 
  Code2, 
  Video, 
  Mic, 
  Palette, 
  Search, 
  FileText, 
  Workflow, 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Database, 
  Headphones, 
  GraduationCap, 
  Scale, 
  Maximize2 
} from "lucide-react";

export const dynamic = "force-dynamic";

const ICON_MAP: Record<string, any> = {
  "Code2": Code2,
  "Video": Video,
  "Mic": Mic,
  "Palette": Palette,
  "Search": Search,
  "FileText": FileText,
  "Workflow": Workflow,
  "Bot": Bot,
  "Sparkles": Sparkles,
  "TrendingUp": TrendingUp,
  "Cpu": Cpu,
  "Database": Database,
  "Headphones": Headphones,
  "GraduationCap": GraduationCap,
  "Scale": Scale,
  "Maximize2": Maximize2
};

export default async function CategoriesPage() {
  const categories = await Repository.getCategories();
  const capabilities = await Repository.getCapabilities();
  const tools = await Repository.getPublishedTools();

  const parents = categories.filter(c => !c.parentId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>AI Atlas Taxonomy Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            16 AI Domains & 28 Capabilities
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Categories classify the technological domain where a tool belongs; capabilities define atomic execution tasks. Browse all 91+ verified tools mapped across both axes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tools"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <span>All 91 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 16 Category Sectors */}
      <div className="space-y-8">
        {parents.map(parent => {
          const subcategories = categories.filter(c => c.parentId === parent.id);
          const parentTools = tools.filter(t => t.categoryIds.includes(parent.id));
          const IconComponent = parent.icon && ICON_MAP[parent.icon] ? ICON_MAP[parent.icon] : Sparkles;

          return (
            <div 
              key={parent.id} 
              className="p-8 rounded-3xl glass-panel border border-zinc-800/80 hover:border-zinc-700/80 transition shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                      {parent.name}
                      <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {parentTools.length} tools
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">{parent.description}</p>
                  </div>
                </div>

                <Link
                  href={`/tools?category=${parent.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition py-1.5 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 self-start sm:self-auto"
                >
                  <span>View All in Domain ({parentTools.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Sample Tools In This Category */}
              {parentTools.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800/60">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 block mb-2.5">
                    Featured Tools in Domain:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {parentTools.slice(0, 7).map(t => (
                      <Link
                        key={t.id}
                        href={`/tools/${t.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 text-xs font-medium text-zinc-200 hover:text-white transition"
                      >
                        <span>{t.name}</span>
                        {t.pricing.model === "free" && (
                          <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-400 font-mono">Free</span>
                        )}
                        {t.openSource && (
                          <span className="text-[9px] px-1 rounded bg-teal-500/20 text-teal-400 font-mono">OSS</span>
                        )}
                      </Link>
                    ))}
                    {parentTools.length > 7 && (
                      <Link
                        href={`/tools?category=${parent.slug}`}
                        className="inline-flex items-center text-xs text-zinc-500 hover:text-indigo-400 px-2 py-1 font-mono transition"
                      >
                        +{parentTools.length - 7} more
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Subcategories (if any) */}
              {subcategories.length > 0 && (
                <div className="mt-6 pt-4 border-t border-zinc-800/60">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 block mb-2.5">
                    Sub-Disciplines:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {subcategories.map(sub => {
                      const subCount = tools.filter(t => t.categoryIds.includes(sub.id)).length;
                      return (
                        <Link
                          key={sub.id}
                          href={`/tools?category=${sub.slug}`}
                          className="p-4 rounded-xl glass-card hover:border-indigo-500/30 transition flex flex-col justify-between"
                        >
                          <div>
                            <h3 className="text-xs font-bold text-zinc-100 mb-1">{sub.name}</h3>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{sub.description}</p>
                          </div>
                          <span className="text-[10px] font-mono text-indigo-400 mt-3 block">
                            {subCount} indexed tools →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 28 Capabilities Matrix */}
      <section className="mt-20 pt-12 border-t border-zinc-800">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atomic Skill Breakdown</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            28 Atomic AI Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Click any capability to immediately filter tools that can perform that exact task.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {capabilities.map(cap => {
            const count = tools.filter(t => t.capabilityIds.includes(cap.id)).length;
            return (
              <Link
                key={cap.id}
                href={`/tools?capability=${cap.slug}`}
                className="p-4 rounded-2xl glass-card hover:border-cyan-500/40 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-bold text-zinc-100 group-hover:text-cyan-300 transition">
                      {cap.name}
                    </h3>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {count}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-zinc-500 group-hover:text-cyan-400 transition font-mono">
                  <span>View matching tools</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
