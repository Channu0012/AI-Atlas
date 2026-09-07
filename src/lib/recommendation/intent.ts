import { z } from "zod";
import { SearchIntent } from "@/types";

export const SearchIntentSchema = z.object({
  goal: z.string().min(2),
  userType: z.string().optional(),
  budget: z.object({
    amount: z.number().optional(),
    currency: z.string().default("USD"),
    period: z.enum(["monthly", "yearly", "one-time"]).default("monthly"),
    maxBudget: z.number().optional(),
    freeOnly: z.boolean().default(false)
  }).optional(),
  skillLevel: z.enum(["beginner", "intermediate", "professional"]).optional(),
  requiredCapabilities: z.array(z.string()).default([]),
  preferredCapabilities: z.array(z.string()).optional(),
  platform: z.array(z.string()).optional(),
  priorities: z.array(z.enum(["ease-of-use", "value", "quality", "cost", "api", "open-source"])).optional(),
  constraints: z.array(z.string()).optional(),
  outputType: z.string().optional(),
  industry: z.string().optional()
});

/**
 * Extracts structured intent from a natural language objective.
 * Combines fast deterministic extraction with Zod validation.
 */
export function extractIntentDeterministic(rawQuery: string): SearchIntent {
  const query = rawQuery.toLowerCase();
  const requiredCapabilities: string[] = [];
  const constraints: string[] = [];
  const priorities: ("ease-of-use" | "value" | "quality" | "cost" | "api" | "open-source")[] = [];

  // Skill level detection
  let skillLevel: "beginner" | "intermediate" | "professional" | undefined = undefined;
  if (query.includes("beginner") || query.includes("starter") || query.includes("noob") || query.includes("easy to use")) {
    skillLevel = "beginner";
    priorities.push("ease-of-use");
  } else if (query.includes("expert") || query.includes("advanced") || query.includes("professional") || query.includes("pro")) {
    skillLevel = "professional";
    priorities.push("quality");
  } else if (query.includes("intermediate")) {
    skillLevel = "intermediate";
  }

  // Budget detection
  let freeOnly = false;
  let amount: number | undefined = undefined;
  let currency = "USD";

  if (query.includes("free only") || query.includes("completely free") || query.includes("no budget") || query.includes("zero cost") || query.includes("without paying")) {
    freeOnly = true;
    priorities.push("cost");
    constraints.push("free-only");
  }

  // Currency & amount parsing (e.g., "$20", "2000 inr", "₹2,000", "€15")
  const inrMatch = query.match(/(?:₹|inr|rs\.?)\s*([\d,]+)/i) || query.match(/([\d,]+)\s*(?:inr|rupees)/i);
  if (inrMatch) {
    amount = parseFloat(inrMatch[1].replace(/,/g, ""));
    currency = "INR";
  } else {
    const usdMatch = query.match(/\$\s*([\d,]+)/) || query.match(/([\d,]+)\s*(?:dollars|usd)/i);
    if (usdMatch) {
      amount = parseFloat(usdMatch[1].replace(/,/g, ""));
      currency = "USD";
    }
  }

  // Capability mapping
  if (query.includes("video") || query.includes("youtube") || query.includes("reel") || query.includes("tiktok")) {
    requiredCapabilities.push("text-to-video", "video-editing");
  }
  if (query.includes("youtube") || query.includes("voice") || query.includes("audio") || query.includes("podcast")) {
    requiredCapabilities.push("text-to-speech");
  }
  if (query.includes("script") || query.includes("write") || query.includes("article") || query.includes("blog")) {
    requiredCapabilities.push("text-generation");
  }
  if (query.includes("code") || query.includes("programming") || query.includes("developer") || query.includes("software") || query.includes("app") || query.includes("website")) {
    requiredCapabilities.push("code-generation");
  }
  if (query.includes("website") || query.includes("landing page") || query.includes("ui") || query.includes("frontend")) {
    requiredCapabilities.push("ui-generation");
  }
  if (query.includes("research") || query.includes("paper") || query.includes("study") || query.includes("literature") || query.includes("citation")) {
    requiredCapabilities.push("web-research", "document-analysis");
  }
  if (query.includes("image") || query.includes("thumbnail") || query.includes("graphic") || query.includes("design") || query.includes("photo")) {
    requiredCapabilities.push("text-to-image");
  }
  if (query.includes("automation") || query.includes("automate") || query.includes("workflow") || query.includes("integrate")) {
    requiredCapabilities.push("automation");
  }

  // Constraint detection
  if (query.includes("api") || query.includes("developer api")) {
    constraints.push("must-have-api");
    priorities.push("api");
  }
  if (query.includes("open source") || query.includes("opensource") || query.includes("self hosted")) {
    constraints.push("open-source-only");
    priorities.push("open-source");
  }

  // Platform detection
  const platform: string[] = [];
  if (query.includes("android")) platform.push("android");
  if (query.includes("ios") || query.includes("iphone") || query.includes("ipad")) platform.push("ios");
  if (query.includes("windows")) platform.push("windows");
  if (query.includes("mac") || query.includes("macos")) platform.push("mac");
  if (query.includes("linux")) platform.push("linux");

  const intentRaw = {
    goal: rawQuery.trim(),
    budget: {
      amount,
      currency,
      period: "monthly" as const,
      maxBudget: amount,
      freeOnly
    },
    skillLevel,
    requiredCapabilities: Array.from(new Set(requiredCapabilities)),
    platform: platform.length > 0 ? platform : undefined,
    priorities: Array.from(new Set(priorities)),
    constraints: Array.from(new Set(constraints))
  };

  return SearchIntentSchema.parse(intentRaw);
}
