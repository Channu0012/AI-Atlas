import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";
import { getDynamicCollection, COLLECTIONS_METADATA } from "@/lib/recommendation/collections";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const allTools = await Repository.getPublishedTools();
    const result = getDynamicCollection(allTools, slug, limit * page);

    // Paginate results
    const startIndex = (page - 1) * limit;
    const paginatedTools = result.tools.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: {
        collection: result.metadata,
        tools: paginatedTools,
        total: result.tools.length,
        page,
        limit,
        totalPages: Math.ceil(result.tools.length / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "COLLECTION_FETCH_FAILED",
          message: error.message || "Failed to load collection"
        }
      },
      { status: 500 }
    );
  }
}
