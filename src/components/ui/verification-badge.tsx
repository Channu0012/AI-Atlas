import React from "react";
import { ToolVerification } from "@/types";
import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  verification: ToolVerification;
  className?: string;
  showDate?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  verification, 
  className,
  showDate = false 
}) => {
  const { status, lastVerifiedAt } = verification;

  if (status === "verified") {
    return (
      <span
        title={lastVerifiedAt ? `Verified on ${new Date(lastVerifiedAt).toLocaleDateString()}` : "Independently verified"}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
          className
        )}
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>Verified</span>
        {showDate && lastVerifiedAt && (
          <span className="text-emerald-500/70 font-normal">
            · {new Date(lastVerifiedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
          </span>
        )}
      </span>
    );
  }

  if (status === "needs-review") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20",
          className
        )}
      >
        <AlertCircle className="w-3 h-3 text-amber-400" />
        <span>Needs Review</span>
      </span>
    );
  }

  if (status === "inactive") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20",
          className
        )}
      >
        <XCircle className="w-3 h-3 text-rose-400" />
        <span>Inactive</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700",
        className
      )}
    >
      <Clock className="w-3 h-3 text-zinc-400" />
      <span>Pending</span>
    </span>
  );
};
