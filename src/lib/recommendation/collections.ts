import { Tool } from "@/types";

export interface CollectionMetadata {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  badge: string;
}

export const COLLECTIONS_METADATA: Record<string, CollectionMetadata> = {
  "top-100": {
    slug: "top-100",
    title: "Top 100 AI Tools of 2025",
    shortTitle: "Top 100",
    description: "The most capable, reliable, and verified AI tools ranked dynamically across performance, community trust, and utility.",
    icon: "Star",
    badge: "⭐ Top 100"
  },
  "trending": {
    slug: "trending",
    title: "Trending AI Tools Right Now",
    shortTitle: "Trending",
    description: "Tools experiencing the highest growth in community bookmarks, natural language searches, and workflow usage this week.",
    icon: "Flame",
    badge: "🔥 Trending"
  },
  "best-free": {
    slug: "best-free",
    title: "Best Free & Open Source AI",
    shortTitle: "Best Free",
    description: "Fact-verified AI platforms with genuine 100% free tiers, open-source repositories, or permanent free allowances. Zero hidden paywalls.",
    icon: "Gift",
    badge: "🆓 Best Free"
  },
  "best-value": {
    slug: "best-value",
    title: "Best Value for Money AI",
    shortTitle: "Best Value",
    description: "AI tools delivering maximum capability, uptime, and features per dollar invested. Evaluated against pricing transparency.",
    icon: "TrendingUp",
    badge: "💰 Best Value"
  },
  "developers": {
    slug: "developers",
    title: "Best AI for Developers & Engineers",
    shortTitle: "For Developers",
    description: "Code assistants, autonomous terminal agents, API generators, and LLMOps infrastructure built for technical velocity.",
    icon: "Code2",
    badge: "👨‍💻 Developers"
  },
  "students": {
    slug: "students",
    title: "Best AI for Students & Academics",
    shortTitle: "For Students",
    description: "Affordable and free study companions, paper analyzers, math solvers, and literature synthesis engines.",
    icon: "GraduationCap",
    badge: "🎓 Students"
  },
  "startups": {
    slug: "startups",
    title: "Best AI for Startups & Founders",
    shortTitle: "For Startups",
    description: "High-leverage automation, full-stack scaffolders, market intelligence, and cost-effective operational stacks.",
    icon: "Rocket",
    badge: "🚀 Startups"
  },
  "creators": {
    slug: "creators",
    title: "Best AI for Creators & Media",
    shortTitle: "For Creators",
    description: "Cinematic video generators, voice cloning, automatic reel editors, and generative thumbnail engines.",
    icon: "Palette",
    badge: "🎨 Creators"
  },
  "business": {
    slug: "business",
    title: "Best AI for Business & Enterprise",
    shortTitle: "For Business",
    description: "Meeting intelligence, sales automation, CRM synchronization, data visualization, and SOC-2 compliant tools.",
    icon: "Building2",
    badge: "🏢 Business"
  },
  "recent": {
    slug: "recent",
    title: "Recently Launched AI Tools",
    shortTitle: "New Launches",
    description: "The newest verified additions to the AI ecosystem, evaluated for safety, novelty, and immediate utility.",
    icon: "Sparkles",
    badge: "🆕 New Launches"
  }
};

/**
 * Multi-Factor Top 100 Scoring Pipeline
 * Quality + Verification + Reliability + Saves + Outbound Interest with Category Diversification
 */
