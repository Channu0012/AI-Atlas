import React from "react";
import Link from "next/link";
import { Workflow, Tool } from "@/types";
import { ToolLogo } from "@/components/ui/tool-logo";
import { PricingBadge } from "@/components/ui/pricing-badge";
import { ArrowDown, CheckCircle2, ChevronRight, Layers } from "lucide-react";

interface WorkflowStepperProps {
  workflow: Workflow;
  toolsMap: Record<string, Tool>;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ workflow, toolsMap }) => {
  return (
    <div className="space-y-6">
      {workflow.steps.map((step, index) => {
        const isLast = index === workflow.steps.length - 1;
        const recommendedTools = step.recommendedToolIds
          .map(id => toolsMap[id])
          .filter(Boolean);

        return (
          <div key={step.id} className="relative">
            <div className="p-4 sm:p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-lg relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {step.order}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {step.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1">
                  {step.requiredCapabilities.map(cap => (
                    <span key={cap} className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {cap.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 mb-5 leading-relaxed">
                {step.description}
              </p>

              {/* Recommended tools in this stage */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-2.5">
                  Recommended Tools for this Step
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendedTools.map(tool => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900 transition group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ToolLogo name={tool.name} logoUrl={tool.logo} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-200 group-hover:text-indigo-400 transition truncate">
                            {tool.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {tool.tagline}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <PricingBadge pricing={tool.pricing} />
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Connecting visual arrow */}
            {!isLast && (
              <div className="w-full flex items-center justify-center py-2 text-zinc-600">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-zinc-800" />
                  <ArrowDown className="w-4 h-4 text-indigo-400/60" />
                  <div className="w-0.5 h-3 bg-zinc-800" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
