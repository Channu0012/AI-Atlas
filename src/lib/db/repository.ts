import { 
  Tool, 
  Category, 
  Capability, 
  UseCase, 
  Workflow, 
  Stack, 
  Review, 
  ToolSubmission, 
  AuditLog, 
  SearchEvent,
  RecommendationFeedback
} from "@/types";
import { SEED_TOOLS } from "@/lib/data/seed-tools";
import { 
  SEED_CATEGORIES, 
  SEED_CAPABILITIES, 
  SEED_USE_CASES, 
  SEED_WORKFLOWS 
} from "@/lib/data/seed-taxonomy";
import { adminFirestore, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

// In-Memory Fallback State (Thread-safe within Node runtime)
const inMemoryStore = {
  tools: [...SEED_TOOLS],
  categories: [...SEED_CATEGORIES],
  capabilities: [...SEED_CAPABILITIES],
  useCases: [...SEED_USE_CASES],
  workflows: [...SEED_WORKFLOWS],
  stacks: [] as Stack[],
  reviews: [] as Review[],
  submissions: [] as ToolSubmission[],
  auditLogs: [] as AuditLog[],
  searchEvents: [] as SearchEvent[],
  feedback: [] as RecommendationFeedback[]
};

export class Repository {
  // ==================== TOOLS ====================
  static async getPublishedTools(): Promise<Tool[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore
          .collection("tools")
          .where("status", "==", "published")
          .get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Tool));
        }
      } catch (err) {
        console.warn("Firestore error fetching published tools, using fallback store:", err);
      }
    }
    return inMemoryStore.tools.filter(t => t.status === "published");
  }

  static async getAllTools(): Promise<Tool[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore.collection("tools").get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Tool));
        }
      } catch (err) {
        console.warn("Firestore error fetching all tools:", err);
      }
    }
    return inMemoryStore.tools;
  }

  static async getToolBySlug(slug: string): Promise<Tool | null> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore
          .collection("tools")
          .where("slug", "==", slug)
          .limit(1)
          .get();
        if (!snapshot.empty) {
          const doc: any = snapshot.docs[0];
          return { id: doc.id, ...doc.data() } as Tool;
        }
      } catch (err) {
        console.warn("Firestore error fetching tool by slug:", err);
      }
    }
    const tool = inMemoryStore.tools.find(t => t.slug === slug);
    return tool || null;
  }

  static async getToolById(id: string): Promise<Tool | null> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const doc: any = await adminFirestore.collection("tools").doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() } as Tool;
        }
      } catch (err) {
        console.warn("Firestore error fetching tool by id:", err);
      }
    }
    const tool = inMemoryStore.tools.find(t => t.id === id);
    return tool || null;
  }

  static async createTool(toolData: Omit<Tool, "id" | "createdAt" | "updatedAt">): Promise<Tool> {
    const now = new Date().toISOString();
    const id = toolData.slug || `tool-${Date.now()}`;
    const newTool: Tool = {
      ...toolData,
      id,
      createdAt: now,
      updatedAt: now
    };

    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("tools").doc(id).set(newTool);
      } catch (err) {
        console.warn("Firestore error creating tool:", err);
      }
    }

    inMemoryStore.tools.unshift(newTool);
    await this.createAuditLog({
      actorId: "admin",
      action: "tool.created",
      entityType: "tool",
      entityId: id,
      changes: newTool
    });

    return newTool;
  }

  static async updateTool(id: string, updates: Partial<Tool>): Promise<Tool | null> {
    const existing = await this.getToolById(id);
    if (!existing) return null;

    const updated: Tool = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("tools").doc(id).update(updated);
      } catch (err) {
        console.warn("Firestore error updating tool:", err);
      }
    }

    const idx = inMemoryStore.tools.findIndex(t => t.id === id);
    if (idx >= 0) inMemoryStore.tools[idx] = updated;

    await this.createAuditLog({
      actorId: "admin",
      action: "tool.updated",
      entityType: "tool",
      entityId: id,
      changes: updates
    });

    return updated;
  }

  static async deleteTool(id: string): Promise<boolean> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("tools").doc(id).delete();
      } catch (err) {
        console.warn("Firestore error deleting tool:", err);
      }
    }
    const initialLen = inMemoryStore.tools.length;
    inMemoryStore.tools = inMemoryStore.tools.filter(t => t.id !== id);

    await this.createAuditLog({
      actorId: "admin",
      action: "tool.deleted",
      entityType: "tool",
      entityId: id
    });

    return inMemoryStore.tools.length < initialLen;
  }

  // ==================== CATEGORIES & CAPABILITIES ====================
  static async getCategories(): Promise<Category[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore.collection("categories").get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Category));
        }
      } catch (err) {
        console.warn("Firestore error fetching categories:", err);
      }
    }
    return inMemoryStore.categories;
  }

  static async getCapabilities(): Promise<Capability[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore.collection("capabilities").get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Capability));
        }
      } catch (err) {
        console.warn("Firestore error fetching capabilities:", err);
      }
    }
    return inMemoryStore.capabilities;
  }

  static async getUseCases(): Promise<UseCase[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore.collection("useCases").get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as UseCase));
        }
      } catch (err) {
        console.warn("Firestore error fetching use cases:", err);
      }
    }
    return inMemoryStore.useCases;
  }

  static async getUseCaseBySlug(slug: string): Promise<UseCase | null> {
    const list = await this.getUseCases();
    return list.find(uc => uc.slug === slug) || null;
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const list = await this.getCategories();
    return list.find(c => c.slug === slug) || null;
  }

  // ==================== WORKFLOWS ====================
  static async getWorkflows(): Promise<Workflow[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore.collection("workflows").get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Workflow));
        }
      } catch (err) {
        console.warn("Firestore error fetching workflows:", err);
      }
    }
    return inMemoryStore.workflows;
  }

  static async getWorkflowBySlug(slug: string): Promise<Workflow | null> {
    const list = await this.getWorkflows();
    return list.find(w => w.slug === slug) || null;
  }

  // ==================== STACKS ====================
  static async createStack(stackData: Omit<Stack, "id" | "createdAt" | "updatedAt">): Promise<Stack> {
    const now = new Date().toISOString();
    const id = `stack-${Date.now()}`;
    const newStack: Stack = {
      ...stackData,
      id,
      createdAt: now,
      updatedAt: now
    };

    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("stacks").doc(id).set(newStack);
      } catch (err) {
        console.warn("Firestore error creating stack:", err);
      }
    }

    inMemoryStore.stacks.unshift(newStack);
    return newStack;
  }

  static async getStackById(id: string): Promise<Stack | null> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const doc: any = await adminFirestore.collection("stacks").doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() } as Stack;
        }
      } catch (err) {
        console.warn("Firestore error fetching stack:", err);
      }
    }
    return inMemoryStore.stacks.find(s => s.id === id) || null;
  }

  static async getUserStacks(userId: string): Promise<Stack[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore
          .collection("stacks")
          .where("userId", "==", userId)
          .get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Stack));
        }
      } catch (err) {
        console.warn("Firestore error fetching user stacks:", err);
      }
    }
    return inMemoryStore.stacks.filter(s => s.userId === userId);
  }

  static async updateStack(id: string, updates: Partial<Stack>): Promise<Stack | null> {
    const existing = await this.getStackById(id);
    if (!existing) return null;

    const updated: Stack = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("stacks").doc(id).update(updated);
      } catch (err) {
        console.warn("Firestore error updating stack:", err);
      }
    }

    const idx = inMemoryStore.stacks.findIndex(s => s.id === id);
    if (idx >= 0) inMemoryStore.stacks[idx] = updated;

    return updated;
  }

  static async deleteStack(id: string): Promise<boolean> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("stacks").doc(id).delete();
      } catch (err) {
        console.warn("Firestore error deleting stack:", err);
      }
    }
    const initialLen = inMemoryStore.stacks.length;
    inMemoryStore.stacks = inMemoryStore.stacks.filter(s => s.id !== id);
    return inMemoryStore.stacks.length < initialLen;
  }

  // ==================== REVIEWS ====================
  static async getReviewsForTool(toolId: string): Promise<Review[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore
          .collection("reviews")
          .where("toolId", "==", toolId)
          .where("status", "==", "published")
          .get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Review));
        }
      } catch (err) {
        console.warn("Firestore error fetching reviews:", err);
      }
    }
    return inMemoryStore.reviews.filter(r => r.toolId === toolId && r.status === "published");
  }

  static async createReview(reviewData: Omit<Review, "id" | "createdAt" | "updatedAt" | "status">): Promise<Review> {
    const now = new Date().toISOString();
    const id = `rev-${Date.now()}`;
    const newReview: Review = {
      ...reviewData,
      id,
      status: "pending", // PRD: Never publish reviews automatically without moderation
      createdAt: now,
      updatedAt: now
    };

    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("reviews").doc(id).set(newReview);
      } catch (err) {
        console.warn("Firestore error creating review:", err);
      }
    }

    inMemoryStore.reviews.unshift(newReview);
    return newReview;
  }

  // ==================== SUBMISSIONS ====================
  static async createSubmission(submissionData: Omit<ToolSubmission, "id" | "createdAt" | "updatedAt" | "status">): Promise<{ submission: ToolSubmission; isDuplicate: boolean }> {
    const tools = await this.getAllTools();
    const cleanUrl = (url: string) => url.replace(/https?:\/\//i, "").replace(/www\./i, "").split("/")[0].toLowerCase();
    const submittedDomain = cleanUrl(submissionData.website);

    // Duplicate detection: domain match or exact name match
    const duplicates = tools.filter(t => 
      cleanUrl(t.website) === submittedDomain || 
      t.name.toLowerCase() === submissionData.toolName.toLowerCase()
    );

    const isDuplicate = duplicates.length > 0;
    const now = new Date().toISOString();
    const id = `sub-${Date.now()}`;

    const submission: ToolSubmission = {
      ...submissionData,
      id,
      status: isDuplicate ? "duplicate" : "pending",
      duplicateMatches: duplicates.map(d => d.name),
      createdAt: now,
      updatedAt: now
    };

    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("toolSubmissions").doc(id).set(submission);
      } catch (err) {
        console.warn("Firestore error saving submission:", err);
      }
    }

    inMemoryStore.submissions.unshift(submission);
    return { submission, isDuplicate };
  }

  static async getSubmissions(): Promise<ToolSubmission[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore.collection("toolSubmissions").get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as ToolSubmission));
        }
      } catch (err) {
        console.warn("Firestore error fetching submissions:", err);
      }
    }
    return inMemoryStore.submissions;
  }

  // ==================== AUDIT LOGS ====================
  static async createAuditLog(logData: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    const id = `log-${Date.now()}`;
    const log: AuditLog = {
      ...logData,
      id,
      timestamp: new Date().toISOString()
    };

    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("auditLogs").doc(id).set(log);
      } catch (err) {
        console.warn("Firestore error saving audit log:", err);
      }
    }

    inMemoryStore.auditLogs.unshift(log);
    return log;
  }

  static async getAuditLogs(): Promise<AuditLog[]> {
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore
          .collection("auditLogs")
          .orderBy("timestamp", "desc")
          .limit(100)
          .get();
        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as AuditLog));
        }
      } catch (err) {
        console.warn("Firestore error fetching audit logs:", err);
      }
    }
    return inMemoryStore.auditLogs;
  }

  // ==================== SEARCH EVENTS & ANALYTICS ====================
  static async logSearchEvent(query: string, resultsCount: number, matchedCategories: string[] = []): Promise<void> {
    const event: SearchEvent = {
      id: `se-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      query: query.trim(),
      resultsCount,
      hasResults: resultsCount > 0,
      matchedCategories,
      timestamp: new Date().toISOString()
    };

    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("searchEvents").doc(event.id).set(event);
      } catch (err) {
        console.warn("Firestore error logging search event:", err);
      }
    }

    inMemoryStore.searchEvents.unshift(event);
  }

  static async getSearchAnalytics(): Promise<{
    totalSearches: number;
    noResultCount: number;
    noResultQueries: { query: string; count: number }[];
    topCategories: { category: string; count: number }[];
  }> {
    let events = inMemoryStore.searchEvents;
    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        const snapshot = await adminFirestore.collection("searchEvents").limit(500).get();
        if (!snapshot.empty) {
          events = snapshot.docs.map((d: any) => d.data() as SearchEvent);
        }
      } catch (err) {
        console.warn("Firestore error fetching analytics:", err);
      }
    }

    const noResultMap = new Map<string, number>();
    events.filter(e => !e.hasResults).forEach(e => {
      const q = e.query.toLowerCase();
      noResultMap.set(q, (noResultMap.get(q) || 0) + 1);
    });

    const noResultQueries = Array.from(noResultMap.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalSearches: events.length,
      noResultCount: events.filter(e => !e.hasResults).length,
      noResultQueries,
      topCategories: []
    };
  }

  // ==================== RECOMMENDATION FEEDBACK ====================
  static async logRecommendationFeedback(feedbackData: Omit<RecommendationFeedback, "id" | "createdAt">): Promise<void> {
    const feedback: RecommendationFeedback = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAdminConfigured && adminFirestore) {
      try {
        await adminFirestore.collection("recommendationFeedback").doc(feedback.id).set(feedback);
      } catch (err) {
        console.warn("Firestore error logging feedback:", err);
      }
    }

    inMemoryStore.feedback.unshift(feedback);
  }

  // Seed migration utility
  static async syncSeedToFirestore(): Promise<{ count: number; success: boolean }> {
    if (!isFirebaseAdminConfigured || !adminFirestore) {
      return { count: 0, success: false };
    }

    const batch = adminFirestore.batch();
    for (const tool of SEED_TOOLS) {
      const ref = adminFirestore.collection("tools").doc(tool.id);
      batch.set(ref, tool, { merge: true });
    }
    for (const cat of SEED_CATEGORIES) {
      const ref = adminFirestore.collection("categories").doc(cat.id);
      batch.set(ref, cat, { merge: true });
    }
    for (const cap of SEED_CAPABILITIES) {
      const ref = adminFirestore.collection("capabilities").doc(cap.id);
      batch.set(ref, cap, { merge: true });
    }
    for (const uc of SEED_USE_CASES) {
      const ref = adminFirestore.collection("useCases").doc(uc.id);
      batch.set(ref, uc, { merge: true });
    }
    for (const wf of SEED_WORKFLOWS) {
      const ref = adminFirestore.collection("workflows").doc(wf.id);
      batch.set(ref, wf, { merge: true });
    }

    await batch.commit();
    return { count: SEED_TOOLS.length, success: true };
  }
}
