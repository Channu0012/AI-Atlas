"use client";

import React, { useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { ShieldAlert, Lock, ArrowRight, CheckCircle2, Eye, EyeOff, Sparkles, Key } from "lucide-react";
import Image from "next/image";

interface AdminAuthGateProps {
  children: React.ReactNode;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ children }) => {
  const { user, isAdmin, loginAsAdmin } = useAuth();
  const [email, setEmail] = useState("channupatil@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAdmin) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your administrator password.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await loginAsAdmin(password, email);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Authentication failed. Invalid administrator credentials.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl relative overflow-hidden space-y-6">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -z-10 h-40 w-64 rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none" />

        {/* Brand Lockup */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-white/10 ring-2 ring-indigo-500/20">
            <Image
              src="/images/ai-atlas-logo.png"
              alt="AI Atlas Emblem"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-semibold tracking-wide">
              <ShieldAlert className="w-3.5 h-3.5" />
              Restricted Control Center
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
              Administrator Authorization
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
              Direct access is restricted to verified system operators. Enter designated credentials to unlock governance controls.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs tracking-wide transition shadow-lg shadow-indigo-500/25 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Authorize & Unlock Admin Console</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-900 text-center">
          <p className="text-[11px] text-zinc-500">
            Protected by AI Atlas Server-Side Environment Authentication
          </p>
        </div>
      </div>
    </div>
  );
};
