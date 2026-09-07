import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { RecommendationEngine } from "@/lib/recommendation/engine";

const RecommendRequestSchema = z.object({
  query: z.string().min(1, "Goal query is required"),
  intent: z.object({
    skillLevel: z.enum(["beginner", "intermediate", "professional"]).optional(),
    budget: z.object({
      amount: z.number().optional(),
      freeOnly: z.boolean().optional(),
      currency: z.string().optional()
    }).optional(),
    requiredCapabilities: z.array(z.string()).optional(),
    platform: z.array(z.string()).optional(),
    constraints: z.array(z.string()).optional()
  }).optional()
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = RecommendRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: parsed.error.issues[0]?.message || "Invalid recommendation payload"
          }
        },
        { status: 400 }
      );
    }

    const { query, intent } = parsed.data;
    const recommendationResult = await RecommendationEngine.recommend(query, intent);

    return NextResponse.json({
      success: true,
      data: recommendationResult
    });
  } catch (error: any) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RECOMMENDATION_FAILED",
          message: error.message || "Failed to generate recommendations"
        }
      },
      { status: 500 }
    );
  }
}
