import { Tool, Category } from "@/types";

export interface DataQualityReport {
  totalTools: number;
  averageCompleteness: number;
  missingDescriptions: Tool[];
  missingPricing: Tool[];
  missingLogos: Tool[];
  missingCapabilities: Tool[];
  unverifiedTools: Tool[];
  oldVerificationRecords: Tool[];
  potentialDuplicates: Array<{ tool1: Tool; tool2: Tool; reason: string }>;
  toolsByCategory: Record<string, number>;
}

export interface SearchGapReport {
  unmetQueries: Array<{ query: string; count: number; lastSearched: string; sampleResultsCount: number }>;
  underServedCategories: Array<{ categoryId: string; categoryName: string; toolCount: number; target: number; deficit: number }>;
}

/**
 * PRD §30 Data Completeness Score Calculator
 * Identity: 15%
 * Description: 15%
 * Categories: 10%
 * Capabilities: 15%
 * Use Cases: 10%
 * Pricing: 10%
 * Platforms: 5%
 * Verification: 20%
 */
export function calculateCompletenessScore(tool: Partial<Tool>): number {
  let score = 0;

  // Identity 15%
  const website = tool.website || (tool as any).websiteUrl;
  if (tool.name && tool.slug && website) score += 15;
  else if (tool.name && website) score += 10;

  // Description 15%
  if (tool.description && tool.description.length > 50 && tool.tagline) score += 15;
  else if (tool.description) score += 10;

  // Categories 10%
  if (tool.categoryIds && tool.categoryIds.length > 0) score += 10;

  // Capabilities 15%
  if (tool.capabilityIds && tool.capabilityIds.length >= 2) score += 15;
  else if (tool.capabilityIds && tool.capabilityIds.length > 0) score += 8;

  // Use Cases 10%
  if (tool.useCaseIds && tool.useCaseIds.length > 0) score += 10;

  // Pricing 10%
  if (tool.pricing && tool.pricing.model && tool.pricing.model !== "unknown") score += 10;

  // Platforms 5%
  if (tool.platforms && (tool.platforms.web || tool.platforms.mac || tool.platforms.windows || tool.platforms.ios || tool.platforms.android)) score += 5;

  // Verification 20%
  if (tool.verification?.status === "verified") score += 20;
  else if (tool.verification?.status === "needs-review") score += 10;

  return Math.min(score, 100);
}

export const calculateDataCompletenessScore = calculateCompletenessScore;

/**
 * PRD §26 Duplicate Prevention Engine
 * Compares normalized website domain, tool name, and slug
 */
export function checkDuplicate(
  candidate: Partial<Tool> & { websiteUrl?: string },
  existingTools: Tool[]
): { isDuplicate: boolean; duplicateOf?: Tool; reason?: string; matchType?: "domain" | "name" | "slug"; confidence: number } {
  const candidateUrl = candidate.website || candidate.websiteUrl;
  if (!candidate.name && !candidateUrl) {
    return { isDuplicate: false, confidence: 0 };
  }

  // Extract clean domain
  const extractDomain = (url?: string) => {
    if (!url) return "";
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      return url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    }
  };

  const candidateDomain = extractDomain(candidateUrl);
  const candidateNameNorm = (candidate.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const existing of existingTools) {
    if (candidate.id && existing.id === candidate.id) continue;

    // 1. Exact Domain Match (High confidence)
    const existingDomain = extractDomain(existing.website || (existing as any).websiteUrl);
    if (candidateDomain && existingDomain && candidateDomain === existingDomain) {
      return {
        isDuplicate: true,
        duplicateOf: existing,
        reason: `Matches existing domain: ${existingDomain}`,
        matchType: "domain",
        confidence: 0.95
      };
    }

    // 2. Normalized Name Match
    const existingNameNorm = existing.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (candidateNameNorm && existingNameNorm && candidateNameNorm === existingNameNorm) {
      return {
        isDuplicate: true,
        duplicateOf: existing,
        reason: `Matches existing tool name: "${existing.name}"`,
        matchType: "name",
        confidence: 0.9
      };
    }

    // 3. Exact Slug Match
    if (candidate.slug && existing.slug && candidate.slug.toLowerCase() === existing.slug.toLowerCase()) {
      return {
        isDuplicate: true,
        duplicateOf: existing,
        reason: `Matches existing slug: "${existing.slug}"`,
        matchType: "slug",
        confidence: 0.85
      };
    }
  }

  return { isDuplicate: false, confidence: 0 };
}

/**
 * PRD §28 Category Gap Calculation
 */
