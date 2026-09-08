import { NextRequest, NextResponse } from "next/server";
import { KieClient } from "@/lib/integrations/kie-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, phaseTitle, skillLevel, customKey } = body;

    if (!goal || typeof goal !== "string" || !goal.trim()) {
      return NextResponse.json(
        { error: "Goal description is required to generate a solution." },
        { status: 400 }
      );
    }

    const solution = await KieClient.generateSolutionDeliverable(
      goal.trim(),
      phaseTitle || "Execution Blueprint",
      skillLevel || "intermediate",
      customKey
    );

    return NextResponse.json({
      success: true,
      data: solution
    });
  } catch (error: any) {
    console.error("Kie.ai Solution API error:", error);
    return NextResponse.json(
      { error: "Failed to generate solution deliverable.", details: error.message },
      { status: 500 }
    );
  }
}
