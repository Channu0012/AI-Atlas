import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    await Repository.logRecommendationFeedback({
      recommendationId: id,
      toolId: body.toolId,
      feedbackType: body.feedbackType || "helpful",
      notes: body.notes
    });

    return NextResponse.json({
      success: true,
      data: { acknowledged: true }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "FEEDBACK_FAILED", message: error.message } },
      { status: 500 }
    );
  }
}
