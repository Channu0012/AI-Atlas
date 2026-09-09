"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tool, Stack, StackToolItem } from "@/types";
import { ToolLogo } from "@/components/ui/tool-logo";
import { PricingBadge } from "@/components/ui/pricing-badge";
import { calculateStackMonthlyCost } from "@/lib/stacks/cost-calculator";
import { 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Check, 
  Share2, 
  Plus, 
  Sparkles,
  Lock,
  Globe,
  AlertTriangle,
  TrendingDown
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";

interface StackBuilderProps {
  initialStack?: Stack;
  availableTools: Tool[];
  onSaveStack?: (stack: Partial<Stack>) => Promise<void>;
}

export const StackBuilder: React.FC<StackBuilderProps> = ({ 
  initialStack, 
  availableTools,
  onSaveStack 
}) => {
  const { user } = useAuth();
  const [name, setName] = useState(initialStack?.name || "My Custom AI Stack");
  const [description, setDescription] = useState(initialStack?.description || "Curated stack of AI tools to accomplish my workflow.");
  const [goal, setGoal] = useState(initialStack?.goal || "General Workflow");
  const [visibility, setVisibility] = useState<"private" | "public">(initialStack?.visibility || "private");
  const [items, setItems] = useState<StackToolItem[]>(initialStack?.tools || [
    { toolId: "chatgpt", role: "Scriptwriting & Ideation", order: 1 },
    { toolId: "elevenlabs", role: "Voiceover Synthesis", order: 2 },
    { toolId: "runway-gen3", role: "Video Clip Generation", order: 3 },
    { toolId: "descript", role: "Video Assembly & Captions", order: 4 }
  ]);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedToolToAdd, setSelectedToolToAdd] = useState(availableTools[0]?.id || "");
  const [newRole, setNewRole] = useState("Workflow Task");

  const toolsMap = new Map(availableTools.map(t => [t.id, t]));
  const stackTools = items.map(item => toolsMap.get(item.toolId)).filter(Boolean) as Tool[];
  const costSummary = calculateStackMonthlyCost(stackTools);

  const handleRemove = (toolId: string) => {
    setItems(items.filter(i => i.toolId !== toolId));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    newItems.forEach((item, idx) => item.order = idx + 1);
    setItems(newItems);
  };

  const handleAddTool = () => {
    if (!selectedToolToAdd) return;
    if (items.some(i => i.toolId === selectedToolToAdd)) return;

    const newItem: StackToolItem = {
      toolId: selectedToolToAdd,
      role: newRole || "Task Execution",
      order: items.length + 1
    };
    setItems([...items, newItem]);
    setNewRole("Workflow Task");
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload: Partial<Stack> = {
        name,
        description,
        goal,
        tools: items,
        visibility,
        estimatedMonthlyCost: {
          amount: costSummary.totalMonthlyUsd,
          currency: "USD",
          hasUnknownPricing: costSummary.hasUnknownPricing
        }
      };

      if (onSaveStack) {
        await onSaveStack(payload);
      } else {
        // Direct local/API save
        await fetch("/api/v1/stacks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn("Error saving stack:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left 2 Cols: Stack Editor */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-lg space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">Stack Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">Description & Objective</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-400 font-medium">Visibility:</span>
            <button
              type="button"
              onClick={() => setVisibility("private")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                visibility === "private"
                  ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/40 font-semibold"
                  : "bg-zinc-800/40 text-zinc-400 border-zinc-700"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Private (Only Me)
            </button>
            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                visibility === "public"
                  ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/40 font-semibold"
                  : "bg-zinc-800/40 text-zinc-400 border-zinc-700"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Public Community
            </button>
          </div>
        </div>

        {/* Stack Items List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
            Pipeline Steps ({items.length})
          </h3>

          {items.map((item, index) => {
            const tool = toolsMap.get(item.toolId);
            if (!tool) return null;

            return (
              <div
                key={tool.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 font-mono text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <ToolLogo name={tool.name} logoUrl={tool.logo} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/tools/${tool.slug}`} className="text-sm font-bold text-white hover:text-indigo-400 transition truncate">
                        {tool.name}
                      </Link>
                      <PricingBadge pricing={tool.pricing} />
                    </div>
                    <p className="text-xs text-indigo-400 font-medium truncate">
                      Role: {item.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === items.length - 1}
                    className="p-1.5 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemove(tool.id)}
                    className="p-1.5 rounded text-zinc-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Tool to Stack Row */}
        <div className="p-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedToolToAdd}
            onChange={(e) => setSelectedToolToAdd(e.target.value)}
            className="flex-1 w-full sm:w-auto bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {availableTools.filter(t => !items.some(i => i.toolId === t.id)).map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.pricing.model === "free" ? "Free" : `$${t.pricing.startingPrice || 0}/mo`})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Step / Role description"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="flex-1 w-full sm:w-auto bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={handleAddTool}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>
      </div>

      {/* Right Col: Cost Summary & Actions */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-xl space-y-4 sticky top-24">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Monthly Cost Estimate</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-2xl font-bold font-mono text-white">
              ${costSummary.totalMonthlyUsd}
              <span className="text-xs font-normal text-zinc-400"> / month</span>
            </div>
            {costSummary.hasUnknownPricing && (
              <p className="text-[11px] text-amber-400/90 mt-1">
                *Includes tools with custom enterprise or variable usage pricing.
              </p>
            )}
          </div>

          {/* Itemized Cost List */}
          <div className="space-y-2 text-xs">
            <span className="text-zinc-500 font-semibold uppercase tracking-wider block">
              Itemized Tool Breakdown
            </span>
            {costSummary.itemized.map(item => (
              <div key={item.toolId} className="flex items-center justify-between text-zinc-300">
                <span className="truncate mr-2">{item.toolName}</span>
                <span className="font-mono text-zinc-400 shrink-0">
                  {item.status === "free" ? (
                    <span className="text-emerald-400">Free</span>
                  ) : item.monthlyPrice !== null ? (
                    `$${item.monthlyPrice}/mo`
                  ) : (
                    <span className="text-amber-400/80">Custom</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Redundancy & Cost Optimization Banner */}
          {costSummary.redundancies.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Capability Overlap Detected</span>
              </div>
              {costSummary.potentialMonthlySavings > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Save up to ${costSummary.potentialMonthlySavings}/mo by consolidating</span>
                </div>
              )}
              <div className="space-y-1.5">
                {costSummary.redundancies.map((r, idx) => (
                  <p key={idx} className="text-[11px] text-amber-200/90 leading-relaxed">
                    • <strong className="text-amber-100">{r.capabilityName}:</strong> {r.recommendation}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Stack Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {saving ? "Saving Stack..." : "Save AI Stack"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
