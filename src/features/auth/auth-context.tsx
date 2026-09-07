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
  signOut: () => Promise<void>;
  toggleSaveTool: (toolId: string) => void;
  isToolSaved: (toolId: string) => boolean;
  switchRoleForDev: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default guest profile
const DEFAULT_DEMO_USER: UserProfile = {
  id: "demo-admin-user",
  email: "admin@ai-atlas.dev",
  displayName: "Admin Operator",
  role: "admin",
  onboardingCompleted: true,
  profile: {
    userType: "founder",
    interests: ["AI Coding", "AI Video", "Automation"],
    skillLevel: "intermediate"
  },
  preferences: {
    currency: "USD",
    preferFree: false,
    preferOpenSource: false
  },
  savedToolIds: ["chatgpt", "cursor", "v0-dev", "perplexity"],
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local storage saved user or demo user
    const savedLocal = typeof window !== "undefined" ? localStorage.getItem("ai_atlas_user") : null;
    if (savedLocal) {
      try {
        setUser(JSON.parse(savedLocal));
      } catch {
        setUser(DEFAULT_DEMO_USER);
      }
    } else {
      setUser(DEFAULT_DEMO_USER);
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const profile: UserProfile = {
            id: fbUser.uid,
            email: fbUser.email || undefined,
            displayName: fbUser.displayName || "Explorer",
            photoURL: fbUser.photoURL || undefined,
            role: fbUser.email?.includes("admin") ? "admin" : "user",
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
      // Offline fallback login
      const devUser: UserProfile = {
        ...DEFAULT_DEMO_USER,
        displayName: "Google Demo Explorer"
      };
      setUser(devUser);
      localStorage.setItem("ai_atlas_user", JSON.stringify(devUser));
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      const devUser: UserProfile = {
        ...DEFAULT_DEMO_USER,
        email,
        displayName: email.split("@")[0],
        role: email.includes("admin") ? "admin" : "user"
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
        ...DEFAULT_DEMO_USER,
        id: `user-${Date.now()}`,
        email,
        displayName: name || email.split("@")[0],
        role: "user"
      };
      setUser(devUser);
      localStorage.setItem("ai_atlas_user", JSON.stringify(devUser));
    }
  };

  const signOut = async () => {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai_atlas_user");
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "admin",
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
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
