"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tool } from "@/types";
import { ComparisonMatrix } from "@/components/compare/comparison-matrix";
import { Scale, Plus, Search } from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const toolsParam = searchParams.get("tools") || "";

  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [allAvailableTools, setAllAvailableTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/v1/tools?limit=50")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const list: Tool[] = json.data.tools;
          setAllAvailableTools(list);

          if (toolsParam) {
            const slugs = toolsParam.split(",").map(s => s.trim().toLowerCase());
            const matched = list.filter(t => slugs.includes(t.slug) || slugs.includes(t.id));
            setSelectedTools(matched.slice(0, 4));
          } else {
            // Default 2 top tools to compare
            setSelectedTools(list.slice(0, 2));
          }
        }
      })
      .catch(err => console.warn("Failed to load tools for comparison:", err))
      .finally(() => setLoading(false));
  }, [toolsParam]);

  const handleAddTool = (tool: Tool) => {
    if (selectedTools.length >= 4) {
      alert("You can compare up to 4 tools at a time.");
      return;
    }
    if (!selectedTools.some(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]);
    }
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  const filteredChoices = allAvailableTools.filter(t => 
    !selectedTools.some(st => st.id === t.id) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.company.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Factual Matrix</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Compare AI Tools Side-by-Side
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Evaluate exact pricing, developer APIs, strengths, and trade-offs. 2 to 4 tools supported.
          </p>
        </div>

        {/* Add Tool dropdown button */}
        {selectedTools.length < 4 && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tool ({selectedTools.length}/4)</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-2 z-50">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools to add..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {filteredChoices.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => handleAddTool(tool)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center justify-between"
                    >
                      <span className="font-medium truncate">{tool.name}</span>
                      <span className="text-[10px] text-zinc-500">{tool.pricing.model}</span>
                    </button>
                  ))}
                  {filteredChoices.length === 0 && (
                    <p className="p-3 text-center text-xs text-zinc-500">No matching tools</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-zinc-500">Loading comparison...</div>
      ) : (
        <ComparisonMatrix tools={selectedTools} onRemoveTool={handleRemoveTool} />
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">Loading compare view...</div>}>
      <CompareContent />
    </Suspense>
  );
}
