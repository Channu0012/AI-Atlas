import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function POST(req: NextRequest) {
  try {
    const result = await Repository.syncSeedToFirestore();
    return NextResponse.json({
      success: true,
      message: "Successfully synchronized AI Atlas catalog to Firebase Firestore",
      syncedRecords: result.count
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FIRESTORE_SYNC_FAILED",
          message: error.message || "Failed to sync to Firebase Firestore"
        }
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const counts = await Repository.getTotalCatalogCount();
    return NextResponse.json({
      success: true,
      data: counts
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
