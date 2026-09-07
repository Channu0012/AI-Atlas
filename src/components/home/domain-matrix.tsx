import React from "react";
import Link from "next/link";
import { Category, Tool } from "@/types";
import { 
  Code2, 
  Video, 
  Mic, 
  Palette, 
  Search, 
  FileText, 
  Workflow, 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Database, 
  Headphones, 
  GraduationCap, 
  Scale, 
  Maximize2,
  ArrowUpRight
} from "lucide-react";

interface DomainMatrixProps {
  categories: Category[];
  tools: Tool[];
}

const ICON_MAP: Record<string, any> = {
  "Code2": Code2,
  "Video": Video,
  "Mic": Mic,
  "Palette": Palette,
  "Search": Search,
  "FileText": FileText,
  "Workflow": Workflow,
  "Bot": Bot,
  "Sparkles": Sparkles,
  "TrendingUp": TrendingUp,
  "Cpu": Cpu,
  "Database": Database,
  "Headphones": Headphones,
  "GraduationCap": GraduationCap,
  "Scale": Scale,
  "Maximize2": Maximize2
};

const CATEGORY_COLORS: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  "cat-coding": { border: "hover:border-cyan-500/50", glow: "from-cyan-500/10 to-blue-500/5", text: "text-cyan-400", bg: "bg-cyan-500/10" },
  "cat-video": { border: "hover:border-purple-500/50", glow: "from-purple-500/10 to-pink-500/5", text: "text-purple-400", bg: "bg-purple-500/10" },
  "cat-audio": { border: "hover:border-amber-500/50", glow: "from-amber-500/10 to-yellow-500/5", text: "text-amber-400", bg: "bg-amber-500/10" },
  "cat-design": { border: "hover:border-fuchsia-500/50", glow: "from-fuchsia-500/10 to-rose-500/5", text: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
  "cat-research": { border: "hover:border-emerald-500/50", glow: "from-emerald-500/10 to-teal-500/5", text: "text-emerald-400", bg: "bg-emerald-500/10" },
  "cat-writing": { border: "hover:border-indigo-500/50", glow: "from-indigo-500/10 to-violet-500/5", text: "text-indigo-400", bg: "bg-indigo-500/10" },
  "cat-automation": { border: "hover:border-blue-500/50", glow: "from-blue-500/10 to-cyan-500/5", text: "text-blue-400", bg: "bg-blue-500/10" },
  "cat-agents": { border: "hover:border-sky-500/50", glow: "from-sky-500/10 to-indigo-500/5", text: "text-sky-400", bg: "bg-sky-500/10" },
  "cat-productivity": { border: "hover:border-orange-500/50", glow: "from-orange-500/10 to-amber-500/5", text: "text-orange-400", bg: "bg-orange-500/10" },
  "cat-marketing": { border: "hover:border-rose-500/50", glow: "from-rose-500/10 to-pink-500/5", text: "text-rose-400", bg: "bg-rose-500/10" },
  "cat-opensource": { border: "hover:border-teal-500/50", glow: "from-teal-500/10 to-emerald-500/5", text: "text-teal-400", bg: "bg-teal-500/10" },
  "cat-datascience": { border: "hover:border-violet-500/50", glow: "from-violet-500/10 to-purple-500/5", text: "text-violet-400", bg: "bg-violet-500/10" },
  "cat-support": { border: "hover:border-lime-500/50", glow: "from-lime-500/10 to-green-500/5", text: "text-lime-400", bg: "bg-lime-500/10" },
  "cat-education": { border: "hover:border-yellow-500/50", glow: "from-yellow-500/10 to-amber-500/5", text: "text-yellow-400", bg: "bg-yellow-500/10" },
  "cat-finance-legal": { border: "hover:border-red-500/50", glow: "from-red-500/10 to-rose-500/5", text: "text-red-400", bg: "bg-red-500/10" },
  "cat-upscaling": { border: "hover:border-cyan-400/50", glow: "from-cyan-400/10 to-blue-500/5", text: "text-cyan-300", bg: "bg-cyan-400/10" }
};

export const DomainMatrix: React.FC<DomainMatrixProps> = ({ categories, tools }) => {
  // Only display top-level parent categories
  const parentCategories = categories.filter(c => !c.parentId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {parentCategories.map(cat => {
        const IconComponent = cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : Sparkles;
        const matchingTools = tools.filter(t => t.categoryIds.includes(cat.id));
        const color = CATEGORY_COLORS[cat.id] || { 
          border: "hover:border-indigo-500/50", 
          glow: "from-indigo-500/10 to-purple-500/5", 
          text: "text-indigo-400", 
          bg: "bg-indigo-500/10" 
        };

        return (
          <Link
            key={cat.id}
            href={`/tools?category=${cat.slug}`}
            className={`group relative p-5 rounded-2xl glass-card transition-all duration-300 flex flex-col justify-between ${color.border}`}
          >
            <div>
              {/* Header with Icon & Count */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center ${color.text} transition-transform group-hover:scale-110`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    {matchingTools.length} tools
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white group-hover:text-zinc-100 transition tracking-tight">
                {cat.name}
              </h3>
              <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            {/* Top Sample Tools Pills */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
              {matchingTools.slice(0, 3).map(t => (
                <span
                  key={t.id}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-800 font-medium"
                >
                  {t.name}
                </span>
              ))}
              {matchingTools.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 text-zinc-500 font-mono">
                  +{matchingTools.length - 3} more
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
