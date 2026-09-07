import { Tool, SearchIntent, RecommendationResultItem } from "@/types";
import { scoreTool, ScoreBreakdown, RecommendationWeights } from "./score";

/**
 * Ranks tools and assigns justified highlight badges.
 */
export function rankCandidates(
  candidates: Tool[],
  intent: SearchIntent,
  weights: RecommendationWeights
): RecommendationResultItem[] {
  const scoredItems: { tool: Tool; scoreData: ScoreBreakdown }[] = candidates.map(tool => ({
    tool,
    scoreData: scoreTool(tool, intent, weights)
  }));

  // Sort descending by finalScore
  scoredItems.sort((a, b) => b.scoreData.finalScore - a.scoreData.finalScore);

  const usedBadges = new Set<string>();

  return scoredItems.map((item, index) => {
    let badgeLabel: RecommendationResultItem["badgeLabel"] = undefined;

    if (index === 0 && !usedBadges.has("Best Overall")) {
      badgeLabel = "Best Overall";
      usedBadges.add(badgeLabel);
    } else if ((item.tool.pricing.freePlan || item.tool.pricing.model === "free") && !usedBadges.has("Best Free")) {
      badgeLabel = "Best Free";
      usedBadges.add(badgeLabel);
    } else if (item.tool.difficulty === "beginner" && intent.skillLevel === "beginner" && !usedBadges.has("Best for Beginners")) {
      badgeLabel = "Best for Beginners";
      usedBadges.add(badgeLabel);
    } else if (item.tool.api.available && !usedBadges.has("Best for API") && intent.priorities?.includes("api")) {
      badgeLabel = "Best for API";
      usedBadges.add(badgeLabel);
    } else if (item.tool.categoryIds.includes("cat-coding") && !usedBadges.has("Best for Developers")) {
      badgeLabel = "Best for Developers";
      usedBadges.add(badgeLabel);
    } else if ((item.tool.pricing.startingPrice || 0) <= 15 && !usedBadges.has("Best Value")) {
      badgeLabel = "Best Value";
      usedBadges.add(badgeLabel);
    }

    return {
      tool: item.tool,
      score: item.scoreData.finalScore,
      rank: index + 1,
      badgeLabel,
      reasonCodes: item.scoreData.reasonCodes,
      whyRecommended: `Matches your requirement for ${item.tool.tagline}`,
      keyLimitations: item.tool.limitations.slice(0, 2),
      componentScores: {
        useCaseMatch: item.scoreData.useCaseMatch,
        capabilityMatch: item.scoreData.capabilityMatch,
        budgetFit: item.scoreData.budgetFit,
        quality: item.scoreData.quality,
        skillFit: item.scoreData.skillFit,
        reliability: item.scoreData.reliability,
        platformFit: item.scoreData.platformFit
      }
    };
  });
}
