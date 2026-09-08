import { Category, Capability, UseCase, Workflow } from "@/types";

export const SEED_CATEGORIES: Category[] = [
  // 1. AI Assistants & Chatbots
  {
    id: "cat-chatbots",
    name: "AI Assistants & Chatbots",
    slug: "ai-assistants",
    description: "General intelligence copilots, conversational models, and everyday task assistants.",
    sortOrder: 1,
    icon: "Bot",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-chatbot-general",
    name: "General AI Assistants",
    slug: "general-assistants",
    description: "Multimodal frontier chat assistants for ideation, analysis, and reasoning.",
    parentId: "cat-chatbots",
    sortOrder: 11,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 2. Coding & Development
  {
    id: "cat-coding",
    name: "Coding & Development",
    slug: "ai-coding",
    description: "AI code editors, terminal agents, automated refactoring, and code review.",
    sortOrder: 2,
    icon: "Code2",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-code-generators",
    name: "AI Code Generators",
    slug: "code-generators",
    description: "Prompt-to-code synthesis, snippet scaffolding, and boilerplate generation.",
    parentId: "cat-coding",
    sortOrder: 21,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-code-agents",
    name: "Coding Assistants & IDEs",
    slug: "developer-agents",
    description: "Autonomous and semi-autonomous coding IDEs and terminal agents.",
    parentId: "cat-coding",
    sortOrder: 22,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-code-review",
    name: "Code Review & Refactoring",
    slug: "code-review",
    description: "Automated PR reviews, security scanning, and architectural refactoring.",
    parentId: "cat-coding",
    sortOrder: 23,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 3. Image Generation & Editing
  {
    id: "cat-image",
    name: "Image Generation & Editing",
    slug: "ai-image",
    description: "Photorealistic image generation, vector SVGs, inpainting, and product photography.",
    sortOrder: 3,
    icon: "Palette",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-text-to-image",
    name: "Text-to-Image Generators",
    slug: "text-to-image",
    description: "Frontier visual diffusion models synthesizing illustrations, concept art, and photorealism.",
    parentId: "cat-image",
    sortOrder: 31,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-image-edit",
    name: "Image Editing & Inpainting",
    slug: "image-editing",
    description: "Generative fill, object removal, background replacement, and style transfer.",
    parentId: "cat-image",
    sortOrder: 32,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 4. Video Generation & Editing
  {
    id: "cat-video",
    name: "Video Generation & Editing",
    slug: "ai-video",
    description: "Text-to-video, cinematic motion, automated editing, lip-sync, and AI avatars.",
    sortOrder: 4,
    icon: "Video",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-video-gen",
    name: "Cinematic Video Generation",
    slug: "video-generation",
    description: "Generative video models synthesizing cinematic scenes from text and images.",
    parentId: "cat-video",
    sortOrder: 41,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-video-edit",
    name: "Automated Video Editing",
    slug: "video-editing",
    description: "Transcription-based cutting, auto-subtitles, and social reel repurposing.",
    parentId: "cat-video",
    sortOrder: 42,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-video-avatar",
    name: "AI Avatars & Lip Sync",
    slug: "video-avatars",
    description: "Photorealistic human presenters with lip-sync translation across 150+ languages.",
    parentId: "cat-video",
    sortOrder: 43,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 5. Music, Audio & Voice
  {
    id: "cat-audio",
    name: "Music, Audio & Voice",
    slug: "ai-audio-voice",
    description: "Realistic text-to-speech, custom voice cloning, and generative music synthesis.",
    sortOrder: 5,
    icon: "Mic",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-music",
    name: "AI Music Creation",
    slug: "ai-music",
    description: "Full song synthesis with vocals, instrumentation, and stem separation.",
    parentId: "cat-audio",
    sortOrder: 51,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-tts",
    name: "Voice Cloning & TTS",
    slug: "voice-cloning-tts",
    description: "Expressive text-to-speech and custom timbre voice cloning.",
    parentId: "cat-audio",
    sortOrder: 52,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 6. Writing & Content
  {
    id: "cat-writing",
    name: "Writing & Content",
    slug: "ai-writing-content",
    description: "Frontier copywriting, long-form publishing, SEO articles, and brand tone editors.",
    sortOrder: 6,
    icon: "FileText",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 7. Search & Research
  {
    id: "cat-research",
    name: "Search & Research",
    slug: "ai-search-research",
    description: "Cited live search engines, scientific paper synthesis, and deep literature explorers.",
    sortOrder: 7,
    icon: "Search",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 8. Education & Students
  {
    id: "cat-education",
    name: "Education & Students",
    slug: "ai-education",
    description: "Personalized learning tutors, language conversation practice, and automated study aids.",
    sortOrder: 8,
    icon: "GraduationCap",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 9. Business & Productivity
  {
    id: "cat-productivity",
    name: "Business & Productivity",
    slug: "ai-business-productivity",
    description: "Presentation generators, meeting intelligence, note synthesis, and smart spreadsheets.",
    sortOrder: 9,
    icon: "Sparkles",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 10. Marketing & SEO
  {
    id: "cat-marketing",
    name: "Marketing & SEO",
    slug: "ai-marketing-seo",
    description: "Ad creative generation, SEO keyword auditing, campaign strategy, and content scoring.",
    sortOrder: 10,
    icon: "TrendingUp",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 11. Design & UI/UX
  {
    id: "cat-design",
    name: "Design & UI/UX",
    slug: "ai-design-ui",
    description: "UI/UX component generators, vector graphics, wireframing, and 3D spatial design.",
    sortOrder: 11,
    icon: "Layers",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 12. Automation & AI Agents
  {
    id: "cat-automation",
    name: "Automation & AI Agents",
    slug: "ai-automation-agents",
    description: "Autonomous OS agents, browser operators, webhook routers, and multi-agent coordination.",
    sortOrder: 12,
    icon: "Workflow",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 13. Sales & CRM
  {
    id: "cat-sales-crm",
    name: "Sales & CRM",
    slug: "ai-sales-crm",
    description: "Lead enrichment, autonomous email sequences, conversation intelligence, and CRM sync.",
    sortOrder: 13,
    icon: "Headphones",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 14. Email & Communication
  {
    id: "cat-email",
    name: "Email & Communication",
    slug: "ai-email",
    description: "Smart email triage, autonomous drafting, and team communication copilots.",
    sortOrder: 14,
    icon: "Mail",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 15. Documents & PDF
  {
    id: "cat-documents",
    name: "Documents & PDF",
    slug: "ai-documents-pdf",
    description: "Chat with PDFs, contract clause analysis, deep document OCR, and table extraction.",
    sortOrder: 15,
    icon: "FileCheck",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 16. Data & Analytics
  {
    id: "cat-datascience",
    name: "Data & Analytics",
    slug: "ai-data-analytics",
    description: "Text-to-SQL, automated data visualization, Python data science copilots, and BI.",
    sortOrder: 16,
    icon: "Database",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 17. Website & App Builders
  {
    id: "cat-builders",
    name: "Website & App Builders",
    slug: "ai-website-app-builders",
    description: "Prompt-to-application platforms, automated landing page generators, and SaaS builders.",
    sortOrder: 17,
    icon: "Globe",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 18. No-Code Tools
  {
    id: "cat-nocode",
    name: "No-Code Tools",
    slug: "ai-no-code",
    description: "Visual logic builders, drag-and-drop workflow platforms, and citizen developer tools.",
    sortOrder: 18,
    icon: "Sliders",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 19. Security & Developer Infrastructure
  {
    id: "cat-security-infra",
    name: "Security & Developer Infrastructure",
    slug: "ai-security-infra",
    description: "LLMOps observability, prompt injection firewalls, guardrails, and model gateways.",
    sortOrder: 19,
    icon: "Shield",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 20. Other Specialized AI
  {
    id: "cat-specialized",
    name: "Other Specialized AI",
    slug: "specialized-ai",
    description: "Domain-specific intelligence across healthcare, legal discovery, finance, and 3D spatial tech.",
    sortOrder: 20,
    icon: "Cpu",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  }
];

export const SEED_CAPABILITIES: Capability[] = [
  { id: "text-generation", name: "Text Generation", slug: "text-generation", description: "Drafting articles, scripts, essays, and conversational responses.", status: "active" },
  { id: "text-to-image", name: "Text to Image", slug: "text-to-image", description: "Generating high fidelity visual art and graphics from text.", status: "active" },
  { id: "text-to-video", name: "Text to Video", slug: "text-to-video", description: "Creating cinematic or animated video clips from text prompts.", status: "active" },
  { id: "image-to-video", name: "Image to Video", slug: "image-to-video", description: "Animating still images into dynamic video clips.", status: "active" },
  { id: "speech-to-text", name: "Speech to Text", slug: "speech-to-text", description: "Accurate audio transcription, timestamps, and diarization.", status: "active" },
  { id: "text-to-speech", name: "Text to Speech", slug: "text-to-speech", description: "High naturalness voiceover synthesis.", status: "active" },
  { id: "voice-cloning", name: "Voice Cloning", slug: "voice-cloning", description: "Replicating custom vocal identity from audio samples.", status: "active" },
  { id: "code-generation", name: "Code Generation", slug: "code-generation", description: "Writing frontend, backend, or full-stack software code.", status: "active" },
  { id: "code-review", name: "Code Review & Refactoring", slug: "code-review", description: "Analyzing code for bugs, performance, and best practices.", status: "active" },
  { id: "web-research", name: "Live Web Research", slug: "web-research", description: "Searching the live internet, aggregating facts with citations.", status: "active" },
  { id: "document-analysis", name: "Document Analysis (RAG)", slug: "document-analysis", description: "Extracting insights, parsing PDFs, and summarizing long files.", status: "active" },
  { id: "presentation-generation", name: "Presentation Generation", slug: "presentation-generation", description: "Building slide decks with design and structure.", status: "active" },
  { id: "data-analysis", name: "Data Analysis", slug: "data-analysis", description: "Interpreting CSVs, generating charts, and executing Python notebooks.", status: "active" },
  { id: "music-generation", name: "Music Generation", slug: "music-generation", description: "Synthesizing full vocal and instrumental music tracks.", status: "active" },
  { id: "automation", name: "Workflow Automation", slug: "automation", description: "Triggering multi-step actions across web services.", status: "active" },
  { id: "ui-generation", name: "UI Generation", slug: "ui-generation", description: "Creating React/HTML visual interface components.", status: "active" },
  { id: "video-editing", name: "Automated Video Editing", slug: "video-editing", description: "Cutting silence, auto-subtitles, and AI b-roll insertion.", status: "active" },
  { id: "3d-generation", name: "3D Mesh Generation", slug: "3d-generation", description: "Creating textured 3D models and spatial assets from text or images.", status: "active" },
  { id: "computer-use", name: "Autonomous Computer Use", slug: "computer-use", description: "Agents taking actions across operating systems, clicks, and keys.", status: "active" },
  { id: "browser-automation", name: "Browser Automation", slug: "browser-automation", description: "Autonomous web browsing, form completion, and scraping.", status: "active" },
  { id: "meeting-transcription", name: "Meeting Intelligence", slug: "meeting-transcription", description: "Live call transcription, action item detection, and CRM sync.", status: "active" },
  { id: "spreadsheet-analysis", name: "Spreadsheet & Formula AI", slug: "spreadsheet-analysis", description: "Complex Excel/Sheets formulas, financial modeling, and pivot insights.", status: "active" },
  { id: "sql-generation", name: "Text to SQL", slug: "sql-generation", description: "Translating natural English requests into database SQL queries.", status: "active" },
  { id: "legal-analysis", name: "Legal Document Review", slug: "legal-analysis", description: "Contract risk assessment, redlining, and case law exploration.", status: "active" },
  { id: "image-upscaling", name: "AI Image & Video Upscaling", slug: "image-upscaling", description: "Enhancing low-res imagery to 4K/8K with generative detail injection.", status: "active" },
  { id: "noise-removal", name: "Voice & Audio Isolation", slug: "noise-removal", description: "Removing background noise and room echo in real-time.", status: "active" },
  { id: "agent-orchestration", name: "Multi-Agent Orchestration", slug: "agent-orchestration", description: "Coordinating teams of AI agents with designated roles and tools.", status: "active" },
  { id: "seo-optimization", name: "SEO & Content Scoring", slug: "seo-optimization", description: "Auditing keyword intent, heading distribution, and search rankings.", status: "active" }
];

export const SEED_USE_CASES: UseCase[] = [
  {
    id: "uc-youtube",
    name: "Create YouTube Videos",
    slug: "create-youtube-videos",
    description: "Research topic ideas, write scripts, synthesize voiceovers, generate b-roll, and edit video.",
    requiredCapabilities: ["web-research", "text-generation", "text-to-speech", "text-to-video", "video-editing"],
    targetUsers: ["creator", "educator", "marketer"],
    recommendedWorkflowId: "wf-youtube",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "uc-build-website",
    name: "Build a Full-Stack Web App",
    slug: "build-website",
    description: "Design UI mockups, generate React code, write backend logic, connect databases, and deploy.",
    requiredCapabilities: ["ui-generation", "code-generation", "code-review"],
    targetUsers: ["developer", "founder", "freelancer"],
    recommendedWorkflowId: "wf-web-dev",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "uc-study-research",
    name: "Study & Academic Research",
    slug: "study-research",
    description: "Summarize research papers, extract key citations, test comprehension with quizzes.",
    requiredCapabilities: ["web-research", "document-analysis", "text-generation"],
    targetUsers: ["student", "researcher", "academic"],
    recommendedWorkflowId: "wf-academic",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "uc-startup-launch",
    name: "Launch a Startup",
    slug: "launch-startup",
    description: "Competitor analysis, value proposition, landing page, MVP development, and marketing automation.",
    requiredCapabilities: ["web-research", "ui-generation", "code-generation", "automation", "text-generation"],
    targetUsers: ["founder", "entrepreneur", "creator"],
    recommendedWorkflowId: "wf-startup",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "uc-social-media",
    name: "Create Social Media Content & Reels",
    slug: "create-social-media",
    description: "Short-form video creation, caption generation, hook testing, and automated scheduling.",
    requiredCapabilities: ["text-generation", "text-to-image", "video-editing", "text-to-speech"],
    targetUsers: ["creator", "marketer", "business-owner"],
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "uc-run-local-llm",
    name: "Run 100% Private Offline AI",
    slug: "run-local-llm",
    description: "Host open-weights models on local GPUs without data leaving your local network.",
    requiredCapabilities: ["text-generation", "code-generation"],
    targetUsers: ["developer", "engineer", "security-officer"],
    recommendedWorkflowId: "wf-local-ai",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "uc-data-analysis-sql",
    name: "Query Databases with Natural Language",
    slug: "data-analysis-sql",
    description: "Ask questions against PostgreSQL or BigQuery tables and receive clean SQL and charts.",
    requiredCapabilities: ["sql-generation", "data-analysis"],
    targetUsers: ["analyst", "founder", "product-manager"],
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "uc-slide-deck",
    name: "Build High-Stakes Pitch Decks",
    slug: "build-pitch-decks",
    description: "Generate structured slide narratives, visual themes, and export to PowerPoint/Figma.",
    requiredCapabilities: ["presentation-generation", "text-generation"],
    targetUsers: ["founder", "executive", "marketer"],
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  }
];

export const SEED_WORKFLOWS: Workflow[] = [
  {
    id: "wf-youtube",
    name: "End-to-End YouTube Content Creation",
    slug: "youtube-content-creation",
    description: "A proven, high-retention workflow from topic ideation to published video.",
    category: "AI Video & Motion",
    status: "published",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    steps: [
      {
        id: "step-1",
        order: 1,
        title: "Topic Ideation & Web Research",
        description: "Analyze trending discussions, verify facts, and structure video outline.",
        requiredCapabilities: ["web-research"],
        recommendedToolIds: ["perplexity", "claude-3-5-sonnet"]
      },
      {
        id: "step-2",
        order: 2,
        title: "Scriptwriting & Hook Optimization",
        description: "Draft engaging narrative with strong first 15-second hook.",
        requiredCapabilities: ["text-generation"],
        recommendedToolIds: ["chatgpt", "claude-3-5-sonnet"]
      },
      {
        id: "step-3",
        order: 3,
        title: "Voiceover & Audio Synthesis",
        description: "Generate studio-grade narration with realistic inflection.",
        requiredCapabilities: ["text-to-speech", "voice-cloning"],
        recommendedToolIds: ["elevenlabs"]
      },
      {
        id: "step-4",
        order: 4,
        title: "B-Roll & Visual Generation",
        description: "Create custom cinematic visual clips and illustrations.",
        requiredCapabilities: ["text-to-video", "text-to-image"],
        recommendedToolIds: ["runway-gen3", "midjourney"]
      },
      {
        id: "step-5",
        order: 5,
        title: "Assembly, Captions & Fast Editing",
        description: "Assemble timeline, remove filler words, and add animated captions.",
        requiredCapabilities: ["video-editing", "speech-to-text"],
        recommendedToolIds: ["descript", "capcut"]
      }
    ]
  },
  {
    id: "wf-web-dev",
    name: "Rapid MVP & Web App Development",
    slug: "web-app-mvp-development",
    description: "Go from idea to deployed full-stack web application in record time.",
    category: "AI Coding & Development",
    status: "published",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    steps: [
      {
        id: "step-1",
        order: 1,
        title: "Design System & Frontend Prototyping",
        description: "Generate interactive React components and clean Tailwind layouts.",
        requiredCapabilities: ["ui-generation"],
        recommendedToolIds: ["v0-dev"]
      },
      {
        id: "step-2",
        order: 2,
        title: "Full-Stack Implementation & Refactoring",
        description: "Build API routes, database integrations, and complex business logic in your IDE.",
        requiredCapabilities: ["code-generation", "code-review"],
        recommendedToolIds: ["cursor", "github-copilot"]
      },
      {
        id: "step-3",
        order: 3,
        title: "Database & Backend Automation",
        description: "Connect workflows, webhook handling, and external API pipelines.",
        requiredCapabilities: ["automation"],
        recommendedToolIds: ["make-com", "n8n"]
      }
    ]
  },
  {
    id: "wf-academic",
    name: "Deep Literature Review & Synthesis",
    slug: "academic-literature-review",
    description: "Accelerate academic paper analysis, citation verification, and comprehensive synthesis.",
    category: "AI Research & Science",
    status: "published",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    steps: [
      {
        id: "step-1",
        order: 1,
        title: "Paper Discovery & Semantic Search",
        description: "Find peer-reviewed papers with exact citation tracking.",
        requiredCapabilities: ["web-research"],
        recommendedToolIds: ["perplexity", "consensus", "elicit"]
      },
      {
        id: "step-2",
        order: 2,
        title: "PDF Deep Analysis & Data Extraction",
        description: "Extract methodology, sample sizes, and compare experimental conclusions.",
        requiredCapabilities: ["document-analysis"],
        recommendedToolIds: ["chatpdf", "claude-3-5-sonnet"]
      },
      {
        id: "step-3",
        order: 3,
        title: "Synthesis & Manuscript Drafting",
        description: "Structure literature review notes into coherent academic prose.",
        requiredCapabilities: ["text-generation"],
        recommendedToolIds: ["claude-3-5-sonnet", "chatgpt"]
      }
    ]
  },
  {
    id: "wf-local-ai",
    name: "Zero-Cloud Private AI Pipeline",
    slug: "zero-cloud-private-ai",
    description: "Set up completely private local intelligence for coding, chats, and image generation.",
    category: "Local & Open Source AI",
    status: "published",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    steps: [
      {
        id: "step-1",
        order: 1,
        title: "Local LLM Serving",
        description: "Download quantized models (Llama 3.3, Mistral, DeepSeek) and spin up local inference endpoints.",
        requiredCapabilities: ["text-generation"],
        recommendedToolIds: ["ollama", "lm-studio"]
      },
      {
        id: "step-2",
        order: 2,
        title: "Private IDE Integration",
        description: "Connect your local Ollama/LM Studio model to your code editor with zero telemetry.",
        requiredCapabilities: ["code-generation"],
        recommendedToolIds: ["continue-dev", "aider"]
      },
      {
        id: "step-3",
        order: 3,
        title: "Node-Based Local Diffusion",
        description: "Run FLUX and Stable Diffusion locally with modular node control.",
        requiredCapabilities: ["text-to-image"],
        recommendedToolIds: ["comfyui"]
      }
    ]
  },
  {
    id: "wf-lead-gen",
    name: "AI Growth & Cold Outreach Engine",
    slug: "ai-growth-cold-outreach",
    description: "Automate prospect research, hyper-personalized email generation, and multi-channel follow-ups.",
    category: "AI Marketing & Sales",
    status: "published",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    steps: [
      {
        id: "step-1",
        order: 1,
        title: "Data Enrichment & Waterfall Signals",
        description: "Scrape company intent signals, hiring triggers, and executive contacts.",
        requiredCapabilities: ["automation"],
        recommendedToolIds: ["clay-earth", "make-com"]
      },
      {
        id: "step-2",
        order: 2,
        title: "Context-Aware Pitch Generation",
        description: "Draft 1-to-1 tailored value propositions matching the prospect's exact tech stack.",
        requiredCapabilities: ["text-generation"],
        recommendedToolIds: ["claude-3-5-sonnet", "chatgpt"]
      }
    ]
  }
];
