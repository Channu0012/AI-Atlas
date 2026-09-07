import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "demo-admin-user";
    const stacks = await Repository.getUserStacks(userId);

    return NextResponse.json({
      success: true,
      data: stacks
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "STACKS_FETCH_FAILED", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await Repository.createStack({
      userId: body.userId || "demo-admin-user",
      name: body.name || "Untitled AI Stack",
      description: body.description || "",
      goal: body.goal || "",
      tools: body.tools || [],
      estimatedMonthlyCost: body.estimatedMonthlyCost,
      visibility: body.visibility || "private"
    });

    return NextResponse.json({
      success: true,
      data: created
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "STACK_CREATE_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}
