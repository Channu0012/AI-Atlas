"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Tool } from "@/types";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolGridSkeleton } from "@/components/ui/skeletons";
import { useAuth } from "@/features/auth/auth-context";
import { Bookmark, ArrowRight, Compass } from "lucide-react";

export default function SavedToolsPage() {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/tools?limit=50")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const all: Tool[] = json.data.tools;
          const saved = all.filter(t => user?.savedToolIds.includes(t.id));
          setTools(saved);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.savedToolIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Saved AI Tools
          </h1>
        </div>

        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore Directory</span>
        </Link>
      </div>

      {loading ? (
        <ToolGridSkeleton count={3} />
      ) : tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40 max-w-md mx-auto my-12">
          <Bookmark className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No saved tools yet</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Bookmark verified AI tools as you discover them to keep track of your favorite capabilities.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
          >
            <span>Browse Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
