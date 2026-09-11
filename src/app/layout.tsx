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
    default: "AI Atlas — Find the Right Verified AI Tools & Stacks",
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
    languages: {
      "en-US": "/",
    },
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
    title: "AI Atlas — Find the Right Verified AI Tools & Stacks",
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
    title: "AI Atlas — Find the Right Verified AI Tools & Stacks",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "AI Atlas",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/ai-atlas-logo.png`,
        width: 512,
        height: 512,
      },
      description: "The deterministic decision engine and verified stack builder for artificial intelligence tools.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "548 Market St, Suite 48201",
        addressLocality: "San Francisco",
        addressRegion: "CA",
        postalCode: "94104",
        addressCountry: "US",
      },
      telephone: "+1-800-555-0199",
      email: "contact@ai-atlas-app.vercel.app",
      sameAs: [
        "https://x.com/aiatlas_app",
        "https://github.com/Channu0012/AI-Atlas",
        "https://linkedin.com/company/ai-atlas-app",
        "https://youtube.com/@aiatlas-app",
        "https://instagram.com/aiatlas.app",
        "https://facebook.com/aiatlas.app",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "AI Atlas",
      description: "Find the right verified AI tools and build deterministic workflows.",
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/ask?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/#software`,
      name: "AI Atlas Decision Engine",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All modern web browsers",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
