import { Tool } from "@/types";
import { Repository } from "@/lib/db/repository";
import { getDynamicCollection } from "@/lib/recommendation/collections";

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  capabilityId?: string;
  pricingModel?: string;
  freePlanOnly?: boolean;
  platform?: string;
  difficulty?: string;
  targetUser?: string;
  collection?: string;
  hasApi?: boolean;
  isOpenSource?: boolean;
  verifiedOnly?: boolean;
  sortBy?: "relevance" | "verified" | "name" | "saves" | "top-100" | "trending" | "best-free" | "best-value" | "newest";
  page?: number;
  limit?: number;
}

export interface SearchResult {
  tools: Tool[];
  total: number;
  page: number;
  totalPages: number;
}

export class SearchService {
  static async search(filters: SearchFilters): Promise<SearchResult> {
    const allTools = await Repository.getPublishedTools();

    const categories = await Repository.getCategories();
    const capabilities = await Repository.getCapabilities();

    let targetCatId = filters.categoryId;
    if (filters.categoryId) {
      const match = categories.find(c => c.id === filters.categoryId || c.slug === filters.categoryId);
      if (match) targetCatId = match.id;
    }

    let targetCapId = filters.capabilityId;
    if (filters.capabilityId) {
      const match = capabilities.find(c => c.id === filters.capabilityId || c.slug === filters.capabilityId);
      if (match) targetCapId = match.id;
    }

    // If collection is requested, compute collection subset first
    let baseTools = allTools;
    if (filters.collection && filters.collection !== "all") {
      const colResult = getDynamicCollection(allTools, filters.collection, 200);
      baseTools = colResult.tools;
    }

    let filtered = baseTools.filter(tool => {
      // 1. Text Query
      if (filters.query && filters.query.trim().length > 0) {
        const terms = filters.query.toLowerCase().trim().split(/\s+/);
        const searchable = `${tool.name} ${tool.tagline} ${tool.description} ${tool.company.name} ${tool.features.join(" ")} ${tool.strengths.join(" ")}`.toLowerCase();
        const matchesAll = terms.every(term => searchable.includes(term));
        if (!matchesAll) return false;
      }

      // 2. Category filter
      if (targetCatId && !tool.categoryIds.includes(targetCatId)) {
        return false;
      }

      // 2b. Subcategory filter
      if (filters.subcategoryId && (!tool.subcategoryIds || !tool.subcategoryIds.includes(filters.subcategoryId))) {
        return false;
      }

      // 3. Capability filter
      if (targetCapId && !tool.capabilityIds.includes(targetCapId)) {
        return false;
      }

      // 4. Pricing model
      if (filters.pricingModel && tool.pricing.model !== filters.pricingModel) {
        return false;
      }

      // 5. Free plan only
      if (filters.freePlanOnly && !tool.pricing.freePlan && tool.pricing.model !== "free" && !tool.openSource) {
        return false;
      }

      // 6. Platform
      if (filters.platform) {
        const pKey = filters.platform.toLowerCase() as keyof typeof tool.platforms;
        if (!tool.platforms[pKey] && !tool.platforms.web) {
          return false;
        }
      }

      // 7. Difficulty
      if (filters.difficulty && tool.difficulty !== filters.difficulty) {
        return false;
      }

      // 7b. Target User
      if (filters.targetUser && !tool.targetUsers?.some(u => u.toLowerCase().includes(filters.targetUser!.toLowerCase()))) {
        return false;
      }

      // 8. API Available
      if (filters.hasApi && !tool.api.available) {
        return false;
      }

      // 9. Open source
      if (filters.isOpenSource && !tool.openSource) {
        return false;
      }

      // 10. Verified only
      if (filters.verifiedOnly && tool.verification.status !== "verified") {
        return false;
      }

      return true;
    });

    // Sorting
    const sortBy = filters.sortBy || (filters.collection ? "relevance" : "relevance");
    if (sortBy === "verified") {
      filtered.sort((a, b) => {
        const timeA = a.verification.lastVerifiedAt ? new Date(a.verification.lastVerifiedAt).getTime() : 0;
        const timeB = b.verification.lastVerifiedAt ? new Date(b.verification.lastVerifiedAt).getTime() : 0;
        return timeB - timeA;
      });
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "saves") {
      filtered.sort((a, b) => (b.metrics?.saveCount || 0) - (a.metrics?.saveCount || 0));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const dateA = a.launchDate ? new Date(a.launchDate).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.launchDate ? new Date(b.launchDate).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } else {
      // Relevance / view count default
      filtered.sort((a, b) => (b.metrics?.viewCount || 0) - (a.metrics?.viewCount || 0));
    }

    // Pagination
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, Math.min(50, filters.limit || 12));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    // Track search event if query provided
    if (filters.query && filters.query.trim().length > 0) {
      await Repository.logSearchEvent(filters.query, total, filters.categoryId ? [filters.categoryId] : []);
    }

    return {
      tools: paginated,
      total,
      page,
      totalPages
    };
  }
}
