"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Search, 
  Compass, 
  Workflow, 
  Scale, 
  Layers, 
  Bookmark, 
  ShieldAlert, 
  User, 
  Menu, 
  X,
  PlusCircle
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAdmin, switchRoleForDev } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/plan", label: "AI Planner", icon: Sparkles, highlight: true },
    { href: "/tools", label: "Discover", icon: Compass },
    { href: "/categories", label: "Categories", icon: Layers },
    { href: "/workflows", label: "Workflows", icon: Workflow },
    { href: "/stacks", label: "Stacks", icon: Layers },
    { href: "/compare", label: "Compare", icon: Scale },
    { href: "/ask", label: "AI Search", icon: Search }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              AI ATLAS
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                91 Verified · Planner Suite
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition",
                  isActive
                    ? "text-white bg-zinc-800/70"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60",
                  link.highlight && "text-indigo-400 hover:text-indigo-300 font-semibold"
                )}
              >
                <Icon className={cn("w-4 h-4", link.highlight ? "text-indigo-400" : "text-zinc-400")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/submit-tool"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded-md hover:bg-zinc-900 transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-400" />
            Submit Tool
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition",
                pathname.startsWith("/admin")
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
              )}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <Link
                href="/saved-tools"
                title="Saved Tools"
                className={cn(
                  "p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition relative",
                  pathname === "/saved-tools" && "text-white bg-zinc-800"
                )}
              >
                <Bookmark className="w-4 h-4" />
                {user.savedToolIds.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
                )}
              </Link>

              <Link
                href="/stacks"
                title="My Stacks"
                className={cn(
                  "p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition",
                  pathname.startsWith("/stacks") && "text-white bg-zinc-800"
                )}
              >
                <Layers className="w-4 h-4" />
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                  {user.displayName?.charAt(0) || "U"}
                </div>
                <span>{user.displayName?.split(" ")[0] || "Profile"}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                  isActive
                    ? "text-white bg-zinc-800"
                    : "text-zinc-300 hover:bg-zinc-900",
                  link.highlight && "text-indigo-400 font-semibold"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 mt-3 border-t border-zinc-800 space-y-1">
            <Link
              href="/submit-tool"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Tool
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-400 bg-amber-500/10"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Console
              </Link>
            )}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300"
            >
              <User className="w-4 h-4" />
              Profile & Saved Tools
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
