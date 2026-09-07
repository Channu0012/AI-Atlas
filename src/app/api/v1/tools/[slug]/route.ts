import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const tool = await Repository.getToolBySlug(slug);

    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "TOOL_NOT_FOUND",
            message: `Tool with slug '${slug}' not found`
          }
        },
        { status: 404 }
      );
    }

    const reviews = await Repository.getReviewsForTool(tool.id);

    return NextResponse.json({
      success: true,
      data: {
        tool,
        reviews
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TOOL_LOOKUP_ERROR",
          message: error.message || "Failed to lookup tool"
        }
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const existing = await Repository.getToolBySlug(slug);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Tool not found" } },
        { status: 404 }
      );
    }

    const body = await req.json();
    const updated = await Repository.updateTool(existing.id, body);

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}
