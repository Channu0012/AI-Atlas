import { Tool, PlanResult, PlanPhase, RedundancyWarning, SkillLevel } from "@/types";
import { Repository } from "@/lib/db/repository";
import { detectStackRedundancies } from "@/lib/stacks/cost-calculator";

export interface PlannerInput {
  goal: string;
  budget?: number;
  skillLevel?: SkillLevel;
  platform?: string;
  preferOpenSource?: boolean;
}

interface PhaseDefinition {
  title: string;
  description: string;
  capabilityId: string;
  actionablePrompt?: string;
  howToExecute?: string;
  estimatedMinutes?: number;
}

export class GoalPlannerEngine {
  /**
   * Deconstruct a natural language goal into sequential phases,
   * match optimal verified tools + budget alternatives, audit cost, and check redundancies.
   */
  static async plan(input: PlannerInput): Promise<PlanResult> {
    const goal = input.goal.trim();
    const budget = input.budget;
    const skillLevel: SkillLevel = input.skillLevel || "beginner";
    const preferOpenSource = Boolean(input.preferOpenSource);

    const allTools = await Repository.getPublishedTools();

    // 1. Determine the phase breakdown based on semantic keywords
    const phaseDefs = this.extractPhaseDefinitions(goal);

    // 2. Select primary tool & alternative tool for each phase
    const phases: PlanPhase[] = [];
    const usedToolIds = new Set<string>();

    for (let i = 0; i < phaseDefs.length; i++) {
      const pDef = phaseDefs[i];
      const matchingTools = allTools.filter(t => 
        t.capabilityIds.includes(pDef.capabilityId) &&
        (input.platform ? (t.platforms as any)[input.platform] !== false : true)
      );

      // Sort matching tools by skill level match and rating/views
      matchingTools.sort((a, b) => {
        if (preferOpenSource && a.openSource !== b.openSource) {
          return a.openSource ? -1 : 1;
        }
        if (a.difficulty === skillLevel && b.difficulty !== skillLevel) return -1;
        if (b.difficulty === skillLevel && a.difficulty !== skillLevel) return 1;
        return b.metrics.viewCount - a.metrics.viewCount;
      });

      // Primary tool (favoring tools not yet selected to keep stack modular)
      let primaryTool = matchingTools.find(t => !usedToolIds.has(t.id)) || matchingTools[0] || allTools[0];
      usedToolIds.add(primaryTool.id);

      // Alternative tool (favoring free or open source options)
      const altTool = matchingTools.find(t => 
        t.id !== primaryTool.id && 
        (t.pricing.model === "free" || t.pricing.freePlan || t.openSource)
      ) || matchingTools.find(t => t.id !== primaryTool.id);

      const estimatedCost = (primaryTool.pricing.model === "free" || primaryTool.pricing.freePlan)
        ? 0
        : (primaryTool.pricing.startingPrice || 0);

      phases.push({
        phaseNumber: i + 1,
        title: pDef.title,
        description: pDef.description,
        requiredCapability: pDef.capabilityId,
        primaryTool,
        alternativeTool: altTool,
        estimatedCost,
        isFreeTier: estimatedCost === 0,
        actionablePrompt: pDef.actionablePrompt,
        howToExecute: pDef.howToExecute,
        estimatedMinutes: pDef.estimatedMinutes || 20
      });
    }

    // 3. Financial & Budget Audit
    const totalEstimatedMonthlyCost = phases.reduce((sum, p) => sum + p.estimatedCost, 0);
    const isWithinBudget = budget !== undefined ? totalEstimatedMonthlyCost <= budget : true;
    const budgetDifference = budget !== undefined ? budget - totalEstimatedMonthlyCost : undefined;

    // Total estimated hours to launch
    const totalMinutes = phases.reduce((sum, p) => sum + (p.estimatedMinutes || 20), 0);
    const estimatedHoursToLaunch = Math.max(1, Math.round((totalMinutes / 60) * 10) / 10);

    // 4. Overlap & Redundancy Detection
    const selectedTools = phases.map(p => p.primaryTool);
    const redundancies = detectStackRedundancies(selectedTools);

    // 5. Generate Blueprint Markdown
    const blueprintMarkdown = this.generateBlueprintMarkdown(
      goal,
      skillLevel,
      phases,
      totalEstimatedMonthlyCost,
      budget,
      redundancies
    );

    const summary = `Actionable ${phases.length}-step roadmap ready to launch in ~${estimatedHoursToLaunch} hours with an estimated $${totalEstimatedMonthlyCost}/mo cost.${
      budget !== undefined
        ? isWithinBudget
          ? ` Safely within your $${budget}/mo budget ($${budgetDifference} surplus).`
          : ` Exceeds your $${budget}/mo budget by $${Math.abs(budgetDifference || 0)}. Switch to free alternatives to lower costs.`
        : ""
    }`;

    return {
      goal,
      skillLevel,
      targetBudget: budget,
      phases,
      totalEstimatedMonthlyCost,
      isWithinBudget,
      budgetDifference,
      redundancies,
      summary,
      blueprintMarkdown,
      estimatedHoursToLaunch
    };
  }

