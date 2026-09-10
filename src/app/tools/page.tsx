"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Tool, Category } from "@/types";
import { ToolCard } from "@/components/tools/tool-card";
import { FilterPanel } from "@/components/tools/filter-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { ToolGridSkeleton } from "@/components/ui/skeletons";
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  LayoutGrid, 
  List, 
  Globe, 
  ShieldCheck, 
  Download, 
  Star, 
  Check, 
  Plus,
  RefreshCw,
  Cpu
} from "lucide-react";
import { recordSearchHistory } from "@/lib/search/search-history";
import { SmoothCategoryScroll } from "@/components/ui/smooth-category-scroll";

function ToolsDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mode: Flagship Verified vs. 100,000+ Open Universe
  const [catalogMode, setCatalogMode] = useState<"flagship" | "universe">("flagship");

  const [tools, setTools] = useState<Tool[]>([]);
  const [universeTools, setUniverseTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [universeLoading, setUniverseLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [universeTotal, setUniverseTotal] = useState(450000);

  // Filters State
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>(searchParams.get("collection") || undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(searchParams.get("category") || undefined);
  const [selectedPricing, setSelectedPricing] = useState<string | undefined>(undefined);
  const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>(undefined);
  const [hasApi, setHasApi] = useState(false);
  const [isOpenSource, setIsOpenSource] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<any>("relevance");

  // Multi-tool compare tracking
  const [comparingIds, setComparingIds] = useState<string[]>([]);

  // Fetch flagship tools
  const fetchFlagshipTools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (selectedCollection && selectedCollection !== "all") params.set("collection", selectedCollection);
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
        if (query.trim()) {
          recordSearchHistory(query.trim(), json.data.tools.length);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch flagship tools:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch 100,000+ Universe tools & models (Hugging Face / Open Source Registry)
  const fetchUniverseTools = async () => {
    setUniverseLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      params.set("limit", "48");

      const res = await fetch(`/api/v1/tools/universe?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setUniverseTools(json.data.tools);
        if (json.data.totalEstimate) {
          setUniverseTotal(json.data.totalEstimate);
        }
      }
    } catch (err) {
      console.warn("Failed to query 100,000+ Universe tools:", err);
    } finally {
      setUniverseLoading(false);
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

  // Fetch based on active catalog mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (catalogMode === "flagship") {
        fetchFlagshipTools();
      } else {
        fetchUniverseTools();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [
    catalogMode,
    query,
    selectedCollection,
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
    setSelectedCollection(undefined);
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

  const DISCOVERY_COLLECTIONS = [
    { id: "all", label: "All Catalog", icon: "🌐" },
    { id: "top-100", label: "Top 100", icon: "🏆" },
    { id: "trending", label: "Trending", icon: "🔥" },
    { id: "best-free", label: "Best Free", icon: "💚" },
    { id: "best-value", label: "Best Value", icon: "💎" },
    { id: "developers", label: "Developers", icon: "👨‍💻" },
    { id: "students", label: "Students", icon: "🎓" },
    { id: "startups", label: "Startups", icon: "🚀" },
    { id: "creators", label: "Creators", icon: "🎨" },
    { id: "business", label: "Business", icon: "💼" },
    { id: "new-launches", label: "New Launches", icon: "✨" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header with Verified Flagships vs Open Model Registry */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tools.length > 0 ? `${tools.length} Verified Directory Tools` : "Verified AI Catalog"} · Open Model Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Directory & Discovery Engine
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Curated database of verified AI tools with audited capabilities, multi-factor collections, and full ecosystem coverage.
          </p>
        </div>

        {/* Catalog Mode Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner w-full sm:w-auto">
          <button
            onClick={() => setCatalogMode("flagship")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              catalogMode === "flagship"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Verified Tools ({tools.length})</span>
          </button>
          <button
            onClick={() => setCatalogMode("universe")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              catalogMode === "universe"
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-purple-600/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>Open Models (Live)</span>
          </button>
        </div>
      </div>

      {/* Compare Tray if tools selected */}
      {comparingIds.length > 0 && (
        <div className="mb-6 flex items-center justify-between gap-3 p-3 px-5 rounded-2xl bg-indigo-950/90 border border-indigo-500/40 shadow-lg shadow-indigo-500/20">
          <span className="text-xs text-indigo-300 font-medium">
            <strong>{comparingIds.length}</strong> tools selected for side-by-side comparison
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/compare?tools=${comparingIds.join(",")}`)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
            >
              Launch Side-by-Side Matrix
            </button>
            <button
              onClick={() => setComparingIds([])}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Sidebar Filters (Flagship) or Full Universe Explorer */}
      {catalogMode === "flagship" ? (
        <div>
          {/* Discovery Collections Horizontal Pills */}
          <SmoothCategoryScroll className="mb-6">
            {DISCOVERY_COLLECTIONS.map((col) => {
              const isSelected = 
                (!selectedCollection && col.id === "all") ||
                (selectedCollection === col.id);

              return (
                <button
                  key={col.id}
                  onClick={() => {
                    if (col.id === "all") {
                      setSelectedCollection(undefined);
                    } else {
                      setSelectedCollection(col.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500"
                      : "glass-pill text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span>{col.icon}</span>
                  <span>{col.label}</span>
                </button>
              );
            })}
          </SmoothCategoryScroll>

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
                    placeholder="Search verified tools by name, feature, company..."
                    aria-label="Search verified tools by name, feature, or company"
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
                    className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium shrink-0"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                  </button>

                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-zinc-400 min-w-0">
                    <ArrowUpDown className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
                    <span className="hidden sm:inline shrink-0">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 sm:px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 max-w-[140px] sm:max-w-none truncate"
                    >
                      <option value="relevance">Popularity</option>
                      <option value="top-100">Top 100</option>
                      <option value="trending">Trending</option>
                      <option value="best-free">Best Free</option>
                      <option value="best-value">Best Value</option>
                      <option value="newest">Recently Launched</option>
                      <option value="verified">Recently Verified</option>
                      <option value="saves">Most Saved</option>
                      <option value="name">A–Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Result Count Banner */}
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span>
                  Showing <strong className="text-zinc-200">{tools.length}</strong> verified flagship tools
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
                <ToolGridSkeleton count={6} />
              ) : tools.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      ) : (
        /* 100,000+ AI Universe Explorer View */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border-purple-500/20 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Live Open-Source Registry</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Searching 100,000+ AI Models & Tools
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                Direct live index querying over 450,000+ open-weights models, checkpoints, and pipelines from the open AI ecosystem. Auto-cached to Firebase.
              </p>
            </div>

            <div className="flex-shrink-0 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any model: llama, flux, whisper..."
                  aria-label="Search any model architecture"
                  className="w-full bg-zinc-900 border border-purple-500/40 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Quick Model Architecture Chips */}
          <SmoothCategoryScroll className="text-xs pb-2">
            <span className="text-zinc-500 font-medium mr-1 shrink-0">Trending Architectures:</span>
            {["llama", "deepseek", "whisper", "flux", "mistral", "stable-diffusion", "qwen", "phi"].map(name => (
              <button
                key={name}
                onClick={() => setQuery(name)}
                className={`px-3 py-1 rounded-full border transition cursor-pointer whitespace-nowrap ${
                  query.toLowerCase() === name
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                }`}
              >
                {name}
              </button>
            ))}
          </SmoothCategoryScroll>

          {/* Universe Tools Grid */}
          {universeLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-60 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 animate-pulse p-6" />
              ))}
            </div>
          ) : universeTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {universeTools.map(tool => (
                <div
                  key={tool.id}
                  className="p-5 rounded-2xl glass-card flex flex-col justify-between group hover:border-purple-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {tool.company.name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                        {tool.metrics.viewCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3 text-zinc-500" />
                            {tool.metrics.viewCount > 1000 ? `${Math.round(tool.metrics.viewCount / 1000)}k` : tool.metrics.viewCount}
                          </span>
                        )}
                        {tool.metrics.saveCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400" />
                            {tool.metrics.saveCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition truncate">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {tool.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-400">
                      100% Free / Open Weights
                    </span>
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                    >
                      <span>Weights</span>
                      <Globe className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
              <Cpu className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">No models found for "{query}". Try searching "llama", "deepseek", or "whisper".</p>
            </div>
          )}
        </div>
      )}
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
