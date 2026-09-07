"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { Sparkles, Lock, Mail, User, AlertCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUpWithEmail(email, password, name);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-600/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Create your AI Atlas Account
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Save verified tools, compose private stacks, and customize recommendations.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl space-y-6">
        {error && (
          <div className="p-3 rounded-xl border border-rose-800/40 bg-rose-950/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
