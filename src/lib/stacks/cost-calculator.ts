import { Tool, RedundancyWarning } from "@/types";

export interface StackCostCalculation {
  totalMonthlyUsd: number;
  hasUnknownPricing: boolean;
  itemized: {
    toolId: string;
    toolName: string;
    monthlyPrice: number | null;
    pricingModel: string;
    status: "free" | "paid" | "unknown";
  }[];
  redundancies: RedundancyWarning[];
  potentialMonthlySavings: number;
}

/**
 * Detects capability redundancies across tools in a stack.
 * Flags overlapping capabilities covered by multiple paid subscriptions.
 */
export function detectStackRedundancies(tools: Tool[]): RedundancyWarning[] {
  const warnings: RedundancyWarning[] = [];
  const capabilityMap = new Map<string, Tool[]>();

  // Group tools by capability
  for (const tool of tools) {
    for (const cap of tool.capabilityIds) {
      if (!capabilityMap.has(cap)) capabilityMap.set(cap, []);
      capabilityMap.get(cap)!.push(tool);
    }
  }

  // Evaluate overlapping capabilities
  capabilityMap.forEach((matchedTools, capId) => {
    // Only check for overlap when multiple tools share high-cost core capabilities
    const auditableCaps = ["text-generation", "code-generation", "text-to-image", "text-to-video", "web-research", "audio-generation"];
    if (matchedTools.length > 1 && auditableCaps.includes(capId)) {
      const paidTools = matchedTools.filter(t => t.pricing.model !== "free" && !t.pricing.freePlan);
      if (paidTools.length > 1) {
        const capName = capId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        const toolNames = paidTools.map(t => t.name);
        const sortedByPrice = [...paidTools].sort((a, b) => (a.pricing.startingPrice || 0) - (b.pricing.startingPrice || 0));
        const cheapestTool = sortedByPrice[0];
        const potentialSavings = paidTools
          .filter(t => t.id !== cheapestTool.id)
          .reduce((sum, t) => sum + (t.pricing.startingPrice || 0), 0);

        warnings.push({
          capabilityId: capId,
          capabilityName: capName,
          overlappingToolNames: toolNames,
          recommendation: `Both ${toolNames.join(" and ")} offer ${capName}. You can consolidate onto ${cheapestTool.name} to avoid duplicate subscription fees.`,
          potentialMonthlySavings: potentialSavings
        });
      }
    }
  });

  return warnings;
}

/**
 * Calculates genuine monthly stack cost strictly from verified database pricing.
 * Never invents prices. Flags unknown pricing accurately and analyzes capability redundancies.
 */
export function calculateStackMonthlyCost(tools: Tool[]): StackCostCalculation {
  let totalMonthlyUsd = 0;
  let hasUnknownPricing = false;

  const itemized = tools.map(tool => {
    const { model, freePlan, startingPrice } = tool.pricing;

    if (model === "free") {
      return {
        toolId: tool.id,
        toolName: tool.name,
        monthlyPrice: 0,
        pricingModel: "Free",
        status: "free" as const
      };
    }

    if (startingPrice !== undefined && startingPrice >= 0) {
      totalMonthlyUsd += startingPrice;
      return {
        toolId: tool.id,
        toolName: tool.name,
        monthlyPrice: startingPrice,
        pricingModel: freePlan ? "Freemium" : "Paid",
        status: "paid" as const
      };
    }

    // Pricing is unknown or custom
    hasUnknownPricing = true;
    return {
      toolId: tool.id,
      toolName: tool.name,
      monthlyPrice: null,
      pricingModel: model === "custom" ? "Custom Enterprise" : "Pricing unavailable",
      status: "unknown" as const
    };
  });

  const redundancies = detectStackRedundancies(tools);
  const potentialMonthlySavings = redundancies.reduce((sum, r) => sum + r.potentialMonthlySavings, 0);

  return {
    totalMonthlyUsd: Number(totalMonthlyUsd.toFixed(2)),
    hasUnknownPricing,
    itemized,
    redundancies,
    potentialMonthlySavings
  };
}
