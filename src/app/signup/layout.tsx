import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Account",
  description: "Join AI Atlas to discover verified artificial intelligence tools, run multi-modal plans, and architect production stacks.",
  alternates: {
    canonical: "/signup",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
