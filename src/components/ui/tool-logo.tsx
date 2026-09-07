"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ToolLogoProps {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const ToolLogo: React.FC<ToolLogoProps> = ({ 
  name, 
  logoUrl, 
  size = "md", 
  className 
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-10 h-10 text-sm font-semibold",
    lg: "w-14 h-14 text-base font-bold",
    xl: "w-18 h-18 text-xl font-bold"
  };

  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800/80 bg-zinc-900 shadow-sm",
        sizeClasses[size],
        className
      )}
    >
      {logoUrl && !hasError ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="w-full h-full object-contain p-1.5"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 via-zinc-900 to-zinc-950 flex items-center justify-center text-indigo-300">
          {initial ? <span>{initial}</span> : <Sparkles className="w-4 h-4" />}
        </div>
      )}
    </div>
  );
};
