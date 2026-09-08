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
        isFreeTier: estimatedCost === 0
      });
    }

    // 3. Financial & Budget Audit
    const totalEstimatedMonthlyCost = phases.reduce((sum, p) => sum + p.estimatedCost, 0);
    const isWithinBudget = budget !== undefined ? totalEstimatedMonthlyCost <= budget : true;
    const budgetDifference = budget !== undefined ? budget - totalEstimatedMonthlyCost : undefined;

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

    const summary = `Generated a ${phases.length}-phase execution plan requiring an estimated $${totalEstimatedMonthlyCost}/mo.${
      budget !== undefined
        ? isWithinBudget
          ? ` Safely within your $${budget}/mo budget ($${budgetDifference} surplus).`
          : ` Exceeds your $${budget}/mo budget by $${Math.abs(budgetDifference || 0)}. Consider switching to the recommended free alternatives.`
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
      blueprintMarkdown
    };
  }

  /**
   * Deconstruct the goal into sequential phases using domain patterns
   */
  private static extractPhaseDefinitions(goal: string): PhaseDefinition[] {
    const lower = goal.toLowerCase();

    // Pattern 1: YouTube / Video Creation
    if (lower.includes("youtube") || lower.includes("video") || lower.includes("reel") || lower.includes("podcast")) {
      return [
        {
          title: "Ideation & Trend Discovery",
          description: "Analyze market interest, verify factual citations, and structure narrative outline.",
          capabilityId: "web-research"
        },
        {
          title: "Scriptwriting & Hook Optimization",
          description: "Draft compelling high-retention script with clear 15-second opening hook.",
          capabilityId: "text-generation"
        },
        {
          title: "Voiceover & Audio Narration",
          description: "Synthesize natural studio-grade voiceover with realistic emotional cadence.",
          capabilityId: "text-to-speech"
        },
        {
          title: "B-Roll & Visual Generation",
          description: "Generate cinematic background clips and visual illustrations matching the script.",
          capabilityId: "text-to-video"
        },
        {
          title: "Video Assembly & Auto-Subtitles",
          description: "Cut filler words, align visual cuts to voice, and burn in animated captions.",
          capabilityId: "video-editing"
        }
      ];
    }

    // Pattern 2: Web App / SaaS / Software Development
    if (lower.includes("app") || lower.includes("website") || lower.includes("code") || lower.includes("software") || lower.includes("saas") || lower.includes("mvp")) {
      return [
        {
          title: "Interactive UI & Layout Prototyping",
          description: "Generate polished React frontend components and responsive styling.",
          capabilityId: "ui-generation"
        },
        {
          title: "Full-Stack Implementation & Backend Logic",
          description: "Build server API routes, database schemas, and complex business logic in your editor.",
          capabilityId: "code-generation"
        },
        {
          title: "Automated Code Review & Bug Audits",
          description: "Lint codebase for vulnerabilities, test coverage gaps, and performance bottlenecks.",
          capabilityId: "code-review"
        },
        {
          title: "Backend Workflows & Webhook Pipelines",
          description: "Connect payment webhooks, database triggers, and third-party APIs.",
          capabilityId: "automation"
        }
      ];
    }

    // Pattern 3: Academic Research / Study / Paper Synthesis
    if (lower.includes("research") || lower.includes("study") || lower.includes("paper") || lower.includes("academic") || lower.includes("literature")) {
      return [
        {
          title: "Paper Discovery & Semantic Search",
          description: "Identify seminal peer-reviewed research papers with verified DOI citations.",
          capabilityId: "web-research"
        },
        {
          title: "Document Deep Analysis & Data Extraction",
          description: "Extract sample sizes, methodologies, and statistical outcomes from uploaded PDFs.",
          capabilityId: "document-analysis"
        },
        {
          title: "Literature Review Synthesis",
          description: "Synthesize contrasting perspectives and draft manuscript sections.",
          capabilityId: "text-generation"
        }
      ];
    }

    // Pattern 4: Marketing / Sales / Cold Outreach
    if (lower.includes("marketing") || lower.includes("outreach") || lower.includes("sales") || lower.includes("leads") || lower.includes("email")) {
      return [
        {
          title: "Data Enrichment & Prospect Signals",
          description: "Scrape company intent signals, hiring indicators, and verified executive contact emails.",
          capabilityId: "automation"
        },
        {
          title: "Context-Aware Pitch Generation",
          description: "Generate 1-to-1 tailored value propositions matching the prospect's tech stack.",
          capabilityId: "text-generation"
        },
        {
          title: "SEO & Content Optimization",
          description: "Audit keywords, search intent, and on-page headings for maximum organic rank.",
          capabilityId: "seo-optimization"
        }
      ];
    }

    // Pattern 5: Local & Private Offline AI
    if (lower.includes("local") || lower.includes("offline") || lower.includes("privacy") || lower.includes("private")) {
      return [
        {
          title: "Local Offline Inference Engine",
          description: "Serve quantized open-weights models locally without sending telemetry to cloud servers.",
          capabilityId: "text-generation"
        },
        {
          title: "Private Code Completion Extension",
          description: "Connect local LLM endpoint directly to your IDE for private pair programming.",
          capabilityId: "code-generation"
        },
        {
          title: "Local Image & Media Generation",
          description: "Run modular diffusion pipelines on your local GPU with node-based precision.",
          capabilityId: "text-to-image"
        }
      ];
    }

    // Default 3-Phase Generic Knowledge Pipeline
    return [
      {
        title: "Phase 1: Research & Discovery",
        description: "Gather background knowledge, competitor signals, and verified facts.",
        capabilityId: "web-research"
      },
      {
        title: "Phase 2: Content & Asset Synthesis",
        description: "Draft core deliverables, scripts, or application code.",
        capabilityId: "text-generation"
      },
      {
        title: "Phase 3: Automation & Delivery",
        description: "Automate delivery pipelines, scheduling, or operational integrations.",
        capabilityId: "automation"
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
      md += `### Phase ${p.phaseNumber}: ${p.title}\n`;
      md += `${p.description}\n\n`;
      md += `- **Primary Tool:** [${p.primaryTool.name}](${p.primaryTool.website}) — ${p.primaryTool.pricing.model === "free" ? "Free" : `$${p.primaryTool.pricing.startingPrice}/mo`}\n`;
      if (p.alternativeTool) {
        md += `- **Budget Alternative:** [${p.alternativeTool.name}](${p.alternativeTool.website}) (${p.alternativeTool.pricing.model === "free" || p.alternativeTool.pricing.freePlan ? "Free tier" : `$${p.alternativeTool.pricing.startingPrice}/mo`})\n`;
      }
      md += `\n`;
    });

    if (redundancies.length > 0) {
      md += `## ⚠️ Cost Optimization & Redundancy Warnings\n\n`;
      redundancies.forEach(r => {
        md += `- **${r.capabilityName} Overlap:** ${r.recommendation} *(Potential Savings: $${r.potentialMonthlySavings}/mo)*\n`;
      });
      md += `\n`;
    }

    md += `---\n*Generated by AI Atlas Decision Engine · 100% Fact-Grounded Data*\n`;
    return md;
  }
}
