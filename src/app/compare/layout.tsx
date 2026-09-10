import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare AI Tools Side-by-Side",
  description: "Direct factual comparison matrix of top AI models and tools. Compare pricing, API access, features, and platform limits.",
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    title: "Compare AI Tools Side-by-Side | AI Atlas",
    description: "Direct factual comparison matrix of top AI models and tools. Compare pricing, API access, features, and platform limits.",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
