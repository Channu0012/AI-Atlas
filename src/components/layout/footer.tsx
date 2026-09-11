import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Globe
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Verification Guarantee */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <Link href="/" aria-label="AI Atlas Home" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 ring-1 ring-white/5 bg-black shrink-0">
                <Image
                  src="/images/ai-atlas-logo.png"
                  alt="AI Atlas"
                  fill
                  sizes="32px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-base font-extrabold text-white tracking-wider group-hover:text-indigo-200 transition-colors">
                AI Atlas
              </span>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              The decision engine and stack builder for verified artificial intelligence tools. Enter your goal to synthesize deterministic pipelines with zero hallucinated pricing.
            </p>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Verified Specifications & Tier Pricing.</span>
            </div>

            {/* Social Presence Profiles (X, LinkedIn, YouTube, Facebook, Instagram, GitHub) */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-zinc-300 block mb-2 uppercase tracking-wider">
                Official Channels
              </span>
              <div className="flex items-center gap-2 text-zinc-400">
                {/* X / Twitter */}
                <a
                  href="https://x.com/aiatlas_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow AI Atlas on X (formerly Twitter)"
                  title="AI Atlas on X"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/ai-atlas-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with AI Atlas on LinkedIn"
                  title="AI Atlas on LinkedIn"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74v-8.37H5.06v8.37z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@aiatlas-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to AI Atlas on YouTube"
                  title="AI Atlas on YouTube"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/aiatlas.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit AI Atlas on Facebook"
                  title="AI Atlas on Facebook"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/aiatlas.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow AI Atlas on Instagram"
                  title="AI Atlas on Instagram"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/Channu0012/AI-Atlas"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View AI Atlas open-source repository on GitHub"
                  title="AI Atlas on GitHub"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Discovery */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
              Discovery & Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/ask" className="hover:text-white transition">
                  Natural Language AI Search
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition">
                  Verified Tool Directory
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="hover:text-white transition">
                  Outcome-Based Use Cases
                </Link>
              </li>
              <li>
                <Link href="/tools?collection=best-free" className="hover:text-white transition">
                  100% Free AI Software
                </Link>
              </li>
              <li>
                <Link href="/tools?collection=developers" className="hover:text-white transition">
                  Developer Frameworks & IDEs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Decisions & Stacks */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
              Decisions & Blueprints
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/compare" className="hover:text-white transition">
                  Side-by-Side Tool Comparison
                </Link>
              </li>
              <li>
                <Link href="/workflows" className="hover:text-white transition">
                  Curated AI Workflows
                </Link>
              </li>
              <li>
                <Link href="/stacks" className="hover:text-white transition">
                  AI Stack Builder & Calculator
                </Link>
              </li>
              <li>
                <Link href="/plan" className="hover:text-white transition">
                  Interactive AI Goal Planner
                </Link>
              </li>
              <li>
                <Link href="/submit-tool" className="hover:text-white transition">
                  Submit a Verified Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Standards, Contact & LLM SEO */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
              Corporate & Standards
            </h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
                <span>548 Market St, Suite 48201, San Francisco, CA 94104</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <a href="mailto:contact@ai-atlas-app.vercel.app" className="hover:text-white transition">
                  contact@ai-atlas-app.vercel.app
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>+1 (800) 555-0199</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/60 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-indigo-400" />
                <a href="/llms.txt" className="hover:text-white transition font-mono">
                  /llms.txt (GEO / AI Crawler Spec)
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-cyan-400" />
                <a href="/sitemap.xml" className="hover:text-white transition font-mono">
                  /sitemap.xml (Search Index)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Principles */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} AI Atlas Technologies Inc. All rights reserved. Production Grade Decision Engine.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Deterministic Compatibility</span>
            <span>·</span>
            <span>Zero Hallucinated Tiers</span>
            <span>·</span>
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
