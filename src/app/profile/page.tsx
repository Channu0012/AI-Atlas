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
  Check 
} from "lucide-react";

export default function ProfilePage() {
  const { user, signOut, switchRoleForDev } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "Explorer");
  const [skillLevel, setSkillLevel] = useState(user?.profile.skillLevel || "intermediate");
  const [currency, setCurrency] = useState(user?.preferences.currency || "USD");
  const [preferFree, setPreferFree] = useState(user?.preferences.preferFree || false);
  const [preferOpenSource, setPreferOpenSource] = useState(user?.preferences.preferOpenSource || false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-600/20">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{displayName}</h1>
            <p className="text-xs text-zinc-400">{user?.email || "Local Demo Profile"}</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-rose-400 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: Navigation stats */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
              Workspace Overview
            </span>

            <Link
              href="/saved-tools"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-200">
                <Bookmark className="w-4 h-4 text-indigo-400" />
                <span>Saved Tools</span>
              </div>
              <span className="text-xs font-mono font-bold text-white">
                {user?.savedToolIds.length || 0}
              </span>
            </Link>

            <Link
              href="/stacks"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-200">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Composed Stacks</span>
              </div>
              <span className="text-xs font-mono font-bold text-white">
                1
              </span>
            </Link>

          </div>
        </div>

        {/* Right 2 Cols: Preferences Editor */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-lg space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>Recommendation & Search Preferences</span>
            </h2>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Your Default Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="beginner">Beginner (prioritize ease of use)</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="professional">Professional / Engineer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Default Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-zinc-800">
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

            <div className="pt-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Preferences Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Preferences</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
