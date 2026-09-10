import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit an AI Tool for Verification",
  description: "Submit your artificial intelligence product, API, or framework to the verified AI Atlas directory.",
  alternates: {
    canonical: "/submit-tool",
  },
};

export default function SubmitToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
