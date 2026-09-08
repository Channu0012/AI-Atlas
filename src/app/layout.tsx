import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NavigationProgressBar } from "@/components/ui/navigation-progress-bar";
import { MandatoryAuthGate } from "@/components/auth/mandatory-auth-gate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Atlas — Find the Right AI for Any Job | Decision Engine & Stack Builder",
  description: "Don't search for AI tools. Tell us what you want to accomplish, and AI Atlas will find the right verified AI tools and build the right AI stack for you.",
  keywords: ["AI Tools", "AI Stack Builder", "AI Workflows", "AI Recommendation Engine", "Compare AI Tools"],
  openGraph: {
    title: "AI Atlas — Find the Right AI for Any Job",
    description: "Decision engine that connects your goal to verified AI tools and multi-step workflows.",
    type: "website"
  },
  icons: {
    icon: [
      { url: "/images/ai-atlas-logo.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/images/ai-atlas-logo.png",
    apple: "/images/ai-atlas-logo.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <MandatoryAuthGate />
          <NavigationProgressBar />
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
