import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Verified AI Tools & Stacks",
  description: "Browse, search, and filter verified AI tools, open-source models, and developer frameworks across 16 major domains.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Discover Verified AI Tools & Stacks | AI Atlas",
    description: "Browse, search, and filter verified AI tools, open-source models, and developer frameworks across 16 major domains.",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
