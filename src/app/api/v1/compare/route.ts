import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Repository } from "@/lib/db/repository";
import { Tool } from "@/types";

const CompareRequestSchema = z.object({
  toolSlugs: z.array(z.string()).min(1).max(4)
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = CompareRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_COMPARE_REQUEST",
            message: "Must provide between 1 and 4 tool slugs"
          }
        },
        { status: 400 }
      );
    }

    const { toolSlugs } = parsed.data;
    const tools: Tool[] = [];

    for (const slug of toolSlugs) {
      const tool = (await Repository.getToolBySlug(slug)) || (await Repository.getToolById(slug));
      if (tool) {
        tools.push(tool);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        tools
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "COMPARE_FAILED",
          message: error.message || "Failed to compare tools"
        }
      },
      { status: 500 }
    );
  }
}
