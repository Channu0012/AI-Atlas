/**
 * Search History Storage & Management (PRD §36 & §37)
 * - Persists last 20 search queries
 * - Stores timestamp, query string, result count, and unique ID
 * - Supports delete individual query, clear all, and opt-out toggle
 * - Syncs locally with optional server persistence
 */

export interface SearchHistoryItem {
  id: string;
  query: string;
  resultCount: number;
  timestamp: number;
}

const STORAGE_KEY = "ai_atlas_search_history";
const OPT_OUT_KEY = "ai_atlas_search_history_opt_out";
const MAX_HISTORY_ITEMS = 20;

export function getSearchHistoryOptOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(OPT_OUT_KEY) === "true";
  } catch {
    return false;
  }
}

export function setSearchHistoryOptOut(optOut: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OPT_OUT_KEY, optOut ? "true" : "false");
  } catch {}
}

export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_HISTORY_ITEMS);
    }
    return [];
  } catch {
    return [];
  }
}

export function recordSearchHistory(query: string, resultCount: number = 0): void {
  if (typeof window === "undefined") return;
  if (!query || !query.trim()) return;
  if (getSearchHistoryOptOut()) return;

  const trimmed = query.trim();
  try {
    const current = getSearchHistory();
    // Filter out previous entry with identical query
    const filtered = current.filter(item => item.query.toLowerCase() !== trimmed.toLowerCase());
    
    const newItem: SearchHistoryItem = {
      id: `sh_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      query: trimmed,
      resultCount,
      timestamp: Date.now()
    };

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Optional: asynchronous broadcast to backend if logged in
    fetch("/api/v1/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trimmed, resultCount })
    }).catch(() => {});
  } catch {}
}

export function removeSearchHistoryItem(id: string): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getSearchHistory();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
