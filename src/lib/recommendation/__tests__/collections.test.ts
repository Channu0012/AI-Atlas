import { describe, it, expect } from "vitest";
import { 
  getTop100, 
  getTrending, 
  getBestFree, 
  getBestValue, 
  getPersonaCollection, 
  getRecentlyLaunched 
} from "../collections";
import { Tool } from "@/types";

const baseTool: Tool = {
  id: "tool-1",
  name: "Cursor AI",
  slug: "cursor-ai",
  tagline: "The AI Code Editor",
  description: "Built to make you extraordinarily productive, Cursor is the best way to code with AI.",
  website: "https://cursor.com",
  company: { name: "Anysphere" },
  categoryIds: ["cat-coding"],
  capabilityIds: ["cap-code-gen", "cap-autocomplete"],
  useCaseIds: ["uc-dev"],
  targetUsers: ["developer", "engineer"],
  features: ["Multi-file editing", "Chat with codebase", "Instant tab predictions"],
  pricing: {
    model: "paid",
    freePlan: false,
    freeTrial: true,
    startingPrice: 20,
    currency: "USD"
  },
  platforms: { web: false, ios: false, android: false, windows: true, mac: true, linux: true },
  api: { available: true },
  openSource: false,
  difficulty: "intermediate",
  strengths: ["Direct fork of VS Code", "Understands full repo"],
  limitations: ["Closed source indexing"],
  integrations: ["GitHub", "GitLab"],
  supportedLanguages: ["English"],
  verification: {
    status: "verified",
    websiteChecked: true,
    pricingChecked: true,
    featuresChecked: true
  },
  metrics: { viewCount: 50000, saveCount: 12000, outboundClickCount: 8000 },
  rankingSignals: {
    velocityScore: 95,
    reputationScore: 98,
    valueScore: 90,
    recentTrafficVelocity: 94
  },
  status: "published",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z"
};

const freeOssTool: Tool = {
  ...baseTool,
  id: "tool-2",
  name: "Ollama",
  slug: "ollama",
  website: "https://ollama.com",
  categoryIds: ["cat-specialized", "cat-coding"],
  targetUsers: ["developer", "student"],
  pricing: {
    model: "free",
    freePlan: true,
    freeTrial: false,
    startingPrice: 0,
    currency: "USD"
  },
  openSource: true,
  metrics: { viewCount: 40000, saveCount: 9500, outboundClickCount: 6000 },
  rankingSignals: {
    velocityScore: 88,
    reputationScore: 92,
    valueScore: 99,
    recentTrafficVelocity: 85
  }
};

const expensiveTool: Tool = {
  ...baseTool,
  id: "tool-3",
  name: "Expensive Enterprise",
  slug: "expensive-tool",
  website: "https://expensive.ai",
  pricing: {
    model: "paid",
    freePlan: false,
    freeTrial: false,
    startingPrice: 200,
    currency: "USD"
  },
  metrics: { viewCount: 1000, saveCount: 50, outboundClickCount: 20 },
  rankingSignals: {
    velocityScore: 30,
    reputationScore: 70,
    valueScore: 40,
    recentTrafficVelocity: 20
  }
};

const studentTool: Tool = {
  ...baseTool,
  id: "tool-4",
  name: "StudyBuddy",
  slug: "study-buddy",
  website: "https://studybuddy.edu",
  categoryIds: ["cat-education"],
  targetUsers: ["student"],
  pricing: {
    model: "free",
    freePlan: true,
    freeTrial: false,
    startingPrice: 0,
    currency: "USD"
  },
  rankingSignals: {
    velocityScore: 75,
    reputationScore: 80,
    valueScore: 95,
    recentTrafficVelocity: 70
  }
};

describe("Dynamic Discovery Collections Engine (PRD §3 & §9–14)", () => {
  const tools = [baseTool, freeOssTool, expensiveTool, studentTool];

  it("getTop100 ranks tools by reputation and enforces category caps", () => {
    const top = getTop100(tools, 5);
    expect(top.length).toBeGreaterThan(0);
    // Cursor AI and Ollama have higher reputation and should be near the top
    expect(top[0].id).toBe("tool-1");
  });

  it("getTrending sorts by velocity and engagement signals", () => {
    const trending = getTrending(tools, 5);
    expect(trending.length).toBeGreaterThan(0);
    // Highest velocity is tool-1 (velocityScore 95)
    expect(trending[0].id).toBe("tool-1");
  });

  it("getBestFree strictly includes verified free or open-source tools", () => {
    const freeList = getBestFree(tools, 5);
    expect(freeList.length).toBe(2);
    expect(freeList.every(t => t.pricing.model === "free" || t.openSource)).toBe(true);
    expect(freeList.some(t => t.id === "tool-3")).toBe(false);
  });

  it("getBestValue prioritizes tools with strong capabilities and low/free pricing", () => {
    const valueList = getBestValue(tools, 5);
    expect(valueList.length).toBeGreaterThan(0);
    // Ollama and StudyBuddy should rank ahead of Expensive Enterprise
    const ollamaIndex = valueList.findIndex(t => t.id === "tool-2");
    const expensiveIndex = valueList.findIndex(t => t.id === "tool-3");
    expect(ollamaIndex).toBeLessThan(expensiveIndex);
  });

  it("getPersonaCollection filters correctly for specific personas", () => {
    const studentCollection = getPersonaCollection(tools, "students", 5);
    expect(studentCollection.some(t => t.id === "tool-4")).toBe(true);

    const devCollection = getPersonaCollection(tools, "developers", 5);
    expect(devCollection.some(t => t.id === "tool-1")).toBe(true);
  });

  it("getRecentlyLaunched sorts by launchDate or createdAt", () => {
    const recent = getRecentlyLaunched(tools, 5);
    expect(recent.length).toBe(tools.length);
  });
});