  /**
   * Deconstruct the goal into sequential phases with practical prompts and execution steps
   */
  private static extractPhaseDefinitions(goal: string): PhaseDefinition[] {
    const lower = goal.toLowerCase();

    // Pattern 1: YouTube / Video Creation
    if (lower.includes("youtube") || lower.includes("video") || lower.includes("reel") || lower.includes("podcast") || lower.includes("short")) {
      return [
        {
          title: "Trend Research & Viral Angle",
          description: "Identify high-performing topics and curiosity-driven hooks with proven viewer demand.",
          capabilityId: "web-research",
          howToExecute: "Ask the AI to uncover 3 breakout video angles with high click-through potential.",
          actionablePrompt: `Act as a viral YouTube creator. Analyze current trends in "${goal}". Give me 3 high-converting title options and a 5-second opening hook that prevents viewers from scrolling away.`,
          estimatedMinutes: 15
        },
        {
          title: "High-Retention Scriptwriting",
          description: "Write an engaging script with visual pacing cues every 5-10 seconds to maximize watch time.",
          capabilityId: "text-generation",
          howToExecute: "Generate a complete script split into narration lines and visual scene cues.",
          actionablePrompt: `Write a compelling 60-second video script for: "${goal}". Include timestamps, voice narration lines, and exact B-roll image descriptions for every 5 seconds.`,
          estimatedMinutes: 20
        },
        {
          title: "Studio Voiceover & Narration",
          description: "Generate natural studio-quality voiceover with realistic emotional cadence.",
          capabilityId: "text-to-speech",
          howToExecute: "Paste the script narration into the voice engine and export high-bitrate MP3/WAV.",
          actionablePrompt: `Select a conversational, confident narrator voice. Keep stability at 60% and clarity at 80% for natural human cadence.`,
          estimatedMinutes: 10
        },
        {
          title: "B-Roll Generation & Auto-Editing",
          description: "Generate cinematic visual clips matching the script beats, then auto-burn subtitles.",
          capabilityId: "text-to-video",
          howToExecute: "Generate short 4-second video clips for each scene, drop into editor, and enable auto-captions.",
          actionablePrompt: `Cinematic hyper-realistic scene, 4K documentary lighting, cinematic motion, smooth camera tracking --ar 9:16 --v 6.0`,
          estimatedMinutes: 25
        }
      ];
    }

    // Pattern 2: Web App / SaaS / Software Development
    if (lower.includes("app") || lower.includes("website") || lower.includes("code") || lower.includes("software") || lower.includes("saas") || lower.includes("mvp")) {
      return [
        {
          title: "Modern UI Component Prototyping",
          description: "Generate responsive frontend layouts, interactive components, and clean design tokens.",
          capabilityId: "ui-generation",
          howToExecute: "Prompt the UI engine to construct the core page layout with dark mode aesthetics.",
          actionablePrompt: `Build a modern, responsive React/Next.js dashboard for "${goal}". Include a hero metrics section, clean sidebar navigation, and interactive action buttons with Tailwind CSS.`,
          estimatedMinutes: 25
        },
        {
          title: "Full-Stack Code Implementation",
          description: "Implement database schema, authentication, and core business logic in your code editor.",
          capabilityId: "code-generation",
          howToExecute: "Use an AI-powered code editor to generate server actions and database handlers.",
          actionablePrompt: `Write the complete TypeScript backend API route and database schema for "${goal}". Handle authentication, validate request inputs with Zod, and return typed responses.`,
          estimatedMinutes: 40
        },
        {
          title: "Security, Performance & Bug Audit",
          description: "Audit code for edge cases, missing error boundaries, and security vulnerabilities.",
          capabilityId: "code-review",
          howToExecute: "Run the code audit tool to catch memory leaks, unhandled promises, and SQL/XSS risks.",
          actionablePrompt: `Review this codebase for production-readiness. Highlight security vulnerabilities, edge-case failure modes, and performance optimizations.`,
          estimatedMinutes: 15
        },
        {
          title: "Automated Workflows & Integrations",
          description: "Connect payment processing (Stripe), email delivery, and webhook notifications.",
          capabilityId: "automation",
          howToExecute: "Set up webhook handlers to automatically dispatch notifications on user actions.",
          actionablePrompt: `Write a resilient webhook listener that processes payment events, updates user entitlement state, and triggers an onboarding email.`,
          estimatedMinutes: 20
        }
      ];
    }

    // Pattern 3: Academic Research / Writing / Analysis
    if (lower.includes("research") || lower.includes("study") || lower.includes("paper") || lower.includes("academic") || lower.includes("write")) {
      return [
        {
          title: "Semantic Paper & Source Discovery",
          description: "Search peer-reviewed literature, cross-reference empirical citations, and verify findings.",
          capabilityId: "web-research",
          howToExecute: "Query indexed academic papers and extract verifiable DOI citations.",
          actionablePrompt: `Find the top peer-reviewed empirical studies published on "${goal}". Summarize their methodologies, sample sizes, and primary statistical findings.`,
          estimatedMinutes: 20
        },
        {
          title: "Deep Document & PDF Synthesis",
          description: "Extract core arguments, contradictions, and data tables from key reference papers.",
          capabilityId: "document-analysis",
          howToExecute: "Upload reference PDFs to extract comparative matrices and key takeaway quotes.",
          actionablePrompt: `Extract key empirical findings, limitations, and theoretical frameworks from this study. Format as a comparative bulleted summary.`,
          estimatedMinutes: 25
        },
        {
          title: "Drafting & Manuscript Structure",
          description: "Draft polished narrative sections with academic rigor, proper transitions, and formal citations.",
          capabilityId: "text-generation",
          howToExecute: "Generate structured drafts with clear headings, literature review, and methodology.",
          actionablePrompt: `Draft a structured literature review section analyzing "${goal}". Compare diverging perspectives and synthesize the current academic consensus with formal APA citations.`,
          estimatedMinutes: 35
        }
      ];
    }

    // Pattern 4: Marketing / Sales / Lead Generation
    if (lower.includes("marketing") || lower.includes("outreach") || lower.includes("sales") || lower.includes("leads") || lower.includes("email") || lower.includes("business")) {
      return [
        {
          title: "Prospect Discovery & Lead Enrichment",
          description: "Identify qualified accounts, verify decision-maker emails, and analyze buyer signals.",
          capabilityId: "automation",
          howToExecute: "Build a verified lead list targeting executives matching your ideal customer profile.",
          actionablePrompt: `Extract verified decision-maker contacts for companies fitting "${goal}". Filter by verified deliverable email addresses and active buying signals.`,
          estimatedMinutes: 20
        },
        {
          title: "Personalized Outreach Pitching",
          description: "Generate tailored 3-sentence email sequences that get high reply rates.",
          capabilityId: "text-generation",
          howToExecute: "Craft personalized value propositions focused on their specific pain points.",
          actionablePrompt: `Write a concise, high-converting 3-email cold outreach sequence for "${goal}". Keep emails under 90 words, focus on a single clear ROI metric, and end with a low-friction CTA.`,
          estimatedMinutes: 15
        },
        {
          title: "Conversion Copy & Landing Page",
          description: "Build high-converting landing page copy, objection handlers, and social proof sections.",
          capabilityId: "seo-optimization",
          howToExecute: "Write clear benefit-driven headlines that address customer objections.",
          actionablePrompt: `Write high-converting website copy for "${goal}". Include a magnetic H1 headline, 3 transformation bullet points, social proof proof-points, and an irresistible call to action.`,
          estimatedMinutes: 25
        }
      ];
    }

    // Default 3-Step Universal Action Plan
    return [
      {
        title: "Step 1: Research & Discovery",
        description: "Analyze the best practices, competitor benchmarks, and proven frameworks.",
        capabilityId: "web-research",
        howToExecute: "Uncover top benchmarks and proven shortcuts before creating assets.",
        actionablePrompt: `Analyze the top 3 best practices for executing: "${goal}". Provide a concrete checklist of what works, what mistakes to avoid, and the fastest path to completion.`,
        estimatedMinutes: 15
      },
      {
        title: "Step 2: Core Creation & Build",
        description: "Generate the core deliverables, content, code, or creative assets.",
        capabilityId: "text-generation",
        howToExecute: "Prompt the AI to create your primary deliverable end-to-end.",
        actionablePrompt: `Generate the complete foundational draft/build for: "${goal}". Ensure professional quality, clear organization, and ready-to-use output.`,
        estimatedMinutes: 30
      },
      {
        title: "Step 3: Polish, Automate & Launch",
        description: "Refine final details, set up automated workflows, and launch.",
        capabilityId: "automation",
        howToExecute: "Package your project and set up automated delivery or distribution.",
        actionablePrompt: `Create a step-by-step launch and distribution checklist for: "${goal}". Detail how to test, package, and present it to target users.`,
        estimatedMinutes: 20
      }
    ];
  }

