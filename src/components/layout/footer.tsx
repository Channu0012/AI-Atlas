import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">AI ATLAS</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The decision engine for AI tools. Describe what you want to accomplish, and AI Atlas finds the verified tools and builds the right workflow for you.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero hallucinated pricing or fake stats.</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Discovery</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/ask" className="hover:text-white transition">Natural Language AI Search</Link></li>
            <li><Link href="/tools" className="hover:text-white transition">Verified Tool Directory</Link></li>
            <li><Link href="/categories" className="hover:text-white transition">Taxonomy & Categories</Link></li>
            <li><Link href="/use-cases" className="hover:text-white transition">Use Cases</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Decisions & Stacks</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/compare" className="hover:text-white transition">Tool Comparison Matrix</Link></li>
            <li><Link href="/workflows" className="hover:text-white transition">Curated AI Workflows</Link></li>
            <li><Link href="/stacks" className="hover:text-white transition">AI Stack Builder</Link></li>
            <li><Link href="/submit-tool" className="hover:text-white transition">Submit a Verified Tool</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Platform Principles</h4>
          <p className="text-xs text-zinc-500 leading-relaxed mb-3">
            The database is our source of truth. Every published capability, platform compatibility, and pricing tier undergoes strict human and automated verification.
          </p>
          <div className="text-[11px] text-zinc-500">
            © {new Date().getFullYear()} AI Atlas. Production Grade.
          </div>
        </div>
      </div>
    </footer>
  );
};
