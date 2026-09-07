import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const workflow = await Repository.getWorkflowBySlug(slug);

    if (!workflow) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "WORKFLOW_NOT_FOUND",
            message: `Workflow '${slug}' not found`
          }
        },
        { status: 404 }
      );
    }

    // Collect all tool IDs referenced in workflow
    const toolIds = workflow.steps.flatMap(s => s.recommendedToolIds);
    const tools = await Repository.getPublishedTools();
    const toolsMap = tools.reduce((acc, t) => {
      if (toolIds.includes(t.id)) acc[t.id] = t;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      data: {
        workflow,
        toolsMap
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "WORKFLOW_LOOKUP_FAILED",
          message: error.message || "Failed to lookup workflow"
        }
      },
      { status: 500 }
    );
  }
}
