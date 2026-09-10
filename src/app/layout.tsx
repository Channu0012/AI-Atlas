import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ai-atlas-app.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AI Atlas — Find the Right AI for Any Job | Decision Engine & Stack Builder",
    template: "%s | AI Atlas",
  },
  description: "Don't search for AI tools. Tell us what you want to accomplish, and AI Atlas will find the right verified AI tools and build the right AI stack for you.",
  keywords: [
    "AI Tools",
    "AI Stack Builder",
    "AI Workflows",
    "AI Recommendation Engine",
    "Compare AI Tools",
    "Best AI Tools 2026",
    "AI Decision Engine"
  ],
  authors: [{ name: "AI Atlas Team" }],
  creator: "AI Atlas",
  publisher: "AI Atlas",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "AI Atlas — Find the Right AI for Any Job",
    description: "Deterministic decision engine that connects your goal to verified AI tools and multi-step workflows with zero hallucinated pricing.",
    url: baseUrl,
    siteName: "AI Atlas",
    images: [
      {
        url: "/images/ai-atlas-logo.png",
        width: 800,
        height: 800,
        alt: "AI Atlas Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Atlas — Find the Right AI for Any Job",
    description: "Decision engine that connects your goal to verified AI tools and multi-step workflows.",
    images: ["/images/ai-atlas-logo.png"],
  },
  icons: {
    icon: [
      { url: "/images/ai-atlas-logo.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/images/ai-atlas-logo.png",
    apple: "/images/ai-atlas-logo.png"
  },
  manifest: "/manifest.webmanifest"
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
          <main className="flex-1 w-full overflow-x-hidden min-w-0">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
