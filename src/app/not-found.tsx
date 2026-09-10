import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowLeft, Search, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-lg w-full text-center space-y-8 relative">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Logo badge */}
        <div className="inline-flex items-center justify-center">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 ring-2 ring-indigo-500/30 bg-black shadow-2xl shadow-indigo-500/20">
            <Image
              src="/images/ai-atlas-logo.png"
              alt="AI Atlas"
              fill
              sizes="64px"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Status & Message */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-semibold text-indigo-400">
            <span>404 · PAGE NOT FOUND</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Lost in the AI Universe?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
            The page or model you are looking for has shifted coordinates or does not exist in our catalog.
          </p>
        </div>

        {/* Quick Nav Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/25"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/ask"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-xs sm:text-sm transition"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Search Tools</span>
          </Link>

          <Link
            href="/tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-xs sm:text-sm transition"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Explore All</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
