import { SearchIntent, RecommendationResultItem } from "@/types";

/**
 * Fact-grounded deterministic explanation generator.
 * Strict rules: Only references facts present in verified tool properties.
 * No hallucinations, no invented numbers or claims.
 */
export function generateDeterministicExplanations(
  items: RecommendationResultItem[],
  intent: SearchIntent
): RecommendationResultItem[] {
  return items.map(item => {
    const { tool } = item;
    const reasons: string[] = [];

    // Goal alignment
    reasons.push(`${tool.name} is recommended because it matches your goal for "${intent.goal}".`);

    // Capabilities
    const matchedCaps = intent.requiredCapabilities.filter(c => tool.capabilityIds.includes(c));
    if (matchedCaps.length > 0) {
      reasons.push(`It directly provides ${matchedCaps.map(c => c.replace(/-/g, " ")).join(", ")}.`);
    }

    // Pricing & budget
    if (tool.pricing.model === "free") {
      reasons.push("It is 100% free with no monthly subscription required.");
    } else if (tool.pricing.freePlan) {
      reasons.push(`It offers a free plan, with starting paid tiers from $${tool.pricing.startingPrice || 0}/month.`);
    } else if (tool.pricing.startingPrice) {
      reasons.push(`Its verified pricing starts at $${tool.pricing.startingPrice}/month.`);
    }

    // Difficulty
    reasons.push(`Designed for ${tool.difficulty} users.`);

    // Top verified strength
    if (tool.strengths.length > 0) {
      reasons.push(`Key advantage: ${tool.strengths[0]}.`);
    }

    // Top verified limitation (truthfulness principle)
    let limitationNote = "";
    if (tool.limitations.length > 0) {
      limitationNote = `Note: ${tool.limitations[0]}`;
    }

    return {
      ...item,
      whyRecommended: reasons.join(" "),
      keyLimitations: tool.limitations.slice(0, 2)
    };
  });
}

/**
 * Orchestrates explanation generation.
 * If external LLM API key (GEMINI_API_KEY) is available, uses Gemini strictly as an
 * interpretation & prose layer referencing ONLY the passed verified tool facts.
 * If external LLM fails, network fails, or key is not provided, gracefully falls back
 * to deterministic explanation with isAiDegraded flag.
 */
export async function enrichWithExplanations(
  items: RecommendationResultItem[],
  intent: SearchIntent
): Promise<{ enrichedItems: RecommendationResultItem[]; isAiDegraded: boolean; notes?: string }> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!geminiApiKey) {
    // Graceful deterministic fallback
    return {
      enrichedItems: generateDeterministicExplanations(items, intent),
      isAiDegraded: true,
      notes: "AI explanation is currently operating in deterministic mode based on verified database properties."
    };
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const factualPayload = items.slice(0, 3).map(item => ({
      name: item.tool.name,
      tagline: item.tool.tagline,
      pricing: item.tool.pricing,
      difficulty: item.tool.difficulty,
      strengths: item.tool.strengths,
      limitations: item.tool.limitations
    }));

    const prompt = `You are the AI Atlas explanation layer.
User Goal: "${intent.goal}"
Target User: "${intent.userType || 'general'}"
Skill Level: "${intent.skillLevel || 'any'}"

Here are the top 3 verified AI tools retrieved and ranked deterministically:
${JSON.stringify(factualPayload, null, 2)}

TASK:
Write a concise, 2-sentence explanation for why each tool fits the user's goal, citing ONLY the facts provided above.
DO NOT hallucinate or invent new pricing, features, or claims.
Output a JSON array of objects with keys "name" and "whyRecommended".`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "[]") as { name: string; whyRecommended: string }[];
    const explanationMap = new Map(parsed.map(p => [p.name.toLowerCase(), p.whyRecommended]));

    const enriched = items.map(item => {
      const customAiExp = explanationMap.get(item.tool.name.toLowerCase());
      return {
        ...item,
        whyRecommended: customAiExp || item.whyRecommended
      };
    });

    return {
      enrichedItems: enriched,
      isAiDegraded: false
    };
  } catch (err) {
    console.warn("External AI explanation failed, falling back to deterministic explanation:", err);
    return {
      enrichedItems: generateDeterministicExplanations(items, intent),
      isAiDegraded: true,
      notes: "AI explanation service was unavailable; displaying fact-verified deterministic recommendations."
    };
  }
}
