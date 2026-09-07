import { NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET() {
  try {
    const allTools = await Repository.getAllTools();
    const submissions = await Repository.getSubmissions();
    const searchAnalytics = await Repository.getSearchAnalytics();
    const auditLogs = await Repository.getAuditLogs();

    const totalTools = allTools.length;
    const publishedTools = allTools.filter(t => t.status === "published").length;
    const verifiedTools = allTools.filter(t => t.verification.status === "verified").length;
    const pendingVerification = allTools.filter(t => t.verification.status === "pending").length;
    const needsReview = allTools.filter(t => t.verification.status === "needs-review").length;
    const inactiveTools = allTools.filter(t => t.verification.status === "inactive").length;
    const pendingSubmissions = submissions.filter(s => s.status === "pending").length;

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalTools,
          publishedTools,
          verifiedTools,
          pendingVerification,
          needsReview,
          inactiveTools,
          pendingSubmissions,
          totalSearches: searchAnalytics.totalSearches,
          noResultSearches: searchAnalytics.noResultCount
        },
        searchGaps: searchAnalytics.noResultQueries,
        recentAuditLogs: auditLogs.slice(0, 10),
        pendingSubmissionsList: submissions.slice(0, 5)
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "STATS_FAILED", message: error.message }
      },
      { status: 500 }
    );
  }
}
