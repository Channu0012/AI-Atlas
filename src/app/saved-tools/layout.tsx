import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Saved AI Tools & Stacks",
  description: "View and manage your bookmarked AI tools, custom stacks, and saved workflows.",
  alternates: {
    canonical: "/saved-tools",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SavedToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
