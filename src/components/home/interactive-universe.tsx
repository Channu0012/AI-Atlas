"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tool, Category } from "@/types";
import { ToolCard } from "@/components/tools/tool-card";
import { SmoothCategoryScroll } from "@/components/ui/smooth-category-scroll";
import { 
  Flame, 
  Code2, 
  Video, 
  Cpu, 
  Search, 
  Sparkles, 
  Bot, 
  Layers,
  ArrowRight,
  Palette,
  Mic,
  Database,
  Briefcase
} from "lucide-react";

interface InteractiveUniverseProps {
  allTools: Tool[];
  categories: Category[];
}

export const InteractiveUniverse: React.FC<InteractiveUniverseProps> = ({ allTools, categories }) => {
  const [activeTab, setActiveTab] = useState<string>("trending");

  const tabs = [
    { id: "trending", label: "Trending", icon: Flame, color: "from-amber-500 to-rose-500" },
    { id: "opensource", label: "Open Source & Free", icon: Cpu, color: "from-emerald-500 to-teal-500" },
    { id: "coding", label: "Dev & Code IDEs", icon: Code2, color: "from-cyan-500 to-blue-500" },
    { id: "video", label: "Video & Motion", icon: Video, color: "from-purple-500 to-pink-500" },
    { id: "design", label: "3D & Design", icon: Palette, color: "from-fuchsia-500 to-indigo-500" },
    { id: "agents", label: "Agents & OS", icon: Bot, color: "from-indigo-500 to-sky-500" },
    { id: "research", label: "Research & Science", icon: Search, color: "from-blue-500 to-emerald-500" },
    { id: "productivity", label: "Productivity & Data", icon: Briefcase, color: "from-amber-400 to-orange-500" }
  ];

  const getFilteredTools = () => {
    switch (activeTab) {
      case "trending":
        return [...allTools].sort((a, b) => b.metrics.viewCount - a.metrics.viewCount).slice(0, 8);
      case "opensource":
        return allTools.filter(t => t.openSource || t.pricing.model === "free").slice(0, 8);
      case "coding":
        return allTools.filter(t => t.categoryIds.includes("cat-coding") || t.categoryIds.includes("cat-code-agents")).slice(0, 8);
      case "video":
        return allTools.filter(t => t.categoryIds.includes("cat-video") || t.categoryIds.includes("cat-video-gen")).slice(0, 8);
      case "design":
        return allTools.filter(t => t.categoryIds.includes("cat-design") || t.categoryIds.includes("cat-3d")).slice(0, 8);
      case "agents":
        return allTools.filter(t => t.categoryIds.includes("cat-agents") || t.capabilityIds.includes("computer-use")).slice(0, 8);
      case "research":
        return allTools.filter(t => t.categoryIds.includes("cat-research") || t.capabilityIds.includes("web-research")).slice(0, 8);
      case "productivity":
        return allTools.filter(t => t.categoryIds.includes("cat-productivity") || t.categoryIds.includes("cat-datascience")).slice(0, 8);
      default:
        return allTools.slice(0, 8);
    }
  };

  const filteredTools = getFilteredTools();

  return (
    <div className="w-full">
      {/* Interactive Tab Switcher with Smooth Category Scrolling */}
      <SmoothCategoryScroll className="mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? `bg-zinc-100 text-zinc-950 shadow-lg shadow-white/10 scale-105`
                  : `glass-pill text-zinc-400 hover:text-zinc-200 hover:border-zinc-700`
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-zinc-950" : "text-zinc-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </SmoothCategoryScroll>

      {/* Tools Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {/* Bottom CTA to full directory */}
      <div className="mt-8 flex justify-center">
        <Link
          href={`/tools`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-semibold text-zinc-200 hover:text-white transition group shadow-md"
        >
          <span>Explore All {allTools.length} Verified AI Tools</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-400" />
        </Link>
      </div>
    </div>
  );
};
