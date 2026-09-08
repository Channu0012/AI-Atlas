import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";
import { generateDataQualityReport } from "@/lib/admin/quality-engine";

const CATEGORY_TARGETS: Record<string, { name: string; target: number }> = {
  "cat-chatbots": { name: "AI Assistants & Chatbots", target: 60 },
  "cat-coding": { name: "Coding & Development", target: 100 },
  "cat-image": { name: "Image Generation & Editing", target: 100 },
  "cat-video": { name: "Video Generation & Editing", target: 80 },
  "cat-audio": { name: "Music, Audio & Voice", target: 60 },
  "cat-writing": { name: "Writing & Content", target: 70 },
  "cat-research": { name: "Search & Research", target: 60 },
  "cat-education": { name: "Education & Students", target: 50 },
  "cat-productivity": { name: "Business & Productivity", target: 70 },
  "cat-marketing": { name: "Marketing & SEO", target: 70 },
  "cat-design": { name: "Design & UI/UX", target: 50 },
  "cat-automation": { name: "Automation & AI Agents", target: 60 },
  "cat-sales-crm": { name: "Sales & CRM", target: 40 },
  "cat-email": { name: "Email & Communication", target: 30 },
  "cat-documents": { name: "Documents & PDF", target: 30 },
  "cat-datascience": { name: "Data & Analytics", target: 30 },
  "cat-builders": { name: "Website & App Builders", target: 40 },
  "cat-nocode": { name: "No-Code Tools", target: 20 },
  "cat-security-infra": { name: "Security & Developer Infrastructure", target: 20 },
  "cat-specialized": { name: "Other Specialized AI", target: 20 }
};

export async function GET(req: NextRequest) {
  try {
    const tools = await Repository.getAllTools();
    const categories = await Repository.getCategories();
    const searchAnalytics = await Repository.getSearchAnalytics();
    const searchGaps = searchAnalytics.noResultQueries.map(q => ({
      query: q.query,
      frequency: q.count,
      resultsCount: 0,
      priority: "high"
    }));

    // 2. Category Gap Analysis (Deficit against PRD targets)
    const categoryCounts: Record<string, number> = {};
    tools.filter(t => t.status === "published").forEach(t => {
      t.categoryIds?.forEach(cid => {
        categoryCounts[cid] = (categoryCounts[cid] || 0) + 1;
      });
    });

    const categoryGaps = Object.entries(CATEGORY_TARGETS).map(([cid, data]) => {
      const count = categoryCounts[cid] || 0;
      const deficit = Math.max(0, data.target - count);
      return {
        categoryId: cid,
        name: data.name,
        currentCount: count,
        target: data.target,
        deficit,
        fulfillmentPercentage: Math.min(100, Math.round((count / data.target) * 100))
      };
    }).sort((a, b) => b.deficit - a.deficit);

    // 3. Data Quality Overview
    const qualityReport = generateDataQualityReport(tools, categories);

    return NextResponse.json({
      success: true,
      data: {
        searchGaps,
        categoryGaps,
        qualityReport: {
          totalTools: qualityReport.totalTools,
          averageCompleteness: qualityReport.averageCompleteness,
          missingDescriptionsCount: qualityReport.missingDescriptions.length,
          missingPricingCount: qualityReport.missingPricing.length,
          missingLogosCount: qualityReport.missingLogos.length,
          unverifiedCount: qualityReport.unverifiedTools.length,
          potentialDuplicatesCount: qualityReport.potentialDuplicates.length
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate gap analysis" },
      { status: 500 }
    );
  }
}
