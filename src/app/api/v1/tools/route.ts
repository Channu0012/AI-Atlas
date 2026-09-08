import { NextRequest, NextResponse } from "next/server";
import { SearchService } from "@/lib/search/search-service";
import { Repository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const categoryId = searchParams.get("category") || undefined;
    const subcategoryId = searchParams.get("subcategory") || undefined;
    const capabilityId = searchParams.get("capability") || undefined;
    const pricingModel = searchParams.get("pricing") || undefined;
    const platform = searchParams.get("platform") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;
    const targetUser = searchParams.get("targetUser") || undefined;
    const collection = searchParams.get("collection") || undefined;
    const freePlanOnly = searchParams.get("freeOnly") === "true";
    const hasApi = searchParams.get("hasApi") === "true";
    const isOpenSource = searchParams.get("openSource") === "true";
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const sortBy = (searchParams.get("sortBy") as any) || "relevance";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const result = await SearchService.search({
      query,
      categoryId,
      subcategoryId,
      capabilityId,
      pricingModel,
      platform,
      difficulty,
      targetUser,
      collection,
      freePlanOnly,
      hasApi,
      isOpenSource,
      verifiedOnly,
      sortBy,
      page,
      limit
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TOOLS_FETCH_FAILED",
          message: error.message || "Failed to fetch tools"
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newTool = await Repository.createTool(body);
    return NextResponse.json({
      success: true,
      data: newTool
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TOOL_CREATE_FAILED",
          message: error.message || "Failed to create tool"
        }
      },
      { status: 400 }
    );
  }
}
