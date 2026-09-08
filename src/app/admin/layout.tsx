"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AdminAuthGate } from "@/components/admin/admin-auth-gate";
import { useAuth } from "@/features/auth/auth-context";
import { 
  ShieldCheck, 
  Layers, 
  PlusCircle, 
  LogOut, 
  ExternalLink, 
  LayoutDashboard,
  UploadCloud
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        {/* Dedicated Admin Header */}
        <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Admin Brand */}
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2.5 group">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-indigo-500/20 border border-white/10 ring-1 ring-white/5 bg-black shrink-0">
                  <Image
                    src="/images/ai-atlas-logo.png"
                    alt="AI Atlas Logo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold tracking-wider text-white">AI ATLAS</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      ADMIN CONSOLE
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {user?.email || "channupatil@gmail.com"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Admin Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  pathname === "/admin"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>

              <Link
                href="/admin/tools"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  pathname === "/admin/tools"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                Manage Tools
              </Link>

              <Link
                href="/admin/import"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  pathname === "/admin/import"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Bulk Import
              </Link>

              <Link
                href="/admin/tools/new"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  pathname === "/admin/tools/new"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add New Tool
              </Link>
            </nav>

            {/* Admin Right Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded-lg hover:bg-zinc-900 transition"
              >
                <span>Exit to Public Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <button
                onClick={() => signOut()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Admin Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-1">{children}</main>
      </div>
    </AdminAuthGate>
  );
}
