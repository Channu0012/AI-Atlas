import { describe, it, expect } from "vitest";
import { GoalPlannerEngine } from "../goal-planner";

describe("GoalPlannerEngine", () => {
  it("deconstructs a YouTube video creation goal into sequential phases", async () => {
    const plan = await GoalPlannerEngine.plan({
      goal: "Launch a faceless YouTube channel on tech news",
      budget: 50,
      skillLevel: "beginner"
    });

    expect(plan.phases.length).toBeGreaterThanOrEqual(3);
    expect(plan.phases[0].requiredCapability).toBe("web-research");
    expect(plan.phases[1].requiredCapability).toBe("text-generation");
    expect(plan.phases.some(p => p.requiredCapability === "text-to-speech")).toBe(true);
    expect(plan.phases.some(p => p.requiredCapability === "video-editing" || p.requiredCapability === "text-to-video")).toBe(true);

    // Each phase has a primary tool
    for (const phase of plan.phases) {
      expect(phase.primaryTool).toBeDefined();
      expect(phase.primaryTool.name).toBeTruthy();
    }

    expect(plan.totalEstimatedMonthlyCost).toBeGreaterThanOrEqual(0);
    expect(plan.blueprintMarkdown).toContain("AI Execution Blueprint");
    expect(plan.summary).toBeTruthy();
  });

  it("deconstructs a SaaS / Web App MVP goal", async () => {
    const plan = await GoalPlannerEngine.plan({
      goal: "Build a full-stack SaaS MVP app for customer onboarding",
      budget: 100,
      skillLevel: "intermediate"
    });

    expect(plan.phases.length).toBeGreaterThanOrEqual(3);
    expect(plan.phases.some(p => p.requiredCapability === "ui-generation" || p.requiredCapability === "code-generation")).toBe(true);
    expect(plan.totalEstimatedMonthlyCost).toBeGreaterThanOrEqual(0);
    expect(plan.blueprintMarkdown).toContain("Implementation Phases");
  });

  it("handles budget constraints accurately", async () => {
    const tightPlan = await GoalPlannerEngine.plan({
      goal: "Build a micro SaaS app",
      budget: 0, // Zero dollar budget
      skillLevel: "beginner"
    });

    expect(tightPlan.targetBudget).toBe(0);
    if (tightPlan.totalEstimatedMonthlyCost > 0) {
      expect(tightPlan.isWithinBudget).toBe(false);
      expect(tightPlan.budgetDifference).toBeLessThan(0);
    } else {
      expect(tightPlan.isWithinBudget).toBe(true);
      expect(tightPlan.budgetDifference).toBe(0);
    }

    const generousPlan = await GoalPlannerEngine.plan({
      goal: "Automate cold email sales pipeline",
      budget: 500,
      skillLevel: "professional"
    });

    expect(generousPlan.isWithinBudget).toBe(true);
    expect(generousPlan.budgetDifference).toBeGreaterThanOrEqual(0);
  });

  it("generates structured blueprint markdown with alternatives and tool links", async () => {
    const plan = await GoalPlannerEngine.plan({
      goal: "Local offline AI research setup",
      skillLevel: "professional",
      preferOpenSource: true
    });

    expect(plan.blueprintMarkdown).toContain("PROFESSIONAL");
    expect(plan.blueprintMarkdown).toContain("Phase 1");
    expect(plan.phases[0].primaryTool.website).toBeTruthy();
  });
});
