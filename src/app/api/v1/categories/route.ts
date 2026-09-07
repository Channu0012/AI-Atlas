import { NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET() {
  try {
    const categories = await Repository.getCategories();
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "CATEGORIES_FETCH_FAILED", message: error.message }
      },
      { status: 500 }
    );
  }
}
