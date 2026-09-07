import { Tool, SearchIntent } from "@/types";

/**
 * Hard Constraint Filtering:
 * Deterministically removes candidates that violate explicit user constraints.
 * A higher score will never override a hard constraint.
 */
export function applyHardConstraints(candidates: Tool[], intent: SearchIntent): {
  survivingCandidates: Tool[];
  filteredOutReasons: Record<string, string>;
} {
  const filteredOutReasons: Record<string, string> = {};

  const survivingCandidates = candidates.filter(tool => {
    // 1. Free only constraint
    if (intent.budget?.freeOnly) {
      const isFree = tool.pricing.model === "free" || tool.pricing.freePlan;
      if (!isFree) {
        filteredOutReasons[tool.id] = "Excluded: Requires paid subscription (User requested free only)";
        return false;
      }
    }

    // 2. Budget ceiling constraint (if specified)
    if (intent.budget?.amount !== undefined && intent.budget.amount > 0) {
      // Normalize currency roughly: 1 USD ~ 85 INR
      let maxMonthlyUsd = intent.budget.amount;
      if (intent.budget.currency === "INR") {
        maxMonthlyUsd = intent.budget.amount / 85;
      }

      const hasFreeAccess = tool.pricing.freePlan || tool.pricing.model === "free";
      const startingPrice = tool.pricing.startingPrice || 0;

      // If no free tier and starting price exceeds budget
      if (!hasFreeAccess && startingPrice > maxMonthlyUsd) {
        filteredOutReasons[tool.id] = `Excluded: Starting price ($${startingPrice}/mo) exceeds budget`;
        return false;
      }
    }

    // 3. Must have API constraint
    if (intent.constraints?.includes("must-have-api") || intent.priorities?.includes("api")) {
      if (!tool.api.available) {
        filteredOutReasons[tool.id] = "Excluded: No public developer API available";
        return false;
      }
    }

    // 4. Open source only constraint
    if (intent.constraints?.includes("open-source-only") || intent.priorities?.includes("open-source")) {
      if (!tool.openSource) {
        filteredOutReasons[tool.id] = "Excluded: Proprietary license (User requested open-source only)";
        return false;
      }
    }

    // 5. Platform compatibility constraints
    if (intent.platform && intent.platform.length > 0) {
      for (const requiredPlatform of intent.platform) {
        const p = requiredPlatform.toLowerCase();
        if (p === "ios" && !tool.platforms.ios) {
          filteredOutReasons[tool.id] = "Excluded: Missing iOS support";
          return false;
        }
        if (p === "android" && !tool.platforms.android) {
          filteredOutReasons[tool.id] = "Excluded: Missing Android support";
          return false;
        }
        if (p === "windows" && !tool.platforms.windows && !tool.platforms.web) {
          filteredOutReasons[tool.id] = "Excluded: Missing Windows support";
          return false;
        }
        if (p === "mac" && !tool.platforms.mac && !tool.platforms.web) {
          filteredOutReasons[tool.id] = "Excluded: Missing macOS support";
          return false;
        }
        if (p === "linux" && !tool.platforms.linux && !tool.platforms.web) {
          filteredOutReasons[tool.id] = "Excluded: Missing Linux support";
          return false;
        }
      }
    }

    return true;
  });

  return { survivingCandidates, filteredOutReasons };
}
