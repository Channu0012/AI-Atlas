"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types";
import { auth, isFirebaseConfigured } from "@/lib/firebase/config";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name?: string) => Promise<void>;
  loginAsAdmin: (password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  toggleSaveTool: (toolId: string) => void;
  isToolSaved: (toolId: string) => boolean;
  switchRoleForDev: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default guest profile (Standard public user — never default admin)
const DEFAULT_GUEST_USER: UserProfile = {
  id: "guest-user",
  email: "explorer@ai-atlas.dev",
  displayName: "AI Explorer",
  role: "user",
  onboardingCompleted: true,
  profile: {
    userType: "creator",
    interests: ["AI Coding", "AI Video", "Automation"],
    skillLevel: "intermediate"
  },
  preferences: {
    currency: "USD",
    preferFree: false,
    preferOpenSource: false
  },
  savedToolIds: ["chatgpt", "cursor", "perplexity"],
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z"
};

const AUTHORIZED_ADMIN_EMAIL = "channupatil@gmail.com";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local storage saved user or default guest
    const savedLocal = typeof window !== "undefined" ? localStorage.getItem("ai_atlas_user") : null;
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        setUser(parsed);
      } catch {
        setUser(DEFAULT_GUEST_USER);
      }
    } else {
      setUser(DEFAULT_GUEST_USER);
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const isUserAdmin = fbUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL;
          const profile: UserProfile = {
            id: fbUser.uid,
            email: fbUser.email || undefined,
            displayName: fbUser.displayName || (isUserAdmin ? "Channu Patil (Admin)" : "Explorer"),
            photoURL: fbUser.photoURL || undefined,
            role: isUserAdmin ? "admin" : "user",
            onboardingCompleted: true,
            profile: {},
            preferences: {},
            savedToolIds: user?.savedToolIds || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setUser(profile);
          if (typeof window !== "undefined") {
            localStorage.setItem("ai_atlas_user", JSON.stringify(profile));
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } else {
      const devUser: UserProfile = {
        ...DEFAULT_GUEST_USER,
        id: `google-user-${Date.now()}`,
        email: "google.explorer@gmail.com",
        displayName: "Google Explorer",
        role: "user"
      };
      setUser(devUser);
      localStorage.setItem("ai_atlas_user", JSON.stringify(devUser));
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      const isAuthorizedAdmin = email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL;
      const devUser: UserProfile = {
        ...DEFAULT_GUEST_USER,
        id: isAuthorizedAdmin ? "admin-channu-patil" : `user-${Date.now()}`,
        email,
        displayName: isAuthorizedAdmin ? "Channu Patil (Admin)" : email.split("@")[0],
        role: isAuthorizedAdmin ? "admin" : "user"
      };
      setUser(devUser);
      localStorage.setItem("ai_atlas_user", JSON.stringify(devUser));
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    if (isFirebaseConfigured && auth) {
      await createUserWithEmailAndPassword(auth, email, pass);
    } else {
      const devUser: UserProfile = {
        ...DEFAULT_GUEST_USER,
        id: `user-${Date.now()}`,
        email,
        displayName: name || email.split("@")[0],
        role: "user"
      };
      setUser(devUser);
      localStorage.setItem("ai_atlas_user", JSON.stringify(devUser));
    }
  };

  /**
   * Secure admin authentication against server-side endpoint.
   * Password is verified on backend via environment variables without hardcoding.
   */
  const loginAsAdmin = async (password: string, email: string = AUTHORIZED_ADMIN_EMAIL) => {
    try {
      const res = await fetch("/api/v1/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Administrative authentication failed." };
      }

      setUser(data.user);
      if (typeof window !== "undefined") {
        localStorage.setItem("ai_atlas_user", JSON.stringify(data.user));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during admin authentication." };
    }
  };

  const signOut = async () => {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    try {
      await fetch("/api/v1/auth/admin-login", { method: "DELETE" });
    } catch {
      // ignore
    }
    setUser(DEFAULT_GUEST_USER);
    if (typeof window !== "undefined") {
      localStorage.setItem("ai_atlas_user", JSON.stringify(DEFAULT_GUEST_USER));
    }
  };

  const toggleSaveTool = (toolId: string) => {
    if (!user) return;
    const isSaved = user.savedToolIds.includes(toolId);
    const updatedIds = isSaved
      ? user.savedToolIds.filter(id => id !== toolId)
      : [...user.savedToolIds, toolId];

    const updatedUser = { ...user, savedToolIds: updatedIds };
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("ai_atlas_user", JSON.stringify(updatedUser));
    }
  };

  const isToolSaved = (toolId: string) => {
    return Boolean(user?.savedToolIds.includes(toolId));
  };

  const switchRoleForDev = (role: UserRole) => {
    if (!user) return;
    const updatedUser: UserProfile = { ...user, role };
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("ai_atlas_user", JSON.stringify(updatedUser));
    }
  };

  // Strictly enforce admin eligibility: user role must be admin AND email must match channupatil@gmail.com
  const isAdmin = Boolean(
    user && 
    user.role === "admin" && 
    user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        loginAsAdmin,
        signOut,
        toggleSaveTool,
        isToolSaved,
        switchRoleForDev
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
