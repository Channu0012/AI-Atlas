"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Tool, Category } from "@/types";
import { ToolCard } from "@/components/tools/tool-card";
import { FilterPanel } from "@/components/tools/filter-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  ExternalLink,
  Plus,
  Check
} from "lucide-react";

function ToolsDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters State
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(searchParams.get("category") || undefined);
  const [selectedPricing, setSelectedPricing] = useState<string | undefined>(undefined);
  const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>(undefined);
  const [hasApi, setHasApi] = useState(false);
  const [isOpenSource, setIsOpenSource] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "verified" | "name" | "saves">("relevance");

  // Multi-tool compare tracking
  const [comparingIds, setComparingIds] = useState<string[]>([]);

  // Fetch tools from API based on active filters
  const fetchTools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedPricing) params.set("pricing", selectedPricing);
      if (selectedPlatform) params.set("platform", selectedPlatform);
      if (selectedDifficulty) params.set("difficulty", selectedDifficulty);
      if (hasApi) params.set("hasApi", "true");
      if (isOpenSource) params.set("openSource", "true");
      if (verifiedOnly) params.set("verifiedOnly", "true");
      params.set("sortBy", sortBy);
      params.set("limit", "200");

      const res = await fetch(`/api/v1/tools?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setTools(json.data.tools);
      }
    } catch (err) {
      console.warn("Failed to fetch tools:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load for categories
  useEffect(() => {
    fetch("/api/v1/categories")
      .then(res => res.json())
      .then(json => {
        if (json.success) setCategories(json.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTools();
    }, 200);
    return () => clearTimeout(timer);
  }, [
    query,
    selectedCategory,
    selectedPricing,
    selectedPlatform,
    selectedDifficulty,
    hasApi,
    isOpenSource,
    verifiedOnly,
    sortBy
  ]);

  const handleResetAll = () => {
    setQuery("");
    setSelectedCategory(undefined);
    setSelectedPricing(undefined);
    setSelectedPlatform(undefined);
    setSelectedDifficulty(undefined);
    setHasApi(false);
    setIsOpenSource(false);
    setVerifiedOnly(false);
    setSortBy("relevance");
  };

  const toggleCompare = (toolId: string) => {
    if (comparingIds.includes(toolId)) {
      setComparingIds(comparingIds.filter(id => id !== toolId));
    } else {
      if (comparingIds.length >= 4) {
        alert("You can compare a maximum of 4 tools simultaneously.");
        return;
      }
      setComparingIds([...comparingIds, toolId]);
    }
  };

  const quickFilterPills = [
    { label: "All", category: undefined, openSource: false, free: false },
    { label: "⚡ Coding & Dev", category: "ai-coding", openSource: false, free: false },
    { label: "🎬 Video & Motion", category: "ai-video", openSource: false, free: false },
    { label: "✨ 100% Free / Open Source", category: undefined, openSource: true, free: false },
    { label: "🤖 Autonomous Agents", category: "autonomous-agents", openSource: false, free: false },
    { label: "🔬 Research & Papers", category: "ai-research", openSource: false, free: false },
    { label: "🎨 3D & Design", category: "ai-design-images", openSource: false, free: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header with High-Tech Atmosphere */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>91+ Verified AI Tools Indexed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Discover Verified AI Tools
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Filter through factual specifications, verified capabilities, honest limitations, and zero hallucinated pricing tiers.
          </p>
        </div>

        {/* Compare tray bar if tools are selected */}
        {comparingIds.length > 0 && (
          <div className="flex items-center gap-3 p-2 px-4 rounded-xl bg-indigo-950/90 border border-indigo-500/40 shadow-lg shadow-indigo-500/10">
            <span className="text-xs text-indigo-300 font-medium">
              {comparingIds.length} tools selected
            </span>
            <button
              onClick={() => router.push(`/compare?tools=${comparingIds.join(",")}`)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
            >
              Compare Side-by-Side
            </button>
            <button
              onClick={() => setComparingIds([])}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Quick Filter Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none no-scrollbar">
        {quickFilterPills.map((pill, idx) => {
          const isSelected = 
            (pill.category === undefined && pill.openSource === false && selectedCategory === undefined && !isOpenSource) ||
            (pill.category && selectedCategory === pill.category) ||
            (pill.openSource && isOpenSource);

          return (
            <button
              key={idx}
              onClick={() => {
                if (pill.openSource) {
                  setIsOpenSource(true);
                  setSelectedCategory(undefined);
                } else {
                  setIsOpenSource(false);
                  setSelectedCategory(pill.category);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "glass-pill text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Sidebar Filters + Tools Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 h-fit sticky top-24">
          <FilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedPricing={selectedPricing}
            onSelectPricing={setSelectedPricing}
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            hasApi={hasApi}
            onToggleApi={() => setHasApi(!hasApi)}
            isOpenSource={isOpenSource}
            onToggleOpenSource={() => setIsOpenSource(!isOpenSource)}
            verifiedOnly={verifiedOnly}
            onToggleVerifiedOnly={() => setVerifiedOnly(!verifiedOnly)}
            onResetAll={handleResetAll}
          />
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search bar, View Switcher & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 91+ verified tools by name, feature, company..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Grid / List View Toggle */}
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition ${viewMode === "grid" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="Compact List View"
                  className={`p-1.5 rounded-lg transition ${viewMode === "list" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>

              {/* Sort selector */}
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="relevance">Popularity</option>
                  <option value="verified">Recently Verified</option>
                  <option value="saves">Community Saves</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result Count Banner */}
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>
              Showing <strong className="text-zinc-200">{tools.length}</strong> matching tools
            </span>
            {(selectedCategory || selectedPricing || selectedPlatform || hasApi || isOpenSource || verifiedOnly || query) && (
              <button
                onClick={handleResetAll}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFiltersOpen && (
            <div className="lg:hidden p-5 rounded-xl border border-zinc-800 bg-zinc-900 mb-6">
              <FilterPanel
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(c) => { setSelectedCategory(c); setMobileFiltersOpen(false); }}
                selectedPricing={selectedPricing}
                onSelectPricing={setSelectedPricing}
                selectedPlatform={selectedPlatform}
                onSelectPlatform={setSelectedPlatform}
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={setSelectedDifficulty}
                hasApi={hasApi}
                onToggleApi={() => setHasApi(!hasApi)}
                isOpenSource={isOpenSource}
                onToggleOpenSource={() => setIsOpenSource(!isOpenSource)}
                verifiedOnly={verifiedOnly}
                onToggleVerifiedOnly={() => setVerifiedOnly(!verifiedOnly)}
                onResetAll={handleResetAll}
              />
            </div>
          )}

          {/* Tools Grid or List View */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 animate-pulse p-6" />
              ))}
            </div>
          ) : tools.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onCompareToggle={toggleCompare}
                    isComparing={comparingIds.includes(tool.id)}
                  />
                ))}
              </div>
            ) : (
              /* Compact High-Density List View */
              <div className="space-y-3">
                {tools.map(tool => (
                  <div
                    key={tool.id}
                    className="p-4 rounded-xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-bold text-white text-base flex-shrink-0">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/tools/${tool.slug}`}
                            className="text-sm font-bold text-white hover:text-indigo-300 transition truncate"
                          >
                            {tool.name}
                          </Link>
                          <VerificationBadge verification={tool.verification} />
                          {tool.openSource && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono">
                              OSS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                          {tool.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-zinc-200 capitalize">
                          {tool.pricing.model}
                        </span>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {tool.pricing.startingPrice !== undefined ? (
                            tool.pricing.startingPrice === 0 ? "Free tier" : `$${tool.pricing.startingPrice}/${tool.pricing.billingPeriod || "mo"}`
                          ) : "Custom pricing"}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCompare(tool.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                          comparingIds.includes(tool.id)
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                        }`}
                      >
                        {comparingIds.includes(tool.id) ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-3 h-3" /> Compare
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Compare
                          </span>
                        )}
                      </button>

                      <Link
                        href={`/tools/${tool.slug}`}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <EmptyState onResetFilters={handleResetAll} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ToolsDirectoryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">Loading directory...</div>}>
      <ToolsDirectoryContent />
    </Suspense>
  );
}
