import { NextRequest, NextResponse } from "next/server";
import { GoalPlannerEngine, PlannerInput } from "@/lib/planner/goal-planner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, budget, skillLevel, platform, preferOpenSource } = body;

    if (!goal || typeof goal !== "string" || !goal.trim()) {
      return NextResponse.json(
        { error: "Goal description is required." },
        { status: 400 }
      );
    }

    const input: PlannerInput = {
      goal: goal.trim(),
      budget: typeof budget === "number" && budget >= 0 ? budget : undefined,
      skillLevel: ["beginner", "intermediate", "professional"].includes(skillLevel) ? skillLevel : "beginner",
      platform: typeof platform === "string" ? platform : undefined,
      preferOpenSource: Boolean(preferOpenSource)
    };

    const planResult = await GoalPlannerEngine.plan(input);

    return NextResponse.json({
      success: true,
      plan: planResult
    });
  } catch (error: any) {
    console.error("Planner API error:", error);
    return NextResponse.json(
      { error: "Failed to generate goal blueprint.", details: error?.message },
      { status: 500 }
    );
  }
}
