"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Tool } from "@/types";
import { ToolLogo } from "@/components/ui/tool-logo";
import { PricingBadge } from "@/components/ui/pricing-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { useAuth } from "@/features/auth/auth-context";
import { Plus, Search, Trash2, Edit3, ArrowLeft, ExternalLink } from "lucide-react";

export default function AdminToolsPage() {
  const { isAdmin } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadTools = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/tools?limit=100");
      const json = await res.json();
      if (json.success) setTools(json.data.tools);
    } catch (err) {
      console.warn("Failed to load tools:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the database?`)) return;
    try {
      await fetch(`/api/v1/tools/${id}`, { method: "DELETE" });
      setTools(tools.filter(t => t.id !== id));
    } catch (err) {
      alert("Failed to delete tool");
    }
  };

  const filtered = tools.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <Link
          href="/admin/tools/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Tool</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Manage Verified Tools ({tools.length})
          </h1>
          <p className="text-xs text-zinc-400">
            Publish, edit metadata, update pricing, and run verification audits.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools in database..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500">Loading catalog...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <th className="p-4 font-semibold">Tool</th>
                <th className="p-4 font-semibold">Pricing</th>
                <th className="p-4 font-semibold">Difficulty</th>
                <th className="p-4 font-semibold">Verification</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filtered.map(tool => (
                <tr key={tool.id} className="hover:bg-zinc-900/40 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <ToolLogo name={tool.name} logoUrl={tool.logo} size="sm" />
                      <div>
                        <Link href={`/tools/${tool.slug}`} className="font-bold text-white hover:text-indigo-400 flex items-center gap-1">
                          {tool.name}
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </Link>
                        <span className="text-[11px] text-zinc-500 font-mono">by {tool.company.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <PricingBadge pricing={tool.pricing} />
                  </td>
                  <td className="p-4 capitalize font-mono text-[11px] text-zinc-400">
                    {tool.difficulty}
                  </td>
                  <td className="p-4">
                    <VerificationBadge verification={tool.verification} />
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {tool.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="p-1.5 rounded text-zinc-400 hover:text-white transition"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tool.id, tool.name)}
                        className="p-1.5 rounded text-zinc-500 hover:text-rose-400 transition"
                        title="Delete Tool"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
