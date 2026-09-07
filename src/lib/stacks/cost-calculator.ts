import { Tool } from "@/types";

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
}

/**
 * Calculates genuine monthly stack cost strictly from verified database pricing.
 * Never invents prices. Flags any tools with custom or unknown pricing accurately.
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

  return {
    totalMonthlyUsd: Number(totalMonthlyUsd.toFixed(2)),
    hasUnknownPricing,
    itemized
  };
}
