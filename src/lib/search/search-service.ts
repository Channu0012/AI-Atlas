import { Tool } from "@/types";
import { Repository } from "@/lib/db/repository";

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  capabilityId?: string;
  pricingModel?: string;
  freePlanOnly?: boolean;
  platform?: string;
  difficulty?: string;
  hasApi?: boolean;
  isOpenSource?: boolean;
  verifiedOnly?: boolean;
  sortBy?: "relevance" | "verified" | "name" | "saves";
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

    let filtered = allTools.filter(tool => {
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

      // 3. Capability filter
      if (targetCapId && !tool.capabilityIds.includes(targetCapId)) {
        return false;
      }

      // 4. Pricing model
      if (filters.pricingModel && tool.pricing.model !== filters.pricingModel) {
        return false;
      }

      // 5. Free plan only
      if (filters.freePlanOnly && !tool.pricing.freePlan && tool.pricing.model !== "free") {
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
    const sortBy = filters.sortBy || "relevance";
    if (sortBy === "verified") {
      filtered.sort((a, b) => {
        const timeA = a.verification.lastVerifiedAt ? new Date(a.verification.lastVerifiedAt).getTime() : 0;
        const timeB = b.verification.lastVerifiedAt ? new Date(b.verification.lastVerifiedAt).getTime() : 0;
        return timeB - timeA;
      });
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "saves") {
      filtered.sort((a, b) => b.metrics.saveCount - a.metrics.saveCount);
    } else {
      // Relevance / view count default
      filtered.sort((a, b) => b.metrics.viewCount - a.metrics.viewCount);
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
