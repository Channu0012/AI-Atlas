import { Category, Capability, UseCase, Workflow } from "@/types";

export const SEED_CATEGORIES: Category[] = [
  // 1. AI Coding & Developer Tools
  {
    id: "cat-coding",
    name: "AI Coding & Development",
    slug: "ai-coding",
    description: "AI code editors, terminal agents, automated refactoring, and code review.",
    sortOrder: 1,
    icon: "Code2",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-code-agents",
    name: "Developer Agents & IDEs",
    slug: "developer-agents",
    description: "Autonomous and semi-autonomous coding IDEs and terminal agents.",
    parentId: "cat-coding",
    sortOrder: 11,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-code-generation",
    name: "Full-Stack App Builders",
    slug: "app-builders",
    description: "Prompt-to-application platforms and UI generators.",
    parentId: "cat-coding",
    sortOrder: 12,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 2. AI Video & Motion
  {
    id: "cat-video",
    name: "AI Video & Motion",
    slug: "ai-video",
    description: "Text-to-video, cinematic generation, automated editing, and AI avatars.",
    sortOrder: 2,
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
    sortOrder: 21,
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
    sortOrder: 22,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-video-avatar",
    name: "AI Avatars & Dubbing",
    slug: "video-avatars",
    description: "Photorealistic human presenters with lip-sync translation across 150+ languages.",
    parentId: "cat-video",
    sortOrder: 23,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 3. AI Audio, Voice & Music
  {
    id: "cat-audio",
    name: "AI Audio & Voice",
    slug: "ai-audio-voice",
    description: "Realistic text-to-speech, custom voice cloning, and generative music tracks.",
    sortOrder: 3,
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
    sortOrder: 31,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 4. AI Design, Images & 3D
  {
    id: "cat-design",
    name: "AI Design & Images",
    slug: "ai-design-images",
    description: "Photorealistic image generation, vector SVGs, 3D assets, and graphic design.",
    sortOrder: 4,
    icon: "Palette",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "cat-3d",
    name: "3D & Spatial AI",
    slug: "3d-spatial",
    description: "Text-to-3D mesh generation, NeRFs, and game-ready 3D models.",
    parentId: "cat-design",
    sortOrder: 41,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 5. AI Research, Science & Citations
  {
    id: "cat-research",
    name: "AI Research & Science",
    slug: "ai-research",
    description: "Cited live search engines, scientific paper synthesis, and deep RAG analyzers.",
    sortOrder: 5,
    icon: "Search",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 6. AI Writing & Reasoning
  {
    id: "cat-writing",
    name: "AI Writing & Reasoning",
    slug: "ai-writing-chat",
    description: "Frontier conversational intelligence, deep reasoning, drafting, and copywriting.",
    sortOrder: 6,
    icon: "FileText",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 7. AI Automation & Workflows
  {
    id: "cat-automation",
    name: "AI Automation & Workflows",
    slug: "ai-automation",
    description: "Visual logic routers, webhook triggers, and automated API pipelines.",
    sortOrder: 7,
    icon: "Workflow",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 8. Autonomous Agents & Computer Use
  {
    id: "cat-agents",
    name: "Autonomous Agents & Computer Use",
    slug: "autonomous-agents",
    description: "OS-level automation, screen interaction, browser copilots, and multi-agent coordination.",
    sortOrder: 8,
    icon: "Bot",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 9. AI Productivity & Workspace
  {
    id: "cat-productivity",
    name: "AI Productivity & Office",
    slug: "ai-productivity",
    description: "Presentation generators, meeting intelligence, note synthesis, and smart docs.",
    sortOrder: 9,
    icon: "Sparkles",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 10. AI Marketing, Sales & SEO
  {
    id: "cat-marketing",
    name: "AI Marketing & Sales",
    slug: "ai-marketing",
    description: "Ad creative generation, SEO optimization, social scheduling, and lead outreach.",
    sortOrder: 10,
    icon: "TrendingUp",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 11. Local & Open Source AI
  {
    id: "cat-opensource",
    name: "Local & Open Source AI",
    slug: "local-open-source",
    description: "Run private LLMs, diffusion models, and speech models 100% offline on your hardware.",
    sortOrder: 11,
    icon: "Cpu",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 12. Data Science & Machine Learning
  {
    id: "cat-datascience",
    name: "Data Science & SQL AI",
    slug: "data-science-ai",
    description: "Automated statistical analysis, Python data notebooks, text-to-SQL, and predictive modeling.",
    sortOrder: 12,
    icon: "Database",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 13. Customer Support & Conversational AI
  {
    id: "cat-support",
    name: "Customer Support & CX",
    slug: "customer-support-ai",
    description: "Autonomous resolution bots, helpdesk copilots, and multi-channel ticket triaging.",
    sortOrder: 13,
    icon: "Headphones",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 14. Education & Tutoring
  {
    id: "cat-education",
    name: "Education & Tutoring AI",
    slug: "ai-education",
    description: "Personalized learning tutors, language conversation practice, and automated exam generation.",
    sortOrder: 14,
    icon: "GraduationCap",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 15. Finance, Legal & Compliance
  {
    id: "cat-finance-legal",
    name: "Legal & Finance AI",
    slug: "legal-finance-ai",
    description: "Contract clause review, litigation discovery, financial filings analysis, and compliance monitoring.",
    sortOrder: 15,
    icon: "Scale",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },

  // 16. Media Enhancement & Upscaling
  {
    id: "cat-upscaling",
    name: "Media Enhancement & Upscaling",
    slug: "media-enhancement",
    description: "AI resolution upscaling, frame interpolation, voice isolation, and noise suppression.",
    sortOrder: 16,
    icon: "Maximize2",
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
