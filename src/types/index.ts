export type PricingModel = "free" | "freemium" | "paid" | "custom" | "unknown";
export type SkillLevel = "beginner" | "intermediate" | "professional";
export type VerificationStatus = "verified" | "pending" | "needs-review" | "inactive" | "draft";
export type ToolStatus = "draft" | "published" | "archived";
export type UserRole = "user" | "editor" | "admin";

export interface ToolPricing {
  model: PricingModel;
  freePlan: boolean;
  freeTrial: boolean;
  startingPrice?: number;
  currency?: string;
  billingPeriod?: "monthly" | "yearly" | "one-time";
  pricingUrl?: string;
  notes?: string;
}

export interface ToolPlatforms {
  web: boolean;
  ios: boolean;
  android: boolean;
  windows: boolean;
  mac: boolean;
  linux: boolean;
}

export interface ToolVerification {
  status: VerificationStatus;
  websiteChecked: boolean;
  pricingChecked: boolean;
  featuresChecked: boolean;
  lastVerifiedAt?: string;
  pricingCheckedAt?: string;
  featuresCheckedAt?: string;
  websiteCheckedAt?: string;
  verificationNotes?: string;
}

export interface ToolMetrics {
  viewCount: number;
  saveCount: number;
  outboundClickCount: number;
  ratingAverage?: number;
  ratingCount?: number;
}

export interface ToolRankingSignals {
  qualityScore?: number;
  reliabilityScore?: number;
  popularityScore?: number;
  recencyScore?: number;
  trendingScore?: number;
  valueScore?: number;
  reputationScore?: number;
  velocityScore?: number;
  recentTrafficVelocity?: number;
}

export type TrustBadge = "verified" | "community" | "ai-explained" | "recently-verified";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website: string;
  company: {
    name: string;
    website?: string;
  };
  logo?: string;
  categoryIds: string[];
  subcategoryIds?: string[];
  capabilityIds: string[];
  useCaseIds: string[];
  targetUsers: string[];
  features: string[];
  pricing: ToolPricing;
  platforms: ToolPlatforms;
  api: {
    available: boolean;
    docsUrl?: string;
  };
  openSource: boolean;
  repositoryUrl?: string;
  difficulty: SkillLevel;
  strengths: string[];
  limitations: string[];
  integrations: string[];
  supportedLanguages: string[];
  verification: ToolVerification;
  metrics: ToolMetrics;
  rankingSignals?: ToolRankingSignals;
  dataCompletenessScore?: number;
  trustBadge?: TrustBadge;
  launchDate?: string;
  status: ToolStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  icon?: string;
  sortOrder: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Capability {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryGroup?: string;
  status?: "active" | "draft";
}

export interface UseCase {
  id: string;
  name: string;
  slug: string;
  description: string;
  requiredCapabilities: string[];
  targetUsers: string[];
  recommendedWorkflowId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  description: string;
  requiredCapabilities: string[];
  recommendedToolIds: string[];
}

export interface Workflow {
  id: string;
  name: string;
  slug: string;
  description: string;
  category?: string;
  steps: WorkflowStep[];
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface StackToolItem {
  toolId: string;
  role: string;
  order: number;
  stepName?: string;
  alternativeToolIds?: string[];
}

export interface Stack {
  id: string;
  userId?: string;
  name: string;
  description: string;
  goal: string;
  tools: StackToolItem[];
  estimatedMonthlyCost?: {
    amount: number;
    currency: string;
    hasUnknownPricing?: boolean;
  };
  visibility: "private" | "public";
  isSystemTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  onboardingCompleted: boolean;
  profile: {
    userType?: string;
    interests?: string[];
    skillLevel?: SkillLevel;
  };
  preferences: {
    budget?: number;
    currency?: string;
    preferredPlatforms?: string[];
    preferFree?: boolean;
    preferOpenSource?: boolean;
  };
  savedToolIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userDisplayName?: string;
  toolId: string;
  rating: number; // 1-5
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  status: "pending" | "published" | "removed";
  createdAt: string;
  updatedAt: string;
}

export interface SearchIntent {
  goal: string;
  userType?: string;
  budget?: {
    amount?: number;
    currency?: string;
    period?: "monthly" | "yearly" | "one-time";
    maxBudget?: number;
    freeOnly?: boolean;
  };
  skillLevel?: SkillLevel;
  requiredCapabilities: string[];
  preferredCapabilities?: string[];
  platform?: string[];
  priorities?: ("ease-of-use" | "value" | "quality" | "cost" | "api" | "open-source")[];
  constraints?: string[];
  outputType?: string;
  industry?: string;
}

export interface RecommendationWeights {
  useCase: number;
  capability: number;
  budget: number;
  quality: number;
  skill: number;
  reliability: number;
  platform: number;
  easeOfUse?: number;
}

export interface RecommendationResultItem {
  tool: Tool;
  score: number;
  rank: number;
  badgeLabel?: "Best Overall" | "Best Free" | "Best Value" | "Best Quality" | "Best for Beginners" | "Best for Professionals" | "Best for Developers" | "Best for API";
  reasonCodes: string[];
  whyRecommended: string;
  keyLimitations: string[];
  componentScores: {
    useCaseMatch: number;
    capabilityMatch: number;
    budgetFit: number;
    quality: number;
    skillFit: number;
    reliability: number;
    platformFit: number;
  };
}

export interface RecommendationResponseData {
  id: string;
  interpretedGoal: string;
  extractedRequirements: {
    label: string;
    type: "skill" | "budget" | "capability" | "platform" | "constraint";
  }[];
  recommendations: RecommendationResultItem[];
  alternatives: {
    forToolId: string;
    tool: Tool;
    relation: string;
  }[];
  suggestedWorkflow?: Workflow;
  followUpQuestions?: {
    id: string;
    question: string;
    options: { label: string; value: string }[];
  }[];
  aiExplanationNotes?: string;
  isAiDegraded: boolean;
}

export interface ToolSubmission {
  id: string;
  userId?: string;
  toolName: string;
  website: string;
  tagline: string;
  description: string;
  categoryIds: string[];
  pricingModel: PricingModel;
  startingPrice?: number;
  openSource: boolean;
  platforms: string[];
  contactEmail: string;
  status: "pending" | "approved" | "rejected" | "duplicate";
  duplicateMatches?: string[];
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: any;
  timestamp: string;
}

export interface SearchEvent {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
  hasResults: boolean;
  matchedCategories?: string[];
  userId?: string;
}

export interface RecommendationFeedback {
  id: string;
  recommendationId: string;
  toolId?: string;
  feedbackType: "helpful" | "not_relevant" | "wrong_budget" | "wrong_capability" | "too_difficult" | "other";
  notes?: string;
  createdAt: string;
}

export interface RedundancyWarning {
  capabilityId: string;
  capabilityName: string;
  overlappingToolNames: string[];
  recommendation: string;
  potentialMonthlySavings: number;
}

export interface PlanPhase {
  phaseNumber: number;
  title: string;
  description: string;
  requiredCapability: string;
  primaryTool: Tool;
  alternativeTool?: Tool;
  estimatedCost: number;
  isFreeTier: boolean;
  actionablePrompt?: string;
  howToExecute?: string;
  estimatedMinutes?: number;
}

export interface PlanResult {
  goal: string;
  skillLevel: SkillLevel;
  targetBudget?: number;
  phases: PlanPhase[];
  totalEstimatedMonthlyCost: number;
  isWithinBudget: boolean;
  budgetDifference?: number;
  redundancies: RedundancyWarning[];
  summary: string;
  blueprintMarkdown: string;
  estimatedHoursToLaunch?: number;
}


