import { NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, resultCount } = body;

    if (!query) {
      return NextResponse.json({ success: false, error: "Missing query" }, { status: 400 });
    }

    // Log the search event in the database repository for search analytics & search gap engine
    await Repository.logSearchEvent(
      query,
      resultCount || 0,
      []
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
