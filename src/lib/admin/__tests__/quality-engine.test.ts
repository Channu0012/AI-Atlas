import { describe, it, expect } from "vitest";
import { 
  calculateDataCompletenessScore, 
  checkDuplicate, 
  computeCategoryGaps, 
  buildVerificationQueue,
  generateDataQualityReport 
} from "../quality-engine";
import { Tool } from "@/types";

const completeTool: Tool = {
  id: "tool-1",
  name: "Cursor AI",
  slug: "cursor-ai",
  tagline: "The AI Code Editor",
  description: "Built to make you extraordinarily productive, Cursor is the best way to code with AI.",
  website: "https://cursor.com",
  company: { name: "Anysphere" },
  categoryIds: ["cat-coding"],
  capabilityIds: ["cap-code-gen"],
  useCaseIds: ["uc-dev"],
  targetUsers: ["developer"],
  features: ["Multi-file editing", "Chat with codebase"],
  pricing: {
    model: "freemium",
    freePlan: true,
    freeTrial: true,
    startingPrice: 20,
    currency: "USD"
  },
  platforms: { web: false, ios: false, android: false, windows: true, mac: true, linux: true },
  api: { available: true },
  openSource: false,
  difficulty: "intermediate",
  strengths: ["Fast predictions"],
  limitations: ["Closed source model"],
  integrations: ["GitHub"],
  supportedLanguages: ["English"],
  verification: {
    status: "verified",
    websiteChecked: true,
    pricingChecked: true,
    featuresChecked: true
  },
  metrics: { viewCount: 10000, saveCount: 500, outboundClickCount: 200 },
  status: "published",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z"
};

const incompleteTool: Partial<Tool> = {
  name: "Sparse Tool",
  website: "https://sparse.ai",
  categoryIds: ["cat-coding"]
};

describe("Data Quality & Governance Engine (PRD §26 & §30)", () => {
  it("calculates completeness score accurately based on weighted fields", () => {
    const scoreComplete = calculateDataCompletenessScore(completeTool);
    expect(scoreComplete).toBeGreaterThanOrEqual(90);

    const scoreIncomplete = calculateDataCompletenessScore(incompleteTool);
    expect(scoreIncomplete).toBeLessThan(50);
  });

  it("checkDuplicate detects duplicate tools via domain match", () => {
    const isDup = checkDuplicate({ websiteUrl: "https://www.cursor.com/download" }, [completeTool]);
    expect(isDup.isDuplicate).toBe(true);
    expect(isDup.matchType).toBe("domain");
  });

  it("checkDuplicate detects duplicate tools via normalized name match", () => {
    const isDup = checkDuplicate({ name: "Cursor  AI!" }, [completeTool]);
    expect(isDup.isDuplicate).toBe(true);
    expect(isDup.matchType).toBe("name");
  });

  it("checkDuplicate permits distinct tools", () => {
    const isDup = checkDuplicate({ name: "Perplexity", websiteUrl: "https://perplexity.ai" }, [completeTool]);
    expect(isDup.isDuplicate).toBe(false);
  });

  it("computeCategoryGaps calculates deficits against PRD category targets", () => {
    const gaps = computeCategoryGaps([completeTool]);
    expect(gaps.length).toBeGreaterThan(0);
    // cat-coding has 1 tool, target is 50, deficit is 49
    const codingGap = gaps.find(g => g.categoryId === "cat-coding");
    expect(codingGap).toBeDefined();
    expect(codingGap?.currentCount).toBe(1);
    expect(codingGap?.deficit).toBe(49);
  });

  it("buildVerificationQueue ranks unverified tools by traffic impact and completeness", () => {
    const unverifiedTool: Tool = {
      ...completeTool,
      id: "tool-unverified",
      verification: {
        status: "pending",
        websiteChecked: false,
        pricingChecked: false,
        featuresChecked: false
      },
      metrics: { viewCount: 5000, saveCount: 100, outboundClickCount: 50 }
    };

    const queue = buildVerificationQueue([completeTool, unverifiedTool]);
    expect(queue.length).toBe(1);
    expect(queue[0].id).toBe("tool-unverified");
    expect(queue[0].impactScore).toBeGreaterThan(0);
  });
});
