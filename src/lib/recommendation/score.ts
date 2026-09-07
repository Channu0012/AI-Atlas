import { Tool, SearchIntent, RecommendationWeights } from "@/types";

export const DEFAULT_WEIGHTS: RecommendationWeights = {
  useCase: 0.35,
  capability: 0.25,
  budget: 0.15,
  quality: 0.10,
  skill: 0.05,
  reliability: 0.05,
  platform: 0.05
};

export type { RecommendationWeights } from "@/types";

/**
 * Dynamically adjusts scoring weights based on user intent signals.
 */
export function calculateDynamicWeights(intent: SearchIntent): RecommendationWeights {
  const weights: RecommendationWeights = { ...DEFAULT_WEIGHTS };

  if (intent.priorities?.includes("quality")) {
    weights.quality = 0.25;
    weights.budget = 0.05;
  } else if (intent.priorities?.includes("cost") || intent.budget?.freeOnly) {
    weights.budget = 0.25;
    weights.quality = 0.05;
  }

  if (intent.priorities?.includes("ease-of-use") || intent.skillLevel === "beginner") {
    weights.skill = 0.10;
    weights.useCase = 0.30;
  }

  // Normalize to ensure sum is strictly 1.0
  const total = Object.values(weights).reduce((acc, val) => acc + (val ?? 0), 0);
  for (const k of Object.keys(weights) as (keyof RecommendationWeights)[]) {
    const val = weights[k];
    if (val !== undefined) {
      weights[k] = Number((val / total).toFixed(4));
    }
  }

  return weights;
}

export interface ScoreBreakdown {
  finalScore: number; // 0 - 100
  useCaseMatch: number; // 0 - 1
  capabilityMatch: number; // 0 - 1
  budgetFit: number; // 0 - 1
  quality: number; // 0 - 1
  skillFit: number; // 0 - 1
  reliability: number; // 0 - 1
  platformFit: number; // 0 - 1
  reasonCodes: string[];
}

/**
 * Computes deterministic weighted sum recommendation score for a tool.
 */
export function scoreTool(tool: Tool, intent: SearchIntent, weights: RecommendationWeights): ScoreBreakdown {
  const reasonCodes: string[] = [];

  // 1. Capability Match (0 to 1)
  let capabilityMatch = 0.5;
  if (intent.requiredCapabilities.length > 0) {
    const matchedCount = intent.requiredCapabilities.filter(capId => 
      tool.capabilityIds.includes(capId)
    ).length;
    capabilityMatch = matchedCount / intent.requiredCapabilities.length;
    if (capabilityMatch >= 0.8) {
      reasonCodes.push("HIGH_CAPABILITY_MATCH");
    }
  }

  // 2. Use Case Match (0 to 1)
  let useCaseMatch = 0.5;
  const goalLower = intent.goal.toLowerCase();
  const matchesNameOrTagline = goalLower.includes(tool.name.toLowerCase()) || 
    tool.useCaseIds.some(uc => goalLower.includes(uc.replace("uc-", "")));
  if (matchesNameOrTagline) {
    useCaseMatch = 0.95;
    reasonCodes.push("EXACT_GOAL_MATCH");
  } else if (capabilityMatch > 0.6) {
    useCaseMatch = 0.8;
  }

  // 3. Budget Fit (0 to 1)
  let budgetFit = 0.7;
  if (intent.budget?.freeOnly) {
    budgetFit = (tool.pricing.model === "free" || tool.pricing.freePlan) ? 1.0 : 0.0;
    if (budgetFit === 1.0) reasonCodes.push("VERIFIED_FREE_TIER");
  } else if (intent.budget?.amount !== undefined && intent.budget.amount > 0) {
    let maxUsd = intent.budget.amount;
    if (intent.budget.currency === "INR") maxUsd /= 85;
    const price = tool.pricing.startingPrice || 0;
    if (price <= maxUsd) {
      budgetFit = 0.95;
      reasonCodes.push("WITHIN_BUDGET");
    } else if (tool.pricing.freePlan) {
      budgetFit = 0.75;
      reasonCodes.push("HAS_FREE_TIER");
    } else {
      budgetFit = 0.3;
    }
  } else {
    if (tool.pricing.freePlan || tool.pricing.model === "free") {
      budgetFit = 0.9;
    }
  }

  // 4. Quality (0 to 1)
  // Derived from community saves, verification, and rating
  let quality = 0.75;
  if (tool.verification.status === "verified") quality += 0.15;
  if (tool.metrics.saveCount > 2500) quality += 0.10;
  quality = Math.min(1.0, quality);

  // 5. Skill Level Fit (0 to 1)
  let skillFit = 0.8;
  if (intent.skillLevel) {
    if (tool.difficulty === intent.skillLevel) {
      skillFit = 1.0;
      reasonCodes.push("MATCHES_SKILL_LEVEL");
    } else if (intent.skillLevel === "beginner" && tool.difficulty === "professional") {
      skillFit = 0.4;
    } else if (intent.skillLevel === "professional" && tool.difficulty === "beginner") {
      skillFit = 0.7;
    }
  }

  // 6. Reliability (0 to 1)
  let reliability = 0.7;
  if (tool.verification.websiteChecked && tool.verification.pricingChecked) {
    reliability = 0.95;
    reasonCodes.push("FULLY_VERIFIED");
  }

  // 7. Platform Fit (0 to 1)
  let platformFit = 1.0;
  if (intent.platform && intent.platform.length > 0) {
    const hasEveryPlatform = intent.platform.every(p => {
      const key = p.toLowerCase() as keyof typeof tool.platforms;
      return Boolean(tool.platforms[key] || tool.platforms.web);
    });
    platformFit = hasEveryPlatform ? 1.0 : 0.5;
  }

  // WEIGHTED SUM:
  const rawScore =
    useCaseMatch * weights.useCase +
    capabilityMatch * weights.capability +
    budgetFit * weights.budget +
    quality * weights.quality +
    skillFit * weights.skill +
    reliability * weights.reliability +
    platformFit * weights.platform;

  const finalScore = Math.round(Math.min(100, Math.max(0, rawScore * 100)));

  return {
    finalScore,
    useCaseMatch: Number(useCaseMatch.toFixed(2)),
    capabilityMatch: Number(capabilityMatch.toFixed(2)),
    budgetFit: Number(budgetFit.toFixed(2)),
    quality: Number(quality.toFixed(2)),
    skillFit: Number(skillFit.toFixed(2)),
    reliability: Number(reliability.toFixed(2)),
    platformFit: Number(platformFit.toFixed(2)),
    reasonCodes
  };
}