export function computeCategoryGaps(tools: Tool[]): Array<{
  categoryId: string;
  name: string;
  targetCount: number;
  currentCount: number;
  deficit: number;
  priority: "high" | "medium" | "low";
}> {
  const categoryTargets: Record<string, { name: string; target: number }> = {
    "cat-chatbots": { name: "Chatbots & Assistants", target: 50 },
    "cat-coding": { name: "Coding & Engineering", target: 50 },
    "cat-image": { name: "Image & Visual Design", target: 40 },
    "cat-video": { name: "Video & Motion", target: 35 },
    "cat-audio": { name: "Audio, Voice & Music", target: 30 },
    "cat-writing": { name: "Writing & Content", target: 40 },
    "cat-research": { name: "Research & Science", target: 30 },
    "cat-education": { name: "Education & Learning", target: 25 },
    "cat-productivity": { name: "Productivity & Workspace", target: 45 },
    "cat-marketing": { name: "Marketing & Growth", target: 35 },
    "cat-design": { name: "3D, CAD & Creative", target: 25 },
    "cat-automation": { name: "Automation & Agents", target: 35 },
    "cat-sales-crm": { name: "Sales & CRM Intelligence", target: 25 },
    "cat-email": { name: "Email & Communication", target: 20 },
    "cat-documents": { name: "Documents & Knowledge", target: 30 },
    "cat-datascience": { name: "Data Science & Analytics", target: 30 },
    "cat-builders": { name: "App & Website Builders", target: 25 },
    "cat-nocode": { name: "No-Code & Visual Logic", target: 25 },
    "cat-security-infra": { name: "Security, Governance & Infra", target: 25 },
    "cat-specialized": { name: "Specialized & Hardware", target: 20 }
  };

  return Object.entries(categoryTargets).map(([cId, meta]) => {
    const current = tools.filter(t => t.categoryIds?.includes(cId)).length;
    const deficit = Math.max(0, meta.target - current);
    const priority = deficit >= 30 ? "high" : deficit >= 15 ? "medium" : "low";
    return {
      categoryId: cId,
      name: meta.name,
      targetCount: meta.target,
      currentCount: current,
      deficit,
      priority
    };
  });
}

/**
 * PRD §31 Verification Priority Queue Builder with Impact Scoring
 */
export function buildVerificationQueue(tools: Tool[]): Array<{
  id: string;
  name: string;
  websiteUrl: string;
  status: string;
  completeness: number;
  impactScore: number;
}> {
  return tools
    .filter(t => t.verification?.status !== "verified")
    .map(t => {
      const completeness = calculateCompletenessScore(t);
      const views = t.metrics?.viewCount || 0;
      const saves = t.metrics?.saveCount || 0;
      const impactScore = Math.round((views * 0.1) + (saves * 2) + completeness);
      return {
        id: t.id,
        name: t.name,
        websiteUrl: t.website || (t as any).websiteUrl || "",
        status: t.verification?.status || "pending",
        completeness,
        impactScore
      };
    })
    .sort((a, b) => b.impactScore - a.impactScore);
}

/**
 * PRD §29 Data Quality Report Generator
 */
export function generateDataQualityReport(tools: Tool[], categories: Category[]): DataQualityReport {
  const missingDescriptions: Tool[] = [];
  const missingPricing: Tool[] = [];
  const missingLogos: Tool[] = [];
  const missingCapabilities: Tool[] = [];
  const unverifiedTools: Tool[] = [];
  const oldVerificationRecords: Tool[] = [];
  const potentialDuplicates: Array<{ tool1: Tool; tool2: Tool; reason: string }> = [];
  const toolsByCategory: Record<string, number> = {};

  let totalCompleteness = 0;
  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const compScore = calculateCompletenessScore(tool);
    totalCompleteness += compScore;

    if (!tool.description || tool.description.length < 30) {
      missingDescriptions.push(tool);
    }

    if (!tool.pricing || tool.pricing.model === "unknown") {
      missingPricing.push(tool);
    }

    if (!tool.logo) {
      missingLogos.push(tool);
    }

    if (!tool.capabilityIds || tool.capabilityIds.length === 0) {
      missingCapabilities.push(tool);
    }

    if (tool.verification?.status !== "verified") {
      unverifiedTools.push(tool);
    } else if (tool.verification.lastVerifiedAt) {
      const verifyTime = new Date(tool.verification.lastVerifiedAt).getTime();
      if (now - verifyTime > ninetyDaysMs) {
        oldVerificationRecords.push(tool);
      }
    }

    // Category count
    tool.categoryIds?.forEach(cId => {
      toolsByCategory[cId] = (toolsByCategory[cId] || 0) + 1;
    });

    // Check duplicate against subsequent tools
    for (let j = i + 1; j < tools.length; j++) {
      const dupCheck = checkDuplicate(tools[i], [tools[j]]);
      if (dupCheck.isDuplicate) {
        potentialDuplicates.push({
          tool1: tools[i],
          tool2: tools[j],
          reason: dupCheck.reason || "Potential similarity"
        });
      }
    }
  }

  return {
    totalTools: tools.length,
    averageCompleteness: tools.length > 0 ? Math.round(totalCompleteness / tools.length) : 100,
    missingDescriptions,
    missingPricing,
    missingLogos,
    missingCapabilities,
    unverifiedTools,
    oldVerificationRecords,
    potentialDuplicates,
    toolsByCategory
  };
}

/**
 * PRD §31 Verification Priority Queue
 * Sorts tools needing review by importance (popularity, saves, old verification)
 */
export function getVerificationPriorityQueue(tools: Tool[]): Tool[] {
  const needsVerification = tools.filter(t => 
    t.verification?.status !== "verified" ||
    (t.verification?.lastVerifiedAt && (Date.now() - new Date(t.verification.lastVerifiedAt).getTime()) > 90 * 24 * 60 * 60 * 1000)
  );

  return needsVerification.sort((a, b) => {
    const priorityA = ((a.metrics?.saveCount || 0) * 3) + ((a.metrics?.viewCount || 0) * 1);
    const priorityB = ((b.metrics?.saveCount || 0) * 3) + ((b.metrics?.viewCount || 0) * 1);
    return priorityB - priorityA;
  });
}
