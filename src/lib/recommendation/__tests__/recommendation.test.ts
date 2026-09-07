import { describe, it, expect } from "vitest";
import { extractIntentDeterministic } from "../intent";
import { applyHardConstraints } from "../filter";
import { scoreTool, DEFAULT_WEIGHTS } from "../score";
import { calculateStackMonthlyCost } from "@/lib/stacks/cost-calculator";
import { Tool } from "@/types";

const mockPaidTool: Tool = {
  id: "test-paid",
  name: "Test Paid Tool",
  slug: "test-paid",
  tagline: "A paid tool",
  description: "Description",
  website: "https://test.com",
  company: { name: "Test Corp" },
  categoryIds: ["cat-video"],
  capabilityIds: ["text-to-video"],
  useCaseIds: ["uc-youtube"],
  targetUsers: ["creator"],
  features: ["Feature 1"],
  pricing: {
    model: "paid",
    freePlan: false,
    freeTrial: false,
    startingPrice: 30,
    currency: "USD"
  },
  platforms: { web: true, ios: false, android: false, windows: false, mac: false, linux: false },
  api: { available: false },
  openSource: false,
  difficulty: "intermediate",
  strengths: ["Fast video"],
  limitations: ["No free plan"],
  integrations: [],
  supportedLanguages: ["English"],
  verification: {
    status: "verified",
    websiteChecked: true,
    pricingChecked: true,
    featuresChecked: true
  },
  metrics: { viewCount: 100, saveCount: 20, outboundClickCount: 10 },
  status: "published",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z"
};

const mockFreeTool: Tool = {
  ...mockPaidTool,
  id: "test-free",
  name: "Test Free Tool",
  pricing: {
    model: "free",
    freePlan: true,
    freeTrial: false,
    startingPrice: 0,
    currency: "USD"
  },
  api: { available: true },
  openSource: true
};

describe("Recommendation Engine: Intent Extraction", () => {
  it("extracts beginner skill level and cost priority correctly", () => {
    const intent = extractIntentDeterministic("I want to create YouTube videos, I am a beginner with free only tools");
    expect(intent.skillLevel).toBe("beginner");
    expect(intent.budget?.freeOnly).toBe(true);
    expect(intent.requiredCapabilities).toContain("text-to-video");
  });

  it("extracts INR budget correctly", () => {
    const intent = extractIntentDeterministic("I have a ₹2,000 monthly budget to build a website");
    expect(intent.budget?.amount).toBe(2000);
    expect(intent.budget?.currency).toBe("INR");
    expect(intent.requiredCapabilities).toContain("code-generation");
  });
});

describe("Recommendation Engine: Hard Constraints", () => {
  it("excludes paid tools when user requests free-only", () => {
    const intent = extractIntentDeterministic("free only");
    const { survivingCandidates, filteredOutReasons } = applyHardConstraints(
      [mockPaidTool, mockFreeTool],
      intent
    );

    expect(survivingCandidates.map(t => t.id)).toEqual(["test-free"]);
    expect(filteredOutReasons["test-paid"]).toBeDefined();
  });

  it("excludes tools without API when user requests API", () => {
    const intent = extractIntentDeterministic("must have developer api");
    const { survivingCandidates } = applyHardConstraints(
      [mockPaidTool, mockFreeTool],
      intent
    );

    expect(survivingCandidates.map(t => t.id)).toEqual(["test-free"]);
  });
});

describe("Recommendation Engine: Weighted Sum Scoring", () => {
  it("calculates deterministic score between 0 and 100 strictly by weighted sum", () => {
    const intent = extractIntentDeterministic("I want to create YouTube videos");
    const scoreBreakdown = scoreTool(mockFreeTool, intent, DEFAULT_WEIGHTS);

    expect(scoreBreakdown.finalScore).toBeGreaterThanOrEqual(0);
    expect(scoreBreakdown.finalScore).toBeLessThanOrEqual(100);
    expect(scoreBreakdown.capabilityMatch).toBeDefined();
    expect(scoreBreakdown.budgetFit).toBeDefined();
  });
});

describe("AI Stack Cost Calculator", () => {
  it("calculates accurate total monthly cost and flags unknown pricing", () => {
    const calculation = calculateStackMonthlyCost([mockPaidTool, mockFreeTool]);
    expect(calculation.totalMonthlyUsd).toBe(30);
    expect(calculation.hasUnknownPricing).toBe(false);
    expect(calculation.itemized.length).toBe(2);
  });
});
