"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Search, 
  Compass, 
  Workflow, 
  Scale, 
  Layers, 
  Bookmark, 
  User, 
  Menu, 
  X,
  PlusCircle,
  Command,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/plan", label: "AI Planner", icon: Sparkles },
    { href: "/tools", label: "Discover", icon: Compass },
    { href: "/workflows", label: "Workflows", icon: Workflow },
    { href: "/stacks", label: "Stacks", icon: Layers },
    { href: "/compare", label: "Compare", icon: Scale }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/70 transition-all">
      {/* Subtle iridescent top border glow */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 border border-white/10 ring-1 ring-white/5 bg-black shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/ai-atlas-logo.png"
              alt="AI Atlas"
              fill
              priority
              sizes="40px"
              className="object-cover"
            />
          </div>
          <span className="text-[17px] sm:text-lg font-extrabold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
            AI Atlas
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all duration-200",
                  isActive
                    ? "text-white bg-white/[0.08] shadow-inner font-semibold"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-indigo-400" : "text-zinc-400")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Controls (Public Header - ZERO Admin references) */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Quick Search Shortcut */}
          <Link
            href="/ask"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-white/[0.08] text-xs text-zinc-400 hover:text-zinc-200 transition shadow-inner"
            title="Search AI Atlas"
            aria-label="Search AI Atlas tools"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline text-zinc-400">Search tools...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-white/5">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </Link>

          {/* Submit Tool secondary CTA */}
          <Link
            href="/submit-tool"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.06] border border-white/[0.08] transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Submit Tool</span>
          </Link>

          {/* User Status / Profile */}
          {user && user.role !== "admin" ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800/80">
              <Link
                href="/saved-tools"
                title="Saved Tools"
                aria-label="Saved Tools"
                className={cn(
                  "p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition relative",
                  pathname === "/saved-tools" && "text-white bg-white/[0.08]"
                )}
              >
                <Bookmark className="w-4 h-4" />
                {user.savedToolIds && user.savedToolIds.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-zinc-950" />
                )}
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800/90 border border-white/[0.08] text-xs font-medium text-zinc-200 transition"
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  {user.displayName?.charAt(0) || "U"}
                </div>
                <span className="max-w-[80px] truncate">{user.displayName?.split(" ")[0] || "Profile"}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800/90 border border-white/[0.08] text-xs font-medium text-zinc-200 transition"
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  {user?.displayName?.charAt(0) || "A"}
                </div>
                <span className="max-w-[90px] truncate">
                  {user?.displayName ? user.displayName.split(" ")[0] : "Profile"}
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/ask"
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Public - ZERO Admin references) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-zinc-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "text-white bg-white/[0.08] font-semibold"
                    : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-zinc-400")} />
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-zinc-800/80 space-y-1.5">
            <Link
              href="/saved-tools"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition",
                pathname === "/saved-tools"
                  ? "text-white bg-white/[0.08] font-semibold"
                  : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Bookmark className={cn("w-4 h-4", pathname === "/saved-tools" ? "text-indigo-400" : "text-zinc-400")} />
                <span>Saved Bookmarks</span>
              </div>
              {user?.savedToolIds && user.savedToolIds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user.savedToolIds.length}
                </span>
              )}
            </Link>

            <Link
              href="/submit-tool"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:bg-white/[0.04] hover:text-white"
            >
              <PlusCircle className="w-4 h-4 text-zinc-400" />
              <span>Submit Verified Tool</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:bg-white/[0.04] hover:text-white"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-zinc-400" />
                <span>My Profile & Preferences</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