export function getTop100(tools: Tool[], limit = 100): Tool[] {
  const scored = tools.map(tool => {
    let score = 50;

    // 1. Verification status
    if (tool.verification?.status === "verified") score += 25;
    if (tool.verification?.pricingChecked) score += 5;
    if (tool.verification?.featuresChecked) score += 5;

    // 2. Metrics (saves and views)
    const metrics = tool.metrics || { saveCount: 0, viewCount: 0, outboundClickCount: 0 };
    score += Math.min(metrics.saveCount * 2, 20);
    score += Math.min(Math.log10((metrics.viewCount || 1) + 1) * 3, 10);
    score += Math.min(metrics.outboundClickCount || 0, 10);

    // 3. API & Ecosystem completeness
    if (tool.api?.available) score += 5;
    if (tool.openSource) score += 5;
    if (tool.features?.length > 4) score += 5;

    // 4. Ranking signals if pre-calculated
    if (tool.rankingSignals?.reputationScore) {
      score = (score * 0.4) + (tool.rankingSignals.reputationScore * 0.6);
    } else if (tool.rankingSignals?.qualityScore) {
      score = (score * 0.5) + (tool.rankingSignals.qualityScore * 0.5);
    }

    return { tool, score };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  // Category Diversification: prevent any single category from monopolizing first 20 items
  const categoryCounts = new Map<string, number>();
  const diversified: Tool[] = [];
  const deferred: Tool[] = [];

  for (const item of scored) {
    const mainCat = item.tool.categoryIds[0] || "general";
    const currentCount = categoryCounts.get(mainCat) || 0;

    if (currentCount < 12 || diversified.length >= 60) {
      diversified.push(item.tool);
      categoryCounts.set(mainCat, currentCount + 1);
    } else {
      deferred.push(item.tool);
    }

    if (diversified.length >= limit) break;
  }

  // Fill remainder from deferred if needed
  while (diversified.length < limit && deferred.length > 0) {
    diversified.push(deferred.shift()!);
  }

  return diversified.slice(0, limit);
}

/**
 * Trending calculation based on recent velocity signals
 */
export function getTrending(tools: Tool[], limit = 20): Tool[] {
  const scored = tools.map(tool => {
    const metrics = tool.metrics || { saveCount: 0, viewCount: 0, outboundClickCount: 0 };
    // Weight saves and outbound clicks heavily for velocity
    const velocity = (metrics.saveCount * 4) + (metrics.outboundClickCount * 2) + Math.min(metrics.viewCount, 50);
    
    // Recency bonus (if added within last 60 days)
    let recencyBonus = 0;
    if (tool.createdAt) {
      const daysOld = (Date.now() - new Date(tool.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysOld < 30) recencyBonus = 30;
      else if (daysOld < 90) recencyBonus = 15;
    }

    const totalTrending = velocity + recencyBonus;
    return { tool, score: totalTrending };
  });

  return scored.sort((a, b) => b.score - a.score).map(s => s.tool).slice(0, limit);
}

/**
 * Best Free AI Tools
 * Strictly free, free plan, or open source
 */
export function getBestFree(tools: Tool[], limit = 20): Tool[] {
  const freeTools = tools.filter(t => 
    t.pricing.model === "free" || 
    t.pricing.freePlan === true || 
    t.openSource === true
  );

  // Rank by capability breadth and verification
  return freeTools.sort((a, b) => {
    const scoreA = (a.verification.status === "verified" ? 20 : 0) + (a.openSource ? 15 : 0) + (a.features?.length || 0);
    const scoreB = (b.verification.status === "verified" ? 20 : 0) + (b.openSource ? 15 : 0) + (b.features?.length || 0);
    return scoreB - scoreA;
  }).slice(0, limit);
}

/**
 * Best Value AI Tools
 * High feature count relative to pricing
 */
export function getBestValue(tools: Tool[], limit = 20): Tool[] {
  const scored = tools.map(tool => {
    const price = tool.pricing.startingPrice || 0;
    const isFree = tool.pricing.model === "free" || tool.pricing.freePlan;
    const featureCount = tool.features?.length || 3;
    const capabilityCount = tool.capabilityIds?.length || 1;

    // High capabilities with low or transparent price = high value score
    let value = (featureCount * 2) + (capabilityCount * 3);
    if (isFree) value += 25;
    if (price > 0 && price <= 20) value += 15;
    if (tool.api?.available) value += 8;

    return { tool, score: value };
  });

  return scored.sort((a, b) => b.score - a.score).map(s => s.tool).slice(0, limit);
}

/**
 * Persona-based collections (Developers, Students, Startups, Creators, Business)
 */
export function getPersonaCollection(
  tools: Tool[], 
  persona: string,
  limit = 20
): Tool[] {
  const normPersona = persona.toLowerCase().replace(/s$/, "");
  const personaCategoryMap: Record<string, string[]> = {
    developer: ["cat-coding", "cat-security-infra", "cat-datascience", "cat-builders"],
    student: ["cat-education", "cat-research", "cat-writing", "cat-documents"],
    startup: ["cat-automation", "cat-builders", "cat-marketing", "cat-productivity"],
    creator: ["cat-video", "cat-image", "cat-audio", "cat-design"],
    business: ["cat-productivity", "cat-sales-crm", "cat-email", "cat-documents", "cat-datascience"]
  };

  const targetCats = personaCategoryMap[normPersona] || [];

  const matched = tools.filter(tool => {
    // 1. Explicit target user match
    const userMatch = tool.targetUsers?.some(u => u.toLowerCase().includes(normPersona));
    // 2. Category match
    const catMatch = tool.categoryIds?.some(c => targetCats.includes(c));
    return userMatch || catMatch;
  });

  return matched.sort((a, b) => {
    const scoreA = (a.verification.status === "verified" ? 20 : 0) + (a.metrics?.saveCount || 0);
    const scoreB = (b.verification.status === "verified" ? 20 : 0) + (b.metrics?.saveCount || 0);
    return scoreB - scoreA;
  }).slice(0, limit);
}

/**
 * Recently Launched Tools
 */
export function getRecentlyLaunched(tools: Tool[], limit = 20): Tool[] {
  return [...tools].sort((a, b) => {
    const dateA = a.launchDate ? new Date(a.launchDate).getTime() : new Date(a.createdAt).getTime();
    const dateB = b.launchDate ? new Date(b.launchDate).getTime() : new Date(b.createdAt).getTime();
    return dateB - dateA;
  }).slice(0, limit);
}

/**
 * Dynamic Collection Dispatcher
 */
export function getDynamicCollection(tools: Tool[], slug: string, limit = 20): {
  metadata: CollectionMetadata;
  tools: Tool[];
} {
  const meta = COLLECTIONS_METADATA[slug] || {
    slug,
    title: "AI Tools Collection",
    shortTitle: "Collection",
    description: "Curated collection of verified artificial intelligence tools.",
    icon: "Layers",
    badge: "Curated"
  };

  let resultTools: Tool[] = [];

  switch (slug) {
    case "top-100":
      resultTools = getTop100(tools, limit);
      break;
    case "trending":
      resultTools = getTrending(tools, limit);
      break;
    case "best-free":
      resultTools = getBestFree(tools, limit);
      break;
    case "best-value":
      resultTools = getBestValue(tools, limit);
      break;
    case "developers":
      resultTools = getPersonaCollection(tools, "developer", limit);
      break;
    case "students":
      resultTools = getPersonaCollection(tools, "student", limit);
      break;
    case "startups":
      resultTools = getPersonaCollection(tools, "startup", limit);
      break;
    case "creators":
      resultTools = getPersonaCollection(tools, "creator", limit);
      break;
    case "business":
      resultTools = getPersonaCollection(tools, "business", limit);
      break;
    case "recent":
      resultTools = getRecentlyLaunched(tools, limit);
      break;
    default:
      resultTools = getTop100(tools, limit);
      break;
  }

  return {
    metadata: meta,
    tools: resultTools
  };
}
