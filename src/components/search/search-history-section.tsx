"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  History, 
  Trash2, 
  Search, 
  Clock, 
  ExternalLink, 
  Shield, 
  Check, 
  AlertCircle 
} from "lucide-react";
import { 
  getSearchHistory, 
  removeSearchHistoryItem, 
  clearSearchHistory, 
  getSearchHistoryOptOut, 
  setSearchHistoryOptOut, 
  SearchHistoryItem 
} from "@/lib/search/search-history";

export function SearchHistorySection() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [optOut, setOptOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(getSearchHistory());
    setOptOut(getSearchHistoryOptOut());
  }, []);

  if (!mounted) return null;

  const handleToggleOptOut = (checked: boolean) => {
    setOptOut(checked);
    setSearchHistoryOptOut(checked);
  };

  const handleDeleteItem = (id: string) => {
    const updated = removeSearchHistoryItem(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearSearchHistory();
    setHistory([]);
    setConfirmClear(false);
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-lg space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <History className="w-4 h-4 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Search History & Activity</h2>
          <span className="text-xs font-mono text-zinc-500">({history.length}/20)</span>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className={`text-xs font-medium px-3 py-1 rounded-lg border transition ${
              confirmClear
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold"
                : "text-zinc-400 hover:text-rose-400 border-zinc-800 hover:bg-zinc-800"
            }`}
          >
            {confirmClear ? "Click to Confirm Clear" : "Clear All History"}
          </button>
        )}
      </div>

      {/* Opt-out toggle */}
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-zinc-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-zinc-200 block">Privacy Control: Search History Opt-Out</span>
            <span className="text-zinc-500 text-[11px]">When enabled, future search queries won&apos;t be saved on this device or profile.</span>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={optOut}
            onChange={(e) => handleToggleOptOut(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {/* Query List */}
      <div className="space-y-2">
        {history.length > 0 ? (
          history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition group"
            >
              <Link
                href={`/tools?q=${encodeURIComponent(item.query)}`}
                className="flex items-center gap-3 flex-1 min-w-0 pr-3"
              >
                <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition shrink-0" />
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                  &ldquo;{item.query}&rdquo;
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                  {item.resultCount} results
                </span>
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  {formatTimeAgo(item.timestamp)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 rounded text-zinc-600 hover:text-rose-400 hover:bg-zinc-900 transition"
                  title="Remove from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-center space-y-2">
            <History className="w-6 h-6 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-medium">No recent searches yet</p>
            <p className="text-[11px] text-zinc-600">
              When you search tools in the directory or universe connector, your recent queries will show here for fast 1-click re-runs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
