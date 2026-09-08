"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  Database,
  Trash2,
  ExternalLink,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ParsedPreviewItem {
  id: string;
  name: string;
  website: string;
  tagline?: string;
  description?: string;
  categoryIds?: string[];
  pricingType?: "free" | "freemium" | "paid" | "open-source";
  isDuplicate?: boolean;
  duplicateReason?: string;
  completenessScore?: number;
  status?: "valid" | "duplicate" | "error";
  errorMsg?: string;
}

const SAMPLE_CSV = `name,website,tagline,description,pricingType,categoryIds
CodeCompanion,https://codecompanion.dev,Autonomous AI code completion,AI-powered assistant for TypeScript and Rust with inline code predictions,freemium,cat-coding
CanvasDreamer,https://canvasdreamer.art,High-speed generative concept canvas,Generative AI drawing canvas with real-time brush diffusion,paid,cat-image
DocuQuery,https://docuquery.ai,Intelligent legal document parser,Extract entities and summarize contracts with citation anchors,paid,cat-documents
VocalPulse,https://vocalpulse.audio,Natural voice synthesizer,Ultra-low-latency real-time voice synthesis and emotion control,freemium,cat-audio`;

const SAMPLE_JSON = JSON.stringify([
  {
    name: "CodeCompanion",
    website: "https://codecompanion.dev",
    tagline: "Autonomous AI code completion",
    description: "AI-powered assistant for TypeScript and Rust with inline code predictions and test generation.",
    pricingType: "freemium",
    categoryIds: ["cat-coding"]
  },
  {
    name: "DocuQuery",
    website: "https://docuquery.ai",
    tagline: "Intelligent legal document parser",
    description: "Extract entities and summarize contracts with citation anchors and export to PDF/Notion.",
    pricingType: "paid",
    categoryIds: ["cat-documents"]
  }
], null, 2);

