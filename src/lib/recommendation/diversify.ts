import { RecommendationResultItem, Tool } from "@/types";

/**
 * Diversifies recommendation results so the top 3-5 options provide
 * distinct complementary strengths (e.g. one primary leader, one free option, one specialized tool).
 */
export function diversifyResults(
  rankedItems: RecommendationResultItem[],
  maxTopResults = 5
): {
  topRecommendations: RecommendationResultItem[];
  alternatives: { forToolId: string; tool: Tool; relation: string }[];
} {
  if (rankedItems.length <= maxTopResults) {
    return {
      topRecommendations: rankedItems,
      alternatives: []
    };
  }

  const top: RecommendationResultItem[] = [];
  const remaining: RecommendationResultItem[] = [];
  const seenCompanies = new Set<string>();

  for (const item of rankedItems) {
    const company = item.tool.company.name.toLowerCase();
    // Allow at most 2 tools from the exact same company in top 5 to ensure healthy diversity
    const countFromCompany = top.filter(t => t.tool.company.name.toLowerCase() === company).length;

    if (top.length < maxTopResults && countFromCompany < 2) {
      top.push(item);
      seenCompanies.add(company);
    } else {
      remaining.push(item);
    }
  }

  // Generate alternatives mapping for top items
  const alternatives: { forToolId: string; tool: Tool; relation: string }[] = [];
  for (const topItem of top) {
    // Find closest remaining tool in same category
    const alt = remaining.find(r => 
      r.tool.id !== topItem.tool.id &&
      r.tool.categoryIds.some(cat => topItem.tool.categoryIds.includes(cat))
    );
    if (alt) {
      let relation = "Alternative Option";
      if (alt.tool.pricing.freePlan && !topItem.tool.pricing.freePlan) {
        relation = "Free Alternative";
      } else if (alt.tool.openSource && !topItem.tool.openSource) {
        relation = "Open-Source Alternative";
      } else if (alt.tool.difficulty === "beginner" && topItem.tool.difficulty !== "beginner") {
        relation = "Easier Alternative";
      }
      alternatives.push({
        forToolId: topItem.tool.id,
        tool: alt.tool,
        relation
      });
    }
  }

  return {
    topRecommendations: top,
    alternatives
  };
}
