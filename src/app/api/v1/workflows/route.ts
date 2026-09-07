import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const workflows = await Repository.getWorkflows();
    return NextResponse.json({
      success: true,
      data: workflows
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "WORKFLOWS_FETCH_FAILED",
          message: error.message || "Failed to fetch workflows"
        }
      },
      { status: 500 }
    );
  }
}