export default function BulkImportPage() {
  const [importMode, setImportMode] = useState<"csv" | "json">("csv");
  const [inputRaw, setInputRaw] = useState(SAMPLE_CSV);
  const [conflictResolution, setConflictResolution] = useState<"skip" | "update" | "draft">("skip");
  const [targetStatus, setTargetStatus] = useState<"published" | "draft">("draft");
  const [previewItems, setPreviewItems] = useState<ParsedPreviewItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  // Parse CSV string
  const parseCSV = (csv: string): any[] => {
    const lines = csv.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    
    return lines.slice(1).map((line, idx) => {
      // Basic comma split respecting quotes
      const values: string[] = [];
      let inQuote = false;
      let currentVal = "";
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          values.push(currentVal.trim().replace(/^"|"$/g, ""));
          currentVal = "";
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim().replace(/^"|"$/g, ""));

      const row: any = {};
      headers.forEach((h, i) => {
        row[h] = values[i] || "";
      });

      if (row.categoryIds) {
        row.categoryIds = row.categoryIds.split(";").map((c: string) => c.trim()).filter(Boolean);
      }
      return row;
    });
  };

  // Preview & Validate entries against API duplicate/completeness engine
  const handleGeneratePreview = async () => {
    setIsParsing(true);
    setImportResult(null);
    try {
      let rawTools: any[] = [];
      if (importMode === "csv") {
        rawTools = parseCSV(inputRaw);
      } else {
        rawTools = JSON.parse(inputRaw);
      }

      if (!Array.isArray(rawTools) || rawTools.length === 0) {
        alert("No valid records found in input data.");
        setIsParsing(false);
        return;
      }

      // Check against current tools via search / admin endpoint or quick client verification
      const res = await fetch("/api/v1/tools?pageSize=1000");
      const json = await res.json();
      const existingTools: any[] = json.data?.tools || [];

      const parsed: ParsedPreviewItem[] = rawTools.map((tool, idx) => {
        const id = `item-${idx}-${Date.now()}`;
        const name = (tool.name || "").trim();
        const website = (tool.website || "").trim();
        
        // Basic validation
        if (!name || !website) {
          return {
            id,
            name: name || "Unknown",
            website: website || "Missing URL",
            status: "error",
            errorMsg: "Name and website URL are strictly required."
          };
        }

        // Domain extraction
        let domain = "";
        try {
          domain = new URL(website).hostname.replace(/^www\./, "").toLowerCase();
        } catch {
          domain = website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
        }

        // Check duplicate
        const normName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const dupMatch = existingTools.find(existing => {
          const exNorm = (existing.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          let exDomain = "";
          try {
            exDomain = new URL(existing.websiteUrl || "").hostname.replace(/^www\./, "").toLowerCase();
          } catch {
            exDomain = (existing.websiteUrl || "").replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
          }
          return exDomain === domain || exNorm === normName;
        });

        // Compute completeness estimate
        let score = 30; // base
        if (tool.tagline) score += 15;
        if (tool.description && tool.description.length > 50) score += 20;
        if (tool.pricingType) score += 15;
        if (tool.categoryIds && tool.categoryIds.length > 0) score += 20;

        return {
          id,
          name,
          website,
          tagline: tool.tagline,
          description: tool.description,
          categoryIds: tool.categoryIds || ["cat-productivity"],
          pricingType: tool.pricingType || "freemium",
          isDuplicate: !!dupMatch,
          duplicateReason: dupMatch ? `Already exists as "${dupMatch.name}" (${domain})` : undefined,
          completenessScore: score,
          status: dupMatch ? "duplicate" : "valid"
        };
      });

      setPreviewItems(parsed);
      // Auto-select valid items
      const valids = parsed.filter(p => p.status === "valid").map(p => p.id);
      setSelectedIds(new Set(valids));
    } catch (err: any) {
      alert("Parsing error: " + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSelectAllValid = () => {
    const valids = previewItems.filter(p => p.status === "valid").map(p => p.id);
    setSelectedIds(new Set(valids));
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(previewItems.map(p => p.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Execute bulk import API
  const handleExecuteImport = async () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one item to import.");
      return;
    }

    const itemsToImport = previewItems
      .filter(item => selectedIds.has(item.id))
      .map(item => ({
        name: item.name,
        websiteUrl: item.website,
        tagline: item.tagline || `${item.name} AI capability tool`,
        description: item.description || `Comprehensive AI tool for ${item.name}.`,
        categoryIds: item.categoryIds || ["cat-productivity"],
        pricingType: item.pricingType || "freemium",
        features: ["Core AI capabilities", "API integration", "Web workflow"],
        status: targetStatus
      }));

    setIsImporting(true);
    setImportResult(null);

    try {
      const res = await fetch("/api/v1/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools: itemsToImport,
          conflictResolution,
          targetStatus
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Bulk import failed.");
      }

      setImportResult(json.data);
      // Clear preview
      setPreviewItems([]);
      setSelectedIds(new Set());
    } catch (err: any) {
      alert("Import error: " + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
          <Link href="/admin" className="hover:text-zinc-300 transition">Admin</Link>
          <span>/</span>
          <span className="text-amber-400">Bulk Import Engine</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <UploadCloud className="w-8 h-8 text-amber-400" />
              <span>Bulk Catalog Importer</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Import tools via CSV or JSON with automatic duplicate prevention, completeness scoring, and batch audit logging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/tools"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition"
            >
              <Database className="w-3.5 h-3.5" />
              <span>View Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Success Notification if Import Done */}
      {importResult && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div className="flex-1">
              <h3 className="text-base font-bold text-white">Import Batch Processed Successfully</h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Batch ID: <span className="font-mono text-white">{importResult.batchId}</span> · Added: <span className="font-bold text-white">{importResult.countAdded}</span> · Updated: <span className="font-bold text-white">{importResult.countUpdated}</span> · Skipped: <span className="font-bold text-white">{importResult.countSkipped}</span>
              </p>
            </div>
          </div>

          {importResult.toolsAdded && importResult.toolsAdded.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-emerald-500/20">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
                Recently Added Tools:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {importResult.toolsAdded.map((t: any) => (
                  <Link
                    key={t.id}
                    href={`/tools/${t.slug}`}
                    target="_blank"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-emerald-500/20 text-xs hover:border-emerald-400/50 transition group"
                  >
                    <span className="font-medium text-zinc-200 group-hover:text-white truncate">{t.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Data Section */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setImportMode("csv");
                  setInputRaw(SAMPLE_CSV);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  importMode === "csv" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                CSV Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportMode("json");
                  setInputRaw(SAMPLE_JSON);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  importMode === "json" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <FileCode className="w-3.5 h-3.5" />
                JSON Mode
              </button>
            </div>

            <button
              type="button"
              onClick={() => setInputRaw(importMode === "csv" ? SAMPLE_CSV : SAMPLE_JSON)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition underline underline-offset-4"
            >
              Reset to Sample
            </button>
          </div>

          {/* Import Configurations */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Duplicate Handling:</span>
              <select
                value={conflictResolution}
                onChange={e => setConflictResolution(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="skip">Skip Duplicates (Recommended)</option>
                <option value="update">Update Existing Fields</option>
                <option value="draft">Save as Draft for Audit</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Target State:</span>
              <select
                value={targetStatus}
                onChange={e => setTargetStatus(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="draft">Draft (Review Before Public)</option>
                <option value="published">Published (Live Immediately)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <textarea
            value={inputRaw}
            onChange={e => setInputRaw(e.target.value)}
            rows={8}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50 transition resize-y"
            placeholder={importMode === "csv" ? "Paste CSV rows here..." : "Paste JSON array here..."}
          />
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-zinc-400" />
              Required columns/keys: <code className="text-zinc-300">name</code>, <code className="text-zinc-300">website</code>. Recommended: <code className="text-zinc-300">tagline</code>, <code className="text-zinc-300">description</code>, <code className="text-zinc-300">pricingType</code>, <code className="text-zinc-300">categoryIds</code>.
            </span>
            <span>Up to 100 tools per batch</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGeneratePreview}
            disabled={isParsing || !inputRaw.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition disabled:opacity-50 shadow-lg shadow-amber-500/10"
          >
            {isParsing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Validating Data...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Parse & Run Validation Preview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Table */}
      {previewItems.length > 0 && (
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Validation Preview Table</span>
                <span className="text-xs font-mono font-normal text-zinc-400">
                  ({previewItems.length} records parsed · {selectedIds.size} selected)
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Inspect duplicate warnings and completeness scores prior to database insertion.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllValid}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-emerald-400 transition border border-emerald-500/20"
              >
                Select Valid Only
              </button>
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-400 transition"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === previewItems.length && previewItems.length > 0}
                      onChange={e => e.target.checked ? handleSelectAll() : handleClearSelection()}
                      className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500/20"
                    />
                  </th>
                  <th className="p-3 font-semibold">Tool</th>
                  <th className="p-3 font-semibold">Domain / URL</th>
                  <th className="p-3 font-semibold">Pricing</th>
                  <th className="p-3 font-semibold">Categories</th>
                  <th className="p-3 font-semibold">Completeness</th>
                  <th className="p-3 font-semibold">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-[11px]">
                {previewItems.map(item => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        "hover:bg-zinc-900/30 transition cursor-pointer",
                        isSelected && "bg-amber-500/5"
                      )}
                      onClick={() => toggleSelect(item.id)}
                    >
                      <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500/20"
                        />
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-white text-xs">{item.name}</div>
                        {item.tagline && <div className="text-zinc-400 truncate max-w-xs">{item.tagline}</div>}
                      </td>

                      <td className="p-3 font-mono text-zinc-400">
                        <span className="truncate max-w-[180px] inline-block">{item.website}</span>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full font-mono text-[10px] uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {item.pricingType || "freemium"}
                        </span>
                      </td>

                      <td className="p-3 text-zinc-400">
                        {item.categoryIds?.join(", ") || "cat-productivity"}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                (item.completenessScore || 0) >= 80 ? "bg-emerald-500" :
                                (item.completenessScore || 0) >= 50 ? "bg-amber-500" : "bg-rose-500"
                              )}
                              style={{ width: `${item.completenessScore || 0}%` }}
                            />
                          </div>
                          <span className="font-mono text-zinc-400">{item.completenessScore || 0}%</span>
                        </div>
                      </td>

                      <td className="p-3">
                        {item.status === "valid" && (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Valid
                          </span>
                        )}
                        {item.status === "duplicate" && (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-medium" title={item.duplicateReason}>
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Duplicate Warning</span>
                          </span>
                        )}
                        {item.status === "error" && (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-medium" title={item.errorMsg}>
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Incomplete</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
            <div className="text-xs text-zinc-400">
              <span className="font-bold text-white">{selectedIds.size}</span> tools selected for import to <span className="font-mono text-amber-400 uppercase">{targetStatus}</span> state.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewItems([])}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold border border-zinc-800 transition"
              >
                Discard Table
              </button>

              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isImporting || selectedIds.size === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Importing Batch...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Execute Import ({selectedIds.size} Tools)</span>
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