  /**
   * Generate an actionable, structured Markdown blueprint
   */
  private static generateBlueprintMarkdown(
    goal: string,
    skillLevel: string,
    phases: PlanPhase[],
    totalCost: number,
    budget: number | undefined,
    redundancies: RedundancyWarning[]
  ): string {
    let md = `# AI Execution Blueprint: ${goal}\n\n`;
    md += `**Target Skill Level:** ${skillLevel.toUpperCase()}  \n`;
    md += `**Estimated Monthly Cost:** $${totalCost}/month  \n`;
    if (budget !== undefined) {
      md += `**Budget Status:** ${totalCost <= budget ? `Within $${budget}/mo budget` : `Exceeds $${budget}/mo budget by $${totalCost - budget}`}  \n`;
    }
    md += `\n---\n\n## 🗺️ Implementation Phases\n\n`;

    phases.forEach(p => {
      md += `### Step ${p.phaseNumber}: ${p.title} (${p.estimatedMinutes || 20} mins)\n`;
      md += `${p.description}\n\n`;
      md += `**Tool to use:** [${p.primaryTool.name}](${p.primaryTool.website}) — ${p.primaryTool.pricing.model === "free" ? "Free" : `$${p.primaryTool.pricing.startingPrice}/mo`}\n`;
      if (p.alternativeTool) {
        md += `*Free Alternative:* [${p.alternativeTool.name}](${p.alternativeTool.website}) (${p.alternativeTool.pricing.model === "free" || p.alternativeTool.pricing.freePlan ? "Free tier" : `$${p.alternativeTool.pricing.startingPrice}/mo`})\n`;
      }
      if (p.howToExecute) {
        md += `\n**How to execute:** ${p.howToExecute}\n`;
      }
      if (p.actionablePrompt) {
        md += `\n**Prompt to copy & paste:**\n\`\`\`text\n${p.actionablePrompt}\n\`\`\`\n`;
      }
      md += `\n---\n\n`;
    });

    if (redundancies.length > 0) {
      md += `## ⚠️ Cost Optimization & Redundancy Warnings\n\n`;
      redundancies.forEach(r => {
        md += `- **${r.capabilityName} Overlap:** ${r.recommendation} *(Potential Savings: $${r.potentialMonthlySavings}/mo)*\n`;
      });
      md += `\n`;
    }

    md += `*Generated by AI Atlas Planner · 100% Fact-Grounded Data*\n`;
    return md;
  }
}
