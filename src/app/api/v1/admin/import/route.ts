import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";
import { checkDuplicate, calculateCompletenessScore } from "@/lib/admin/quality-engine";
import { Tool } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tools: rawTools, importStatus = "draft", skipDuplicates = true } = body;

    if (!Array.isArray(rawTools) || rawTools.length === 0) {
      return NextResponse.json(
        { success: false, error: "No tool records supplied for import." },
        { status: 400 }
      );
    }

    const existingTools = await Repository.getAllTools();
    const imported: Tool[] = [];
    const skippedDuplicates: Array<{ name: string; duplicateOf: string }> = [];
    const errors: Array<{ name: string; error: string }> = [];

    for (const raw of rawTools) {
      if (!raw.name || !raw.website) {
        errors.push({ name: raw.name || "Unknown", error: "Missing required name or website." });
        continue;
      }

      // Check duplicate
      const dupCheck = checkDuplicate(raw, existingTools);
      if (dupCheck.isDuplicate) {
        if (skipDuplicates) {
          skippedDuplicates.push({
            name: raw.name,
            duplicateOf: dupCheck.duplicateOf?.name || "Existing tool"
          });
          continue;
        }
      }

      const slug = raw.slug || raw.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const completeness = calculateCompletenessScore(raw);

      const toolPayload: Omit<Tool, "id" | "createdAt" | "updatedAt"> = {
        name: raw.name,
        slug,
        tagline: raw.tagline || raw.description?.slice(0, 120) || "AI Capability",
        description: raw.description || raw.tagline || "Verified AI platform.",
        website: raw.website,
        company: raw.company || { name: raw.name },
        logo: raw.logo,
        categoryIds: Array.isArray(raw.categoryIds) && raw.categoryIds.length > 0 ? raw.categoryIds : ["cat-coding"],
        subcategoryIds: Array.isArray(raw.subcategoryIds) ? raw.subcategoryIds : [],
        capabilityIds: Array.isArray(raw.capabilityIds) && raw.capabilityIds.length > 0 ? raw.capabilityIds : ["text-generation"],
        useCaseIds: Array.isArray(raw.useCaseIds) ? raw.useCaseIds : ["uc-build-website"],
        targetUsers: Array.isArray(raw.targetUsers) ? raw.targetUsers : ["developer", "creator"],
        features: Array.isArray(raw.features) ? raw.features : ["Core functionality"],
        pricing: raw.pricing || { model: "freemium", freePlan: true, freeTrial: false, startingPrice: 0 },
        platforms: raw.platforms || { web: true, ios: false, android: false, windows: false, mac: false, linux: false },
        api: raw.api || { available: false },
        openSource: Boolean(raw.openSource),
        difficulty: raw.difficulty || "intermediate",
        strengths: Array.isArray(raw.strengths) ? raw.strengths : ["Easy setup"],
        limitations: Array.isArray(raw.limitations) ? raw.limitations : ["Standard rate limits"],
        integrations: Array.isArray(raw.integrations) ? raw.integrations : [],
        supportedLanguages: Array.isArray(raw.supportedLanguages) ? raw.supportedLanguages : ["English"],
        verification: raw.verification || {
          status: importStatus === "published" ? "verified" : "draft",
          websiteChecked: true,
          pricingChecked: true,
          featuresChecked: true,
          lastVerifiedAt: new Date().toISOString()
        },
        metrics: {
          viewCount: 0,
          saveCount: 0,
          outboundClickCount: 0
        },
        dataCompletenessScore: completeness,
        status: importStatus === "published" ? "published" : "draft"
      };

      const created = await Repository.createTool(toolPayload);
      imported.push(created);
      existingTools.unshift(created);
    }

    return NextResponse.json({
      success: true,
      data: {
        importedCount: imported.length,
        skippedCount: skippedDuplicates.length,
        errorCount: errors.length,
        skippedDuplicates,
        errors,
        sampleImported: imported.slice(0, 5)
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute bulk import." },
      { status: 500 }
    );
  }
}
