import React from "react";
import { ToolPricing } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";

interface PricingBadgeProps {
  pricing: ToolPricing;
  className?: string;
  showPrice?: boolean;
}

export const PricingBadge: React.FC<PricingBadgeProps> = ({ pricing, className, showPrice = true }) => {
  const { model, freePlan, startingPrice, currency } = pricing;

  let label = "Paid";
  let colorStyles = "bg-amber-500/10 text-amber-400 border-amber-500/20";

  if (model === "free") {
    label = "100% Free";
    colorStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (model === "freemium" || freePlan) {
    label = showPrice && startingPrice ? `Free Plan + $${startingPrice}/mo` : "Freemium";
    colorStyles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  } else if (model === "custom") {
    label = "Enterprise";
    colorStyles = "bg-purple-500/10 text-purple-400 border-purple-500/20";
  } else if (startingPrice) {
    label = `${formatCurrency(startingPrice, currency || "USD")}/mo`;
    colorStyles = "bg-zinc-500/10 text-zinc-300 border-zinc-500/20";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide",
        colorStyles,
        className
      )}
    >
      {label}
    </span>
  );
};
