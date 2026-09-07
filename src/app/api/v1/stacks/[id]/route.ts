import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const stack = await Repository.getStackById(id);
    if (!stack) {
      return NextResponse.json(
        { success: false, error: { code: "STACK_NOT_FOUND", message: "Stack not found" } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: stack });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "STACK_LOOKUP_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const updated = await Repository.updateStack(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "STACK_NOT_FOUND", message: "Stack not found" } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "STACK_UPDATE_ERROR", message: error.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = await Repository.deleteStack(id);
    return NextResponse.json({ success: true, data: { deleted } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "STACK_DELETE_ERROR", message: error.message } },
      { status: 400 }
    );
  }
}
