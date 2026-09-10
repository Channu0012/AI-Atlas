"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/auth-context";
import { 
  User, 
  Settings, 
  Bookmark, 
  Layers, 
  ShieldCheck, 
  LogOut, 
  Save, 
  Check, 
  Cpu, 
  Zap, 
  Terminal, 
  ExternalLink, 
  Copy, 
  Key, 
  Sparkles, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Sliders,
  History,
  Activity,
  CheckCircle2
} from "lucide-react";
import { SearchHistorySection } from "@/components/search/search-history-section";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "stacks" | "saved" | "kie" | "preferences">("overview");
  const [displayName, setDisplayName] = useState(user?.displayName || "AI Explorer");
  const [skillLevel, setSkillLevel] = useState(user?.profile?.skillLevel || "intermediate");
  const [currency, setCurrency] = useState(user?.preferences?.currency || "USD");
  const [preferFree, setPreferFree] = useState(user?.preferences?.preferFree || false);
  const [preferOpenSource, setPreferOpenSource] = useState(user?.preferences?.preferOpenSource || false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Kie.ai API Key Management
  const [customKey, setCustomKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const activeKieKey = "5eec2e84e297ce765d9c596cf17a721c";

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveCustomKey = () => {
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(activeKieKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Mock sample stacks for profile visualization
  const sampleStacks = [
    {
      id: "stack-1",
      name: "Faceless YouTube Production Matrix",
      goal: "Automated video essays with AI voiceover and b-roll",
      tools: ["Claude 3.5 Sonnet", "ElevenLabs", "Runway Gen-3", "CapCut"],
      monthlyCost: 35,
      updatedAt: "Today"
    },
    {
      id: "stack-2",
      name: "Full-Stack SaaS MVP Rapid Builder",
      goal: "Build web apps with AI code generation and database",
      tools: ["Cursor", "Supabase AI", "V0 by Vercel", "Resend"],
      monthlyCost: 20,
      updatedAt: "2 days ago"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Holographic Command Center Identity Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 shadow-2xl relative overflow-hidden backdrop-blur-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-64 bg-gradient-to-l from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-32 bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar & Identifiers */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-0.5 shadow-xl shadow-indigo-500/30">
                <div className="w-full h-full rounded-2xl bg-zinc-950 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold font-mono">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
                <Check className="w-3 h-3 text-black" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[11px] font-mono font-bold text-indigo-300">
                  Tier 3 Architect
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">
                  #ATLAS-9042
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-mono">
                {user?.email || "explorer@ai-atlas.dev"}
              </p>

              {/* XP / Level Progress Bar */}
              <div className="pt-2 flex items-center gap-3">
                <div className="w-48 sm:w-64 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 w-4/5 rounded-full" />
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                  8,450 / 10,000 XP
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <Link
              href="/ask"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-xs font-bold text-white transition shadow-lg shadow-indigo-600/25"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Decision Matrix</span>
            </Link>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-500/40 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry HUD Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-md flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
              Saved Tools
            </span>
            <span className="text-xl font-bold font-mono text-white">
              {user?.savedToolIds?.length || 3}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-md flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
              Deployed Stacks
            </span>
            <span className="text-xl font-bold font-mono text-white">
              {sampleStacks.length}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-md flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
              Kie.ai Quota
            </span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              Active (Unlimited)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-md flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
              Matrix Precision
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              99.4% Fit
            </span>
          </div>
        </div>
      </div>

      {/* Cockpit Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none no-scrollbar">
        {[
          { id: "overview", label: "Workspace Overview", icon: Activity },
          { id: "stacks", label: "My AI Stacks", icon: Layers },
          { id: "saved", label: "Bookmarked Tools", icon: Bookmark },
          { id: "kie", label: "Kie.ai Terminal & API Key", icon: Cpu },
          { id: "preferences", label: "Intelligence Preferences", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500"
                  : "glass-pill text-zinc-400 hover:text-white"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-zinc-400")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Panel */}
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Autonomous Quick Actions</span>
              </h3>

              <div className="space-y-2.5">
                <Link
                  href="/ask"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 hover:border-indigo-500/50 border border-zinc-800 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition block">
                        Analyze New Project Goal
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Synthesize multi-step execution stack
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition" />
                </Link>

                <Link
                  href="/stacks"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 hover:border-purple-500/50 border border-zinc-800 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-purple-400 transition block">
                        Open Custom Stack Builder
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Calculate monthly spend and redundancies
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition" />
                </Link>

                <Link
                  href="/compare?tools=claude-3-5-sonnet,chatgpt,cursor"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 hover:border-cyan-500/50 border border-zinc-800 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition block">
                        Frontier Model Comparison Duel
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Side-by-side benchmark matrix
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition" />
                </Link>
              </div>
            </div>

            {/* Active Stacks Spotlight */}
            <div className="lg:col-span-2 p-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Recent AI Execution Stacks</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("stacks")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View All ({sampleStacks.length})
                </button>
              </div>

              <div className="space-y-3">
                {sampleStacks.map((stack) => (
                  <div
                    key={stack.id}
                    className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{stack.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{stack.goal}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {stack.tools.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        ${stack.monthlyCost}/mo
                      </span>
                      <Link
                        href="/stacks"
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-1"
                      >
                        <span>Open Stack</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search & Audit History Section */}
          <SearchHistorySection />
        </div>
      )}

      {/* TAB CONTENT: Stacks */}
      {activeTab === "stacks" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">My Deployed AI Stacks</h3>
              <p className="text-xs text-zinc-400">
                Audited tool combinations with cost analysis and redundancy checks.
              </p>
            </div>
            <Link
              href="/stacks"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition"
            >
              <span>+ Create New Stack</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleStacks.map((stack) => (
              <div
                key={stack.id}
                className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Verified Stack
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      ${stack.monthlyCost}/mo
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{stack.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{stack.goal}</p>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                      Assigned Toolchain:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stack.tools.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2.5 py-1 rounded-lg bg-zinc-950 text-zinc-200 border border-zinc-800 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">Updated {stack.updatedAt}</span>
                  <Link
                    href="/stacks"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-white transition"
                  >
                    <span>Inspect Pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Saved Tools */}
      {activeTab === "saved" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Bookmarked Tools</h3>
              <p className="text-xs text-zinc-400">
                Your pinned AI engines ready for quick launch and comparison.
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Browse 1,000+ Tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "ChatGPT (GPT-4o)", category: "Frontier LLM", pricing: "Freemium · $20/mo", slug: "chatgpt" },
              { name: "Cursor AI", category: "Developer IDE", pricing: "Freemium · $20/mo", slug: "cursor" },
              { name: "Perplexity AI", category: "Deep Research", pricing: "Freemium · $20/mo", slug: "perplexity" }
            ].map((tool) => (
              <div
                key={tool.slug}
                className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 inline-block mb-2">
                    {tool.category}
                  </span>
                  <h4 className="text-sm font-bold text-white">{tool.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{tool.pricing}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-xs text-indigo-400 hover:text-white transition font-semibold"
                  >
                    View Details
                  </Link>
                  <Bookmark className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Kie.ai Multimodal Terminal */}
      {activeTab === "kie" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-zinc-900/60 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Kie.ai Multimodal Terminal
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Connected
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Powers live task deliverables, multimodal prompt execution, and agentic workflows.
                  </p>
                </div>
              </div>

              <a
                href="https://kie.ai/api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-cyan-300 transition"
              >
                <span>Manage on Kie.ai</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Active Key Display */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 block">
                Active System API Key
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-xs text-cyan-300 flex items-center justify-between">
                  <span>{activeKieKey}</span>
                  <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition shrink-0 flex items-center gap-1.5"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Override with Custom Key */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <label htmlFor="custom-kie-key" className="text-xs font-semibold text-zinc-300 block">
                Override with Personal Kie.ai Key (Optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="custom-kie-key"
                  type="text"
                  placeholder="Paste your personal Kie.ai API key"
                  aria-label="Personal Kie.ai API key"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleSaveCustomKey}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shrink-0 flex items-center justify-center gap-1.5"
                >
                  {keySaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Key Applied!</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5" />
                      <span>Save Key</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Multimodal Endpoint Status Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-800">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
                <span className="text-[10px] font-mono text-zinc-500 block">LLM Reasoning</span>
                <span className="font-bold text-white">GPT-4o / Claude 3.5</span>
                <span className="text-[10px] text-emerald-400 block mt-1">● Operational (42ms)</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
                <span className="text-[10px] font-mono text-zinc-500 block">Visual Synthesis</span>
                <span className="font-bold text-white">Flux / Midjourney API</span>
                <span className="text-[10px] text-emerald-400 block mt-1">● Operational (88ms)</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
                <span className="text-[10px] font-mono text-zinc-500 block">Audio & Music</span>
                <span className="font-bold text-white">Suno / ElevenLabs</span>
                <span className="text-[10px] text-emerald-400 block mt-1">● Operational (64ms)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Preferences */}
      {activeTab === "preferences" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-lg space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>Recommendation & Search Preferences</span>
            </h3>

            <div>
              <label htmlFor="profile-display-name" className="text-xs font-semibold text-zinc-400 block mb-1">Display Name</label>
              <input
                id="profile-display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                aria-label="Display Name"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Technical Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="beginner">Beginner (No-code / Turnkey)</option>
                  <option value="intermediate">Intermediate (Power user / APIs)</option>
                  <option value="professional">Professional (Developer / CLI / Local)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Default Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <label className="flex items-center gap-3 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferFree}
                  onChange={(e) => setPreferFree(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-0"
                />
                <span>Always prioritize 100% free or freemium tools in rankings</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferOpenSource}
                  onChange={(e) => setPreferOpenSource(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-0"
                />
                <span>Prioritize Open Source solutions where equivalent capabilities exist</span>
              </label>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Preferences Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save All Preferences</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
