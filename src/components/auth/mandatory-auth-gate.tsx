"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Layers,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MandatoryAuthGate: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, loading, signInWithEmail, signUpWithEmail, quickDemoAccess } = useAuth();

  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [unlockedAnimation, setUnlockedAnimation] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bypass on admin route since /admin has its own dedicated administrative password challenge
  const isAdminRoute = pathname?.startsWith("/admin");
  const shouldShow = mounted && !loading && !isAuthenticated && !isAdminRoute;

  useEffect(() => {
    if (shouldShow && !unlockedAnimation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [shouldShow, unlockedAnimation]);

  if (!shouldShow) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signUpWithEmail(email.trim(), password, name.trim());
      } else {
        await signInWithEmail(email.trim(), password);
      }
      setUnlockedAnimation(true);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInstantDemo = () => {
    setSubmitting(true);
    setTimeout(() => {
      quickDemoAccess();
      setUnlockedAnimation(true);
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[99999] overflow-y-auto bg-black/85 backdrop-blur-2xl transition-all duration-700 p-4 sm:p-6 flex min-h-full items-center justify-center py-8 sm:py-12",
      unlockedAnimation && "opacity-0 pointer-events-none scale-105"
    )}>
      {/* Background Animated Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      {/* Futuristic Cosmic Modal */}
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-indigo-500/30 bg-zinc-950/95 p-5 sm:p-8 shadow-2xl shadow-indigo-950/50 backdrop-blur-3xl overflow-hidden my-auto">
        {/* Top Glowing Beam */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />

        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="relative mx-auto w-16 h-16 rounded-2xl overflow-hidden border border-white/15 bg-black p-1 shadow-xl shadow-indigo-500/25 ring-2 ring-indigo-500/30">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src="/images/ai-atlas-logo.png"
                alt="AI Atlas"
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 rounded-2xl border border-cyan-400/40 animate-pulse pointer-events-none" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-400 mb-2">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>AI ATLAS UNIVERSE GATEWAY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Unlock the AI Universe
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Create your free account to access 1,000+ verified tools, deterministic stack planning, and live Kie.ai solutions.
            </p>
          </div>
        </div>

        {/* Tab Switcher (Sign Up / Sign In) */}
        <div className="flex rounded-xl bg-zinc-900/80 p-1 border border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null); }}
            className={cn(
              "flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              mode === "signup"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(null); }}
            className={cn(
              "flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              mode === "signin"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-gate-name" className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Full Name
              </label>
              <input
                id="auth-gate-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-gate-email" className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Email Address
            </label>
            <input
              id="auth-gate-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
            />
          </div>

          <div>
            <label htmlFor="auth-gate-password" className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Password
            </label>
            <input
              id="auth-gate-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm tracking-wide transition shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Authenticating Gateway...</span>
            ) : mode === "signup" ? (
              <>
                <span>Create Account & Unlock Universe</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In to Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
            <span className="bg-zinc-950 px-2 text-zinc-500">Quick Testing Bypass</span>
          </div>
        </div>

        {/* 1-Click Instant Demo Button */}
        <button
          type="button"
          onClick={handleInstantDemo}
          disabled={submitting}
          className="w-full py-2.5 px-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-cyan-500/50"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>⚡ Instant 1-Click Access (Skip for Review)</span>
        </button>

        {/* Security & Feature Guarantees */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Free Access
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Kie.ai Layer Active
          </span>
        </div>
      </div>
    </div>
  );
};
