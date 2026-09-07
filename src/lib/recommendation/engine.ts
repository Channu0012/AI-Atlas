import { 
  SearchIntent, 
  RecommendationResponseData 
} from "@/types";
import { extractIntentDeterministic } from "./intent";
import { retrieveCandidates } from "./retrieve";
import { applyHardConstraints } from "./filter";
import { calculateDynamicWeights } from "./score";
import { rankCandidates } from "./rank";
import { diversifyResults } from "./diversify";
import { enrichWithExplanations } from "./explain";
import { Repository } from "@/lib/db/repository";

export class RecommendationEngine {
  /**
   * Main recommendation pipeline execution
   */
  static async recommend(query: string, customIntent?: Partial<SearchIntent>): Promise<RecommendationResponseData> {
    // 1. Intent extraction
    const baseIntent = extractIntentDeterministic(query);
    const intent: SearchIntent = {
      ...baseIntent,
      ...customIntent,
      // Merge arrays cleanly
      requiredCapabilities: Array.from(new Set([
        ...baseIntent.requiredCapabilities,
        ...(customIntent?.requiredCapabilities || [])
      ])),
      constraints: Array.from(new Set([
        ...(baseIntent.constraints || []),
        ...(customIntent?.constraints || [])
      ]))
    };

    // 2. Candidate retrieval
    const candidates = await retrieveCandidates(intent);

    // 3. Hard constraint filtering
    const { survivingCandidates } = applyHardConstraints(candidates, intent);

    // 4. Dynamic weighting
    const weights = calculateDynamicWeights(intent);

    // 5. Deterministic scoring & ranking
    const ranked = rankCandidates(survivingCandidates, intent, weights);

    // 6. Diversification & alternatives
    const { topRecommendations, alternatives } = diversifyResults(ranked, 5);

    // 7. Grounded explanation generation with fallback
    const { enrichedItems, isAiDegraded, notes } = await enrichWithExplanations(topRecommendations, intent);

    // 8. Find matching pre-built workflow (if any)
    const workflows = await Repository.getWorkflows();
    const matchedWorkflow = workflows.find(wf => 
      wf.steps.some(step => step.requiredCapabilities.some(c => intent.requiredCapabilities.includes(c)))
    );

    // 9. Intelligent follow-up questions: only ask if missing and materially relevant
    const followUpQuestions: RecommendationResponseData["followUpQuestions"] = [];
    if (!intent.budget?.amount && !intent.budget?.freeOnly) {
      followUpQuestions.push({
        id: "budget",
        question: "What is your target budget for this stack?",
        options: [
          { label: "Free only", value: "free-only" },
          { label: "Under $20/month", value: "under-20" },
          { label: "Flexible", value: "flexible" }
        ]
      });
    }

    if (!intent.skillLevel) {
      followUpQuestions.push({
        id: "skill",
        question: "What is your experience level with AI tools?",
        options: [
          { label: "Beginner (need ease of use)", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Professional / Technical", value: "professional" }
        ]
      });
    }

    // Extracted requirement chips for UI
    const extractedRequirements: RecommendationResponseData["extractedRequirements"] = [];
    if (intent.skillLevel) {
      extractedRequirements.push({ label: `${intent.skillLevel.charAt(0).toUpperCase() + intent.skillLevel.slice(1)} level`, type: "skill" });
    }
    if (intent.budget?.freeOnly) {
      extractedRequirements.push({ label: "Free Only", type: "budget" });
    } else if (intent.budget?.amount) {
      extractedRequirements.push({ label: `Max ${intent.budget.currency || '$'}${intent.budget.amount}/mo`, type: "budget" });
    }
    for (const cap of intent.requiredCapabilities) {
      extractedRequirements.push({ label: cap.replace(/-/g, " "), type: "capability" });
    }
    if (intent.platform && intent.platform.length > 0) {
      extractedRequirements.push({ label: intent.platform.join(", "), type: "platform" });
    }

    // Log search event for analytics & search-gap metrics
    await Repository.logSearchEvent(query, enrichedItems.length, intent.requiredCapabilities);

    return {
      id: `rec-${Date.now()}`,
      interpretedGoal: intent.goal,
      extractedRequirements,
      recommendations: enrichedItems,
      alternatives,
      suggestedWorkflow: matchedWorkflow,
      followUpQuestions: followUpQuestions.slice(0, 2),
      aiExplanationNotes: notes,
      isAiDegraded
    };
  }
}
