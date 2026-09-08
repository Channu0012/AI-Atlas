import { NextRequest, NextResponse } from "next/server";
import { OpenRegistryService } from "@/lib/registry/open-registry";
import { Repository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const pipeline = searchParams.get("pipeline") || undefined;
    const sort = (searchParams.get("sort") as any) || undefined;
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    // 1. Check local/verified tools that match query
    const verifiedTools = await Repository.getPublishedTools();
    const matchingVerified = query
      ? verifiedTools.filter(t => 
          t.name.toLowerCase().includes(query.toLowerCase()) || 
          t.tagline.toLowerCase().includes(query.toLowerCase())
        )
      : verifiedTools.slice(0, 10);

    // 2. Fetch live from 400,000+ open-source AI registry
    const { tools: registryTools, totalEstimate } = await OpenRegistryService.searchUniverse({
      query,
      pipeline,
      sort,
      limit
    });

    // 3. Cache discovered registry tools in Firestore in the background
    registryTools.slice(0, 15).forEach(tool => {
      Repository.cacheUniverseTool(tool).catch(() => {});
    });

    // 4. Combine matching verified tools with universe tools (deduplicating by slug/id)
    const seen = new Set<string>();
    const combined = [...matchingVerified, ...registryTools].filter(t => {
      if (seen.has(t.id) || seen.has(t.slug)) return false;
      seen.add(t.id);
      seen.add(t.slug);
      return true;
    });

    return NextResponse.json({
      success: true,
      data: {
        tools: combined,
        totalEstimate: totalEstimate + verifiedTools.length,
        verifiedCount: matchingVerified.length,
        universeCount: registryTools.length,
        page,
        limit
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNIVERSE_SEARCH_FAILED",
          message: error.message || "Failed to search AI universe"
        }
      },
      { status: 500 }
    );
  }
}
