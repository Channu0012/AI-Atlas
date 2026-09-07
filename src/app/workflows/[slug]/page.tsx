import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Repository } from "@/lib/db/repository";
import { WorkflowStepper } from "@/components/workflows/workflow-stepper";
import { Workflow as WorkflowIcon, Layers, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workflow = await Repository.getWorkflowBySlug(slug);

  if (!workflow) {
    notFound();
  }

  const allTools = await Repository.getPublishedTools();
  const toolsMap = allTools.reduce((acc, t) => {
    acc[t.id] = t;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/workflows"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all workflows</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
            <WorkflowIcon className="w-4 h-4" />
            <span>{workflow.category} Blueprint</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {workflow.name}
          </h1>
          <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
            {workflow.description}
          </p>
        </div>

        <Link
          href="/stacks"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md"
        >
          <Layers className="w-4 h-4" />
          <span>Build Into My Stack</span>
        </Link>
      </div>

      {/* Workflow Stepper */}
      <WorkflowStepper workflow={workflow} toolsMap={toolsMap} />
    </div>
  );
}
