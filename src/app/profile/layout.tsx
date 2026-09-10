import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile & Preferences",
  description: "Manage your AI Atlas profile, custom API keys, and workflow preferences.",
  alternates: {
    canonical: "/profile",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
