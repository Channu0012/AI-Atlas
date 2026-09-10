import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Natural Language AI Search & Decision Engine",
  description: "Describe what you want to achieve. Our neural decision engine retrieves the optimal tools and constructs complete multi-step execution stacks.",
  alternates: {
    canonical: "/ask",
  },
  openGraph: {
    title: "Natural Language AI Search & Decision Engine | AI Atlas",
    description: "Describe what you want to achieve. Our neural decision engine retrieves the optimal tools and constructs complete multi-step execution stacks.",
  },
};

export default function AskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
