import { Tool, SearchIntent } from "@/types";
import { Repository } from "@/lib/db/repository";

/**
 * Candidate Retrieval Layer:
 * Fetches structured candidates from the database based on broad matching
 * across capabilities, categories, use cases, and text tokens.
 */
export async function retrieveCandidates(intent: SearchIntent): Promise<Tool[]> {
  const publishedTools = await Repository.getPublishedTools();

  // If no specific capabilities extracted, return all published candidates
  if (!intent.requiredCapabilities || intent.requiredCapabilities.length === 0) {
    return publishedTools;
  }

  const queryTerms = intent.goal.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  const matched = publishedTools.filter(tool => {
    // 1. Capability match
    const hasCapability = intent.requiredCapabilities.some(capId => 
      tool.capabilityIds.includes(capId)
    );
    if (hasCapability) return true;

    // 2. Keyword relevance in tool name, tagline, or features
    const textBlob = `${tool.name} ${tool.tagline} ${tool.description} ${tool.features.join(" ")}`.toLowerCase();
    const matchesKeyword = queryTerms.some(term => textBlob.includes(term));
    if (matchesKeyword) return true;

    // 3. Target user match
    if (intent.userType && tool.targetUsers.includes(intent.userType)) {
      return true;
    }

    return false;
  });

  // Ensure we have candidates, fallback to all published if overly restrictive
  return matched.length > 0 ? matched : publishedTools;
}
